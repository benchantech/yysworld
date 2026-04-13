# ADR 004 — Branches Arise from Acquisitions and Drift Gradually

- **ID:** YYBW-004
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-002, YYBW-003
- **Supersedes / clarifies:** Clarifies branch origin and rejects instant hard divergence

## Context

The product needed a clean branching logic. Abstract trait mutation and weird parallel selves were initially interesting, but the cleaner form became: same YY, shared root, then a branch where YY acquires a skill, language, or capability. The branch should not become a different being instantly; it should be slightly offset and then drift.

## Decision

Primary branches are created by explicit acquisitions or capability changes: e.g. learning to help, negotiation, planning, a second language, or another skill. Post-branch divergence starts subtly and compounds over time.

## Why

This makes branches:
- understandable
- explainable
- comparable
- emotionally believable
- experimentally useful

## Alternatives considered

1. **Pure entropy branches only** — kept as an interesting special case, but not the default branch logic.
2. **Immediate binary personality swaps** — rejected as unbelievable.
3. **Purely decorative language overlays** — rejected in favor of language as a real capability/acquisition source.

## Reversals / scars preserved

- Parallel-world weirdness was useful as a generative phase but too muddy as the default explanatory model.
- Entropy-only twins remain valuable as diagnostics, but not as the main branch mechanism.
- The phrase 'same being, slightly offset' became load-bearing.

## Consequences

- Branch metadata must include branch cause and branch day.
- The diff system must support progressive drift, not just point-in-time flips.
- The UI should visually show branches staying close early and widening later.

## Invariants preserved

Explainability via branch causes; Compression via a simple branching rule; Scars via preserving entropy as a special branch class; Discipline via rejecting arbitrary divergence.

## Freshness boundary

Stable unless the branch mechanism broadens materially beyond acquisitions.
