**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-012 (Immutable Ledger), YYBW-013 (Manifests and Projections)

---

# ADR 002 — yysworld Package as Reasoning Control Plane

## Status
accepted

## Human Anchor
“Provenance matters as much as output.”

## Context
The system relies on evolving reasoning rules, schemas, and model configurations. Without a unified control artifact, reasoning becomes fragmented and difficult to reproduce.

## Decision
Introduce a single control artifact:

`yysworld-package-vX.Y.json`

Each package defines:
- schema version
- reasoning rules (YY Method binding)
- mutation policy
- model profiles
- comparison/output contract
- freshness/staleness rules

Rules:
- packages are immutable once published
- each package must have a unique hash
- packages are inspectable via UI/API

## Consequences

### Positive
- Enables replay and comparison
- Centralizes reasoning logic
- Makes system behavior explainable

### Negative
- Requires discipline in versioning
- Adds overhead to changes
