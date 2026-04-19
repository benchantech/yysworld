# ADR-034 — Voice Versioning: Root-Scoped Narrative Register with Iterative Evolution

**Status:** Accepted  
**Date:** 2026-04-19  
**Affects:** pipeline-go, craft.md, yy_baseline.json, docs/voice/

---

## Context

On April 19, 2026, the author compared the pipeline's generated narrative prose against a reference bedtime story written in their own voice for YY. The pipeline's v1 register — literary restraint, no dialogue, quiet movement, no puns — was functional but flat relative to the author's actual YY voice, which is warmer, more physical, dialogue-driven, and built around sparse food puns and a canonical catchphrase.

The question was how to adopt the author's voice for future stories without disrupting the current run (`root_2026_04_14`), which had already published six days in v1. Mid-story register changes were ruled out immediately: readers tracking YY through April would feel the seam, and the narrative would lose coherence.

This ADR documents the voice versioning system adopted as a result and the specific v1→v2 transition planned for the May 2026 root.

---

## Decision: Voice is root-scoped

The narrative register for a root is declared once, at root creation, and does not change for the life of that root. The declaration lives in `yy_baseline.json` as a `voice_version` field. The pipeline reads this field and loads the corresponding voice file from `docs/voice/`.

This is the same principle applied to branching and state: decisions made at root initialization propagate forward; they are not revised retroactively. A voice is a commitment, not a setting.

---

## System structure

```
docs/voice/
  v1.md           ← complete rules for v1, applied to root_2026_04_14
  v2-draft.md     ← rules for v2, not active until renamed v2.md
  vN-draft.md     ← future drafts follow same pattern
```

**Rules:**
- Only non-draft files are ever applied. The pipeline ignores files ending in `-draft.md`.
- A draft is promoted by renaming it. The rename is the activation gate — no other mechanism.
- Each new voice version gets an example narrative approved by the author before promotion.
- Each transition gets an ADR entry.
- The new root's baseline declares the new version at creation time.

---

## v1 — literary restraint (`root_2026_04_14`)

Third person. No dialogue. Quiet, sensory movement. Restraint as a feature. Events arrive through physical encounter, never through announcement. No puns, no capital emphasis, no catchphrases.

Rides out through the end of `root_2026_04_14` without modification.

---

## v2 — author voice (pending, `root_2026_05_*`)

Codified from the author's reference material and three questions answered in session:

**Register:** Third person. YY speaks — short, reactive dialogue. Physical comedy is the default movement vocabulary. Warmth through contrast. Tension resolves through action, not reflection.

**Food puns:** One per narrative, two maximum under genuine duress. Sparse landing is the point — one reads as character, three compete. Desperation scales with food stat (see register table in `docs/voice/v2-draft.md`).

**Food-state register:** YY's voice shifts with his `food` stat. At 0.6+, curious and cheeky. At 0.3–0.59, wry whine — still witty, starting to bemoan. At 0.0–0.29, openly bemoaning — puns urgent and a little pathetic, YY knows it and leans in. The whine never tips into defeat.

**Catchphrase:** "When in doubt, get myself out!" — canonical, reusable, earns recognition over time. Applied when YY commits to a self-preservation decision under pressure. Never forced.

**What changed from v1:** Dialogue added. Physical comedy replaces quiet movement. Puns introduced (sparse). Capital emphasis for genuine surprise. Inner mantra permitted. Endings resolve in action, not observation.

**What stayed the same:** Third person. Opens in scene. Events through physical encounter. No meta-commentary. No recycled closers. ADR-028 antipatterns apply.

---

## Why not just update the current voice

Changing register mid-run has two costs:

1. **Reader coherence.** A reader following April YY has built an expectation. The prose switches register and the story feels like a different narrator arrived. This is not a subtle difference — v1 YY never speaks; v2 YY speaks in the first sentence.

2. **Provenance.** The pipeline's canon integrity principle requires that generated artifacts be reproducible from their declared inputs. If the voice changes mid-run, artifacts from day 1 and artifacts from day 10 of the same root cannot be regenerated with the same rules. The root's truth record becomes ambiguous.

Waiting for a root boundary costs nothing except patience. The May root was already planned.

---

## Promotion checklist for v2

- [x] Rules written in `docs/voice/v2-draft.md`
- [x] Example narrative written and approved by author (food 0.33, wry-whine register)
- [ ] Rename `v2-draft.md` → `v2.md`
- [ ] Create `runs/root_2026_05_*/baseline/yy_baseline.json` with `voice_version: "v2"`
- [ ] Run first day of new root to confirm voice applies correctly
