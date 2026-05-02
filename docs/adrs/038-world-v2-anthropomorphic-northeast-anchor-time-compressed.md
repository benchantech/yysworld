# ADR-038 — World v2.0: Anthropomorphic Society, Northeast Anchor, Time-Compressed Seasonal Arc, Unique Inventory

**Status:** Accepted
**Date:** 2026-05-01
**Refs:** ADR-029 (world seed), ADR-005 (event stream), ADR-026 (species/stat names), ADR-034 (voice versioning)
**Supersedes:** v1.1 template (`docs/templates/world-seed.json` prior content). v1.0 (April retroactive declaration) is preserved as historical record.

---

## Context

The April 2026 root ran without a world seed (ADR-029 §3). v1.0 was reconstructed retroactively. v1.1 was drafted as the first authored-before-a-root template but was never used by a live root.

Before the May root begins, the world's social and physical rules are being upgraded substantively enough that v1.1 is being superseded entirely rather than incrementally promoted. The author specified six rules:

1. **Anthropomorphic society** — like *Daniel Tiger*: animals talk, reason, barter, hold grudges, while retaining animal-like instincts. Conflict is non-violent — physical contact is emotional display, no one gets hurt.
2. **Economy is barter-based**, currency is food + rarer gathered materials. Foraging and exploring advance YY's standing.
3. **No vehicles** — travel is physical exertion. Distances matter.
4. **Northeast US weather and geography** — recognizable patterns to a NE-US reader, without naming specific real-world locations.
5. **Time compression** — Jan → Dec across 30 run-days, with seasons visibly changing.
6. **Unique inventory items** — singular objects YY may hold, each with its own interaction unlocks. Branches may diverge by inventory state.

---

## Decision

### 1. Skip v1.1; v2.0 is the next live version

v1.1 (template-only, never read by a pipeline) is replaced by v2.0. The April v1.0 retroactive seed remains as historical record per ADR-029. No retrofit — that scar is preserved.

### 2. New top-level blocks in the seed

- `world_kind` — register, tone anchor, violence rule, speech rule
- `society` — capability rules, customs, named neighbors (replaces v1's `social_field`)
- `economy` — currency types, exchange norms, advancement rule
- `mobility` — physical-exertion-only, travel cost is real
- `seasonal_arc` — replaces v1's `seasonal_physics`; per-day-range schedule for season / weather / food_pressure / daylight
- `inventory_catalog` — declares unique items with interaction unlocks
- `starting_conditions.starting_inventory.{main, alt1, ...}` — per-branch starting inventory; one mechanism for seeded branch divergence

`schema_version` bumps from `0.1` to `0.2` to signal the additive but substantial change.

### 3. Time compression — weighted, not linear

30 run-days ≈ 1 in-world year. Distribution biases toward shoulder seasons (spring / summer / autumn = 22 days) and uses winter as bookend framing (8 days total: 3 days late-winter open, 5 days early-winter close).

Reason: a linear 2.5-days-per-month split gives narrative monotony in winter dormancy. Hobby-stage discipline (CLAUDE.md §3.6) says foraging-rich variation is what carries reader interest. Default schedule is documented in the template; per-root authors may adjust.

### 4. Economy is loose — qualitative, not stat-tracked

Bulk currency (food acorns, generic materials) is narrated, not counted. YY's wealth accumulates implicitly through events.

**Unique inventory items are the exception.** Those are tracked by id in the seed (`inventory_catalog`, `starting_inventory.{branch}`). The pipeline will need a way to carry inventory state forward through snapshots and reference items in events; the snapshot/event schema extension is left to land when the pipeline first reads a v2.0 seed (May root, Day 1). Documenting the intent here so the implementation has a clear target.

This keeps the existing snapshot/event schema additive — old roots and tests are not affected.

### 5. NE-US regional anchor

`geography.region_anchor` is a soft anchor — constrains biome, weather patterns, and physical signatures (fieldstone walls, mixed hardwood, four-season) without naming specific real-world locations. A NE-US reader recognizes the patterns; the world remains fictional.

Future extrapolations of geography (places introduced over the month, or carried into later roots) should remain within the anchor region. If a future root needs a different anchor, it gets a new world version.

### 6. Branch divergence via inventory

Per the May root's branch hypothesis: alt1 starts Day 1 holding a single unique item that main does not. The hypothesis is whether one inherited status object reshapes 30 days of social positioning. This is a small initial divergence (parallel to April's missed-morning) but operates on the new social/economic substrate rather than on a stat delta.

Inventory-as-divergence-mechanism is one of several possible v2.0 branch seeds — others (different starting neighbor relationships, different starting place knowledge) are valid and may be used in later roots.

---

## What this does not do

- Does not retrofit `world_version: "2.0"` into April run files — ADR-029 immutability stands
- Does not enforce stat-tracking for bulk currency
- Does not change voice versioning (ADR-034) — voice v2 lives independently in `docs/voice/v2.md` (promoted alongside this ADR per ADR-039)
- Does not lock the day-segment schedule — per-root authors adjust within the seed
- Does not commit to a specific snapshot field name for inventory state — that lands with the pipeline implementation

---

## Consequences

- `docs/templates/world-seed.json` becomes the v2.0 template
- `runs/root_2026_05_01/world-seed.json` is authored before Day 1 and is the first live use of v2.0
- The pipeline must read `world_version`, `world_kind`, `society`, `economy`, `mobility`, `seasonal_arc`, `inventory_catalog`, `starting_conditions.starting_inventory.{branch}` when generating against a v2.0 seed
- Snapshot/event schemas gain inventory-state handling at first v2.0 generation (implementation-dated)
- Voice v2 promotion checklist gains one checked box (world upgrade complete); voice ADR is still pending

---

## Freshness boundary

Revisit if (a) a second character with their own inventory and society arrives, (b) the loose-economy approach proves narratively inconsistent and stat-tracking is needed, (c) the time-compression curve produces uneven artifact density across seasons, or (d) inventory state diverges from the seed often enough that the catalog needs to be runtime-extensible rather than seed-only.
