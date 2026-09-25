# Public Incident Source Submission Guide

You can help expand God's Eye View Public Incidents without writing any code.

If your city, county, fire department, EMS agency, police department, emergency communications center, or other public agency publishes incident information online, we want to know about it.

Even if you do not understand how the underlying system works, sending us the public page can be useful.

## What We Are Looking For

Useful public sources may include:

- active emergency calls
- fire incidents
- EMS incidents
- police calls for service
- public CAD information
- dispatch information
- emergency incident maps
- open-data datasets
- public GIS services
- ArcGIS services
- JSON APIs
- XML feeds
- CSV datasets
- RSS feeds
- Atom feeds
- historical incident datasets
- vendor-hosted public safety pages

The source must be information intentionally available to the public.

## You Do Not Need to Know the Technical Details

If you know that your local fire department has an active-call webpage, send us the webpage.

If you know your county has an emergency incident map, send us the map.

If you found an open-data dataset but do not understand the API, send us the dataset page.

Technical contributors can investigate how the source works.

## Information You Can Submit

Provide whatever information you know.

You do not need to complete every field.

```text
Location / Jurisdiction:

State / Province / Region:

Country:

Agency or Department:

Type of information:
[ ] Fire
[ ] EMS
[ ] Police
[ ] Rescue
[ ] Emergency Management
[ ] Other

Public webpage:

Direct data/API/feed URL, if known:

Type of source, if known:
[ ] Public active-call page
[ ] CAD
[ ] API
[ ] JSON
[ ] XML
[ ] CSV
[ ] RSS
[ ] Atom
[ ] ArcGIS / GIS
[ ] Open-data portal
[ ] Downloadable dataset
[ ] Vendor-hosted system
[ ] Unknown
[ ] Other

Vendor or software platform, if known:

Does the source show current incidents?
[ ] Yes
[ ] No
[ ] Unsure

Does the source provide historical incidents?
[ ] Yes
[ ] No
[ ] Unsure

How far back does the historical data go, if known?

Does the source include locations or coordinates?
[ ] Yes
[ ] No
[ ] Unsure

Does the source require a login?
[ ] No
[ ] Yes
[ ] Unsure

How did you find this source?

Date you checked the source:

Additional notes:
```

## The Most Important Information

If you do not have time to investigate anything else, send:

```text
Jurisdiction:
Public URL:
What appears to be on the page:
```

That is enough to begin investigating.

## Please Send the Original Source

Whenever possible, provide the official public source rather than a screenshot.

A direct URL allows contributors to determine:

- who publishes the information
- how the webpage obtains its data
- whether an API exists
- whether the source belongs to a known provider family
- how frequently the information updates
- whether the source can be integrated into Public Incidents

Screenshots can still be useful as supporting information.

## Finding Your Local Public Incident Sources

Try searches such as:

```text
[your city] active calls
[your county] active calls
[your city] fire incidents
[your county] fire rescue active calls
[your city] police calls for service
[your county] emergency incidents
[your city] CAD public
[your county] CAD public
[your city] emergency incident map
[your county] open data emergency calls
[your city] ArcGIS fire incidents
[your county] dispatch calls
```

You can also check the websites of:

- your city
- your county
- fire departments
- EMS agencies
- sheriff's offices
- police departments
- emergency communications centers
- 911 centers
- emergency management agencies
- municipal or county open-data portals

## Look for More Than the Visible Page

Sometimes the webpage you see is only a viewer for another public data source.

Behind it may be:

- a JSON API
- an XML feed
- an ArcGIS service
- a GIS layer
- an RSS feed
- an Atom feed
- a CSV file
- an open-data API
- a vendor-hosted endpoint

You do not need to find these yourself.

If you do find one, include it with your submission.

## Using AI to Help

If you want to investigate further but do not know how, you can use your preferred AI assistant.

Copy this prompt and replace the jurisdiction:

```text
I am helping an open-source project locate publicly available emergency and public-safety incident information.

Please investigate:

[JURISDICTION, STATE/REGION, COUNTRY]

I am looking only for information intentionally available to ordinary members of the public.

Search for:

1. Official active-call pages
2. Fire and EMS incident pages
3. Police calls-for-service pages
4. Public CAD systems
5. Official emergency incident maps
6. Government open-data datasets
7. ArcGIS or GIS services
8. Public JSON APIs
9. Public XML feeds
10. CSV datasets
11. RSS or Atom feeds
12. Historical incident datasets
13. The vendor or software platform powering these systems, when verifiable
14. Direct public data endpoints used by public webpages, when discoverable

For every finding:

- provide the actual public URL
- identify the agency or government organization
- describe what information appears to be available
- identify the data format if known
- identify the vendor/platform only when supported by evidence
- distinguish verified facts from possibilities
- state when something could not be verified

Do not invent URLs, APIs, feeds, vendors, or technical details.

Do not attempt to access restricted systems, bypass authentication, defeat access controls, or obtain non-public information.
```

AI assistance can help with discovery, but AI output is not proof that a source exists.

Please open and verify URLs before submitting them.

## What Not to Submit

Do not submit:

- passwords
- private API keys
- restricted credentials
- non-public dispatch systems
- information obtained by bypassing authentication
- private databases
- confidential records
- leaked information
- instructions for defeating access controls

Public Incidents is specifically intended to work with legitimate public information.

## If You Find Several Sources

Great.

Submit all of them.

A jurisdiction may have separate systems for:

```text
Fire / EMS
Police
Emergency Management
Historical Open Data
GIS
```

These may use completely different providers.

Do not assume there should be only one source per jurisdiction.

## If You Find a Broken Source

Old or broken links are useful clues.

If a public incident page no longer works, provide:

```text
Jurisdiction:
Old URL:
Date checked:
What happens when you open it:
Possible replacement URL:
Any other information:
```

The agency may have moved the feed or changed vendors.

## If You Know the Vendor

Include the vendor or platform name if you can verify it.

Examples of evidence may include:

- branding on the public page
- official agency documentation
- vendor documentation
- public API documentation
- identifiable endpoint structure

Do not guess based only on appearance.

Provider identification helps Public Incidents reuse integrations across multiple jurisdictions.

## Why This Helps

Thousands of local agencies publish useful public incident information using many unrelated systems.

Finding those sources is a major part of building broad coverage.

One person who knows their local area may discover a source that would otherwise be difficult to find.

That source may also reveal a provider family used by dozens or hundreds of other jurisdictions.

## Developers

If you want to go beyond source discovery and help implement a provider, see:

```text
CONTRIBUTING.md
ADDING-A-PROVIDER.md
PROVIDER-FAMILIES.md
INCIDENT-SCHEMA.md
DATA-SOURCE-POLICY.md
ARCHITECTURE.md
```

## Goal

You do not need to be a developer.

You do not need to understand APIs.

You do not need to reverse-engineer anything.

If you know where your community publishes legitimate public incident information, **send us the source**.

That alone can help expand Public Incidents.
