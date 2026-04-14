# ADR 006 — Two Parallel Labs: Measurement and Chaos

- **ID:** YYBW-006
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-004, YYBW-005
- **Supersedes / clarifies:** Clarifies the resolution of the branch-crossing conflict
- **Museum lineage:** [PM-005](./museum/pre-manifest/PM-005-rnd-lab-for-llms.md)

## Context

The concept oscillated between two incompatible desires:
1. a clean system for measuring how a skill changes processing
2. a messy emergent world where branches or agents can collide
Initially, crossings were exciting. Then they were stripped away to preserve clean comparison. The final resolution was not to pick one, but to split the product into two labs.

## Decision

The system conceptually contains two distinct labs:
- **Measurement Lab**: isolated branches, shared root, no crossings, controlled comparisons.
- **Chaos Lab**: interactions, crossings, entropy, emergent contact, and messy ecology.

The launch product should start in Measurement Lab, with Chaos Lab treated as future or secondary.

## Why

This preserves both values without corrupting either:
- clean causality for measurement
- emergent aliveness for discovery

## Alternatives considered

1. **Crossings everywhere** — rejected because they muddy causal interpretation.
2. **No crossings ever** — rejected because emergent interactions remain creatively and scientifically interesting.
3. **Hide the distinction** — rejected because users and builders need conceptual clarity.

## Reversals / scars preserved

- Multiple turns in the conversation wrestled with crossings.
- The 'sometimes timelines interfere' framing remains valuable, but belongs in chaos, not baseline measurement.
- This ADR preserves the strongest resolution rather than erasing the oscillation.

## Consequences

- Data models should support isolated branches now and reserve hooks for inter-branch encounters later.
- UI and copy must not confuse clean branch comparison with chaos behavior.
- Future chaos experiments can borrow from measurement insights without polluting them.

## Invariants preserved

Discipline through separation of concerns; Explainability via lab distinction; Scars by preserving the crossing obsession as a bounded mode, not a mistake.

## Freshness boundary

Stable. Implementation priority remains Measurement Lab first.
