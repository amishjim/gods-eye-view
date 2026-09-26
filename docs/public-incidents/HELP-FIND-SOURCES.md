# Help Find Public Incident Sources

God's Eye View — Public Incidents is building a directory and integration system for publicly available emergency and public-safety information.

We need help finding those sources.

You do **not** need to be a programmer, know what an API is, or understand how emergency dispatch systems work.

If your city, county, fire department, police department, emergency-management agency, or other local government publishes public incident information online, you can help us find it.

## What We Are Looking For

We are interested in legitimate public sources containing information such as:

- fire incidents
- EMS calls
- police calls for service
- rescue incidents
- traffic incidents
- road closures
- hazardous-material incidents
- emergency-management incidents
- wildfire information
- other geographically identifiable public-safety events

Useful sources may be called:

- Active Calls
- Calls for Service
- 911 Calls
- Dispatch
- CAD
- Incident Dashboard
- Open Data
- Emergency Incidents
- Fire Incidents
- Police Incidents
- Public Safety
- GIS
- Live Incidents

Different jurisdictions use very different terminology.

## The Most Important Thing You Can Send Us

A URL.

If you find a webpage where your local government or emergency agency publicly displays incidents, send us the link.

Even if you know nothing about how the page works, that can be enough for us to investigate it.

For example:

```text
Jurisdiction: Example County, Virginia
Agency: Example County Fire & Rescue

Public page:
https://example.gov/active-calls

What I found:
This page shows current fire and EMS calls.
```

That is already a useful submission.

## What We Would Like to Know

Provide whatever you can determine.

You are **not expected to answer every question**.

### Location

Tell us:

- city, county, or other jurisdiction
- state, province, or region
- country, if outside the United States

### Agency

If known, tell us which organization publishes the information.

Examples:

- fire department
- sheriff's office
- police department
- county 911 center
- emergency communications center
- emergency-management agency
- transportation department

### Public Source

Provide the public webpage where you found the information.

This is the most important field.

### What Does It Show?

Tell us what you can actually see.

Examples:

- active fire calls
- fire and EMS incidents
- police calls for service
- traffic crashes
- road closures
- recent incidents
- emergency alerts

Do not guess.

If you are unsure, say so.

### How Much Information Is Shown?

Useful observations include whether the source displays:

- incident type
- date
- time
- status
- street
- intersection
- neighborhood
- latitude/longitude
- responding agency
- responding units
- incident number

Again, you do not need to identify all of these.

### Does It Show a Map?

Tell us if incidents appear on:

- a map
- a list
- both

### How Current Is It?

If you can tell, let us know whether the page appears to contain:

- live or active incidents
- today's incidents
- recent incidents
- historical incidents
- an archive

### Can You Search Older Incidents?

If the system allows searching previous dates, tell us.

If you see downloadable historical information such as CSV files, spreadsheets, GIS datasets, or open-data records, include those links too.

## Technical Information — Optional

You do **not** need to investigate this section.

If you happen to recognize technical information, however, it can save us research time.

Useful information includes:

- API URL
- JSON endpoint
- XML feed
- RSS feed
- Atom feed
- GeoJSON
- CSV download
- ArcGIS REST service
- Socrata dataset
- vendor/platform name
- public CAD provider

If none of that means anything to you, ignore it.

The public webpage alone is useful.

## Vendor or Platform

Sometimes the website identifies the company or system providing the incident information.

Examples might appear:

- at the bottom of the page
- in a logo
- in the webpage address
- in an About page
- in documentation

If you see a vendor or platform name, include it.

Do not guess the vendor from appearance alone.

## Evidence

Whenever possible, give us something we can independently inspect.

Good evidence includes:

- official government URL
- official agency URL
- public incident page
- open-data dataset
- API documentation
- GIS service
- vendor documentation
- downloadable public dataset

A description without a source can still provide a research lead, but a working URL is substantially more useful.

## What Not to Send

Please do not submit:

- passwords
- usernames
- private API keys
- access tokens
- private databases
- restricted dispatch systems
- information obtained by bypassing security
- information requiring unauthorized access
- personally identifying information that is not necessary to identify the public source

We are looking for information intentionally made available to the public.

## Can't Find the Source?

You can still help.

Search for combinations such as:

```text
[city] active calls

[county] active incidents

[county] 911 calls

[city] fire dispatch

[county] calls for service

[city] open data fire incidents

[county] emergency communications active calls

[agency] incident dashboard
```

Try both the city and county.

Fire, EMS, police, emergency communications, transportation, and emergency-management agencies may maintain separate systems.

## Use Your Favorite AI to Help

You may also use ChatGPT, Claude, Gemini, Copilot, or another AI assistant to help investigate your jurisdiction.

Copy the following prompt into your preferred AI:

```text
I am helping an open-source project locate legitimate PUBLIC emergency and public-safety incident information for my community.

Jurisdiction:
[ENTER CITY/COUNTY]

State/Region:
[ENTER STATE/REGION]

Country:
[ENTER COUNTRY]

Help me research public sources for:

- fire incidents
- EMS incidents
- police calls for service
- 911/dispatch calls
- traffic incidents
- emergency-management incidents
- other public incident feeds

Prioritize authoritative sources such as:

- official government websites
- fire departments
- police or sheriff agencies
- emergency communications/911 centers
- government open-data portals
- public GIS systems
- transportation agencies
- official vendor-hosted public incident systems

Look for:

- active-call pages
- incident dashboards
- public CAD pages
- APIs
- JSON/XML feeds
- RSS or Atom feeds
- CSV/downloadable datasets
- ArcGIS REST services
- Socrata datasets
- historical incident datasets

For every possible source, give me:

1. jurisdiction
2. agency
3. public webpage URL
4. direct data/feed/API URL, if actually found
5. what types of incidents it appears to contain
6. whether it appears live, recent, or historical
7. vendor/platform, if confirmed
8. evidence showing why you believe the source belongs to this jurisdiction

IMPORTANT:

Do not invent URLs, APIs, vendors, datasets, or facts.

Clearly label anything uncertain.

A search result or AI inference is only a research lead.

I need real URLs that I can open and inspect myself.

Do not attempt to bypass authentication, CAPTCHAs, paywalls, access controls, or other security restrictions.

Only investigate information intentionally available to the public.
```

## Verify Before Submitting

AI systems and search engines can return outdated or incorrect information.

Before submitting a source:

1. open the URL yourself
2. confirm that the page actually exists
3. confirm that it appears related to the jurisdiction
4. tell us what you personally observed

You do not need to prove that the source can be integrated into God's Eye View.

That is our job.

## What Happens After You Submit It?

A community submission begins as a **candidate source**.

Submission does not mean the source is automatically added to God's Eye View.

The project will attempt to:

1. verify the jurisdiction and agency
2. verify that the information is legitimately public
3. inspect the source
4. identify the underlying data when practical
5. identify the provider or provider family
6. evaluate source restrictions and attribution requirements
7. test the source
8. determine whether it can be integrated reliably

Confirmed sources may then become part of the Public Incidents source catalog and potentially the God's Eye View Public Incidents layer.

## You Can Help Without Writing Code

Finding the source is often the hardest part.

Someone who knows their own community may know about a county dispatch page, fire-department dashboard, or local open-data system that would take an outside developer much longer to discover.

That makes source discovery a meaningful contribution to the project.

**Find it. Send us the link. We'll investigate the rest.**
