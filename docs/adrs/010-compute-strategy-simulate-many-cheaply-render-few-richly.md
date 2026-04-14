# ADR 010 — Compute Strategy: Simulate Many Cheaply, Render Few Richly

- **ID:** YYBW-010
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-007, YYBW-009
- **Supersedes / clarifies:** Clarifies use of local models, premium models, and media cost control
- **Museum lineage:** [SK-006](./museum/starter-kit-v0.1/006_model_provenance_and_role_separation.md)

## Context

The project repeatedly confronted cost. The core insight was that pictures and clever text are the expensive parts, while structured state transitions are cheap. This led to a layered compute strategy: local models or rules for deterministic tasks, stronger hosted models for premium surface moments, and selective media generation.

## Decision

Use a hybrid compute model:
- deterministic code + local models for routine structured updates
- premium hosted models for selected narrative moments
- selective, milestone-based media rather than rich generation everywhere

## Why

This matches the economics of the product:
- state is cheap
- narrative polish is expensive
- images/video should mark significance, not fill space

## Alternatives considered

1. **All premium model, everywhere** — rejected as too expensive.
2. **All local models, including premium prose** — rejected for quality risk.
3. **Full image generation for every node** — rejected immediately on cost grounds.

## Reversals / scars preserved

- The conversation explicitly recognized that kids want pictures and clever text, but those are the highest-cost surfaces.
- SNES/SMS format became a direct answer to this cost pressure.
- Local-vs-remote is not ideology here; it is economic discipline.

## Consequences

- Need structured schemas for local model output.
- Need triage logic for which branches/events get premium passes.
- Need restraint in media design: mostly sprites, composables, or lightweight visuals.

## Invariants preserved

Compression and Discipline are the main guards; Explainability improves when structured state is primary; Survivability improves because prose is view-layer, not truth.

## Freshness boundary

Revisit when cost/traffic data becomes real.
