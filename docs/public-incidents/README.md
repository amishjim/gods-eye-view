# Public Incidents

Public Incidents is a community-driven data layer for God's Eye View (GEV) that brings publicly available emergency and public-safety incident information into the GEV map.

The goal is not to create another closed incident database. The goal is to make useful public information easier to discover, normalize, visualize, and contribute.

## Current Status

Public Incidents is under active development.

The current implementation can:

- Fetch live public incident data from multiple jurisdictions.
- Support multiple source/provider formats.
- Normalize different source formats into a common incident model.
- Display incidents geographically in God's Eye View.
- Refresh incident data automatically.
- Allow incidents to be selected on the map.
- Register incident information with GEV's context system.
- Display a tracked Public Incidents readout.

Initial provider work includes jurisdictions such as Austin, Rochester, Phoenix, Seattle, San Diego, Monroe County (New York), and Portland (Oregon).

Coverage does **not** mean that every jurisdiction is guaranteed to be available, complete, or current. Public incident systems vary significantly between jurisdictions.

## Why This Exists

Thousands of local governments, emergency agencies, dispatch centers, and public-safety organizations publish useful information online.

Unfortunately, that information is fragmented across:

- public CAD systems
- active-call pages
- open-data portals
- GIS services
- JSON APIs
- XML feeds
- RSS and Atom feeds
- CSV datasets
- agency dashboards
- vendor-hosted public incident systems

Two neighboring jurisdictions may publish essentially the same type of information using completely different technologies.

Public Incidents attempts to bridge those differences.

Instead of designing GEV around individual cities, the project identifies reusable **provider families** and converts their data into a common format.

## Project Principles

### Public Sources Only

Public Incidents uses information intentionally made available to the public.

The project is not intended to bypass authentication, access controls, paywalls, or other technical restrictions.

### Source First

Whenever possible, contributors should identify the original government, agency, dispatch, or official open-data source rather than relying solely on third-party aggregators.

Third-party sources can still be useful for discovery and verification.

### Provider-Neutral Architecture

A new jurisdiction should not automatically require an entirely new implementation.

When multiple jurisdictions use the same underlying system or data structure, the preferred approach is to build reusable provider support.

### Preserve Source Context

Normalization should make different feeds usable together without pretending that every jurisdiction publishes the same information.

Unknown or unavailable fields should remain unknown rather than being guessed.

### Verify Before Integration

A source appearing to contain incident information is not enough.

Before integration, sources should be checked for:

- accessibility
- structure
- geographic information
- timestamps
- update behavior
- incident identifiers
- reliability
- terms or access restrictions

## How You Can Help

One of the most valuable contributions does not require writing code.

We need help discovering public incident sources.

If your city, county, fire department, EMS agency, police department, emergency communications center, or local government publishes active or recent incident information, you can help identify it.

Useful discoveries include:

- active emergency calls
- fire and EMS incidents
- police calls for service
- public CAD pages
- dispatch logs
- open-data datasets
- GIS layers
- JSON or XML endpoints
- RSS or Atom feeds
- downloadable CSV data
- vendor-hosted public safety pages
- official incident dashboards

Even if you do not know what technology is behind the page, the URL itself can be useful.

A public source submission process and contributor scouting guide are being developed.

## Using AI to Help Find Sources

You do not need to be a developer to investigate a public incident system.

AI tools can help examine public websites, identify likely data endpoints, explain unfamiliar terminology, and organize findings.

A contributor-oriented AI research prompt will be provided as part of the Public Incident Scout documentation.

AI-generated findings should be treated as leads rather than facts. URLs, endpoints, provider identities, and technical claims should be independently verified before being added to the project.

## For Developers

Developer documentation for Public Incidents is being organized under this directory.

Planned documentation includes:

- architecture
- normalized incident schema
- provider families
- adding a new provider
- source catalog
- data-source policy
- testing procedures
- contributor scouting
- project roadmap

The objective is to make adding a jurisdiction increasingly routine as the provider library grows.

## What This Project Is Not

Public Incidents is not:

- an emergency dispatch service
- a replacement for official emergency information
- a guarantee of complete incident coverage
- a system for tracking non-public law-enforcement activity
- a system for accessing non-public information
- a substitute for calling emergency services

Public feeds may be delayed, filtered, incomplete, temporarily unavailable, or intentionally limited by the publishing agency.

## Relationship to Signal Blotter

Public Incidents is being developed as a layer within God's Eye View.

The same public-source research and provider infrastructure may also support **Signal Blotter**, a separate project focused on making local public incident information easier to discover and explore.

The projects can share knowledge and source research while remaining separate products.

## Documentation

This documentation is being expanded as the project develops.

See this directory for technical documentation, contributor instructions, source research, and implementation guidance.

---

**Project status:** Active development  
**Primary implementation:** God's Eye View — Public Incidents  
**Source philosophy:** Public, verifiable, provider-neutral
