**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-011 (Versioned Canon)

---

# ADR 011 — Schema Evolution & Compatibility Rules

## Status
accepted

## Context
The system depends on structured state and outputs. Over time, schema changes are inevitable.

Without strict rules:
- past artifacts become unusable
- comparisons break
- replay fails

## Decision
Schema evolution must preserve backward interpretability and comparability.

### Rules
1. Additive-first evolution
2. No silent meaning changes
3. Versioning required
4. Breaking changes must be explicit
5. Comparison contract protection

## Consequences

### Positive
- Preserves long-term usability of artifacts
- Enables cross-version comparison
- Protects system integrity

### Negative
- Slows schema evolution
- Requires discipline in design
