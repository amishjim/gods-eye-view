# Public Incidents — Roadmap

This roadmap tracks planned, proposed, experimental, and research-stage work for the Public Incidents layer in God's Eye View (GEV).

The roadmap is intentionally broader than the immediate implementation.

Ideas can be recorded here without requiring them to be built now.

The guiding priority is to make Public Incidents useful as quickly as possible while continuing to improve the underlying architecture over time.

## Development Philosophy

Public Incidents should prefer:

- working functionality over speculative complexity
- existing GEV primitives over duplicated systems
- reusable provider families over jurisdiction-specific code
- verified public sources over large unverified source lists
- graceful failure over assumptions of permanent availability
- incremental improvement over large rewrites

A useful feature does not need to be perfect before it provides value.

When an existing GEV primitive can provide most of the required functionality, prefer using or adapting it rather than building a parallel system solely to achieve an ideal implementation.

Desired improvements that are intentionally deferred should remain documented here rather than being forgotten.

## Current Foundation

The initial Public Incidents implementation has established:

- multiple public incident jurisdictions
- multiple provider/source patterns
- live source retrieval
- normalization
- server-side proxying
- Cesium map rendering
- automatic refresh
- incident selection
- GEV context integration
- Public Incidents readout
- automated tests
- successful production builds
- source and provider documentation

This foundation should remain stable while coverage and functionality expand.

## Priority 1 — Reliable Public Deployment

The immediate priority is a reliable public deployment.

Required work includes:

- deploy the current GEV fork
- verify production server behavior
- verify Public Incidents API proxy routes
- verify production asset loading
- smoke-test known working jurisdictions
- confirm refresh behavior
- confirm selection/context behavior
- check browser console for production-only errors
- establish a repeatable deployment/update process

The first public version does not need every planned feature.

It needs to work reliably.

## Priority 2 — Source Catalog

Maintain a structured catalog of investigated public incident sources.

The catalog should eventually track information such as:

```text
Jurisdiction
Agency
State / Region
Country
Service categories
Public source
Machine-readable source
Provider family
Source format
Status
Commercial-use status
Attribution requirements
Historical availability
Last checked
Notes
```

The catalog should distinguish clearly between:

- discovered sources
- confirmed public sources
- confirmed machine-readable sources
- development integrations
- verified working integrations
- degraded sources
- broken sources
- retired sources
- rejected sources

See `SOURCE-STATUS.md`.

## Priority 3 — Provider-Family Expansion

Continue identifying reusable provider families.

For each new jurisdiction:

1. identify the authoritative public source
2. identify the underlying technology
3. compare it with known provider families
4. reuse existing logic whenever practical
5. document genuinely new patterns
6. search for additional jurisdictions using confirmed reusable systems

The objective is not merely to add cities.

The objective is to make every provider discovery increase the number of jurisdictions that can be added efficiently.

## Priority 4 — Public Scout

Create a simple community source-discovery workflow.

People should be able to contribute useful information without understanding APIs or software development.

Public Scout should allow contributors to submit:

- jurisdiction
- agency
- public incident page
- source URL
- feed/API URL when known
- source type
- service categories
- provider/vendor when known
- historical-data information
- notes

Community submissions begin as research leads and require independent verification.

Related documentation includes:

```text
SOURCE-SUBMISSION.md
SOURCE-RESEARCH-WORKSHEET.md
SOURCE-VERIFICATION.md
CONTRIBUTING.md
```

## Priority 5 — Source Submission Form

Create a public submission form based on `SOURCE-SUBMISSION.md`.

The form should favor accessibility over technical knowledge.

Only a few fields should be required.

Likely required fields:

```text
Jurisdiction
State / Region
Public source URL
What appears to be available
```

Optional technical fields can capture:

- agency
- API/feed URL
- source type
- provider/vendor
- incident categories
- historical availability
- geographic information
- contributor notes

Submissions should enter the research process as candidates rather than automatically becoming approved sources.

## Priority 6 — Source Health

Develop lightweight source-health monitoring.

Potential checks include:

- endpoint reachable
- HTTP status
- response parseable
- expected root structure present
- last successful retrieval
- last incident timestamp
- unusual zero-record periods
- provider-family failures

Health monitoring should distinguish between:

```text
No incidents currently published
```

and:

```text
Source failure
```

These are not equivalent.

## Priority 7 — Camera Context

Public Incidents should take advantage of GEV's existing camera capabilities where useful.

When a user selects an incident, GEV may identify the nearest available public camera.

The interface should clearly distinguish between:

- the incident location
- the camera location
- the distance between them

A nearby camera should not be presented as though it necessarily shows the incident.

Conceptually:

```text
Selected Incident
      |
      v
Find nearest appropriate public camera
      |
      v
Calculate distance
      |
      +-- sufficiently nearby -> offer/display camera context
      |
      +-- farther away -> "View nearest camera"
```

The exact distance threshold should be determined through testing rather than treated as fixed prematurely.

Possible initial testing may consider distances in the range of several hundred feet, with broader access to the nearest camera when nothing is particularly close.

The interface should use language such as:

```text
Nearest camera
```

rather than implying:

```text
Camera showing this incident
```

unless that relationship can actually be established.

## Priority 8 — More Visual Incident Presentation

Public Incidents should favor fast visual comprehension.

Future incident-card improvements may include:

- clearer hierarchy
- service-type icons
- compact status indicators
- visual source identification
- improved typography
- geographic context
- camera availability
- age of incident
- distance information
- structured field layout

Agency identity may be useful, but logos and trademarks should not be used casually.

Plain-text source attribution should be preferred when branding rights or endorsement implications are uncertain.

The interface should not imply that an agency sponsors or endorses Public Incidents.

## Priority 9 — Source Attribution

Incident presentation should make provenance understandable without overwhelming the user.

Potential display information includes:

```text
Source: Austin Fire Department
Provider: [when useful]
Updated: [time]
```

Source attribution should identify the origin of the information without unnecessarily directing users away from the GEV experience.

Direct source links may still be appropriate where required by attribution terms, useful for verification, or otherwise beneficial.

## Priority 10 — Historical Incident Data

Investigate historical data independently from live-feed integration.

Possible historical sources include:

- government open-data portals
- ArcGIS datasets
- downloadable CSV files
- archived CAD data
- agency reports
- public APIs

Prefer demand-driven acquisition over downloading every available historical record immediately.

A possible workflow:

```text
User requests historical data for jurisdiction
        |
        v
Check local availability
        |
        +-- available -> serve it
        |
        +-- unavailable -> retrieve permitted source data
                            |
                            v
                         normalize
                            |
                            v
                         cache/store when permitted
```

Historical storage must respect source terms, privacy considerations, and retention restrictions.

## Priority 11 — Search

Future Public Incidents search may support:

- jurisdiction
- agency
- incident type
- date/time
- geographic area
- provider
- service category

Search architecture should be designed from actual usage requirements rather than built prematurely.

## Priority 12 — Geographic Alerts

Potential future functionality includes user-defined geographic awareness.

Examples:

- incidents within 5 miles
- incidents within 10 miles
- selected incident categories near a location
- significant incident notifications

Alerting should account for:

- source reliability
- incomplete jurisdiction coverage
- duplicate incidents
- location precision
- notification fatigue

This is a future capability, not a guarantee of emergency notification.

Public Incidents should never be represented as a replacement for official emergency alerts.

## Priority 13 — Related Context

Selected incidents may eventually surface relevant public context.

Possible sources include:

- nearby public cameras
- official agency updates
- emergency alerts
- traffic information
- weather hazards
- wildfire information
- official RSS/Atom feeds
- established news coverage
- publicly available video

Context should remain clearly distinguished from the authoritative incident record.

## Priority 14 — News and Media Relationships

Signal Blotter may eventually associate public incidents with relevant reporting.

Potential relationships include:

```text
Incident
   |
   +-- Official agency update
   +-- Local news article
   +-- Television report
   +-- Public video
   +-- Related alert
```

Automated matching should be treated cautiously.

Geographic proximity or similar wording does not prove that two records describe the same event.

## Priority 15 — Traffic and Transportation Incidents

Expand beyond traditional Fire/EMS feeds where legitimate public sources exist.

Potential sources include:

- state transportation departments
- municipal traffic systems
- road closures
- crashes
- major hazards
- transportation incident APIs

These sources may already align with existing GEV primitives and should be integrated through those primitives where practical.

## Priority 16 — Emergency Management and All-Hazards Data

Potential sources include:

- emergency management agencies
- evacuation notices
- civil emergency alerts
- wildfire systems
- severe-weather incidents
- hazardous-material events
- public warning systems

Reuse native GEV capabilities where they already exist.

Public Incidents should complement existing GEV layers rather than duplicate them.

## Priority 17 — Law-Enforcement Public Data

Continue researching legitimate public law-enforcement sources such as:

- public calls-for-service feeds
- official police incident datasets
- sheriff dispatch information
- public CAD feeds
- government open-data systems

Law-enforcement data should follow the same source, privacy, precision, and verification standards as other Public Incidents data.

Restricted or non-public law-enforcement systems are outside project scope.

## Priority 18 — RSS and Atom

RSS and Atom feeds should be considered useful first-class discovery targets.

They may provide:

- official incident updates
- emergency-management notices
- agency news
- public alerts
- road closures
- follow-up information

Not every feed belongs directly on the incident map.

Some may be more appropriate as contextual information.

## Priority 19 — Provider Research Automation

As the provider-family library grows, automate repetitive research where practical.

Potential tools could:

- recognize known endpoint patterns
- identify ArcGIS services
- classify common feed structures
- compare schemas
- identify likely provider families
- flag duplicate sources
- detect broken endpoints

Automation should accelerate research, not replace verification.

## Priority 20 — Commercial-Use Tracking

Commercial-use status is a required source-research field.

Track at least:

```text
ALLOWED
PROHIBITED
UNCLEAR
UNKNOWN
```

Related fields may include:

- redistribution
- attribution
- archival permission
- automated-access restrictions

This information should remain associated with the source even when Public Incidents itself is being used non-commercially.

## Priority 21 — Signal Blotter Integration

Signal Blotter and Public Incidents should share source research and reusable infrastructure where appropriate while remaining separate products.

Conceptually:

```text
Public Source Research
        |
        +------------------+
        |                  |
        v                  v
Signal Blotter      God's Eye View
Discovery           Exploration
```

Signal Blotter can focus on discovering and presenting local incident information.

GEV can provide deeper geographic exploration and situational context.

Neither project should unnecessarily duplicate provider research.

## Priority 22 — Contributor Experience

Make contributing increasingly straightforward.

Desired improvements include:

- clear source-submission process
- GitHub issue templates
- provider templates
- sample fixtures
- contribution checklist
- research worksheet
- provider-family registry
- testing instructions
- AI-assisted research prompt

A person who discovers a useful source should not need to understand the entire GEV codebase to contribute it.

## Priority 23 — Developer Experience

As Public Incidents grows, reduce the effort required to implement another compatible jurisdiction.

A future ideal workflow might resemble:

```text
Discover source
      |
      v
Identify provider family
      |
      v
Add jurisdiction configuration
      |
      v
Add fixture/test
      |
      v
Verify
```

New provider code should increasingly be the exception rather than the default when expanding within known families.

## Deferred / Experimental Ideas

The following ideas are worth preserving but are not immediate requirements:

- automatic nearest-camera selection
- configurable camera-distance thresholds
- richer visual incident cards
- agency visual identity
- incident clustering
- incident heat maps
- historical timelines
- historical density views
- incident/news correlation
- video correlation
- scanner/transcript context where lawful and appropriate
- jurisdiction-specific statistics
- provider health dashboards
- automated source rediscovery
- source-change detection
- user geographic alerts
- incident significance scoring
- multi-source event correlation
- mobile-focused incident presentation
- public source coverage maps

Recording an idea here does not mean it has been approved for immediate implementation.

## Prioritization

When deciding what to build next, consider:

1. Does it make Public Incidents more useful now?
2. Does GEV already provide a primitive we can reuse?
3. Does it improve reliability?
4. Does it unlock multiple jurisdictions?
5. Does it reduce future maintenance?
6. Is the source or feature legally and technically sustainable?
7. What is the implementation cost?
8. Can a simpler version provide most of the value?
9. Can the more ambitious version be deferred without losing the idea?

A low-cost feature that unlocks existing GEV capability may deserve higher priority than a larger custom feature.

## Feature Compromise

A feature does not need to match the eventual ideal implementation on its first release.

When an existing GEV primitive provides a useful version of a desired feature:

```text
Use existing primitive now
        |
        v
Document limitations
        |
        v
Deploy useful capability
        |
        v
Revisit custom implementation later if justified
```

This keeps development moving while preserving long-term design goals.

## What Success Looks Like

Public Incidents succeeds when:

- a new source can be discovered systematically
- its authority and permissions can be evaluated
- its provider family can be identified
- existing integrations can be reused
- records normalize reliably
- one failed provider does not break the system
- users can quickly understand what is happening geographically
- contributors can help without becoming GEV experts
- the next jurisdiction is easier to add than the previous one

The project does not need every possible feature before it becomes useful.

It needs a strong foundation that can continue growing.

---

**Document:** Public Incidents Roadmap  
**Status:** Living document  
**Principle:** Ship useful capability, reuse what GEV already provides, and preserve the better ideas for the next iteration.
