# Contributing to Public Incidents

Public Incidents is a community-driven data layer for God's Eye View (GEV) that collects, normalizes, and displays publicly available emergency and public-safety incident information.

Contributions are welcome from developers, researchers, public-safety data enthusiasts, local residents, journalists, civic technologists, and anyone who discovers a useful public source.

You do not need to write code to contribute.

## Ways to Contribute

Useful contributions include:

- finding public incident feeds
- identifying public CAD or active-call systems
- locating official APIs
- locating GIS or ArcGIS services
- finding open-data datasets
- identifying RSS or Atom feeds
- identifying vendor platforms
- documenting jurisdictions using known provider families
- reporting broken or changed sources
- supplying sample public responses
- improving provider adapters
- improving normalization
- adding tests
- improving documentation
- verifying existing sources

Even a single verified URL can be useful.

## Source Requirements

Public Incidents is designed around publicly accessible information.

Good candidate sources include:

- official government websites
- official agency websites
- public CAD systems
- public active-call pages
- public APIs
- public GIS services
- open-data portals
- publicly accessible RSS or Atom feeds
- vendor-hosted systems intentionally exposed to the public

Do not submit:

- credentials
- passwords
- API keys that are not intended to be public
- information obtained by bypassing access controls
- private databases
- restricted law-enforcement systems
- confidential information
- personally obtained non-public emergency information

If access requires authorization that ordinary members of the public do not have, it is outside the intended scope of Public Incidents.

## Finding a Source

When researching a jurisdiction, useful searches include combinations of:

```text
[city] active calls
[county] active incidents
[city] fire dispatch
[county] fire rescue calls
[city] police calls for service
[county] CAD public
[city] open data incidents
[county] emergency calls
[agency] ArcGIS incidents
[agency] RSS incidents
```

The visible webpage is often only the beginning.

Useful public data may be delivered through:

- JSON
- XML
- CSV
- RSS
- Atom
- ArcGIS REST services
- Socrata
- JavaScript network requests
- vendor APIs
- downloadable datasets

If you do not know how to identify the underlying source, submit the public page anyway.

Someone else may be able to determine how it works.

## What to Record

When possible, provide:

```text
Jurisdiction:
State/Province/Region:
Country:
Agency:
Public page URL:
Direct feed/API URL:
Source type:
Provider/vendor:
Data format:
Geographic coverage:
Incident types:
Update frequency:
Historical data available:
Authentication required:
Date checked:
Notes:
```

It is completely acceptable to leave fields blank when you do not know the answer.

Do not guess.

## Minimum Useful Submission

A contribution does not need to be exhaustive.

At minimum, this can be useful:

```text
Jurisdiction: Example County, Virginia
Public page URL: https://example.gov/active-calls
Date checked: 2026-09-25
```

The project can investigate the technical details from there.

## Verification

Whenever possible, verify that:

- the source actually loads
- the source is publicly accessible
- the jurisdiction is correctly identified
- the source contains public incident information
- the URL is current
- the information comes from the agency, government, or an identifiable public-data provider

Do not present assumptions as verified facts.

If something is uncertain, say so.

For example:

```text
Provider/vendor: Possibly ExampleCAD — not verified
```

is better than stating the vendor as fact.

## Using AI to Help Research

You may use your preferred AI assistant to help investigate a public source.

AI can be useful for:

- explaining unfamiliar technical terms
- identifying possible APIs
- explaining JSON or XML
- examining public webpage source code
- suggesting where a feed may be located
- identifying common public-data platforms
- organizing research notes

However, AI output must not be treated as verification.

AI systems can invent URLs, vendor names, APIs, fields, or technical explanations.

Always verify important findings against the actual public source.

A useful starting prompt is:

```text
I am researching publicly available emergency and public-safety incident data for an open-source mapping project.

Help me investigate this jurisdiction:

[JURISDICTION]

I am looking only for information intentionally available to the general public.

Please help identify:

1. Official public active-call or incident pages
2. Public CAD pages
3. Official APIs
4. Open-data datasets
5. ArcGIS or GIS services
6. JSON or XML feeds
7. RSS or Atom feeds
8. Fire/EMS incident feeds
9. Police calls-for-service feeds
10. The vendor or software platform used, if verifiable
11. Direct public data endpoints used by the webpage
12. Documentation describing the public system

For every finding, provide the actual source URL.

Clearly distinguish verified information from possibilities or guesses.

Do not invent URLs or endpoints.

Do not attempt to bypass authentication, access controls, or non-public systems.
```

Then verify the results yourself before submitting them.

## Provider Families

Public Incidents uses reusable provider families whenever possible.

Several jurisdictions may publish information through the same underlying technology.

If you recognize a source as belonging to an existing provider family, mention that in your submission.

If you do not know, leave it unidentified.

Do not force a source into a provider family simply because two websites look similar.

See:

```text
PROVIDER-FAMILIES.md
```

for more information.

## Developers

Before implementing a new source, review:

```text
README.md
ARCHITECTURE.md
INCIDENT-SCHEMA.md
ADDING-A-PROVIDER.md
PROVIDER-FAMILIES.md
DATA-SOURCE-POLICY.md
```

Whenever practical, extend an existing provider family rather than duplicating an adapter.

New integrations should preserve the normalized Public Incidents schema.

## Testing

Code contributions should include appropriate tests when practical.

Tests should cover relevant behavior such as:

- parsing
- normalization
- malformed records
- missing fields
- coordinate handling
- timestamp handling
- empty responses
- source-specific variations

Live public feeds can change unexpectedly.

Tests should avoid assuming that a particular live incident will always exist.

## Broken Sources

Public incident systems change frequently.

If an existing source stops working, useful reports include:

```text
Jurisdiction:
Source:
Date observed:
Observed error:
Old URL:
Possible new URL:
Notes:
```

A broken source does not necessarily mean the jurisdiction stopped publishing data.

The agency may have:

- changed vendors
- moved the endpoint
- redesigned its website
- changed the API
- temporarily disabled the feed

## Accuracy

Public Incidents should preserve what the source actually provides.

Do not invent missing:

- coordinates
- addresses
- incident categories
- timestamps
- agency names
- statuses
- identifiers

Derived information should be clearly identifiable as derived rather than source-provided.

## Privacy and Responsible Use

Public availability does not eliminate the need for responsible handling.

Contributors should avoid unnecessarily adding sensitive personal information that is irrelevant to the project's public-safety mapping purpose.

The project is intended to organize legitimate public incident information, not to create tools for accessing restricted information or monitoring individuals.

## Documentation Contributions

Documentation improvements are welcome.

Useful additions include:

- provider research
- source-discovery techniques
- implementation examples
- troubleshooting information
- jurisdiction notes
- data-format explanations
- corrections
- clearer contributor instructions

Documentation should distinguish verified facts from observations, assumptions, and future plans.

## Keep Contributions Focused

Small, understandable contributions are easier to review than large unrelated changes.

When practical:

- keep provider work separate from unrelated features
- explain what source is being added or changed
- identify the jurisdiction
- identify the public source
- describe unusual normalization decisions
- note known limitations

## Goal

The goal is to make publicly available incident information easier to discover, normalize, visualize, and reuse.

A contributor does not need to solve an entire jurisdiction.

Finding one good source, identifying one provider, fixing one parser, documenting one system, or verifying one endpoint can move the project forward.
