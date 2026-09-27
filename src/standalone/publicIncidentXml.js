import { normalizePublicIncidentSnapshot } from '../layers/publicIncidents/records.js';

function childText(element, localName) {
  if (!element) return '';

  for (const child of element.children) {
    if (child.localName === localName) {
      return child.textContent?.trim() || '';
    }
  }

  return '';
}

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

function parseProviderTime(value, provider) {
  if (value == null || value === '') return null;

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (provider.timeZone) {
    return parseLocalDateTimeInZone(value, provider.timeZone);
  }

  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function rssIncident(item, provider) {
  const title = childText(item, 'title');
  const description = childText(item, 'description');
  const guid = childText(item, 'guid');
  const pubDate = childText(item, 'pubDate');
  const lat = childText(item, 'lat');
  const lon = childText(item, 'long');

  const idMatch = /\bID:\s*([A-Za-z0-9_-]+)/i.exec(description);
  const statusMatch = /\bStatus:\s*([^,]+)/i.exec(description);

  const sourceId =
    idMatch?.[1] ||
    guid.split('?').pop() ||
    guid;

  const titleParts = title.split(/\s+at\s+/i);
  const type = titleParts[0]?.trim() || title;
  const location =
    titleParts.length > 1
      ? titleParts.slice(1).join(' at ').trim()
      : title;

  return {
    sourceId,
    provider: provider.id,
    type,
    title: type,
    description: location,
    lat,
    lon,
    time: parseProviderTime(pubDate, provider),
    status: statusMatch?.[1]?.trim() || '',
    source: provider.agency,
    url: provider.sourceUrl,
  };
}

function atomIncident(entry, provider) {
  const id = childText(entry, 'id');
  const title = childText(entry, 'title');
  const published = childText(entry, 'published');
  const updated = childText(entry, 'updated');
  const point = childText(entry, 'point');

  const coordinates = point.split(/\s+/).filter(Boolean);
  const lat = coordinates[0] || '';
  const lon = coordinates[1] || '';

  let type = '';

  for (const child of entry.children) {
    if (child.localName === 'category') {
      type =
        child.getAttribute('label') ||
        child.getAttribute('term') ||
        '';
      break;
    }
  }

  const sourceId =
    id.split('/').pop() ||
    id.split(':').pop() ||
    id;

  const titleParts = title.split(/\s+at\s+/i);
  const location =
    titleParts.length > 1
      ? titleParts.slice(1).join(' at ').trim()
      : title;

  return {
    sourceId,
    provider: provider.id,
    type: type || titleParts[0]?.trim() || title,
    title: type || titleParts[0]?.trim() || title,
    description: location,
    lat,
    lon,
    time: parseProviderTime(published || updated, provider),
    status: '',
    source: provider.agency,
    url: provider.sourceUrl,
  };
}

/**
 * Browser-owned RSS/Atom/GeoRSS parser for Public Incidents.
 *
 * Portable source modules receive this function as an injected capability
 * rather than reaching DOMParser themselves.
 */
export function parsePublicIncidentXml(xmlText, provider) {
  if (typeof DOMParser !== 'function') {
    throw new Error(`${provider.label} XML parsing is unavailable`);
  }

  const document = new DOMParser().parseFromString(
    xmlText,
    'application/xml',
  );

  if (document.querySelector('parsererror')) {
    throw new Error(`${provider.label} returned invalid XML`);
  }

  let records;

  if (provider.format === 'rss') {
    records = Array.from(document.getElementsByTagName('item')).map(
      (item) => rssIncident(item, provider),
    );
  } else if (provider.format === 'atom') {
    records = Array.from(document.getElementsByTagNameNS('*', 'entry')).map(
      (entry) => atomIncident(entry, provider),
    );
  } else {
    throw new TypeError(
      `Unsupported Public Incidents XML format: ${provider.format}`,
    );
  }

  return normalizePublicIncidentSnapshot(records);
}