# ADR 011 — Versioned Canon: YY Evolves Explicitly (v1.0, v1.1, ...)

- **ID:** YYBW-011
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-002
- **Supersedes / clarifies:** Clarifies character refinement without retroactive confusion

## Context

A major late insight: canonical YY may need refinement over time. Rather than silently changing YY, the system should version canon. Each root or branch can explicitly reference the YY version it used. YY itself can have an independent timeline and diff history, similar to commit history.

## Decision

YY is a versioned canonical entity. Changes to canonical understanding are released as explicit YY versions (v1.0, v1.1, etc.), never silently overwritten. Roots and branches declare which YY version they use.

## Why

This allows:
- historical integrity
- faithful refinement
- auditability
- cleaner comparison between path changes and canon changes

## Alternatives considered

1. **One eternal YY with silent edits** — rejected because it destroys trust and reproducibility.
2. **No YY evolution allowed** — rejected because understanding can deepen over time.
3. **Retroactively rewrite old roots to newest YY** — rejected because it erases historical truth.

## Reversals / scars preserved

- The tension between stable canon and living understanding is preserved here rather than hidden.
- The Git analogy proved unusually fruitful and should remain in explanatory copy for builders.

## Consequences

- Need yy_versions and yy_version_diffs as first-class entities.
- User-facing pages may need 'view YY changes' affordances.
- Story and canon timelines become distinct but linked.

## Invariants preserved

Scars and Timestamping become literal; Explainability and Survivability improve through explicit version history; Discipline by forbidding silent canon drift.

## Freshness boundary

Stable.
