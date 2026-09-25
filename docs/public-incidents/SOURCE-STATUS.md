# Public Incidents — Source Status

This document defines the status system used to track public incident data sources discovered for God's Eye View (GEV).

The purpose is to distinguish clearly between sources that have merely been discovered, sources that have been technically verified, sources that are integrated, and sources that no longer work.

A source should never be described as operational unless its current status supports that claim.

## Status Values

Use one of the following primary status values for each source.

### CANDIDATE

A possible public incident source has been identified but has not yet been verified.

Examples:

- search result
- agency webpage
- possible active-calls page
- possible API endpoint
- vendor-hosted application
- GIS layer
- source suggested by a contributor
- source suggested by AI

A candidate is a research lead only.

### PUBLIC-CONFIRMED

The source has been manually verified as a legitimate public source associated with the stated jurisdiction or agency.

At minimum:

- the source loads
- the jurisdiction or agency is confirmed
- relevant incident information is publicly accessible
- no private credentials are required

The underlying machine-readable data may not yet have been identified.

### DATA-CONFIRMED

The underlying data source has been located and inspected.

Examples:

- JSON endpoint
- XML feed
- GeoJSON
- CSV
- ArcGIS REST service
- RSS or Atom feed
- documented API
- structured HTML suitable for parsing

The source has not necessarily been integrated into GEV yet.

### DEVELOPMENT

Implementation work is underway.

This status may include:

- provider development
- field mapping
- normalization
- proxy work
- tests
- debugging
- refresh behavior analysis

A source in development should not yet be treated as a production-ready integration.

### INTEGRATED

The source has been successfully implemented in Public Incidents.

The integration should:

- retrieve data
- normalize records
- pass relevant tests
- render or otherwise function correctly in GEV

### VERIFIED

The integration has been tested against the live source and confirmed to work as expected.

Verification should include actual source records whenever possible.

This is the preferred status for sources considered operational.

### DEGRADED

The integration still works, but some expected functionality is impaired.

Examples:

- missing fields
- intermittent failures
- incomplete incident categories
- abnormal delays
- partial geographic information
- source-side problems

Document the known degradation.

### TEMPORARILY-UNAVAILABLE

A previously working source is currently unavailable, but there is not enough evidence to conclude that it has been permanently discontinued.

Possible causes include:

- maintenance
- server outage
- temporary network failure
- certificate problem
- upstream vendor issue
- temporary access problem

Do not immediately remove the provider.

### BROKEN

A previously working integration no longer functions because the source or its technical behavior has changed.

Examples:

- endpoint changed
- response format changed
- required fields disappeared
- provider application changed
- integration logic no longer matches the source

Broken sources should remain documented while repair or replacement is investigated.

### RETIRED

The source is known to have been discontinued, replaced, or intentionally removed from active use.

Record the reason whenever known.

Examples:

- jurisdiction changed vendors
- agency stopped publishing the feed
- replacement source exists
- source was determined inappropriate for integration

### REJECTED

The source was investigated and intentionally rejected.

Possible reasons include:

- not actually public
- wrong jurisdiction
- unrelated dataset
- requires bypassing access controls
- unreliable secondary source
- unacceptable privacy concerns
- duplicate of a better source
- unsuitable technical characteristics

Record the rejection reason so future contributors do not repeat the same investigation unnecessarily.

## Recommended Status Flow

A typical successful source may progress through:

CANDIDATE  
→ PUBLIC-CONFIRMED  
→ DATA-CONFIRMED  
→ DEVELOPMENT  
→ INTEGRATED  
→ VERIFIED

Not every source will pass through every stage.

A verified source may later move to:

VERIFIED  
→ DEGRADED

or:

VERIFIED  
→ TEMPORARILY-UNAVAILABLE

or:

VERIFIED  
→ BROKEN

and eventually:

BROKEN  
→ VERIFIED

if repaired.

A permanently discontinued source may move to:

BROKEN  
→ RETIRED

## Status Is Not Source Quality

Status describes the state of research or integration.

It does not indicate how comprehensive the underlying source is.

A VERIFIED source may still:

- omit police incidents
- omit medical incidents
- delay publication
- provide approximate locations
- retain incidents briefly
- contain only selected call types

Those limitations should be documented separately.

## Verification Date

Every source marked VERIFIED should include a verification date.

Example:

```text
Status: VERIFIED
Verified: 2026-09-25
