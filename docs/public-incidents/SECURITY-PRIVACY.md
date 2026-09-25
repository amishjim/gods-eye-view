# Public Incidents — Security and Privacy

Public Incidents is designed to work with information intentionally made available to the public.

The project should expand access to legitimate public information without creating unnecessary privacy or security risks.

## Core Rule

Public Incidents should collect and display information from legitimate public sources.

The existence of technically accessible information does not automatically make that information appropriate for collection, redistribution, or display.

Contributors should consider both:

- whether information can be accessed
- whether it should be incorporated into the project

## Public Sources

Acceptable sources may include:

- official government websites
- public CAD or active-call pages
- government open-data portals
- public GIS services
- publicly documented APIs
- public RSS or Atom feeds
- public agency datasets
- vendor-hosted systems intentionally exposed for public access

Access should use normal public interfaces whenever possible.

## Do Not Circumvent Access Controls

Contributors must not bypass or defeat:

- authentication
- authorization controls
- CAPTCHAs
- paywalls
- access tokens not intended for public use
- IP restrictions
- technical security controls

Public Incidents is not intended to discover or exploit vulnerabilities.

If accessing a source requires defeating a security measure, it should not be used.

## Credentials and Secrets

Never commit credentials or secrets to the repository.

This includes:

- passwords
- API keys
- private access tokens
- session cookies
- SSH private keys
- database credentials
- private certificates
- authentication headers containing secrets

If a credential is accidentally committed, treat it as compromised and rotate or revoke it immediately.

## Personally Identifiable Information

Incident systems sometimes expose information that may identify individuals.

Examples may include:

- names
- phone numbers
- email addresses
- exact residential addresses
- vehicle information
- medical information
- victim information
- suspect information
- juvenile information

Public Incidents should not automatically ingest every available field merely because the field exists.

Collect only information necessary for the project's public-safety and situational-awareness purposes.

## Sensitive Incident Information

Additional caution should be used with incidents involving:

- medical emergencies
- mental-health calls
- domestic violence
- sexual offenses
- juveniles
- suicides or attempted suicides
- vulnerable individuals
- shelters or protected facilities
- active tactical operations

If an official public source intentionally reduces location precision or withholds details, Public Incidents should preserve that limitation.

The project should not attempt to reconstruct information that the source intentionally obscures.

## Geographic Precision

Do not create more precise location information than the source provides.

For example, if a source publishes:

- a street block
- an intersection
- a neighborhood
- approximate coordinates

the project should not attempt to infer the exact residence or individual involved.

Normalization should preserve source precision rather than manufacture precision.

## Data Minimization

Store only what is useful.

Avoid retaining unnecessary fields simply because they are available.

When evaluating a field, ask:

1. Does it help identify, classify, locate, verify, or understand the incident?
2. Is the information appropriate for redistribution?
3. Does retaining it create unnecessary privacy or security risk?

If the value is minimal and the risk is significant, omit it.

## Source Attribution

Whenever practical, records should retain enough source information to identify where the data originated.

Useful attribution fields may include:

- jurisdiction
- agency
- provider
- source URL
- source incident identifier
- retrieval timestamp

This helps users and developers distinguish GEV's normalized representation from the authoritative source.

## Historical Data

Information that was once publicly available may become more sensitive when permanently aggregated.

Historical retention should therefore be considered separately from live display.

A source displaying an incident for thirty minutes does not necessarily imply that indefinitely archiving every detail is appropriate.

Future historical-data features should consider:

- source retention practices
- public value
- privacy implications
- legal requirements
- whether sensitive fields should expire or be reduced

## Scraping and Automated Collection

Automated collection should be respectful of source infrastructure.

Contributors should:

- use documented APIs when available
- avoid unnecessary request volume
- use reasonable refresh intervals
- cache where appropriate
- respect explicit technical restrictions
- avoid repeatedly downloading unchanged large datasets

The objective is reliable integration, not aggressive extraction.

## Source Discovery

Research may reveal endpoints or data structures used internally by a public-facing application.

Before using such an endpoint, determine whether it appears intended to support public access.

Do not assume that every endpoint visible in browser developer tools is appropriate for automated collection.

When uncertain, document the source for review before integrating it.

## AI-Assisted Research

AI tools may help explain:

- network requests
- unfamiliar data formats
- GIS services
- API documentation
- JavaScript applications
- potential provider relationships

AI must not be used to justify bypassing access restrictions or to invent authorization for accessing a source.

Any endpoint or access method suggested by AI must be independently verified.

## Reporting Problems

If a contributor discovers:

- exposed credentials
- unintentionally public sensitive information
- a security vulnerability
- an endpoint that appears accidentally exposed
- information that creates a substantial privacy concern

do not publish the sensitive details in a public issue.

Notify the project maintainers privately so the situation can be evaluated responsibly.

## Public Safety

Public Incidents should not expose information in a way that creates an obvious operational risk to emergency responders or members of the public.

The project is intended for public situational awareness and research, not operational surveillance.

## Guiding Principle

When choosing between collecting more information and protecting reasonable privacy or security interests:

**collect the minimum information necessary to provide useful, verifiable public incident awareness.**
