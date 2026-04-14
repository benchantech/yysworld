**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-003 (Roots Are Finite Story Arcs)

---

# ADR 008 — Finite Roots & Time Segmentation

## Status
accepted

## Human Anchor
“Time is part of the system.”

## Context
Unbounded timelines create:
- complexity explosion
- loss of interpretability
- difficulty in replay and comparison

## Decision
The system operates in finite roots, typically time-bounded (e.g. monthly).

Each root:
- has a defined start and end
- contains a shared event stream
- supports multiple branches
- produces a complete, replayable unit

### Rules
- branches cannot span across roots without explicit transition
- snapshots are taken within root boundaries
- roots are archived but remain replayable

### Root Lifecycle
1. root initialized
2. events applied
3. branches created via mutations
4. snapshots generated
5. root finalized and archived

## Consequences

### Positive
- Keeps system bounded and interpretable
- Enables clean replay units
- Supports long-term accumulation

### Negative
- Requires explicit handling of cross-root continuity
- Introduces structural overhead
