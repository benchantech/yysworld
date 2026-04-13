# ADR 009 — Nightly Snapshot Build; Daytime Static Exploration

- **ID:** YYBW-009
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-003, YYBW-005, YYBW-007, YYBW-008
- **Supersedes / clarifies:** Clarifies the compute and publishing cadence

## Context

Real-time simulation was attractive in theory but unnecessary and expensive. A better architecture emerged: every night the world advances, artifacts are generated and cached, and during the day users browse static pages and JSON. This mirrors the project's habit-loop nature and keeps costs predictable.

## Decision

The MVP runs as a nightly build system:
- ingest or select events
- update active branches
- compute diffs and summaries
- publish static/cached artifacts

During the day users interact with static pages and cached data, not live inference.

## Why

This:
- controls cost
- speeds UX
- stabilizes shared references
- supports Vercel Hobby
- fits a daily ritual/product cadence

## Alternatives considered

1. **Live inference on every visit** — rejected for cost, inconsistency, and latency.
2. **Continuous background world simulation** — rejected as unnecessary for the first product.
3. **Manual-only publishing** — acceptable for earliest prototyping but not the intended operating pattern.

## Reversals / scars preserved

- The temptation toward "always alive" simulation was preserved as a future option.
- The static-first instinct aligns strongly with Case 002's outward-only posture.
- This choice is a reduction in spectacle but a gain in viability.

## Consequences

- Build pipeline becomes central.
- Site should visibly communicate snapshot dates and last-update times.
- Static artifacts should be structured enough to regenerate, republish, or diff later.

## Invariants preserved

Timestamping, Survivability, Discipline, and Explainability all improve under snapshot publishing.

## Freshness boundary

Stable for MVP; revisit only when traffic and product depth justify more dynamism.
