# Public Incident Source Research Worksheet

Use this worksheet when researching a city, county, agency, or other jurisdiction for possible inclusion in God's Eye View Public Incidents.

The purpose is to capture useful research consistently without requiring every field to be completed.

Do not guess. Unknown is an acceptable answer.

---

## Jurisdiction

```text
Jurisdiction name:

Jurisdiction type:
[ ] City
[ ] County
[ ] Parish
[ ] Borough
[ ] Township
[ ] Regional authority
[ ] State / Province
[ ] Other

State / Province / Region:

Country:

Population, if relevant:

Research date:

Researcher:
```

## Agencies

List public-safety agencies serving the jurisdiction that may publish useful information.

```text
Fire department:

EMS / Rescue:

Police department:

Sheriff:

Emergency communications / 911:

Emergency management:

Other:
```

A jurisdiction may have multiple agencies and multiple independent public-data systems.

---

## Public Incident Sources

Create a separate entry for each source discovered.

### Source 1

```text
Source name:

Publishing agency:

Public webpage URL:

Direct API/feed/data URL:

Source category:
[ ] Active calls
[ ] Fire incidents
[ ] EMS incidents
[ ] Police calls for service
[ ] CAD
[ ] Dispatch
[ ] Emergency incident map
[ ] Open data
[ ] Historical incidents
[ ] GIS
[ ] Other

Data format:
[ ] JSON
[ ] XML
[ ] CSV
[ ] RSS
[ ] Atom
[ ] ArcGIS
[ ] Socrata
[ ] HTML
[ ] Unknown
[ ] Other

Provider / Vendor:

Provider verified?
[ ] Yes
[ ] No
[ ] Unknown

Evidence for provider identification:

Authentication required?
[ ] No
[ ] Yes
[ ] Unknown

Publicly accessible without credentials?
[ ] Yes
[ ] No
[ ] Unknown

Current incidents?
[ ] Yes
[ ] No
[ ] Unknown

Historical incidents?
[ ] Yes
[ ] No
[ ] Unknown

Historical range:

Observed refresh frequency:

Geographic coverage:

Incident categories available:

Coordinates available?
[ ] Yes
[ ] No
[ ] Unknown

Street address or location available?
[ ] Yes
[ ] No
[ ] Unknown

Incident identifier available?
[ ] Yes
[ ] No
[ ] Unknown

Agency identified in records?
[ ] Yes
[ ] No
[ ] Unknown

Status available?
[ ] Yes
[ ] No
[ ] Unknown

Timestamp fields:

Other useful fields:

Source limitations:

Notes:
```

Duplicate the source section when multiple sources exist.

---

## Endpoint Investigation

If the public webpage retrieves data from another public endpoint, record it here.

```text
Visible webpage:

Observed endpoint:

Request method:
[ ] GET
[ ] POST
[ ] Unknown

Response type:

Example response available?
[ ] Yes
[ ] No

Pagination?
[ ] Yes
[ ] No
[ ] Unknown

Geographic parameters?

Date/time parameters?

Other query parameters?

Rate-limit information?

CORS behavior, if relevant:

Endpoint notes:
```

Do not attempt to bypass authentication or access controls.

Only investigate resources available through legitimate public access.

---

## Provider-Family Investigation

```text
Possible provider family:

Existing Public Incidents provider family?
[ ] Yes
[ ] No
[ ] Unknown

Similar known jurisdiction:

Evidence of shared platform:

Same endpoint structure?
[ ] Yes
[ ] No
[ ] Unknown

Same response schema?
[ ] Yes
[ ] No
[ ] Unknown

Same vendor?
[ ] Yes
[ ] No
[ ] Unknown

Could existing adapter likely support this source?
[ ] Yes
[ ] No
[ ] Requires investigation
```

Do not classify a source into a provider family solely because the websites look similar.

Technical evidence is preferred.

---

## Sample Record

When practical, save a small example of the public data structure.

Remove unnecessary personal information before adding samples to project documentation.

```text
Sample source record:

[PASTE SMALL SAMPLE HERE]
```

Record when the sample was retrieved:

```text
Sample date/time:

Sample source URL:
```

---

## Normalization Notes

Compare available fields with the Public Incidents normalized schema.

```text
Source incident ID ->

Source incident type ->

Source timestamp ->

Source updated timestamp ->

Source status ->

Source agency ->

Source address/location ->

Source latitude ->

Source longitude ->

Source description ->

Source jurisdiction ->

Other mappings:
```

See:

```text
INCIDENT-SCHEMA.md
```

Do not invent values for fields the source does not provide.

---

## Historical Data

Historical information can be useful even when it is separate from the live incident source.

```text
Historical dataset found?
[ ] Yes
[ ] No

Historical dataset URL:

Publishing organization:

Coverage start:

Coverage end:

Update schedule:

Download format:

API available?
[ ] Yes
[ ] No
[ ] Unknown

Approximate record count:

Useful fields:

Notes:
```

Historical datasets should be documented even if they are not immediately integrated into the live Public Incidents layer.

---

## RSS / Atom / News Feeds

```text
Official RSS feed:

Official Atom feed:

Agency news feed:

Emergency alerts feed:

Other official feed:

Notes:
```

These feeds may provide useful context even when they are not suitable as the primary incident source.

---

## Related Public Sources

Record other useful public information associated with the jurisdiction.

```text
Fire department website:

EMS website:

Police website:

Sheriff website:

911 / communications website:

Emergency management website:

Open-data portal:

GIS portal:

ArcGIS organization:

Government data portal:

Other:
```

---

## Verification

Before marking research complete:

```text
[ ] Public URLs were opened and checked.
[ ] Jurisdiction was verified.
[ ] Publishing agency was identified where possible.
[ ] Direct endpoints were tested where possible.
[ ] Provider claims are supported by evidence or marked unverified.
[ ] AI-generated findings were independently checked.
[ ] No restricted credentials or non-public information were collected.
[ ] Source limitations were recorded.
[ ] Unknown information was left unknown rather than guessed.
```

---

## Research Result

Choose the current research status.

```text
[ ] Confirmed usable source
[ ] Promising — technical investigation needed
[ ] Public page found — underlying source unknown
[ ] Historical data only
[ ] No useful public source found
[ ] Source currently broken
[ ] Source requires non-public authentication
[ ] Needs additional research
```

### Recommended Next Action

```text
[ ] Add jurisdiction using existing provider
[ ] Test against existing provider
[ ] Investigate possible provider family
[ ] Build new provider adapter
[ ] Add source to research catalog
[ ] Recheck later
[ ] No action
```

---

## Research Notes

```text
Additional observations:


Potential leads:


Questions:


Follow-up:
```

---

## Important Principle

The objective of source research is not to prove that every jurisdiction has usable public incident data.

The objective is to accurately determine what is publicly available, how it is published, and whether it can responsibly and reliably be incorporated into Public Incidents.

A documented negative result is still useful research.
