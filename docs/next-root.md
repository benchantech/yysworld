# Next Root — Placeholder

**Target start:** ~2026-05-01  
**Voice:** v2 (pending promotion of `docs/voice/v2-draft.md`)  
**Status:** Not started

---

## Before the first pipeline run

- [ ] Rename `docs/voice/v2-draft.md` → `docs/voice/v2.md`
- [ ] Create `runs/root_2026_05_01/` (or whichever date the run begins)
- [ ] Create `runs/root_2026_05_01/baseline/yy_baseline.json` with `voice_version: "v2"`
- [ ] Create `runs/root_2026_05_01/branches/branch_root_2026_05_01_main.json` (fresh state)
- [ ] Decide: carry over alt1-on-time into new root, or start fresh with one branch?
- [ ] Decide: what is the new root's arc / time horizon?
- [ ] Update `llms.txt` with new root entry

## Open questions

- Does the new root continue YY's story from where April ended, or is it a fresh arc?
- Does the east boundary / grey squirrel thread carry over?
- Does alt1-on-time's territory map carry forward as prior knowledge?

## Voice v2 promotion checklist (from ADR-034)

- [x] Rules written
- [x] Example approved
- [ ] Rename draft → v2.md
- [ ] Baseline declares voice_version: "v2"
- [ ] First day confirms voice applies correctly
