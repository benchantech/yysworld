**Status:** museum — starter-kit v0.1 era
**Superseded by:** YYBW-013 (Manifests and Projections), YYBW-020 (Public/Private Key)

---

# ADR 013 — Human Annotation System

## Status
accepted

## Human Anchor
“This is something I want to be proud to show my family.”

## Context
Human interpretation is essential to meaning, but must remain separate from system execution.

## Decision
Introduce a Human Annotation System.

Annotations:
- are attached to specific context
- are timestamped
- are immutable once written

### Properties
- context binding
- author
- timestamp
- optional related references

### Rules
- annotations are part of commentary layer
- annotations must not influence runtime behavior
- annotations may be promoted via ADR or package updates

## Consequences

### Positive
- Preserves human insight without contaminating system
- Enables rich interpretation
- Supports Substack integration naturally

### Negative
- Requires discipline to avoid over-annotation
- Adds data management overhead
