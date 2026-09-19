import { normalizePublicIncidentSnapshot } from './records.js';
import { PUBLIC_INCIDENT_PROVIDERS } from './providers.js';

function getProvider(providerId) {
  const provider = PUBLIC_INCIDENT_PROVIDERS.find(
    (candidate) => candidate.id === providerId,
  );

  if (!provider)
    throw new Error(`Unknown Public Incidents provider: ${providerId}`);

  return provider;
}

/**
 * Convert a timezone-less local datetime into an absolute timestamp.
 */
function parseLocalDateTimeInZone(value, timeZone) {
  if (typeof value !== 'string') return null;

  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/.exec(
      value.trim(),
    );

  if (!match) return null;

  const [
    ,
    yearText,
    monthText,
    dayText,
    hourText,
    minuteText,
    secondText,
    millisecondText = '0',
  ] = match;

  const wallTimeUtc = Date.UTC(
    Number(yearText),
    Number(monthText) - 1,
    Number(dayText),
    Number(hourText),
    Number(minuteText),
    Number(secondText),
    0,
  );

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  let guess = wallTimeUtc;

  for (let i = 0; i < 2; i += 1) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(guess))
        .filter((part) => part.type !== 'literal')
        .map((part) => [part.type, part.value]),
    );

    const representedLocalTime = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour) % 24,
      Number(parts.minute),
      Number(parts.second),
      0,
    );

    const offset = representedLocalTime - guess;
    guess = wallTimeUtc - offset;
  }

  return guess + Number(millisecondText.padEnd(3, '0'));
}

function readField(row, fieldName) {
  if (!fieldName) return '';
  return row?.[fieldName];
}

function parseProviderTime(value, provider) {
  if (value == null || value === '') return null;

  /*
   * ArcGIS commonly returns date fields as epoch milliseconds.
   */
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (provider.timeZone) {
    return parseLocalDateTimeInZone(value, provider.timeZone);
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function adaptProviderIncident(row, provider) {
  const { fields } = provider;

  return {
    sourceId: readField(row, fields.sourceId),
    provider: provider.id,
    type: readField(row, fields.type),
    title: readField(row, fields.title),
    description: readField(row, fields.description),
    lat: readField(row, fields.lat),
    lon: readField(row, fields.lon),
    time: parseProviderTime(readField(row, fields.time), provider),
    status: readField(row, fields.status),
    source: provider.agency,
    url: provider.sourceUrl,
  };
}

/**
 * Convert an ArcGIS GeoJSON feature into the common provider-record shape.
 */
function adaptArcGisFeature(feature, provider) {
  const properties = feature?.properties;
  const coordinates = feature?.geometry?.coordinates;

  if (
    !properties ||
    feature?.geometry?.type !== 'Point' ||
    !Array.isArray(coordinates) ||
    coordinates.length < 2
  ) {
    return null;
  }

  const [lon, lat] = coordinates;
const { fields } = provider;
const sourceId = readField(properties, fields.sourceId);

return {
  sourceId:
    sourceId == null || sourceId === ''
      ? ''
      : String(sourceId),
    provider: provider.id,
    type: readField(properties, fields.type),
    title: readField(properties, fields.title),
    description: readField(properties, fields.description),
    lat,
    lon,
    time: parseProviderTime(readField(properties, fields.time), provider),
    status: readField(properties, fields.status),
    source: provider.agency,
    url: provider.sourceUrl,
  };
}

/**
 * Construct a Socrata-backed Public Incidents source from a provider registry
 * entry. Most future Socrata cities should require only a registry entry.
 */
export function createSocrataPublicIncidentSource(
  providerId,
  { fetchImpl = globalThis.fetch } = {},
) {
  const provider = getProvider(providerId);

  if (provider.platform !== 'socrata') {
    throw new TypeError(
      `${provider.id} is not a Socrata Public Incidents provider`,
    );
  }

  if (typeof fetchImpl !== 'function') {
    throw new TypeError(`${provider.label} source requires fetch`);
  }

  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();

      const response = await fetchImpl(provider.endpoint, { signal });

      if (!response.ok)
        throw new Error(`${provider.label} HTTP ${response.status}`);

      const rows = await response.json();

      signal?.throwIfAborted();

      if (!Array.isArray(rows))
        throw new Error(`${provider.label} returned an invalid snapshot`);

      return normalizePublicIncidentSnapshot(
        rows.map((row) => adaptProviderIncident(row, provider)),
      );
    },
  };
}

/**
 * Construct an ArcGIS GeoJSON-backed Public Incidents source from a provider
 * registry entry.
 */
export function createArcGisPublicIncidentSource(
  providerId,
  { fetchImpl = globalThis.fetch } = {},
) {
  const provider = getProvider(providerId);

  if (provider.platform !== 'arcgis') {
    throw new TypeError(
      `${provider.id} is not an ArcGIS Public Incidents provider`,
    );
  }

  if (typeof fetchImpl !== 'function') {
    throw new TypeError(`${provider.label} source requires fetch`);
  }

  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();

      const response = await fetchImpl(provider.endpoint, { signal });

      if (!response.ok)
        throw new Error(`${provider.label} HTTP ${response.status}`);

      const payload = await response.json();

      signal?.throwIfAborted();

      if (
        !payload ||
        payload.type !== 'FeatureCollection' ||
        !Array.isArray(payload.features)
      ) {
        throw new Error(`${provider.label} returned an invalid snapshot`);
      }

      return normalizePublicIncidentSnapshot(
        payload.features
          .map((feature) => adaptArcGisFeature(feature, provider))
          .filter(Boolean),
      );
    },
  };
}

/**
 * Construct the correct source implementation for any registered provider.
 */
export function createPublicIncidentSource(
  providerId,
  options = {},
) {
  const provider = getProvider(providerId);

  if (provider.platform === 'socrata') {
    return createSocrataPublicIncidentSource(providerId, options);
  }

  if (provider.platform === 'arcgis') {
    return createArcGisPublicIncidentSource(providerId, options);
  }

  throw new TypeError(
    `Unsupported Public Incidents platform: ${provider.platform}`,
  );
}

/**
 * Compatibility factories retained for callers and tests.
 */
export function createAustinFireIncidentSource(options = {}) {
  return createSocrataPublicIncidentSource('austin-fire', options);
}

export function createSeattleFireIncidentSource(options = {}) {
  return createSocrataPublicIncidentSource('seattle-fire', options);
}

export function createPhoenixFireIncidentSource(options = {}) {
  return createArcGisPublicIncidentSource('phoenix-fire', options);
}
export function createHoustonActiveIncidentSource(options = {}) {
  return createArcGisPublicIncidentSource(
    'houston-active-incidents',
    options,
  );
}

/**
 * Combine multiple provider sources into one Public Incidents snapshot.
 */
export function createCombinedPublicIncidentSource(sources) {
  if (
    !Array.isArray(sources) ||
    sources.length === 0 ||
    sources.some((source) => typeof source?.getSnapshot !== 'function')
  ) {
    throw new TypeError(
      'Combined Public Incidents source requires snapshot sources',
    );
  }

  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();

      const snapshots = await Promise.all(
        sources.map((source) => source.getSnapshot({ signal })),
      );

      signal?.throwIfAborted();

      return snapshots.flat();
    },
  };
}