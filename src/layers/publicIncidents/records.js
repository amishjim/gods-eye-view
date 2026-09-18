/**
 * Normalize provider-specific public-safety incidents into the common
 * representation consumed by the Public Incidents layer.
 *
 * Providers should adapt their records to this shape before publication so
 * the display layer does not need to understand individual CAD/feed formats.
 */
export function normalizePublicIncident(record) {
  if (!record || typeof record !== 'object') return null;

  const lat = Number(record.lat);
  const lon = Number(record.lon);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }

  const sourceId = String(record.sourceId ?? '').trim();
  if (!sourceId) return null;

  const timeValue = record.time == null ? NaN : Number(record.time);
  const time = Number.isFinite(timeValue) ? timeValue : null;

  return Object.freeze({
    stableId: `${String(record.provider ?? 'unknown')}:${sourceId}`,
    sourceId,
    provider: String(record.provider ?? 'unknown'),
    type: String(record.type ?? 'incident'),
    title: String(record.title ?? 'Public Safety Incident'),
    description: String(record.description ?? ''),
    lat,
    lon,
    time,
    status: String(record.status ?? ''),
    source: String(record.source ?? ''),
    url: String(record.url ?? ''),
  });
}

/** Normalize a complete provider snapshot, dropping malformed records. */
export function normalizePublicIncidentSnapshot(records) {
  if (!Array.isArray(records)) return [];

  const normalized = [];

  for (const record of records) {
    const incident = normalizePublicIncident(record);
    if (incident) normalized.push(incident);
  }

  return normalized;
}
