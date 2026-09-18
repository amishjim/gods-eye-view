import { normalizePublicIncidentSnapshot } from './records.js';

const AUSTIN_FIRE_URL =
  "https://data.austintexas.gov/resource/wpu4-x69d.json?$where=traffic_report_status='ACTIVE'&$order=published_date%20DESC&$limit=500";

/**
 * Adapt one Austin Fire incident into the provider-neutral Public Incidents
 * record consumed by the layer.
 */
function adaptAustinFireIncident(row) {
  const publishedTime = Date.parse(row?.published_date);

  return {
    sourceId: row?.traffic_report_id,
    provider: 'austin-fire',
    type: row?.issue_reported,
    title: row?.issue_reported,
    description: row?.address,
    lat: row?.latitude,
    lon: row?.longitude,
    time: Number.isFinite(publishedTime) ? publishedTime : null,
    status: row?.traffic_report_status,
    source: 'Austin Fire Department',
    url: 'https://data.austintexas.gov/d/wpu4-x69d',
  };
}

/**
 * Live non-medical Austin Fire incidents published through Austin Open Data.
 */
export function createAustinFireIncidentSource({
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== 'function')
    throw new TypeError('Austin Fire source requires fetch');

  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();

      const response = await fetchImpl(AUSTIN_FIRE_URL, { signal });

      if (!response.ok)
        throw new Error(`Austin Fire HTTP ${response.status}`);

      const rows = await response.json();

      signal?.throwIfAborted();

      if (!Array.isArray(rows))
        throw new Error('Austin Fire returned an invalid snapshot');

      const adapted = rows.map(adaptAustinFireIncident);

      return normalizePublicIncidentSnapshot(adapted);
    },
  };
}