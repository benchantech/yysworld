**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-012 (Immutable Ledger), YYBW-014 (Cached Diffs)

---

# ADR 003 — Artifact Provenance Contract

## Status
accepted

## Human Anchor
“I don’t want to lose how I got here.”

## Context
Artifacts without full provenance cannot be replayed, trusted, or meaningfully compared across time.

## Decision
Every artifact MUST include:

- `world_snapshot_id`
- `package_id`
- `package_hash`
- `mutation_id`
- `model_profile`
- `generated_at`

Artifacts missing any of these fields are invalid.

## Consequences

### Positive
- Guarantees replayability
- Enables debugging and comparison
- Preserves lineage

### Negative
- Increases data size
- Requires strict validation
