# ADR 008 — Bookmark a Branch, but Keep Root One Tap Away

- **ID:** YYBW-008
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-003, YYBW-004, YYBW-007
- **Supersedes / clarifies:** Clarifies the user navigation model

## Context

Once multiple branches exist, users need both attachment and reference. The winning interaction pattern became: let users follow/bookmark a branch they care about, but keep the root or canonical baseline instantly accessible so meaning never floats free of origin.

## Decision

Users may bookmark/follow a branch. Every branch view must provide a clear, immediate path back to root and to branch-to-root comparison.

## Why

This preserves:
- emotional attachment to a path
- intellectual grounding in origin
- shared community reference
- the meaning of divergence itself

## Alternatives considered

1. **Root-only navigation** — too dry, no attachment.
2. **Branch-only immersion** — too disorienting; users lose context.
3. **Deep tree browser first** — too complex for mobile habit use.

## Reversals / scars preserved

- The product repeatedly risked becoming either too personal ('my branch only') or too abstract ('everything relative').
- The follow-plus-root model was the clean balance.

## Consequences

- Every branch page should expose compare-to-root, timeline, and switch-branch affordances.
- Notifications/email can target followed branches while still referencing root deltas.
- Root remains canon; following is preference, not truth.

## Invariants preserved

Explainability through persistent root access; Discipline by preventing branch drift from becoming contextless; Compression via simple navigation primitives.

## Freshness boundary

Stable.
