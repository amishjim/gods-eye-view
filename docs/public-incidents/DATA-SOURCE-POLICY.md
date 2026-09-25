# Public Incidents Data Source Policy

This document defines the source, provenance, access, attribution, and usage principles for data integrated into the Public Incidents layer of God's Eye View (GEV).

Public Incidents works with information published by many independent governments, agencies, vendors, and public-data systems.

Technical accessibility and permission to use data are separate questions.

A source should not be integrated merely because it can be fetched.

## Core Rule

Every Public Incidents source should be:

1. intentionally publicly accessible;
2. traceable to its origin;
3. technically appropriate for the intended use;
4. reviewed for known terms or restrictions;
5. documented well enough for future contributors to reevaluate it.

When the answer to a licensing or usage question is unknown, record it as unknown.

Do not convert uncertainty into permission.

## Public Does Not Mean Unrestricted

A webpage, API, feed, or dataset being publicly reachable does not automatically grant unlimited rights to:

- redistribute the data;
- archive it permanently;
- republish it commercially;
- bulk-download it;
- modify it;
- create derivative datasets;
- remove attribution;
- poll it without limitation.

The software license covering God's Eye View or Public Incidents does not override the rights or terms associated with third-party data.

Each data source must be considered independently.

## Source Categories

Public Incidents may encounter sources including:

- government websites;
- public CAD displays;
- emergency communications systems;
- open-data portals;
- GIS services;
- agency dashboards;
- JSON APIs;
- XML feeds;
- GeoJSON;
- CSV datasets;
- RSS or Atom feeds;
- CAP feeds;
- vendor-hosted public systems;
- other intentionally public structured sources.

A source type does not determine its usage rights.

## Source Authority

Prefer authoritative primary sources whenever practical.

Examples include:

- city government;
- county government;
- fire department;
- EMS authority;
- police department;
- sheriff's office;
- emergency communications center;
- emergency-management agency;
- transportation agency;
- official government open-data portal;
- official GIS service.

Third-party systems may still be useful for:

- discovery;
- context;
- corroboration;
- identifying participating agencies;
- identifying vendors;
- locating an authoritative upstream source.

A third-party source should not automatically replace an available authoritative source.

## Provenance

Every implemented source should remain traceable.

At minimum, source documentation should identify:

```text
Jurisdiction
Publishing organization
Public source page
Machine-readable source or method
Provider / feed family
Service categories
Date reviewed
Implementation status
