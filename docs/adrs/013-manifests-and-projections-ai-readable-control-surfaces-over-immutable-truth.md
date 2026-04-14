# ADR 013 — Manifests and Projections: AI-Readable Control Surfaces over Immutable Truth

- **ID:** YYBW-013
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-012
- **Supersedes / clarifies:** Clarifies what manifests are for
- **Museum lineage:** [PM-019](./museum/pre-manifest/PM-019-dual-layer-lineage-vs-commentary.md), [SK-004](./museum/starter-kit-v0.1/004_dual_layer_architecture_lineage_vs_commentary.md), [SK-012](./museum/starter-kit-v0.1/012_output_rendering_layer.md), [SK-013](./museum/starter-kit-v0.1/013_human_annotation_system.md)

## Context

Once the database of truth hardened, manifests regained a narrower but essential role. The system needs machine-readable summaries of what exists, what is stale, what depends on what, and what needs recomputation. This helps AI operate safely without inferring too much from raw world state.

## Decision

Maintain manifests/projections as derived control surfaces:
- world manifest
- build manifest
- publish manifest

These are not canonical truth; they are AI-readable operational maps over the immutable ledger.

## Why

This allows AI or automation to:
- determine what changed
- know what needs updating
- avoid reprocessing unaffected artifacts
- act deterministically against explicit state

## Alternatives considered

1. **No manifests; let AI infer from raw DB** — rejected as fragile.
2. **Manifest-only, no immutable DB** — rejected because manifests are too lossy as truth.
3. **One giant monolithic manifest** — rejected in favor of layered control surfaces.

## Reversals / scars preserved

- The term 'manifest' was initially overloaded. It now has a cleaner role.
- The phrase 'database of truth' corrected the architecture materially.
- This ADR preserves that correction.

## Consequences

- Need scheduled regeneration of manifests/projections.
- Need stale-status semantics and dependency tracking.
- Builders should treat manifests as disposable/rebuildable but still important.

## Invariants preserved

Explainability and Discipline improve when AI has explicit work surfaces; Survivability improves because manifests can be rebuilt from truth.

## Freshness boundary

Stable.
