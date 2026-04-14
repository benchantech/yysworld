# ADR 014 — Cached Diffs for Branches and YY Versions

- **ID:** YYBW-014
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-011, YYBW-012, YYBW-013
- **Supersedes / clarifies:** Clarifies diff computation strategy
- **Museum lineage:** [SK-005](./museum/starter-kit-v0.1/005_stable_comparison_contract_cross_version_relatability.md), [SK-010](./museum/starter-kit-v0.1/010_replay_system_and_rerun_semantics.md)

## Context

The product depends on comparison. Recomputing diffs on every view would be wasteful. Since most branches and YY versions are mostly static once generated, branch diffs and YY version diffs can be computed once and cached. Pairwise explosion exists, so not every possible diff should be eagerly generated.

## Decision

Diffs are treated as first-class artifacts:
- branch vs root and selected sibling diffs are eagerly computed and cached
- unusual branch-to-branch diffs can be lazily computed and then cached
- YY version diffs are computed when versions change and cached permanently

## Why

This makes the site:
- fast
- mobile-friendly
- shareable
- stable
while keeping compute predictable.

## Alternatives considered

1. **Live diffing on every request** — rejected for cost and latency.
2. **No diffs, only prose summaries** — rejected because comparison is the product.
3. **Compute all pairwise diffs eagerly forever** — rejected because it does not scale as branch counts rise.

## Reversals / scars preserved

- The Git analogy again helped.
- The realization that diffs themselves are artifacts, not temporary calculations, was decisive.
- Branch and canon diff systems became parallel structures, not one muddled mechanism.

## Consequences

- Need diff schemas, completeness levels, and timestamps.
- Need pairwise-diff triage.
- Progress bars can represent diff depth/completeness when richer narratives are not yet computed.

## Invariants preserved

Compression via precomputed summaries; Explainability through formal diff objects; Timestamping and Discipline through diff metadata.

## Freshness boundary

Stable.
