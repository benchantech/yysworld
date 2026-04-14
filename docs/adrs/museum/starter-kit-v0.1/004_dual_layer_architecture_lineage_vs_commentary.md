**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-013 (Manifests and Projections), YYBW-020 (Public/Private Key)

---

# ADR 004 — Dual Layer Architecture (Lineage vs Commentary)

## Status
accepted

## Human Anchor
“Commentary observes lineage. Lineage does not depend on commentary.”

## Context
The system must preserve both:
- structured, replayable truth (lineage)
- human interpretation (commentary)

Mixing these layers destroys causal clarity and introduces bias.

## Decision
Define two strictly separated layers:

### Lineage Layer
- canonical state
- packages
- snapshots
- mutations
- model outputs

### Commentary Layer
- Substack
- notes
- reflections
- interpretation

Rules:
- lineage is the source of truth
- commentary may read lineage
- commentary must not influence runtime behavior

Allowed influence path:
Commentary → ADR → Package → Runtime

Direct influence is forbidden.

## Consequences

### Positive
- Preserves experimental integrity
- Maintains interpretive richness
- Enables long-term trust

### Negative
- Requires discipline in boundaries
- Adds friction for rapid iteration
