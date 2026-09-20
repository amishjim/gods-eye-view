import * as Cesium from 'cesium';
import { isPointerFree } from '../../data/inputOwnership.js';

export { createAustinFireIncidentSource } from './source.js';
export * from './records.js';

const LAYER_ID = 'public-incidents';
const INCIDENT_ACCENT = '#ff4b32';

/** Own the Public Incidents display, refresh, and selection lifecycle. */
export function createPublicIncidentsLayer({ source, services = {} } = {}) {
  if (typeof source?.getSnapshot !== 'function')
    throw new TypeError('Public Incidents require a snapshot source');

  const context = services.context ?? {};
  const {
    registerEntityContext,
    selectEntityContext,
    clearSelectedEntityContextForLayer,
    removeEntityContextsForLayer,
  } = context;

  let _viewer = null;
  let _request = null;
  let _dataSource = null;
  let _clickHandler = null;
  let _count = 0;
  let _lastUpdate = null;
  let _lastError = null;
  let _enabled = false;
  let _selectedId = null;

  function clearSelection({ evicted = false } = {}) {
    _selectedId = null;

    if (typeof clearSelectedEntityContextForLayer === 'function') {
      clearSelectedEntityContextForLayer(LAYER_ID, { evicted });
    }
  }

  function selectIncident(entity) {
    if (!entity || typeof entity.id !== 'string') return false;

    _selectedId = entity.id;

    if (typeof selectEntityContext === 'function') {
      selectEntityContext(entity);
    }

    console.log(
      `[Data:PublicIncidents] Selected: ${entity.name ?? entity.id}`,
    );

    return true;
  }

  function installInteraction(viewer) {
    if (_clickHandler) return;

    _clickHandler = new Cesium.ScreenSpaceEventHandler(
      viewer.scene.canvas,
    );

    _clickHandler.setInputAction((click) => {
      if (!isPointerFree() || !_enabled || !_dataSource) return;

      const picked = viewer.scene.pick(click.position);
      const entity = picked?.id;

      const isOurEntity =
        entity instanceof Cesium.Entity &&
        typeof entity.id === 'string' &&
        entity.id.startsWith('public-incident:') &&
        _dataSource.entities.getById(entity.id) === entity;

      if (isOurEntity) {
        selectIncident(entity);
        return;
      }

      if (_selectedId) clearSelection();
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  const layer = {
    id: LAYER_ID,
    name: 'Public Incidents',
    icon: '!',
    source: 'Public Safety',
    updateInterval: 300000,

    init(viewer) {
      if (_viewer)
        throw new Error('Public Incidents layer is already initialized');

      _viewer = viewer;
      _dataSource = new Cesium.CustomDataSource(LAYER_ID);
      _dataSource.show = false;
      viewer.dataSources.add(_dataSource);

      installInteraction(viewer);

      _count = 0;
      _lastUpdate = null;
      _lastError = null;
      _enabled = false;
      _selectedId = null;

      console.log('[Data:PublicIncidents] Initialized');
    },

    enable() {
      _enabled = true;

      if (_dataSource) {
        _dataSource.show = true;
      }
    },

    disable() {
      _request?.abort();
      _request = null;
      _enabled = false;

      clearSelection();

      if (_dataSource) {
        _dataSource.show = false;
      }
    },

    async update() {
      if (!_enabled || !_dataSource) return false;

      _request?.abort();

      const request = new AbortController();
      _request = request;

      try {
        const rows = await source.getSnapshot({
          signal: request.signal,
        });

        if (
          request.signal.aborted ||
          _request !== request ||
          !_enabled
        ) {
          return false;
        }

        /*
         * This feed is a complete active snapshot, so rebuild the rendered
         * entity collection atomically from the latest provider response.
         */
        _dataSource.entities.removeAll();

        const nextContextIds = new Set();

        for (const incident of rows) {
          const position = Cesium.Cartesian3.fromDegrees(
            incident.lon,
            incident.lat,
          );

          const entityId =
            `public-incident:${incident.stableId}`;

          /*
           * Add first and use the actual Cesium entity returned by the
           * collection. GEV's selection/readout metadata must live on the
           * same entity that scene picking later returns.
           */
          const entity = _dataSource.entities.add({
            id: entityId,
            name: incident.title,
            position,

            point: {
              pixelSize: 12,
              color: Cesium.Color.ORANGERED,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              heightReference:
                Cesium.HeightReference.CLAMP_TO_GROUND,
            },

            properties: {
              sourceId: incident.sourceId,
              provider: incident.provider,
              type: incident.type,
              description: incident.description,
              time: incident.time,
              status: incident.status,
              source: incident.source,
              url: incident.url,
            },
          });

          /*
           * Static entities selected into GEV's tracked-readout surface
           * publish their presentation model directly on the rendered entity.
           */
          entity.gevTrackedId = entityId;
          entity.gevDisplayPosition = () => position;
          entity.gevLabelModel = {
            title: String(
              incident.title || 'PUBLIC SAFETY INCIDENT',
            ).toUpperCase(),

            details: [
              incident.description
                ? String(incident.description).toUpperCase()
                : null,

              incident.status
                ? `STATUS · ${String(incident.status).toUpperCase()}`
                : null,

              incident.source
                ? String(incident.source).toUpperCase()
                : null,
            ].filter(Boolean),

            accent: INCIDENT_ACCENT,
          };

          if (typeof registerEntityContext === 'function') {
            registerEntityContext(entity, {
              id: entityId,
              layerId: LAYER_ID,
              layerName: 'Public Incidents',
              source:
                incident.source || 'Public Safety',
              label:
                incident.title || 'Public Safety Incident',
              latitude: incident.lat,
              longitude: incident.lon,
              properties: {
                type: incident.type,
                address: incident.description,
                status: incident.status,
                reportedAt: incident.time,
                provider: incident.provider,
                sourceId: incident.sourceId,
                url: incident.url,
              },
            });

            nextContextIds.add(entityId);
          }
        }

        /*
         * Drop context records for incidents no longer present in the
         * provider's active snapshot while retaining surviving records.
         */
        if (typeof removeEntityContextsForLayer === 'function') {
          removeEntityContextsForLayer(LAYER_ID, {
            retainIds: nextContextIds,
          });
        }

        /*
         * Refreshes replace Cesium entities. If the selected incident still
         * exists, claim its newly rendered entity as the selected context.
         */
        if (_selectedId) {
          const selectedEntity =
            _dataSource.entities.getById(_selectedId);

          if (selectedEntity) {
            if (typeof selectEntityContext === 'function') {
              selectEntityContext(selectedEntity);
            }
          } else {
            _selectedId = null;
          }
        }

        _count = _dataSource.entities.values.length;
        _lastUpdate = Date.now();
        _lastError = null;

        console.log(
          `[Data:PublicIncidents] Updated: ${_count} active incidents`,
        );

        return true;
      } catch (error) {
        if (
          request.signal.aborted ||
          _request !== request ||
          !_enabled
        ) {
          return false;
        }

        console.warn(
          '[Data:PublicIncidents] Fetch error:',
          error,
        );

        _lastError =
          error?.message ||
          'Public Incidents source unavailable';

        return false;
      } finally {
        if (_request === request) {
          _request = null;
        }
      }
    },

    destroy(viewer = _viewer) {
      _request?.abort();
      _request = null;
      _enabled = false;

      clearSelection();

      if (_clickHandler) {
        _clickHandler.destroy();
        _clickHandler = null;
      }

      if (typeof removeEntityContextsForLayer === 'function') {
        removeEntityContextsForLayer(LAYER_ID);
      }

      if (_dataSource && viewer) {
        viewer.dataSources.remove(_dataSource, true);
      }

      _dataSource = null;
      _viewer = null;
      _count = 0;
      _lastUpdate = null;
      _lastError = null;
    },

    getAnalystRecords(maxCount = 2000) {
      if (!_dataSource) return [];

      return _dataSource.entities.values
        .slice(0, maxCount)
        .map((entity) => {
          const properties = entity.properties;

          const position = entity.position?.getValue(
            Cesium.JulianDate.now(),
          );

          if (!position) return null;

          const cartographic =
            Cesium.Cartographic.fromCartesian(position);

          return {
            id: entity.id,
            type: properties?.type?.getValue(),
            description:
              properties?.description?.getValue(),
            status: properties?.status?.getValue(),
            source: properties?.source?.getValue(),
            time: properties?.time?.getValue(),
            lat: Cesium.Math.toDegrees(
              cartographic.latitude,
            ),
            lon: Cesium.Math.toDegrees(
              cartographic.longitude,
            ),
          };
        })
        .filter(Boolean);
    },

    getStats() {
      return {
        count: _count,
        countLabel: `${_count} total`,
        lastUpdate: _lastUpdate,
        error: _lastError,
      };
    },
  };

  return layer;
}
