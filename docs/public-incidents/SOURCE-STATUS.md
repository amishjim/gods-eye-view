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

```text
CANDIDATE
    ↓
PUBLIC-CONFIRMED
    ↓
DATA-CONFIRMED
    ↓
DEVELOPMENT
    ↓
INTEGRATED
    ↓
VERIFIED
```

Not every source will pass through every stage.

A verified source may later move to:

```text
VERIFIED
    ↓
DEGRADED
```

or:

```text
VERIFIED
    ↓
TEMPORARILY-UNAVAILABLE
```

or:

```text
VERIFIED
    ↓
BROKEN
```

and eventually:

```text
BROKEN
    ↓
VERIFIED
```

if repaired.

A permanently discontinued source may move to:

```text
BROKEN
    ↓
RETIRED
```

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
```

This helps distinguish recently confirmed sources from integrations that may not have been checked for months.

## Last Checked

Where practical, maintain a separate `last_checked` value.

Example:

```text
Status: VERIFIED
Verified: 2026-09-18
Last checked: 2026-09-25
```

The verification date records when the integration was established or substantially reverified.

The last-checked date records the most recent routine confirmation.

## Failure Notes

For DEGRADED, TEMPORARILY-UNAVAILABLE, BROKEN, RETIRED, or REJECTED sources, include a short explanation.

Example:

```text
Status: BROKEN
Last checked: 2026-09-25
Reason: Previous JSON endpoint now returns 404.
```

Useful failure information includes:

- HTTP status
- error message
- observed response change
- date first noticed
- suspected vendor migration
- replacement URL
- related jurisdictions affected

## Provider-Family Impact

When a source fails, determine whether the failure appears specific to one jurisdiction or affects a provider family.

If several jurisdictions share the same technical provider, one failure may indicate a broader change.

Provider-family changes should be documented because fixing one integration may solve several jurisdictions at once.

## Do Not Guess Status

If the current condition of a source is unknown, do not mark it VERIFIED simply because it worked previously.

Use the most accurate status supported by current evidence.

When necessary, record:

```text
Status: UNKNOWN
```

with an explanation of why the source has not recently been checked.

UNKNOWN should be temporary and should trigger future verification.

## Contributor Submissions

Community-submitted sources should normally begin as:

```text
Status: CANDIDATE
```

unless a project maintainer or contributor independently verifies them.

Submission alone does not establish source validity.

## AI-Discovered Sources

Sources suggested by AI must begin as:

```text
Status: CANDIDATE
```

AI output cannot elevate a source to PUBLIC-CONFIRMED, DATA-CONFIRMED, or VERIFIED without independent examination of the actual source.

## Guiding Principle

The source registry should tell contributors what is actually known.

**Do not confuse discovered, plausible, previously working, or AI-suggested sources with currently verified sources.**
