# ADR 012 — Immutable Append-Only Ledger as Database of Truth

- **ID:** YYBW-012
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-009, YYBW-011
- **Supersedes / clarifies:** Clarifies source-of-truth architecture

## Context

The project needed high-fidelity tracking. The strongest architectural model became financial: like orders and refunds, original facts remain immutable; later corrections or interpretations are added as ledger events. The database must preserve what happened, when it happened, and what the system believed at each point.

## Decision

The source of truth is append-only. Important records are immutable once written. Corrections, supersessions, explanations, or rebuilds are new ledger entries, not in-place edits. Current views are projections derived from the ledger.

## Why

This ensures:
- provenance
- auditability
- reproducibility
- safer AI maintenance
- future attestability

## Alternatives considered

1. **Editable mutable rows as truth** — rejected because they collapse provenance.
2. **Flat manifests only** — rejected because manifests are views/control surfaces, not durable truth.
3. **Store only rendered pages** — rejected because rendered pages are artifacts, not canonical state.

## Reversals / scars preserved

- The orders/refunds analogy was the decisive simplifier.
- The design shifted from 'manifest as truth' to 'database as truth, manifest as control surface.'
- This was one of the biggest hardenings in the architecture.

## Consequences

- Need explicit event types, projections, and supersedes/corrects links.
- Query patterns must separate ledger storage from read models.
- Builders must learn to think in append-only terms, not overwrite terms.

## Invariants preserved

Survivability, Scars, Timestamping, and Explainability all depend on this decision.

## Freshness boundary

Stable.
