# Public Incidents Data Sources

This document records authoritative public-data sources used by the God's Eye View Public Incidents layer.

Its purpose is to preserve source provenance, technical details, operational characteristics, and known limitations as additional jurisdictions and provider families are added.

## Current Coverage

Public Incidents currently has seven registered jurisdictions across three provider families:

| Provider | Jurisdiction | Platform / Format | Target Polling |
| --- | --- | --- | --- |
| Austin Fire | Austin, Texas | Socrata | 5 minutes |
| Seattle Fire | Seattle, Washington | Socrata | 5 minutes |
| Phoenix Fire | Phoenix, Arizona | ArcGIS | 5 minutes |
| Houston Active Incidents | Houston, Texas | ArcGIS | 5 minutes |
| San Diego Fire-Rescue | San Diego, California | ArcGIS | 5 minutes |
| Monroe County 911 | Monroe County, New York | XML / RSS | 5 minutes |
| Portland 911 | Portland, Oregon | XML / Atom | 5 minutes |

Registration does not imply that every provider is available at all times. Public upstream systems can experience outages, maintenance, schema changes, or other failures.

GEV treats provider availability separately from incident activity. A failed provider must not be interpreted as a jurisdiction having zero incidents.

---

## Architecture

Public Incidents is a provider-neutral layer.

Individual public-data systems are handled by provider adapters. Each adapter converts its source into the common Public Incident record consumed by the display layer.

The current provider families are:

- Socrata Open Data API
- ArcGIS REST / GeoJSON
- XML syndication, currently RSS and Atom

Additional provider families can be added without teaching the map layer individual CAD, dispatch, GIS, or open-data schemas.

### Common Record

Where available, a provider produces:

- stable provider-qualified ID
- provider ID
- incident type
- title
- description or location
- latitude
- longitude
- event or publication time
- status
- authoritative source
- authoritative source URL

Missing information remains unknown rather than being inferred.

Incident records do not establish injuries, casualties, cause, severity, identity, or other facts unless the authoritative source explicitly supplies them.

---

## Retrieval and Proxy Architecture

Browser clients retrieve Public Incidents data through the GEV server rather than directly contacting provider endpoints.

The browser requests:

`/api/public-incidents/<provider-id>`

The server resolves that registered provider ID to its configured authoritative endpoint and retrieves the upstream data.

This architecture provides a consistent same-origin interface for providers that would otherwise be inaccessible to browsers because of CORS restrictions.

The proxy is provider-ID based and allowlisted through the registered provider catalog. It is not intended to operate as an arbitrary URL proxy.

The authoritative upstream source remains identified in the provider registry and normalized incident records.

---

## Failure Isolation

Public Incidents providers are independent data sources.

A failure by one provider must not prevent healthy providers from displaying incidents.

The combined source therefore tolerates individual provider failures and displays records returned by providers that remain available. The combined source fails only when all registered providers fail.

Provider failure and an authoritative report of zero incidents are different states.

A future provider-health interface should expose states such as:

- healthy
- degraded
- unavailable
- last successful update

This may eventually appear geographically as a jurisdiction status card or marker so an upstream outage cannot make an area appear falsely quiet.

---

# Registered Providers

## Austin Fire Department

**Provider ID:** `austin-fire`

**Jurisdiction:** Austin, Texas, USA

**Agency:** Austin Fire Department

**Dataset:** Real-Time Fire Incidents

**Platform / vendor:** Socrata Open Data API (SODA)

**Public information / source page:**

`https://data.austintexas.gov/d/wpu4-x69d`

**Authoritative endpoint:**

`https://data.austintexas.gov/resource/wpu4-x69d.json`

GEV requests active incidents, orders them by published date, and limits the result to 500 records.

**Fields currently consumed:**

- `traffic_report_id` -> provider source ID
- `issue_reported` -> incident type and title
- `address` -> description/location
- `latitude` -> latitude
- `longitude` -> longitude
- `published_date` -> incident time
- `traffic_report_status` -> status

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Known limitations:**

- The feed represents active incidents rather than a complete incident history.
- Medical incidents are excluded from the public feed.
- Snapshot collection should not be treated as a complete historical record.
- Upstream availability is outside GEV's control.

**Verified:** 2026-09-18

---

## Seattle Fire Department

**Provider ID:** `seattle-fire`

**Jurisdiction:** Seattle, Washington, USA

**Agency:** Seattle Fire Department

**Dataset:** Seattle Real Time Fire 911 Calls

**Platform / vendor:** Socrata Open Data API (SODA)

**Public dataset / source page:**

`https://data.seattle.gov/d/kzjm-xkqj`

**Authoritative endpoint:**

`https://data.seattle.gov/resource/kzjm-xkqj.json`

GEV requests the newest dispatch records first and limits the result to 500 records.

**Fields currently consumed:**

- `incident_number` -> provider source ID
- `type` -> incident type and title
- `address` -> description/location
- `latitude` -> latitude
- `longitude` -> longitude
- `datetime` -> incident time

**Status behavior:** The source does not provide the Austin-style status field used by the Austin adapter. GEV leaves status blank rather than inferring one.

**Timezone handling:** Seattle publishes timezone-less local timestamps. GEV interprets them using `America/Los_Angeles` before converting them to an absolute timestamp.

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Known limitations:**

- The feed includes dispatch activity and may include medical response types.
- No equivalent of Austin's active/inactive status field is currently consumed.
- Upstream availability is outside GEV's control.

**Verified:** 2026-09-18

---

## Phoenix Fire Department

**Provider ID:** `phoenix-fire`

**Jurisdiction:** Phoenix, Arizona, USA

**Agency:** Phoenix Fire Department

**Dataset:** Active Incidents - Public

**Platform / vendor:** ArcGIS REST

**Authoritative service:**

`https://maps.phoenix.gov/phxfire/rest/services/Active_Incidents__Public/MapServer/0`

GEV queries the service as GeoJSON with geometry returned in WGS84 coordinates.

**Fields currently consumed:**

- `Incident` -> provider source ID
- `Nature` -> incident type
- `NatureDesc` -> title
- `GenLocInfo` -> description/location
- GeoJSON geometry -> latitude and longitude
- `Date` -> incident time

**Status behavior:** No status field is currently mapped.

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Known limitations:**

- GEV depends on the public ArcGIS service remaining available and maintaining a compatible schema.
- Status remains unknown when the source does not supply a mapped status value.

**Verified:** 2026-09-19

---

## Houston Emergency Center

**Provider ID:** `houston-active-incidents`

**Jurisdiction:** Houston, Texas, USA

**Agency:** Houston Emergency Center

**Dataset:** HEC Active Incidents

**Platform / vendor:** ArcGIS REST

**Authoritative service:**

`https://mycity2.houstontx.gov/pubgis01/rest/services/HEC/HEC_Active_Incidents/MapServer/0`

GEV queries the service as GeoJSON with geometry returned in WGS84 coordinates.

**Fields currently consumed:**

- `UID` -> provider source ID
- `Agency` -> incident type
- `IncidentType` -> title
- `Address` -> description/location
- GeoJSON geometry -> latitude and longitude
- `CALL_TIME` -> incident time

**Status behavior:** No status field is currently mapped.

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Known limitations:**

- GEV depends on the public ArcGIS service remaining available and maintaining a compatible schema.
- Status remains unknown when the source does not supply a mapped status value.

**Verified:** 2026-09-19

---

## San Diego Fire-Rescue Department

**Provider ID:** `san-diego-fire`

**Jurisdiction:** San Diego, California, USA

**Agency:** San Diego Fire-Rescue Department

**Dataset:** FireMap Incidents

**Platform / vendor:** ArcGIS FeatureServer

**Authoritative service:**

`https://webmaps.sandiego.gov/arcgis/rest/services/SDFR/FireMap_Incidents/FeatureServer/0`

GEV requests records where `IsActive=-1` and retrieves the result as GeoJSON with WGS84 geometry.

**Fields currently consumed:**

- `MasterIncidentNumber` -> provider source ID
- `ProblemCode` -> incident type
- `ProblemDescription` -> title
- `Address` -> description/location
- GeoJSON geometry -> latitude and longitude
- `ResponseDate` -> incident time
- `PriorityDescription` -> current mapped status value

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Known limitations:**

- `PriorityDescription` is currently mapped into the common status field even though source semantics may differ from operational incident status.
- Invalid or unusable coordinates must not create map incidents.
- GEV depends on the public ArcGIS service remaining available and maintaining a compatible schema.

**Verified:** 2026-09-19

---

## Monroe County 911

**Provider ID:** `monroe-county-911`

**Jurisdiction:** Monroe County, New York, USA

**Agency:** Monroe County 911

**Platform / format:** XML / RSS 2.0 with W3C geographic elements

**Public incident page:**

`https://www.monroecounty.gov/safety-incidents`

**Authoritative feed:**

`https://www.monroecounty.gov/incidents911.rss`

The feed supplies current dispatch incidents as RSS items.

**Fields currently consumed:**

- RSS `title` -> incident type plus location
- RSS `description` -> status and incident ID
- RSS `pubDate` -> incident time
- RSS `guid` -> fallback identity
- `geo:lat` -> latitude
- `geo:long` -> longitude

GEV extracts the incident ID from the description when available and uses the GUID as a fallback.

GEV extracts the source-provided status from the RSS description when available.

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Browser access:** Direct browser retrieval is restricted by the source's CORS behavior. GEV retrieves the authoritative feed through its allowlisted server proxy.

**Known limitations:**

- The XML adapter depends on the current RSS structure and text conventions.
- Status and incident ID are currently parsed from source-provided description text.
- Changes to that formatting may require adapter changes.

**Verified:** 2026-09-19

---

## Portland 911

**Provider ID:** `portland-911`

**Jurisdiction:** Portland, Oregon, USA

**Agency:** Portland 911

**Platform / format:** XML / Atom with GeoRSS

**Public source site:**

`https://www.portlandmaps.com/`

**Authoritative feed:**

`https://www.portlandmaps.com/scripts/911incidents.cfm`

The feed supplies current dispatch incidents as Atom entries.

**Fields currently consumed:**

- Atom `id` -> provider source ID
- Atom `title` -> incident type plus location
- Atom `category` -> incident type
- Atom `published` or `updated` -> incident time
- GeoRSS `point` -> latitude and longitude

For current entries, GEV extracts the final path component of the Atom ID as the source incident ID.

**Status behavior:** No separate status field is currently mapped.

**GEV polling cadence:** 5 minutes.

**Authentication:** None currently required.

**Runtime cost:** No paid API dependency currently used by GEV.

**Browser access:** Direct browser retrieval is restricted by the source's CORS behavior. GEV retrieves the authoritative feed through its allowlisted server proxy.

**Known limitations:**

- The adapter depends on the current Atom and GeoRSS structure.
- The normalized agency is currently the general `Portland 911` source rather than a per-entry responding agency.
- Status remains unknown unless a future source mapping provides it.

**Verified:** 2026-09-19

---

# Source and Data Integrity Rules

Public Incidents presents information from authoritative public sources.

GEV should not infer facts that the source does not provide.

In particular:

- Do not infer injuries or casualties from incident type.
- Do not infer cause from dispatch terminology.
- Do not infer severity from the presence, number, or type of responding units unless the authoritative source explicitly defines that meaning.
- Do not attempt to re-identify individuals.
- Do not treat an unavailable provider as reporting zero incidents.
- Do not silently convert an upstream failure into an empty result.

Future supplemental sources may include official resources, local news, public-safety radio, nearby cameras, or public/social information.

Geographic proximity, matching keywords, or similar timing alone are not sufficient to claim that supplemental information concerns the same incident.

Any future correlation system should preserve the distinction between:

1. authoritative incident record
2. official supplemental resources
3. local news
4. live public-safety radio
5. nearby public cameras
6. public/social information

Correlation should be represented with appropriate confidence and provenance rather than presented as established fact without sufficient evidence.

---

# Adding Providers

Before enabling a new provider:

1. Identify the authoritative public source.
2. Determine the platform, vendor, feed type, or data format.
3. Verify that the endpoint is current and operational.
4. Confirm that incidents contain usable geographic information.
5. Determine stable incident identity.
6. Identify incident type, time, location, and status fields where available.
7. Determine expected update cadence.
8. Review authentication requirements.
9. Review runtime/API cost.
10. Review terms, licensing, attribution, privacy, and redistribution considerations.
11. Implement or reuse a provider adapter.
12. Normalize into the common Public Incident record.
13. Verify the resulting incidents geographically and semantically in GEV.
14. Record the provider in this document.

A technically reachable endpoint is not sufficient by itself. Stale, historical, abandoned, or otherwise unsuitable datasets should not be presented as live incident sources.

Provider-specific schemas belong in provider adapters. The display layer should remain provider-neutral.