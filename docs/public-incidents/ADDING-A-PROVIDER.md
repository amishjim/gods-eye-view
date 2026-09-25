# Adding a Public Incidents Provider

This guide describes the preferred process for adding a new jurisdiction or source to the Public Incidents layer in God's Eye View (GEV).

The goal is not simply to make one feed work.

A good contribution should determine whether the source can reuse existing provider logic, preserve source provenance, fail safely, and make future jurisdictions easier to integrate.

## Before Writing Code

Do not begin by assuming that a newly discovered jurisdiction requires a new provider.

First determine:

1. What jurisdiction or agencies does the source cover?
2. Who publishes the source?
3. Is it intentionally publicly accessible?
4. What services does it contain?
5. What technology or vendor appears to power it?
6. Is the underlying data machine-readable?
7. Does an existing Public Incidents provider already support the same pattern?
8. Are there attribution, licensing, commercial-use, storage, or redistribution restrictions?

Research before implementation.

## Step 1 — Identify the Authoritative Source

Prefer the original public source whenever possible.

Examples include:

- municipal or county websites
- emergency communications centers
- fire departments
- EMS agencies
- police or sheriff departments
- emergency-management agencies
- government open-data portals
- official GIS services
- official public CAD displays

Third-party services may be useful discovery clues, but a downstream application should not automatically be treated as the authoritative source.

Record the public-facing source URL even when the actual machine-readable endpoint is different.

## Step 2 — Identify the Coverage Area

Determine what the source actually represents.

Do not assume that a page named for a city covers only that city.

Possible coverage relationships include:

```text
City
County
Regional dispatch authority
Multiple municipalities
Individual agency
Multiple agencies
Special district
State or regional system
