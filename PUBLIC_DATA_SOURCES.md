# Public Incidents Data Sources

This document records authoritative public-data sources used by the Public Incidents layer.

The purpose of this registry is to preserve source provenance, technical details,
usage constraints, and operational characteristics as additional jurisdictions
and providers are added.

## Provider Record

Each provider should document:

- Provider ID
- Jurisdiction
- Agency
- Dataset
- Platform / vendor
- Public information page
- API endpoint
- Geographic fields
- Time fields
- Incident fields
- Status fields
- Refresh cadence
- API/runtime cost
- Authentication requirements
- Terms / license
- Attribution requirements
- Redistribution considerations
- Privacy / sensitivity considerations
- Known limitations
- Date verified

---

## Austin Fire Department

**Provider ID:** `austin-fire`

**Jurisdiction:** Austin, Texas, USA

**Agency:** Austin Fire Department

**Dataset:** Real-Time Fire Incidents

**Platform / vendor:** Socrata Open Data API (SODA)

**Public information page:**  
https://data.austintexas.gov/stories/s/Real-Time-Fire-Incidents/dr26-vqib/

**Dataset/API:**  
https://data.austintexas.gov/resource/wpu4-x69d.json

**GEV query:** Active incidents only, newest published incidents first, maximum
500 records.

**Fields currently consumed:**

- `traffic_report_id` ? provider source ID
- `issue_reported` ? incident type/title
- `address` ? incident description/location text
- `latitude` ? latitude
- `longitude` ? longitude
- `published_date` ? reported/published time
- `traffic_report_status` ? incident status

**Normalized provider:** `austin-fire`

**Refresh cadence:** Approximately every 5 minutes according to the City of
Austin dataset documentation.

**GEV polling cadence:** 5 minutes.

**API/runtime cost:** Free public endpoint; no paid API dependency used by GEV.

**Authentication:** None currently required for the endpoint used by GEV.

**Terms / license:**  
https://data.austintexas.gov/stories/s/City-of-Austin-Open-Data-Terms-of-Use/ranj-cccq/

**Attribution:** Preserve identification of the City of Austin / Austin Fire
Department as the source when presenting this data.

**Privacy / sensitivity:** Public Incidents must not use this or related data to
attempt re-identification of individuals or infer information not supplied by
the authoritative source.

**Known limitations:**

- The feed represents active incidents rather than a complete incident history.
- Medical incidents are excluded from the public feed.
- Snapshot collection should not be treated as a complete historical record.
- Incident type does not establish injuries, casualties, cause, severity, or
  other facts not explicitly supplied by the authoritative source.
- Supplemental future sources such as radio, cameras, news, or social posts
  must not automatically be represented as concerning the same incident merely
  because of geographic proximity or matching keywords.

**Verified:** 2026-09-18

---

## Seattle Fire Department

**Provider ID:** `seattle-fire`

**Jurisdiction:** Seattle, Washington, USA

**Agency:** Seattle Fire Department

**Dataset:** Seattle Real Time Fire 911 Calls

**Platform / vendor:** Socrata Open Data API (SODA)

**Public dataset page:**  
https://data.seattle.gov/d/kzjm-xkqj

**Dataset/API:**  
https://data.seattle.gov/resource/kzjm-xkqj.json

**GEV query:** Newest dispatch records first, maximum 500 records.

**Fields currently consumed:**

- `incident_number` → provider source ID
- `type` → incident type/title
- `address` → incident description/location text
- `latitude` → latitude
- `longitude` → longitude
- `datetime` → incident time

**Normalized provider:** `seattle-fire`

**Refresh cadence:** Approximately every 5 minutes.

**GEV polling cadence:** 5 minutes.

**API/runtime cost:** Free public endpoint; no paid API dependency used by GEV.

**Authentication:** None currently required for the endpoint used by GEV.

**Status behavior:** Seattle does not provide the Austin-style active/inactive status field used by the Austin Fire source. GEV leaves status blank rather than inferring one.

**Timezone handling:** Seattle publishes timezone-less local timestamps. GEV interprets them as `America/Los_Angeles` local time before converting them to an absolute timestamp.

**Known limitations:**

- The feed includes dispatch activity and may include medical response types such as Aid Response and Medic Response.
- The public dataset does not provide an incident status field equivalent to Austin's `traffic_report_status`.
- `report_location` duplicates geographic information already supplied by latitude/longitude and is not currently stored in the normalized record.
- Incident type does not establish injuries, casualties, cause, severity, or other facts not explicitly supplied by the authoritative source.
- Supplemental future sources such as radio, cameras, news, or social posts must not automatically be represented as concerning the same incident merely because of geographic proximity or matching keywords.

**Verified:** 2026-09-18

---

## Adding Providers

New providers should be evaluated against the common Public Incidents record
before implementation.

A provider adapter should, where available, produce:

- stable provider-qualified ID
- provider
- incident type
- title
- description/location
- latitude
- longitude
- event/publication time
- status
- authoritative source
- authoritative source URL

Missing information should remain unknown rather than being inferred.

Provider-specific schemas belong in provider adapters. The display layer should
consume normalized Public Incident records and should not need to understand
individual CAD, dispatch, GIS, or open-data schemas.

Before enabling a new provider, verify its endpoint, current schema, update
cadence, terms, attribution requirements, authentication requirements, runtime
cost, and relevant privacy or redistribution restrictions.
