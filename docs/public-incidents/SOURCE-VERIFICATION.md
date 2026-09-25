# Public Incidents — Source Verification

Every source added to Public Incidents should be independently verified before it is treated as a working provider.

Finding a promising URL is not the same as confirming a usable source.

## Verification Goals

Source verification should establish:

1. who publishes the information
2. what jurisdiction or agency the source covers
3. what type of incidents it contains
4. whether the information is genuinely public
5. whether the source currently works
6. how the underlying data is delivered
7. whether the source is suitable for integration
8. whether the source appears stable enough to maintain

## Verification Levels

Research should distinguish between different levels of confidence.

### Candidate

A possible source has been identified but not technically confirmed.

Examples:

- search result
- agency page mentioning active incidents
- vendor product page
- secondary reference
- archived documentation
- AI-suggested source

Candidate sources must not be described as working integrations.

### Confirmed Public Source

The source has been manually opened and verified to provide relevant public incident information.

At minimum confirm:

- the page or endpoint loads
- the jurisdiction is correct
- incident information is actually present
- access does not require private credentials

### Confirmed Data Source

The underlying machine-readable data has been located and inspected.

Examples include:

- JSON
- XML
- CSV
- GeoJSON
- ArcGIS REST service
- RSS
- Atom
- documented API
- structured HTML

At this stage, record enough information for another contributor to reproduce the discovery.

### Integration Verified

The source has been successfully retrieved, normalized, and tested within Public Incidents.

Only at this stage should the source be considered a verified working integration.

## Prefer Primary Sources

Verification should begin with the organization responsible for publishing the information.

Preferred evidence includes:

1. official agency or government pages
2. official open-data portals
3. official GIS services
4. official API documentation
5. public systems linked directly by the responsible agency
6. vendor documentation identifying the public system

Secondary sources can help discover a source but should not replace primary verification when primary evidence exists.

## Verify the Jurisdiction

Do not assume that a source covers a jurisdiction simply because the jurisdiction is mentioned nearby.

Confirm:

- city
- county
- state
- agency
- dispatch authority
- regional coverage

Some dispatch systems serve multiple municipalities or agencies.

Others cover only one department within a larger jurisdiction.

Document the actual coverage.

## Verify Incident Types

Determine what categories of information are included.

Possible categories include:

- fire
- EMS
- police
- rescue
- traffic incidents
- hazardous materials
- marine incidents
- public works incidents
- emergency management incidents

Do not assume that a general "911" or "active calls" page includes every public-safety discipline.

## Find the Actual Data Source

A visible webpage may only be a frontend.

When appropriate, inspect:

- browser network requests
- page source
- JavaScript configuration
- API calls
- GIS services
- downloadable datasets
- RSS or Atom links
- embedded JSON
- vendor documentation

The objective is to identify the most stable legitimate public source behind the display.

Do not bypass access controls while doing this.

## Record the Source

For each confirmed source, record as much of the following as practical:

- jurisdiction
- state
- agency
- public display URL
- data endpoint
- provider or vendor
- provider family
- data format
- incident disciplines
- geographic fields
- timestamp fields
- incident identifier
- refresh behavior
- historical availability
- source attribution
- verification date
- verification notes

Use `SOURCE-RESEARCH-WORKSHEET.md` when performing source research.

## Test With Real Records

Do not verify a source based only on an empty response.

Whenever possible, inspect actual incident records.

Confirm that the returned fields can be interpreted reliably.

Look for:

- incident identifiers
- incident type
- timestamps
- location
- latitude and longitude
- agency
- status
- responding units
- descriptive fields

Not every source will provide every field.

## Compare Display and Data

When both a public webpage and an underlying data source are available, compare them.

Confirm that records visible on the public page correspond to records returned by the data source.

This can help detect:

- wrong endpoints
- stale datasets
- unrelated GIS layers
- historical-only datasets
- incomplete feeds
- misunderstood fields

## Determine Refresh Behavior

If practical, observe the source more than once.

Determine whether:

- new incidents appear
- existing incidents update
- closed incidents disappear
- timestamps change
- records expire
- the entire dataset is replaced

Understanding refresh behavior is important for choosing polling and caching strategies.

## Check Provider Family

Before creating a new provider implementation, compare the source with known provider families.

Look for similarities in:

- endpoint structure
- vendor branding
- field names
- response format
- URL patterns
- JavaScript applications
- GIS layer structure

A new jurisdiction may be compatible with an existing provider family.

Reuse should be preferred when the technical behavior genuinely matches.

## Secondary Confirmation

Useful secondary evidence may include:

- agency documentation
- municipal documents
- vendor documentation
- public meeting documents
- procurement records
- technical documentation
- reputable news coverage

Secondary evidence can help identify ownership, vendors, coverage, or system history.

It should not be used to claim that an endpoint currently works without direct verification.

## AI-Assisted Verification

AI may assist with research but cannot perform the final act of verification unless its claims are checked against the actual source.

AI can help:

- identify likely search terms
- interpret JSON or XML
- explain GIS services
- recognize vendor patterns
- analyze JavaScript
- suggest possible endpoints
- summarize documentation

AI can also confidently produce incorrect URLs, vendors, APIs, and technical explanations.

Therefore:

**AI output is a lead, not evidence.**

Every material claim used to add a provider must ultimately be supported by an actual source.

## Broken or Changed Sources

A source that previously worked should not be silently deleted from research records when it stops working.

Record:

- previous status
- date failure was observed
- type of failure
- replacement source if discovered
- relevant provider changes

This information may help identify migrations affecting multiple jurisdictions.

## Reverification

Sources should be periodically rechecked.

Reverification is particularly useful when:

- a provider suddenly fails
- a jurisdiction redesigns its website
- field mappings change
- incident counts become abnormal
- a vendor migration is suspected
- a contributor reports a problem

Provider-family failures should trigger checks of other jurisdictions using the same family.

## Evidence Standard

A contributor should be able to answer:

> How do we know this source is real, public, current, and associated with this jurisdiction?

Another contributor should then be able to reproduce that conclusion from the documented evidence.

## Guiding Principle

**Discover broadly. Verify narrowly. Integrate only what can be independently confirmed.**
