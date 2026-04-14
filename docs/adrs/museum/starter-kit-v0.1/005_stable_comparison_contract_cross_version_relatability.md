**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-014 (Cached Diffs)

---

# ADR 005 — Stable Comparison Contract (Cross-Version Relatability)

## Status
accepted

## Human Anchor
“The gap between what happened and what I think happened is the product.”

## Context
The system must support comparing outputs across time, including:
- different package versions
- different model versions
- different interpretations

Without a stable comparison surface, outputs become incomparable.

## Decision
Define a stable comparison contract:

- core output fields must remain consistent across versions
- new fields may be added, but existing meaning must not be removed
- breaking changes require:
  - explicit version bump
  - mapping or translation layer

Each package includes:
- `comparison_contract_version`

## Consequences

### Positive
- Enables longitudinal analysis
- Makes replay meaningful
- Preserves interpretability

### Negative
- Slows schema evolution
- Requires careful design upfront
