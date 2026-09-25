# Public Incidents — Known Limitations

The Public Incidents layer in God's Eye View (GEV) aggregates publicly available incident information from independent agencies, jurisdictions, and third-party public-data systems.

Because GEV does not control these source systems, users and contributors should understand the limitations of the data.

## Public Data Is Not Complete Data

Public Incidents only displays information that a source makes publicly available.

A jurisdiction may:

- publish only certain categories of incidents
- exclude law-enforcement incidents
- exclude medical calls
- exclude sensitive incidents
- delay publication
- remove incidents after a short period
- provide only approximate locations
- redact portions of incident information
- publish active incidents but not historical incidents

The absence of an incident from GEV does not mean that an incident did not occur.

## Data May Be Delayed

GEV cannot guarantee real-time information.

Delays may occur between:

1. an incident occurring
2. an agency entering information
3. the information becoming publicly available
4. the source system updating
5. GEV retrieving the updated information

Some sources may update within seconds or minutes. Others may update much less frequently.

## Sources Can Change Without Notice

Public incident systems are operated independently of GEV.

An agency or vendor may change:

- URLs
- APIs
- data formats
- field names
- authentication requirements
- GIS services
- refresh behavior
- retention periods
- public-access policies

A previously working provider may therefore stop working without any change to GEV.

## Temporary Source Failures

Public sources may become temporarily unavailable because of:

- server outages
- maintenance
- rate limiting
- network problems
- certificate problems
- upstream software failures
- configuration changes

GEV should treat temporary source failures as expected operational conditions rather than assuming that the underlying jurisdiction no longer publishes data.

## Geographic Accuracy

Incident locations may not represent exact incident locations.

Sources may provide:

- exact coordinates
- street addresses
- intersections
- street blocks
- approximate coordinates
- neighborhood locations
- jurisdiction centroids
- intentionally displaced coordinates

GEV should preserve the level of geographic precision supplied by the source whenever practical.

GEV should not manufacture additional geographic precision that the source does not provide.

## Incident Classification

Different jurisdictions may describe similar incidents differently.

For example, similar events might be labeled:

- Structure Fire
- Building Fire
- Fire Alarm
- Residential Fire
- Commercial Fire
- Smoke Investigation

Normalization can make different systems easier to use together, but normalization inevitably loses some local terminology and detail.

Whenever practical, GEV should preserve the original source description in addition to normalized fields.

## Duplicate Incidents

A single real-world event may appear in more than one public source.

Examples include:

- fire and EMS systems reporting the same event
- neighboring jurisdictions responding to the same incident
- regional and municipal systems publishing overlapping records
- multiple agencies generating separate incident identifiers

GEV may not always be able to determine that these records represent the same event.

Deduplication should therefore be conservative.

## Incident Updates

Public incidents can change after they are initially published.

Fields that may change include:

- incident type
- status
- responding units
- location
- description
- timestamps
- disposition

A record retrieved earlier may differ from the current source record.

## Historical Availability

Historical data varies substantially between providers.

Some systems may provide:

- only currently active incidents
- several hours of history
- several days of history
- downloadable archives
- open-data datasets covering years

Historical availability should not be assumed simply because a live incident feed exists.

## Source Authority

The original publishing agency or system remains authoritative for its own information.

GEV is an aggregation and visualization layer.

When accuracy is important, users should consult the original source or appropriate public agency.

## Emergency Use

Public Incidents is not an emergency notification system.

It is not:

- a replacement for 911
- a dispatch system
- an official emergency alert service
- a guarantee that every emergency will appear
- a guarantee that displayed information is current

Anyone experiencing or witnessing an emergency should contact the appropriate emergency service directly.

## Automated Research and AI

Automated tools and AI systems may assist contributors in locating possible public sources or understanding unfamiliar data structures.

Their output must not be treated as verified evidence.

AI-generated:

- URLs
- endpoint descriptions
- vendor identifications
- field mappings
- API claims
- jurisdiction coverage claims

must be independently verified against the actual source before being added to the project.

AI is a research assistant, not a source of record.

## Contributor Responsibility

Contributors should clearly distinguish between:

- confirmed working sources
- probable sources
- experimental sources
- broken sources
- historical sources
- secondary references

Do not represent an unverified source as operational.

When uncertain, document the uncertainty.

## Guiding Principle

Public Incidents should prefer:

**accurate, attributable, and incomplete data over comprehensive but unreliable data.**

The project should never imply greater certainty, precision, coverage, or timeliness than the underlying public sources actually provide.
