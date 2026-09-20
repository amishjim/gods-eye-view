# Public Incident Feed Research Field Manual

This field manual helps contributors investigate potential live public-safety data sources for the **God's Eye View Public Incidents** project.

> **You do not need to read this entire manual to contribute a feed.**

If you know about an official website showing current fire, EMS, police, 911, emergency-dispatch, rescue, traffic, or other public-safety incidents, that alone may be enough to help.

Start with the **Public Incident Feed submission form**. Answer whatever you know and select **I don't know** when you don't know something.

The submission form links directly to relevant sections of this manual when a question needs more explanation.

For example:

- Don't know what an **ArcGIS**, **Socrata**, **RSS**, **Atom**, **JSON**, or **GeoJSON** feed is? See [Finding the Actual Data Feed](#finding-the-actual-data-feed).
- Don't know what geographic coordinates look like? See [What Are Coordinates?](#what-are-coordinates).
- Not sure whether a number is an incident identifier? See [What Is an Incident ID?](#what-is-an-incident-id).
- Want AI help finding a source? See the [Quick Scout Prompt](#quick-scout-prompt).
- Want AI to investigate a source more thoroughly? See the [Full Research Prompt](#full-research-prompt).
- Want to ask your local government or emergency agency about public data? See [Ask Your Local Agency](#ask-your-local-agency).

You can contribute at whatever level you are comfortable with:

**Found a page:** Send us the official live-incidents webpage.

**Found a possible feed:** Send us the webpage and the feed or API URL you discovered.

**Researched the source:** Use this manual to help identify the platform, coordinates, incident fields, update frequency, access requirements, and other technical details.

**Technical contributor:** You are welcome to investigate the source further or contribute an implementation.

A useful lead is better than an incomplete investigation that never gets submitted. Project maintainers will independently verify sources before they are incorporated into God's Eye View.

---

## What We Are Looking For

God's Eye View Public Incidents is intended to grow beyond a handful of cities or agencies. Public-safety data is published differently by thousands of cities, counties, regions, states, provinces, territories, and countries around the world.

Finding those sources is a large job, and you do not need to be a programmer to help.

We are primarily interested in authoritative public sources that provide current or near-real-time geographically identifiable incidents, including:

- Fire department incidents
- EMS incidents
- Police calls or incidents when publicly released
- 911 / emergency communications calls
- Computer-aided dispatch (CAD) data
- Traffic collisions handled by public-safety agencies
- Rescue incidents
- Hazardous-material incidents
- Other active public-safety events

An ideal source provides:

- A unique incident identifier
- Incident or call type
- Location
- Latitude and longitude
- Date and time
- Current status
- A machine-readable feed or API
- Frequent updates

A source does **not** need to provide everything on this list to be useful.

---

## Start With the Official Source

Whenever possible, begin with the government agency or other authoritative organization responsible for the information.

Examples include:

- City or county 911 centers
- Fire departments
- Police departments
- Emergency communications centers
- City or county GIS departments
- Government open-data portals
- State, provincial, regional, or national emergency agencies

A third-party website can be useful for discovering that a feed exists, but we want to locate and verify the underlying authoritative source before adding it to God's Eye View.

---

## You Do Not Need to Find the API

If all you find is an official page showing current incidents, submit it.

For example:

> Fauquier County has an official page showing current emergency calls. I don't know how the page gets its data.

That is useful.

Someone else can investigate the technical details.

If you want to dig deeper, the following sections explain what to look for.

---

# Information to Collect

## Country

Tell us the country where the incidents occur.

Examples:

- United States
- Canada
- United Kingdom
- Australia

## State, Province, Territory, or Region

Provide the state, province, territory, or similar administrative area when applicable.

Examples:

- Virginia
- Pennsylvania
- Ontario
- Queensland

## Jurisdiction

Tell us the geographic area covered by the source.

This could be:

- A city
- A county
- A group of cities
- A metropolitan area
- A state or province
- Another defined service area

Examples:

- Austin, Texas
- Monroe County, New York
- Portland, Oregon

## Agency

Who publishes or operates the information?

Examples:

- Austin Fire Department
- Monroe County 911
- A city emergency communications department
- A county GIS department

If you cannot determine the agency, **Unknown** is fine.

## Official Public Page

Provide the webpage where a member of the public can see the incidents.

This is extremely useful even if you find nothing else.

Please prefer an official government or agency website when one exists.

## Is the Information Current?

This is one of the most important questions.

Look at the incidents and their timestamps.

Are they from today?

Are new incidents appearing?

Does the page say **Active Incidents**, **Current Calls**, **Live Calls**, or something similar?

A page containing incidents from several years ago may be a historical dataset rather than a live feed.

Useful answers include:

- Current incidents from today
- Appears to update every few minutes
- Historical data only
- No timestamps visible
- I don't know

---

# Finding the Actual Data Feed

Webpages often retrieve incident information from another machine-readable source behind the scenes.

Finding that source can make a contribution much more useful.

You do not need to understand or modify the data.

Just give us the URL if you find it.

Common types include the following.

## ArcGIS

Many governments use Esri ArcGIS for public maps and GIS data.

Useful clues in a URL include:

```text
/arcgis/rest/services/
FeatureServer
MapServer
```

An ArcGIS address might look something like:

```text
https://example.gov/arcgis/rest/services/PublicIncidents/FeatureServer/0
```

If you encounter an ArcGIS REST Services Directory, FeatureServer, or MapServer related to current incidents, include that URL.

## Socrata

Many government open-data portals use Socrata.

You may see addresses containing:

```text
data.cityname.gov
/resource/
.json
```

A Socrata API may look something like:

```text
https://data.example.gov/resource/abcd-1234.json
```

If you find a dataset page but not the API address, submit the dataset page anyway.

## RSS

RSS is a structured feed commonly used for frequently updated information.

An RSS feed may contain text resembling:

```xml
<rss>
<channel>
<item>
```

The address may contain words such as:

```text
rss
feed
incidents
```

Some RSS incident feeds also contain geographic coordinates.

## Atom / GeoRSS

Atom is another structured feed format.

You may see text resembling:

```xml
<feed>
<entry>
```

A geographic Atom or GeoRSS feed may also contain something such as:

```xml
<georss:point>
```

## JSON / GeoJSON

JSON is a common machine-readable data format.

It often looks roughly like:

```json
{
  "incident": "12345",
  "type": "FIRE",
  "latitude": 38.91,
  "longitude": -77.22
}
```

GeoJSON is a geographic form of JSON and may contain:

```text
"type": "Feature"
```

and:

```text
"coordinates": [-77.22, 38.91]
```

If opening a URL produces a page full of structured text like this, it may be exactly what we need.

## XML

XML is another structured format.

It usually contains tags enclosed in angle brackets, such as:

```xml
<incident>
  <type>FIRE</type>
  <status>ACTIVE</status>
</incident>
```

RSS and Atom are themselves forms of XML.

## CSV

Some agencies publish comma-separated data.

It may look something like:

```text
incident_id,type,address,latitude,longitude,time
12345,FIRE,100 MAIN ST,38.91,-77.22,2026-09-19T20:30:00
```

CSV can be useful if it contains current incidents and is updated regularly.

## Other Formats

Do not stop because a source does not match one of these examples.

Submit it and describe what you found.

Public agencies use many different systems.

---

# What Are Coordinates?

Coordinates allow God's Eye View to place an incident on the globe.

The most common form is latitude and longitude.

For example:

```text
38.9176, -77.2290
```

You may see field names such as:

```text
latitude
longitude
lat
lon
lng
```

GeoJSON often uses:

```text
coordinates
```

**Important:** Some geographic systems list longitude first and latitude second.

For example:

```text
[-77.2290, 38.9176]
```

Other GIS systems may use X and Y coordinates or another coordinate system.

If you are unsure what you are seeing, do not guess. Include the example and select **I don't know**.

---

# What Is an Incident ID?

A good live feed usually has some way to distinguish one incident from another.

You may see fields named:

```text
incident_id
incident_number
call_id
event_id
cad_id
case_number
master_incident_number
id
```

An incident ID might look like:

```text
PP26000274661
```

or:

```text
PENE2626202250
```

The exact format does not matter.

We mainly need to know whether the source provides a stable identifier that can help God's Eye View recognize the same incident when the feed updates.

Do not assume that every ID is an incident ID. For example, an RSS item identifier might identify the feed entry rather than the underlying emergency incident.

If you are unsure, tell us that.

---

# Incident Type

Look for information describing what kind of event occurred.

Examples might include:

```text
STRUCTURE FIRE
MEDICAL
TRAFFIC COLLISION
BURGLARY
HAZARDOUS CONDITION
RESCUE
```

Possible field names include:

```text
type
incident_type
nature
problem
category
description
```

Please report the actual field name if you can identify it.

---

# Incident Location

A source may describe an incident location as:

- Street address
- Intersection
- Block
- Highway
- Landmark
- General area
- Geographic coordinates

Possible field names include:

```text
address
location
location_name
street
intersection
general_location
```

Do not attempt to make an intentionally approximate location more precise than the agency provides.

---

# Incident Time

Look for a timestamp associated with the incident.

Possible field names include:

```text
time
date
datetime
call_time
response_date
published
updated
```

If possible, include one example exactly as the source provides it.

Do not convert the time yourself.

---

# Incident Status

Some feeds report whether responders have been dispatched, are on scene, or whether an incident remains active.

Examples might include:

```text
WAITING
DISPATCHED
ENROUTE
ONSCENE
ACTIVE
CLOSED
```

Possible field names include:

```text
status
call_status
incident_status
priority
```

Do not assume that a field called **priority** means the same thing as operational status.

Just report what the source provides.

---

# Update Frequency

If you can determine how frequently the source updates, tell us.

Examples:

- About every minute
- About every five minutes
- RSS says TTL 5
- Appears to update continuously
- Unknown

You do not need to sit and watch the page for a long time.

If the update frequency is not obvious, select **I don't know**.

---

# Access, Authentication, and Cost

Please tell us if the source:

- Works without logging in
- Requires an account
- Requires an API key
- Requires payment
- Has usage limits
- Blocks automated access
- Has unclear access requirements

God's Eye View should prefer authoritative public sources that can be accessed reliably and lawfully.

Do not bypass authentication, access controls, CAPTCHAs, or other technical restrictions.

---

# Terms, Licensing, and Usage Restrictions

If you find terms of service, API terms, licensing information, or data-use restrictions, include the URL or relevant information in your submission.

Do not interpret complicated legal language for us.

Just point us to it.

Project maintainers will review access and usage requirements before incorporating a source.

---

# Sample Record

If practical, include **one** example incident record or a small sample of the fields you found.

We primarily want to see things such as:

```text
incident ID
type
location
latitude
longitude
time
status
```

A link to the machine-readable source is usually better than copying a large amount of data.

Do not supplement an official record with personal information from other sources or attempt to identify people involved in an incident.

---

# AI Research Prompts

You can use your own AI assistant to help investigate a jurisdiction.

There are two prompts below.

Use the **Quick Scout Prompt** if you simply want help finding something useful to submit.

Use the **Full Research Prompt** if you want the AI to investigate a potential source in considerably more detail.

---

## Quick Scout Prompt

Replace the location in brackets, then copy and paste this prompt into your AI assistant.

```text
Help me find official live or near-real-time public-safety incident information for [CITY / COUNTY / REGION, COUNTRY] to contribute to the open-source God's Eye View Public Incidents project.

Look for official government or public-agency sources showing current fire, EMS, police, 911/CAD, emergency dispatch, rescue, traffic collision, or other active public-safety incidents.

Start with official agency and government websites.

If possible, also look for the actual data source behind the webpage, such as an ArcGIS service, Socrata dataset, JSON/GeoJSON API, RSS, Atom/GeoRSS, XML, CSV, or another machine-readable public feed.

I do NOT need you to find everything. Give me the best useful lead you can verify.

Please report:

1. Location covered
2. Agency or organization
3. Official public incident webpage
4. Whether the incidents appear current
5. Machine-readable feed or API URL, if you can find one
6. Feed/platform type, if you can identify it
7. Whether geographic coordinates appear to be included
8. Any obvious access restrictions, login, API key, cost, or usage terms
9. Anything else that would help the project investigate the source

Do not guess. Mark anything you cannot determine as UNKNOWN.

Prefer authoritative government or public-agency sources. A third-party website may be used as a clue, but do not treat it as proof of an official source.

Do not bypass authentication, CAPTCHAs, access controls, or other restrictions.

Give me URLs supporting what you found so the God's Eye View maintainers can independently verify it.
```

If you find something promising, submit what you have.

You do not need to complete the deeper investigation below.

---

## Full Research Prompt

For contributors who want to investigate a source more thoroughly, replace the location in brackets and copy the following prompt into your AI assistant.

```text
Research live or near-real-time public-safety incident data for [CITY / COUNTY / REGION, COUNTRY] for the God's Eye View Public Incidents project.

Look specifically for authoritative government or public-agency sources for fire, EMS, police, 911/CAD, emergency dispatch, rescue, traffic collisions, or active public-safety incidents.

Start with official government and public-agency websites.

Search beyond the visible webpage for structured or machine-readable sources including:

- ArcGIS REST Services, FeatureServer, or MapServer
- Socrata/open-data APIs
- JSON or GeoJSON
- RSS
- Atom or GeoRSS
- XML
- CSV
- Other documented public APIs or structured feeds

Determine whether the information is genuinely current or near-real-time rather than historical.

For each promising source, report:

1. Country
2. State/province/region
3. City/county/jurisdiction
4. Publishing agency
5. Official public incident webpage
6. Exact machine-readable feed or API endpoint, if found
7. Platform or system, if identifiable
8. Data format
9. Whether incidents appear current
10. Apparent update frequency
11. Whether geographic coordinates are included
12. Coordinate field names and one example, if available
13. Incident ID field and one example, if available
14. Incident type/category field
15. Location/address field
16. Date/time field
17. Status field, if available
18. Whether authentication or an API key is required
19. Any cost or usage limits
20. Terms, license, or data-use information and the source URL
21. A small example of the schema or field names
22. Important limitations or uncertainties

Do not guess missing information.

Clearly label anything you cannot determine as UNKNOWN.

Do not treat a third-party aggregator as proof that an authoritative feed exists. A third-party source may be used as a lead, but attempt to locate the underlying official government or agency source.

Do not bypass authentication, CAPTCHAs, access controls, or technical restrictions.

Do not infer casualties, injuries, severity, cause, identity, or other facts that the authoritative source does not provide.

At the end, classify the result as one of:

PROMISING - current authoritative structured source found

PARTIAL - official current incident source found, but important technical information is still missing

HISTORICAL - structured source exists but does not appear current

NO STRUCTURED FEED FOUND - official information exists but no machine-readable source was located

ACCESS RESTRICTED - a possible source exists but requires access that was not publicly available

Include the evidence and URLs supporting the classification.
```

---

# Ask Your Local Agency

Sometimes an official agency publishes an incident page but the underlying data source is difficult to find.

Sometimes you may simply want to ask whether your community has public incident data available.

You can contact the relevant fire department, 911 center, emergency communications agency, GIS department, open-data office, or other local government agency.

You are **not** asking for access to a private or restricted CAD system.

You are asking whether the agency already publishes information intended for public use.

You can adapt the following message:

> Hello,
>
> I'm helping document publicly available live or near-real-time public-safety incident data for the open-source God's Eye View Public Incidents project.
>
> Does your agency publish an official public incident feed, API, GIS service, RSS/Atom feed, open-data dataset, or other machine-readable source for information such as active fire, EMS, 911/CAD, emergency-dispatch, rescue, traffic, or other public-safety incidents?
>
> If so, could you point me to the public documentation, webpage, dataset, or endpoint?
>
> We are only interested in information your agency already makes available for public distribution. We are not requesting access to restricted CAD systems, private records, or non-public information.
>
> Thank you.

If the agency replies, include its response or the relevant public links in your feed submission.

Do not pressure an agency to release information that it does not make public.

---

# What Happens After You Submit a Source?

A submission is a **lead**, not an automatically accepted data source.

Before adding a provider, project maintainers will independently verify important details such as:

1. The source is authoritative.
2. The data is actually current.
3. The endpoint works.
4. Incident locations can be mapped reliably.
5. Incident identity can be handled reliably.
6. The source can be normalized into the Public Incidents data model.
7. Access and usage restrictions are acceptable.
8. The provider behaves reliably enough for inclusion.

If accepted, the source can be registered as a Public Incidents provider and normalized into the common God's Eye View incident format.

You do not need to write the provider code yourself.

Developers who want to contribute an implementation are also welcome to submit a pull request.

---

# Useful Leads and Negative Results

Do not abandon a submission because you could not answer every question.

These are all useful contributions:

> "Here is my county's official live 911 page."

> "I found what appears to be an ArcGIS FeatureServer, but I don't understand its fields."

> "This fire department has an RSS feed with current calls."

> "This city has an active incident map, but I could not find the data behind it."

> "I researched this city and could find only historical incident data."

> "The agency appears to have a feed, but it requires authentication."

Even a negative result can prevent other contributors from repeating the same research.

Over time, the project may catalog jurisdictions as having:

- Verified current structured source
- Official public incident page
- Research in progress
- Historical data only
- No structured feed found
- Access restricted
- Temporarily unavailable
- Needs re-verification

The goal is to build a verified worldwide catalog over time, not to require every contributor to solve the entire integration themselves.

---

# Data Integrity and Safety

God's Eye View should display what authoritative sources actually provide.

Contributors should not:

- Guess missing incident details.
- Infer injuries or casualties from an incident type.
- Infer severity or cause without supporting information.
- Attempt to identify private individuals.
- Make an intentionally approximate public location more precise.
- Combine unrelated sources solely because they are geographically close.
- Claim that a news report, radio transmission, camera, or social-media post describes the same incident without sufficient evidence.
- Bypass authentication, CAPTCHAs, access controls, or other technical restrictions.

When information is uncertain, preserve that uncertainty.

---

# Why This Research Matters

Public incident infrastructure is highly fragmented.

One jurisdiction may publish a modern GeoJSON API while the next county publishes RSS, an old CAD webpage, or nothing machine-readable at all.

Documenting what **doesn't** work can be valuable too.

Over time, this research can help establish:

- Which jurisdictions provide public incident information
- Which agencies publish it
- Which platforms and technologies they use
- Which sources are machine-readable
- Which sources contain geographic coordinates
- Which sources are current or historical
- Which feeds are healthy, unavailable, or stale
- When a source was last verified
- Which jurisdictions still need research

This information can support God's Eye View while also creating a useful public catalog of public-safety data sources.

---

# Thank You

Building useful worldwide coverage requires many people finding and documenting local sources.

You may know your community's public-safety systems better than someone researching it from across the country or across the world.

Whether you contribute a tested API endpoint or simply point us toward an official live incident page we did not know existed, you are helping expand the map.