# ADR-039 — Voice v1 → v2 Transition: Promotion at the May 2026 Root Boundary

**Status:** Accepted
**Date:** 2026-05-01
**Refs:** ADR-034 (voice versioning system), ADR-028 (narrative antipatterns), ADR-029 (world seed and yy_version), ADR-038 (world v2.0)

---

## Context

ADR-034 established voice as root-scoped: a root declares `voice_version` once at creation and does not revise it mid-run. v1 (literary restraint, no dialogue) rode out the April root; v2 (author voice — dialogue, physical comedy, food puns, food-state register) lived as `docs/voice/v2-draft.md` pending promotion.

Between the original v2-draft (ADR-034, 2026-04-19) and this transition, the rules absorbed substantial additions:

- Active subject, not passive landscape
- Permission to surprise
- Attention before interpretation
- Small failures stay
- YY may narrate (not just react)
- No children's-book smoothing
- Target reader band: 9–12 active, 13–18 interested
- Ending shape (small transfer, not moral)

These were authored against the same v2 register and are codified in `docs/voice/v2.md`.

---

## Decision

### 1. Promote v2

Renamed `docs/voice/v2-draft.md` → `docs/voice/v2.md`. From this date forward, any root declaring `voice_version: "v2"` reads `v2.md` as the authoritative voice rules.

ADR-034's promotion checklist is satisfied:

- [x] Rules written
- [x] First example approved by author (food 0.33, wry-whine, 2026-04-19)
- [x] Second example drafted at high food band (food 0.78, cheeky-curious with Bramble, 2026-05-01)
- [x] World upgrade for the May root complete (ADR-038, world v2.0)
- [x] ADR for the v1→v2 transition (this document)
- [x] Target root's `yy_baseline.json` declares `voice_version: "v2"`

### 2. May root declares v2

`runs/root_2026_05_01/baseline/yy_baseline.json` declares `voice_version: "v2"` at root creation. Per ADR-034, this declaration is immutable for the life of the root.

### 3. April root unchanged

`runs/root_2026_04_14/baseline/yy_baseline.json` continues to declare `voice_version: "v1"`. No retrofit. Per ADR-034 §Why not just update the current voice, mid-run register changes are forbidden — that scar is preserved.

### 4. yy_version concept clarified

ADR-029 §6 anticipated declaring `yy_version: "1.1"` in the new root's baseline alongside a `docs/yy/voice-v1.1-draft.md` voice register. ADR-034 (later) introduced the `voice_version` mechanism with files in `docs/voice/`, which has been the live system through April. The April baseline declares `voice_version: "v1"` only and does not declare `yy_version`.

This ADR confirms ADR-034's mechanism is the live one. The May baseline declares `voice_version: "v2"` only. `docs/yy/voice-v1.1-draft.md` is preserved as historical reference but is not read by the pipeline. If a future root needs separate trait-era versioning, it gets a fresh ADR.

### 5. Second example written under v2.0 world rules

Example 2 (Bramble in late spring) is set in the v2.0 world (ADR-038) — anthropomorphic neighbors, barter, NE-anchored geography. It demonstrates:

- Active subject construction (every clause has an actor)
- Dialogue between YY and a named neighbor (new under v2)
- Permission to surprise ("A tree," YY guessed)
- Capital emphasis used sparingly (NEVER, once)
- One light food pun (going rate has *risen*)
- Ending shape (small transfer — what YY is carrying home)
- Target reader band — middle-grade-readable, YA-engaging

This is the first reference example that exercises both voice v2 and world v2.0 in combination, which is the configuration the May root will run.

---

## What this does not do

- Does not retrofit `voice_version` to anything in the April run
- Does not freeze v2 — additional rules may be added with another ADR if patterns emerge during the May run
- Does not change ADR-029's status — the yy_version reconciliation in §4 is a clarification, not a supersession
- Does not commit to a specific voice for the next-after-May root — that root authors its own decision

---

## Consequences

- `docs/voice/v2.md` is the authoritative voice file
- `docs/voice/v2-draft.md` no longer exists
- `runs/root_2026_05_01/baseline/yy_baseline.json` declares `voice_version: "v2"`
- ADR-034 remains a historical record of the versioning system; this ADR closes the v1→v2 promotion gate it left open
- Future root baselines may declare any active voice version (currently `v1` or `v2`)

---

## Freshness boundary

Revisit if (a) the May run reveals voice rules that need codification, (b) a new world version introduces register implications voice v2 cannot carry, or (c) the high-food-band example proves under-tested in actual generation and needs replacement before any v3 work begins.
