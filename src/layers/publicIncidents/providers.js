export const PUBLIC_INCIDENT_PROVIDERS = Object.freeze([
  Object.freeze({
    id: 'austin-fire',
    jurisdiction: 'Austin, Texas, USA',
    agency: 'Austin Fire Department',
    label: 'Austin Fire',
    platform: 'socrata',
    endpoint:
      "https://data.austintexas.gov/resource/wpu4-x69d.json?$where=traffic_report_status='ACTIVE'&$order=published_date%20DESC&$limit=500",
    sourceUrl: 'https://data.austintexas.gov/d/wpu4-x69d',
    fields: Object.freeze({
      sourceId: 'traffic_report_id',
      type: 'issue_reported',
      title: 'issue_reported',
      description: 'address',
      lat: 'latitude',
      lon: 'longitude',
      time: 'published_date',
      status: 'traffic_report_status',
    }),
  }),

  Object.freeze({
    id: 'seattle-fire',
    jurisdiction: 'Seattle, Washington, USA',
    agency: 'Seattle Fire Department',
    label: 'Seattle Fire',
    platform: 'socrata',
    endpoint:
      'https://data.seattle.gov/resource/kzjm-xkqj.json?$order=datetime%20DESC&$limit=500',
    sourceUrl: 'https://data.seattle.gov/d/kzjm-xkqj',
    timeZone: 'America/Los_Angeles',
    fields: Object.freeze({
      sourceId: 'incident_number',
      type: 'type',
      title: 'type',
      description: 'address',
      lat: 'latitude',
      lon: 'longitude',
      time: 'datetime',
      status: null,
    }),
  }),
]);