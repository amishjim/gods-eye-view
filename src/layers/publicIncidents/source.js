import { normalizePublicIncidentSnapshot } from './records.js';

const AUSTIN_FIRE_URL =
  "https://data.austintexas.gov/resource/wpu4-x69d.json?$where=traffic_report_status='ACTIVE'&$order=published_date%20DESC&$limit=500";

const SEATTLE_FIRE_URL =
  'https://data.seattle.gov/resource/kzjm-xkqj.json?$order=datetime%20DESC&$limit=500';

/**
 * Convert a timezone-less local datetime into an absolute timestamp.
 *
 * Seattle publishes values such as:
 *   2026-09-18T15:35:00.000
 *
 * Those represent Seattle wall-clock time rather than UTC. Using Date.parse()
 * directly would interpret the value in the browser/runtime's local timezone.
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

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const millisecond = Number(millisecondText.padEnd(3, '0'));

  const wallTimeUtc = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
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

  // Two passes handle normal timezone/DST offset resolution.
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

  return guess + millisecond;
}

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
 * Adapt one Seattle Fire dispatch into the provider-neutral Public Incidents
 * record consumed by the layer.
 */
function adaptSeattleFireIncident(row) {
  return {
    sourceId: row?.incident_number,
    provider: 'seattle-fire',
    type: row?.type,
    title: row?.type,
    description: row?.address,
    lat: row?.latitude,
    lon: row?.longitude,
    time: parseLocalDateTimeInZone(row?.datetime, 'America/Los_Angeles'),
    status: '',
    source: 'Seattle Fire Department',
    url: 'https://data.seattle.gov/d/kzjm-xkqj',
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

      return normalizePublicIncidentSnapshot(
        rows.map(adaptAustinFireIncident),
      );
    },
  };
}

/**
 * Seattle Fire Department 911 dispatches published through Seattle Open Data.
 *
 * Unlike Austin, Seattle does not publish an active/inactive status field.
 * Unknown status therefore remains blank rather than being inferred.
 */
export function createSeattleFireIncidentSource({
  fetchImpl = globalThis.fetch,
} = {}) {
  if (typeof fetchImpl !== 'function')
    throw new TypeError('Seattle Fire source requires fetch');

  return {
    async getSnapshot({ signal } = {}) {
      signal?.throwIfAborted();

      const response = await fetchImpl(SEATTLE_FIRE_URL, { signal });

      if (!response.ok)
        throw new Error(`Seattle Fire HTTP ${response.status}`);

      const rows = await response.json();

      signal?.throwIfAborted();

      if (!Array.isArray(rows))
        throw new Error('Seattle Fire returned an invalid snapshot');

      return normalizePublicIncidentSnapshot(
        rows.map(adaptSeattleFireIncident),
      );
    },
  };
}

/**
 * Combine multiple provider sources into one Public Incidents snapshot.
 *
 * This keeps the application layer provider-neutral: GEV consumes one source
 * while individual cities remain independent adapters.
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
