# Public Incident Schema

This document defines the normalized incident model used by the Public Incidents layer in God's Eye View (GEV).

Public incident sources vary widely. One jurisdiction may publish detailed structured records while another provides only a small number of fields.

The normalized model exists so the rest of GEV can work with incidents consistently without requiring the map layer to understand every upstream source format.

## Core Principle

Normalization should standardize information without inventing information.

If a source does not provide a value, the normalized incident should leave that value unavailable rather than infer or fabricate it.

The source remains authoritative for the information it actually publishes.

## Conceptual Incident Record

A normalized Public Incident record may contain:

```text
id
providerId
jurisdiction
service
type
description
agency
location
latitude
longitude
timestamp
updatedAt
status
source
sourceUrl
