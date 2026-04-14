# PM-019 — Dual Layer: Lineage vs Commentary

**Status:** museum
**Era:** pre-manifest (before v0.1 schema)
**Superseded by:** YYBW-013 (Manifests and Projections), SK-004 (Dual Layer Architecture), Manifest v0.1 (Dual Layer Truth section)

---

## Context

There is a clear need to preserve both strict data lineage (structured, replayable truth) and human commentary (interpretive, creative reflection). These serve different purposes and audiences.

## Decision / Direction

Maintain two distinct layers:
- Lineage layer (JSON, packages, snapshots, provenance)
- Commentary layer (Substack, notes, reflections)

Commentary may observe lineage but must not directly influence runtime behavior.

## Tensions / Contradictions

- Commentary may bias future decisions
- Desire to connect meaning with system without contaminating it

## Implications

System must enforce separation while allowing explicit promotion (commentary → ADR → package).

## Notes

"truth vs meaning", "the gap is the product"
