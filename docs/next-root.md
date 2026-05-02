# Next Root — Status

**Target start:** 2026-05-01 (`root_2026_05_01`)
**Voice:** v2 (active — see `docs/voice/v2.md`, ADR-039)
**World:** v2.0 (active — see ADR-038, `runs/root_2026_05_01/world-seed.json`)
**Status:** Authoring complete. Pipeline implementation gate remains.

---

## Pre-pipeline checklist

- [x] Rename `docs/voice/v2-draft.md` → `docs/voice/v2.md` (ADR-039)
- [x] World v2.0 template at `docs/templates/world-seed.json` (ADR-038)
- [x] ADR-038 — world v2.0 supersedes v1.1
- [x] ADR-039 — voice v1 → v2 promotion
- [x] `runs/root_2026_05_01/world-seed.json` authored
- [x] `runs/root_2026_05_01/baseline/yy_baseline.json` declares `voice_version: "v2"`
- [x] Pipeline reads v2.0 world seed (`pipeline/lib/context.ts → loadWorldSeed`, `pipeline/lib/generate.ts → worldSection`)
- [x] Pipeline reads voice file (`pipeline/lib/context.ts → loadVoiceText`)
- [x] Pipeline carries inventory state — `BranchInventoryEntry[]` typed, snapshot tool emits objects, artifact prompt shows inventory delta
- [x] `runs/root_2026_05_01/branches/branch_root_2026_05_01_main.json` (empty inventory)
- [x] `runs/root_2026_05_01/branches/branch_root_2026_05_01_alt1-with-feather.json` (holds `heron_feather`)
- [ ] Update `llms.txt` with new root entry
- [ ] First day confirms voice and world apply correctly

## Branch plan for May

- **Main:** flat start, no inventory
- **Alt1:** holds `heron_feather` from Day 1 — see branch hypothesis in `runs/root_2026_05_01/world-seed.json`

## Implementation notes (closed)

- **Inventory shape:** `BranchInventoryEntry { id, label, acquired_day?, tradeable?, notes? }` — matches the convention already in April's main branch file. Catalog ids preferred when applicable; novel finds get fresh ids.
- **Inventory delta in artifact prompt:** computed from set-difference of `state_before.inventory` vs `state_after.inventory` by `id`.
- **Seasonal lookup:** `pipeline/lib/generate.ts → currentSeason()` reads `worldSeed.seasonal_arc.schedule[].days` ranges and matches the current `storyDay`.
- **April compatibility:** `loadWorldSeed` skips files with `world_version: "1.0"`, so April's retroactive seed is ignored as intended (ADR-029 §3).
- **Voice fallback:** `loadVoiceText` returns `null` if no `voice_version` is declared or the file is missing — `systemPrompt` then falls back to the original v1-style narrative-style block.

## When ready

Run `/pipeline-go` to fire Day 1.
