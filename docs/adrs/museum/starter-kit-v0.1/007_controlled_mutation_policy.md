**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-004 (Branches Arise from Drift)

---

# ADR 007 — Controlled Mutation Policy

## Status
accepted

## Context
The system explores divergence through mutations. Without constraints, mutations can become:
- too large
- too arbitrary
- too frequent

## Decision
All branches must originate from explicit, controlled mutations.

Each mutation MUST be:
- small
- attributable
- bounded

### Mutation Types (initial categories)
- timing shift
- interpretation shift
- relationship change
- missed vs taken action
- emotional carryover

### Rules
- each branch must reference a `mutation_id`
- mutation definitions must be stored and versioned
- multiple mutations per branch are allowed but must be explicit

Mutation policy is defined in the package and versioned with it.

## Consequences

### Positive
- Preserves causal clarity
- Enables meaningful divergence
- Supports replay and comparison

### Negative
- Limits creative freedom in early stages
- Requires discipline in defining mutations
