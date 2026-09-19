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
 * Compatibility factories retained for callers and tests.
 */
export function createAustinFireIncidentSource(options = {}) {
  return createSocrataPublicIncidentSource('austin-fire', options);
}

export function createSeattleFireIncidentSource(options = {}) {
  return createSocrataPublicIncidentSource('seattle-fire', options);
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