# ADR 017 — Launch Infrastructure: Vercel Hobby + Neon Postgres, Static-First

- **ID:** YYBW-017
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-009, YYBW-012, YYBW-013, YYBW-014
- **Supersedes / clarifies:** Clarifies stack, hobby constraints, and expansion logic
- **Museum lineage:** [PM-010](./museum/pre-manifest/PM-010-start-with-very-little.md), [PM-012](./museum/pre-manifest/PM-012-starting-is-more-important-than-perfection.md), [C2-012](./museum/case-002/C2-012-technical-stack.md), [C2-023](./museum/case-002/C2-023-stack-pending.md)

## Context

The desired early stack is cheap and simple: Vercel for static site delivery and Neon Postgres for source-of-truth storage. The early launch is explicitly hobby-scale and mostly static, with small branch counts and minimal media. This must stay within hobby/free constraints while leaving room to grow.

## Decision

Launch on:
- **Vercel Hobby** for static/mobile-first site delivery and small dynamic helpers
- **Neon Postgres Free** for the database of truth and projections
- minimal file/blob storage at first
- static pages + cached JSON as the dominant delivery model

## Why

This supports:
- fast launch
- low cost
- static-first outward posture
- low operational complexity
- easy later migration to paid/pro tiers if traction appears

## Alternatives considered

1. **Immediate production-grade paid infra** — rejected as premature.
2. **Custom servers from day one** — rejected for speed and simplicity reasons.
3. **Media-heavy architecture** — rejected because it would burn limits before the concept is proven.

## Reversals / scars preserved

- The stack remains contingent on hobby viability, not ideology.
- The architecture is intentionally constrained to qualify for free/hobby early.
- Blob/media-heavy temptations are explicitly deferred.

## Consequences

- Strict scope control is required: few roots, few branches, lightweight assets.
- Commercialization or heavier usage will force Vercel plan reassessment.
- Need a clean line between immutable truth in Postgres and publish artifacts on the site.

## Invariants preserved

Discipline through scope control; Survivability through a real DB + static build split; Explainability through explicit infra roles.

## Freshness boundary

Needs revisiting when usage or monetization exceeds hobby assumptions.
