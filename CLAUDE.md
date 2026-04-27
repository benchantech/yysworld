# CLAUDE.md

This file tells AI executors how to work on the YY Branching World project without breaking canon, provenance, or hobby-stage discipline. The project is a provenance-preserving, versioned, branching YY artifact — not just a site.

**Reference docs** (read when task-relevant):
- `docs/system-map-v1.0.md` — system architecture: every layer, what exists vs. what is planned
- `docs/executor/procedures.md` — executor responsibilities, change taxonomy, nightly pipeline, naming conventions
- `docs/executor/craft.md` — YY Method lens, narrative antipatterns, quality bar, discoverability
- `docs/pipeline/schemas.md` — canonical JSON schemas for all pipeline file types
- `docs/adrs/` — every schema and pipeline decision with its reasoning; read before writing new pipeline files

---

## 1. Operating posture

**Primary:** Preserve truth before polish.
**Secondary:** Do not mutate the past silently.
**Tertiary:** Prefer static, inspectable, rebuildable systems over live magical ones unless a strong reason exists.

---

## 2. What this project is

A mobile-first branching YY world where:
- each root is a finite arc
- branches emerge from explicit causes
- events align to real dates but are abstracted
- user-facing content is lightweight and glanceable
- the substrate is rigorous and immutable

---

## 3. Canonical invariants

Every serious change must preserve all eight.

1. **Canon integrity** — YY versions are explicit; old roots keep their original YY version; no silent retroactive rewrites.
2. **Immutable truth** — ledger entries are append-only; corrections are new events; projections may be rebuilt, truth may not be overwritten.
3. **Root clarity** — each root has a bounded time horizon; roots are independent by default; the user can always identify where a root begins and ends.
4. **Branch legibility** — branch causes are explicit; drift is gradual unless intentionally exceptional; root comparison remains one tap away.
5. **Event alignment** — events keep real-date anchors; surface events remain abstracted enough to be universal; story date and generation date must not be conflated.
6. **Surface simplicity** — default output is short and clear; the product is mobile-first; readability beats richness unless the moment truly warrants richness.
7. **Build determinism** — nightly pipelines are reproducible; manifests make work explicit; no hidden state or side effects.
8. **Audience discipline** — adult-facing and family-shareable, not child-directed; no toy-like drift in language or visuals.

---

## 4. Final operator principle

> The project should feel gentle on the surface and exacting underneath.

That tension is not a bug. It is the design.
