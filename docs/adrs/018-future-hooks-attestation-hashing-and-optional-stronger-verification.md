# ADR 018 — Future Hooks: Attestation, Hashing, and Optional Stronger Verification

- **ID:** YYBW-018
- **Status:** Decided
- **Date:** 2026-04-13
- **Scope:** YY Branching World / YY's World evolution
- **Depends on:** YYBW-012, YYBW-013, YYBW-017
- **Supersedes / clarifies:** Clarifies blockchain-adjacent future-proofing
- **Museum lineage:** [PM-013](./museum/pre-manifest/PM-013-provenance-matters-as-much-as-output.md), [SK-003](./museum/starter-kit-v0.1/003_artifact_provenance_contract.md)

## Context

In the distant future, others may become involved and stronger verification or distributed attestation may matter. The right response is not to build on blockchain now, but to preserve the hooks that make later verification possible without contorting the product today.

## Decision

Design for future verifiability, not current chain dependence. Immutable events should support:
- stable IDs
- hashes
- provenance fields
- optional signatures
- exportability
- optional future attestation backends

No blockchain dependency is required now.

## Why

This keeps the product:
- simple now
- extensible later
- compatible with stronger trust layers if collaboration or public verification becomes important

## Alternatives considered

1. **Blockchain-first architecture now** — rejected as distorting and premature.
2. **No future-proofing at all** — rejected because append-only provenance invites later verification naturally.
3. **Chain-specific assumptions** — rejected because the right future verification substrate is unknown.

## Reversals / scars preserved

- The future verification instinct was kept, but disciplined.
- The crucial correction was: let blockchain verify the ledger later, not define the product now.
- Abstract hooks beat speculative complexity.

## Consequences

- Event schemas should leave room for hash/signature fields.
- Batch attestation can be added later without changing domain logic.
- Collaboration models can be layered on top of current provenance architecture.

## Invariants preserved

Survivability, Explainability, and Discipline all benefit from future-proof but deferred verification.

## Freshness boundary

Long-horizon; low-priority until collaboration or trust requirements materially change.
