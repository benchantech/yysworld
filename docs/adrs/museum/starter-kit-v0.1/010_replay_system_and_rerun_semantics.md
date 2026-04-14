**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-009 (Nightly Snapshot Build), YYBW-014 (Cached Diffs)

---

# ADR 010 — Replay System & Re-run Semantics

## Status
accepted

## Human Anchor
“I don’t want to lose how I got here.”

## Context
The system’s value depends on the ability to:
- revisit past states
- re-run them under new reasoning
- compare outcomes

## Decision
The system must support deterministic replay at the artifact level.

Each replay operation is defined as:
- world_snapshot_id
- package_id
- model_profile
- mutation_id

### Replay Types
1. Exact Replay
   - same snapshot
   - same package
   - same model
2. Comparative Replay
   - same snapshot
   - different package and/or model

### Rules
- all inputs must be preserved for replay
- replay must be inspectable and diffable
- replay results must not overwrite original artifacts

### Constraints
- stochastic models may produce slight variation
- determinism should be approximated where possible

## Consequences

### Positive
- Enables longitudinal analysis
- Makes reasoning evolution visible
- Supports debugging and validation

### Negative
- Requires storage of historical inputs
- Adds computational overhead
