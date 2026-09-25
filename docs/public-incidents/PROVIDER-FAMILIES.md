# Public Incidents Provider Families

This document describes the provider-family model used by the Public Incidents layer in God's Eye View (GEV).

A provider family represents a reusable technical pattern shared by multiple public incident sources.

The objective is to avoid building and maintaining a separate integration for every city, county, or agency when several jurisdictions publish their data through the same underlying system or format.

## Core Concept

Public Incidents distinguishes between:

- **Jurisdiction** — the geographic or governmental area being represented.
- **Agency** — the organization publishing or responsible for the information.
- **Source** — the specific public endpoint, feed, page, API, or dataset.
- **Provider family** — the reusable technical method used to retrieve and interpret that source.

A jurisdiction is therefore not necessarily a provider.

Multiple jurisdictions may use the same provider family.

Likewise, one jurisdiction may expose multiple sources using different provider families.

## Why Provider Families Matter

Public-safety information is published through many different systems.

Examples include:

- JSON APIs
- XML feeds
- RSS or Atom feeds
- CSV files
- ArcGIS services
- Socrata/open-data portals
- public CAD pages
- vendor-hosted active-call systems
- agency dashboards
- static or semi-static web pages

If every jurisdiction were implemented independently, the Public Incidents layer would eventually contain hundreds or thousands of nearly duplicated integrations.

Provider families allow the project to reuse:

- fetch logic
- parsing logic
- field mapping
- normalization
- error handling
- testing
- documentation
- maintenance knowledge

The long-term objective is:

> Discover a new jurisdiction, identify its provider family, configure the source, and reuse as much existing code as possible.

## Provider-Family Model

A provider family should represent a meaningful reusable technical pattern.

Conceptually:

```text
Jurisdiction
    |
    +-- Source
            |
            +-- Provider Family
                    |
                    +-- Fetch
                    +-- Parse
                    +-- Normalize
                    +-- Validate
```

The provider family handles the mechanics of obtaining and interpreting the source.

Jurisdiction-specific configuration supplies information such as:

- jurisdiction name
- agency name
- source URL
- geographic information
- refresh behavior
- source-specific field mappings when necessary
- attribution
- source notes

## Example

Suppose several cities expose active incidents through the same vendor platform.

Instead of implementing:

```text
City A integration
City B integration
City C integration
City D integration
```

the project should prefer:

```text
Vendor/provider family
    |
    +-- City A configuration
    +-- City B configuration
    +-- City C configuration
    +-- City D configuration
```

When the underlying platform changes, the shared provider-family implementation can often be updated once rather than repairing every jurisdiction independently.

## Provider-Neutral Architecture

God's Eye View should not depend on any particular vendor.

Provider-family names describe technical integrations, not preferred suppliers.

The normalized Public Incidents model should remain independent of the original source technology.

For example, these sources:

```text
JSON API
XML feed
ArcGIS service
RSS feed
CSV dataset
```

should ultimately produce incidents using the same normalized internal schema.

The map and user interface should not need to understand the original provider format.

## Discovery Process

When researching a new jurisdiction:

1. Identify the official agency or jurisdiction.
2. Locate the public incident source.
3. Verify that the source is publicly accessible.
4. Identify the underlying technology or provider when possible.
5. Compare the source with existing provider families.
6. Determine whether an existing adapter can support it.
7. If necessary, extend an existing provider family.
8. Create a new provider family only when the source represents a genuinely different technical pattern.
9. Normalize the resulting records into the Public Incidents schema.
10. Test the source with real public data.

Do not assume two visually similar websites use the same backend.

Do not assume two different-looking websites use different backends.

The actual network endpoint and data structure matter more than the appearance of the public page.

## Identifying a Provider Family

Useful clues include:

- API endpoint structure
- hostname
- vendor branding
- JavaScript bundle references
- network requests
- JSON structure
- XML namespaces
- ArcGIS service metadata
- Socrata dataset identifiers
- recurring field names
- URL patterns
- response headers
- documentation from the publishing agency or vendor

Provider-family identification should be based on verifiable technical evidence whenever possible.

## Configuration vs. Code

Whenever practical, adding another jurisdiction using an existing provider family should require configuration rather than new parsing code.

Prefer:

```text
existing provider adapter
+ new jurisdiction configuration
```

over:

```text
copy existing adapter
+ rename it for another city
```

Duplicated adapters increase maintenance cost and make fixes harder to propagate.

## When to Create a New Provider Family

Create a new provider family when the source cannot reasonably be represented by an existing integration.

Examples may include:

- a substantially different API
- a unique XML schema
- a new vendor platform
- a different authentication or request model
- a source requiring fundamentally different parsing
- a new public-data technology not already represented

Do not create a new family merely because:

- the jurisdiction is different
- the agency name is different
- the source URL is different
- field labels vary slightly
- one jurisdiction omits optional fields

Those differences should generally be handled through configuration or normalization.

## Source Variations Within a Family

Real-world public systems are inconsistent.

Two deployments of the same platform may expose:

- different fields
- different date formats
- different incident categories
- different coordinate precision
- different refresh intervals
- different historical windows
- different agency identifiers
- additional custom fields

Provider-family implementations should tolerate reasonable variation without silently inventing missing information.

Missing values should remain missing when they cannot be reliably derived.

## Normalization

Provider-family adapters convert source-specific records into the common Public Incidents incident model.

Typical source fields may include:

```text
call_type
incident_number
dispatch_time
latitude
longitude
address
agency
status
```

Another provider might expose:

```text
nature
event_id
created
y
x
location
department
disposition
```

Both should be normalized into the same internal schema.

See:

```text
INCIDENT-SCHEMA.md
```

for the normalized incident model.

## Verification

A provider family should be tested against actual public sources.

Testing should confirm, where applicable:

- successful retrieval
- expected response format
- record parsing
- incident normalization
- coordinates
- timestamps
- jurisdiction attribution
- source attribution
- malformed or incomplete records
- empty responses
- temporary source failures

A successful HTTP response alone does not prove that the integration is correct.

## Failure Isolation

One provider or jurisdiction should not prevent unrelated Public Incidents sources from functioning.

The architecture should expect that public feeds may:

- disappear
- change format
- return errors
- time out
- temporarily contain no records
- become rate limited
- move to another endpoint
- change vendors

Failures should be isolated and observable.

## Source Status

Provider-family documentation and configuration should eventually make it possible to distinguish states such as:

```text
active
experimental
degraded
temporarily unavailable
retired
```

A source that stops working should not automatically be treated as permanently invalid.

Public agencies frequently change systems or endpoints.

## Research Records

When a new provider family is discovered, useful research should be retained.

Relevant information may include:

- vendor or platform name
- known jurisdictions
- example public endpoints
- response format
- identifying characteristics
- official documentation
- implementation notes
- limitations
- observed variations

This research can make future jurisdiction discovery substantially faster.

## Community Contributions

Contributors can help by identifying:

- public incident pages
- official APIs
- active-call feeds
- CAD pages
- open-data datasets
- GIS services
- RSS or Atom feeds
- vendor names
- endpoint URLs
- sample responses
- additional jurisdictions using known systems

A contributor does not need to understand the provider-family architecture before submitting a source.

Raw, verifiable information is useful.

Technical contributors can then determine whether the source matches an existing family or requires additional implementation.

## AI-Assisted Research

AI tools may be useful for helping contributors understand technical information, inspect public documentation, identify possible endpoints, or explain unfamiliar data formats.

AI-generated findings are not treated as verified sources by themselves.

Any endpoint, vendor identification, field mapping, or technical claim discovered with AI assistance should be checked against the actual public source before being incorporated into the project.

## Current Development

The initial Public Incidents work includes multiple jurisdictions and multiple source/provider patterns.

The provider-family catalog will continue to grow as additional public systems are discovered and verified.

The objective is not to enumerate every city with custom code.

The objective is to build a reusable library of public incident source patterns capable of supporting many jurisdictions.

## Related Documentation

See also:

```text
README.md
ARCHITECTURE.md
INCIDENT-SCHEMA.md
ADDING-A-PROVIDER.md
DATA-SOURCE-POLICY.md
```

These documents describe the surrounding Public Incidents architecture, normalized data model, provider integration process, and source standards.
