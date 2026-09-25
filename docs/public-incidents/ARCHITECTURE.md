# Public Incidents Architecture

This document describes the current architecture of the Public Incidents layer in God's Eye View (GEV).

The architecture is designed around a simple idea:

> Jurisdictions are numerous, but the systems and data formats behind them are often reusable.

Instead of building a separate implementation for every city or county, Public Incidents separates jurisdiction configuration from provider-specific data handling.

## High-Level Flow

Public incident data moves through the system approximately as follows:

```text
Public Source
     |
     v
Provider Adapter
     |
     v
GEV Server Proxy
     |
     v
Normalization
     |
     v
Common Incident Model
     |
     v
Public Incidents Layer
     |
     +----> Cesium Map
     |
     +----> Selection / Context
     |
     +----> Incident Readout
