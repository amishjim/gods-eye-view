# Public Incidents Testing Guide

This document describes the testing process for the Public Incidents layer in God's Eye View (GEV).

Public Incidents depends on external public-data systems that can change without notice.

Testing therefore needs to cover both:

- deterministic behavior that can be tested locally; and
- live behavior that must be verified against real public sources.

## Testing Goals

Testing should help confirm that:

- provider responses are parsed correctly;
- source records normalize correctly;
- malformed records do not break the layer;
- provider failures remain isolated;
- jurisdiction configuration is correct;
- incidents render correctly;
- selection and context behavior work;
- refresh behavior works;
- unrelated GEV functionality remains operational.

## Repository Tests

Before merging Public Incidents changes, run the current repository test suite.

At minimum:

```text
npm test
```

Public Incidents changes should not knowingly leave the repository test suite failing.

Always follow the root GEV documentation if its testing commands change.

## Production Build

Run the production build:

```text
npm run build
```

A successful development session is not sufficient if the production build fails.

Provider additions and documentation changes should preserve a clean build.

## Provider Tests

Provider tests should focus on deterministic source behavior.

Useful tests include:

- valid response parsing;
- empty responses;
- malformed responses;
- missing optional fields;
- incident identifier extraction;
- timestamp conversion;
- coordinate extraction;
- location handling;
- service classification;
- status mapping;
- jurisdiction configuration;
- normalization;
- provider-specific variations.

## Fixtures

When practical, provider tests should use small representative fixtures rather than depending directly on a live external source.

A fixture should contain only enough data to reproduce the behavior being tested.

Avoid committing unnecessarily large raw source responses.

Avoid including unnecessary sensitive or personally identifying information.

A fixture should represent the source structure, not become a permanent archive of unrelated incident data.

## Live Sources Are Not Unit Tests

A live public feed may:

- be temporarily unavailable;
- contain zero incidents;
- change records between requests;
- change format;
- rate limit requests;
- move to another endpoint.

Automated tests should therefore avoid assertions such as:

```text
Austin must currently contain exactly 42 incidents.
```

Prefer deterministic assertions about parsing and normalization.

Live availability should be checked separately through smoke testing.

## Normalization Tests

Normalization tests should verify that source-specific records become valid Public Incident records.

Test fields that the provider actually supplies.

Examples include:

```text
source incident ID
    ->
normalized id

source event type
    ->
normalized type

source coordinates
    ->
latitude / longitude

source dispatch time
    ->
normalized timestamp
```

Do not require a provider to fabricate fields that its source does not publish.

See:

```text
INCIDENT-SCHEMA.md
```

## Missing Fields

Public incident feeds frequently omit information.

Tests should confirm that missing optional fields do not create false values.

For example:

```text
missing agency
```

should not automatically become:

```text
local police department
```

Likewise:

```text
missing timestamp
```

should not automatically become the current time.

Unknown should remain unknown.

## Malformed Records

A single malformed record should not necessarily invalidate an entire provider response.

Where practical, test behavior involving:

- missing coordinates;
- invalid coordinates;
- malformed timestamps;
- missing IDs;
- unexpected null values;
- incomplete records;
- unexpected source fields.

Provider behavior should be predictable and should not crash the entire Public Incidents layer.

## Empty Feeds

An empty incident list is not automatically an error.

A jurisdiction may legitimately have no currently published incidents.

Tests should distinguish:

```text
successful request + zero incidents
```

from:

```text
failed request
```

and:

```text
malformed response
```

These conditions are not equivalent.

## Provider Failure Isolation

Public Incidents supports multiple external sources.

One provider failing should not prevent unrelated providers from functioning.

Test or manually verify behavior when a provider:

- times out;
- returns an HTTP error;
- returns malformed data;
- returns an unexpected content type;
- becomes temporarily unavailable.

The desired behavior is graceful degradation rather than application-wide failure.

## Proxy Testing

Public Incidents may retrieve external sources through the GEV server proxy.

The current route pattern is:

```text
/api/public-incidents/<provider-id>
```

Verify that:

- valid provider IDs resolve correctly;
- upstream responses are handled appropriately;
- provider errors do not crash the server;
- invalid provider requests fail safely;
- expected response formats reach the provider logic.

Do not use the proxy to bypass authentication or intentional access controls.

## Catalog Testing

When adding a jurisdiction, verify that its catalog entry:

- uses the correct provider;
- identifies the intended jurisdiction;
- points to the correct source;
- contains required configuration;
- does not duplicate an existing provider unnecessarily.

A configuration error can look like a provider bug.

Check both.

## Map Smoke Test

After automated tests pass, run GEV and inspect the Public Incidents layer manually.

Verify:

```text
GEV loads
    |
    v
Public Incidents layer loads
    |
    v
Provider request succeeds
    |
    v
Incidents appear
    |
    v
Map locations are plausible
    |
    v
Incident can be selected
    |
    v
Incident details/context appear
```

## Geographic Verification

Map rendering can appear technically successful while coordinates are wrong.

Check several records when practical.

Watch for:

- reversed latitude and longitude;
- coordinates at 0,0;
- incidents appearing in another state or country;
- jurisdiction-center fallback masquerading as incident coordinates;
- incorrect coordinate systems;
- source-provided approximate locations being displayed as exact.

Geographic plausibility is part of provider verification.

## Incident Selection

Verify that selecting an incident behaves normally within GEV.

Check:

- map selection;
- incident information;
- context registration;
- tracked readout behavior;
- deselection or switching between incidents.

Public Incidents should use existing GEV interaction primitives whenever practical rather than creating parallel behavior unnecessarily.

## Refresh Testing

Public Incidents supports periodic refresh.

Verify that refresh behavior:

- retrieves updated data;
- does not continuously duplicate incidents;
- removes or updates displayed records appropriately;
- does not reset unrelated GEV state unnecessarily;
- handles temporary provider failure gracefully.

Avoid excessively aggressive manual refresh testing against public sources.

Respect upstream systems.

## Browser Console

During smoke testing, inspect the browser console.

Look for:

- uncaught exceptions;
- repeated failed requests;
- parsing errors;
- CORS problems;
- rendering errors;
- unexpected warnings.

A map that appears to work may still be generating important background errors.

## Server Output

When working on proxy/provider behavior, inspect server output where available.

Look for:

- upstream request failures;
- parsing exceptions;
- invalid provider IDs;
- repeated retries;
- unexpected response types.

Do not expose sensitive server information in public logs.

## Multi-Provider Smoke Test

After changes to shared Public Incidents code, test more than one provider family when practical.

A useful regression check is:

```text
Provider Family A -> working
Provider Family B -> working
Provider Family C -> working
```

This is especially important when modifying:

- normalization;
- catalog construction;
- proxy behavior;
- shared layer code;
- refresh logic;
- selection/context behavior.

A fix for one provider should not silently break another.

## Known-Good Providers

Maintain a small group of known-good providers for routine smoke testing.

The exact jurisdictions may change over time as public sources change.

Do not hard-code this document to assume that a particular external feed will remain available forever.

When a known-good provider disappears or changes, replace it with another verified source and document the change.

## New Provider Checklist

Before considering a new provider complete:

- [ ] Public source verified
- [ ] Provider family identified or documented as new
- [ ] Source response inspected
- [ ] Normalization implemented
- [ ] Representative tests added
- [ ] Missing fields handled
- [ ] Malformed records handled
- [ ] Empty feed handled
- [ ] Provider failure isolated
- [ ] Catalog entry added
- [ ] `npm test` passes
- [ ] `npm run build` passes
- [ ] Live source smoke-tested
- [ ] Geographic placement checked
- [ ] Selection/context checked
- [ ] Browser console checked
- [ ] Source documentation updated

## Shared-Code Checklist

When modifying shared Public Incidents infrastructure:

- [ ] Run full test suite
- [ ] Run production build
- [ ] Test multiple provider families
- [ ] Test at least one live source
- [ ] Check map rendering
- [ ] Check selection
- [ ] Check refresh behavior when relevant
- [ ] Check browser console
- [ ] Verify unrelated GEV behavior remains functional

## Documentation-Only Changes

Documentation-only changes normally do not require live provider testing unless the documentation change reflects or depends on a technical behavior that needs verification.

Documentation should still be checked for:

- correct filenames;
- valid relative references;
- obsolete instructions;
- claims that no longer match the implementation.

## Source Changes

If an upstream source changes:

1. Confirm the change directly.
2. Determine whether it affects one jurisdiction or an entire provider family.
3. Update provider logic if necessary.
4. Add a regression fixture or test when practical.
5. Smoke-test affected jurisdictions.
6. Update provider/source documentation.
7. Record important reusable discoveries.

Do not immediately create a jurisdiction-specific workaround when the actual problem belongs in shared provider logic.

## Regression Philosophy

Every provider failure is an opportunity to improve the reusable system.

When practical:

```text
Discover failure
      |
      v
Understand cause
      |
      v
Fix shared behavior
      |
      v
Add regression test
      |
      v
Verify other providers
```

The objective is not merely to restore one city.

The objective is to make the provider architecture more resilient.

## Final Rule

A provider is not considered working because:

- a URL exists;
- an HTTP request returns 200;
- a parser returns records;
- markers appear somewhere on the map.

A working integration requires reasonable confidence that:

- the source is legitimate;
- the records are interpreted correctly;
- geographic information is meaningful;
- failures are contained;
- the implementation does not break the rest of GEV.

---

**Document:** Public Incidents Testing Guide  
**Status:** Active development  
**Principle:** Test the reusable behavior locally, then verify the real source in the real application.
