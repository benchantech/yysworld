# YY Voice — v2 (author voice) — DRAFT

**Applies to:** First root declared with `voice_version: "v2"` in its baseline  
**Status:** Draft — do NOT apply until renamed to `v2.md`

---

## Register

Third person. YY speaks aloud. Short, reactive dialogue. Physical energy. Warmth and humor through contrast. Tension resolves through action, not reflection.

---

## Always-on rules

- **YY speaks.** Dialogue is short and reactive. YY exclaims, asks, squeaks, mutters. One or two lines per scene beat — not speeches.
- **Food puns: one per narrative, two maximum under duress.** They are YY's primary linguistic reflex but land best when sparse. One well-placed pun reads as character; three compete with each other and dilute the effect. Resist adding a second unless the scene genuinely earns it.
- **Capital emphasis for genuine surprise.** SHINY, SNAP, LARGE — used sparingly so they land. One or two per narrative maximum.
- **Physical comedy is the default movement vocabulary.** YY scampers, darts, gulps, gasps, freezes, squints. Quiet movement is the exception, not the rule.
- **"When in doubt, get myself out!"** is a canonical catchphrase. Use it when YY makes a self-preservation decision under pressure. Do not force it — it earns its place by being the moment YY commits to action. Reuse builds recognition over time.
- Open in scene, not in concept. First sentence places YY physically and in motion.
- Title must not repeat as the first line.
- World events enter through what YY encounters — something seen, heard, touched. Never through an announcement.
- No recycled closing devices across days.

---

## Food-state register

YY's voice shifts with his `food` stat. Read `state_before.condition.food` before writing.

| food stat | register |
|-----------|---------|
| 0.6 – 1.0 | Curious, energetic, cheeky. Puns land lightly. YY is enjoying himself. |
| 0.3 – 0.59 | Starting to whine and bemoan, but still wry and witty. Puns get more food-focused and slightly desperate. YY notices he's hungry and isn't shy about it. |
| 0.0 – 0.29 | Bemoaning openly. Puns are urgent and a little pathetic — YY knows it and leans in. Still cheeky, never defeated. The desperation is the joke. |

The whine never tips into self-pity or negativity (failure boundary). YY complains the way someone complains who fully expects things to improve.

---

## What this voice does not do

- No detached literary observation. YY is in the scene, not watching it.
- No meta-commentary. Render from inside.
- No italicized interior thought without an active referent.
- No defeat, cynicism, or genuine despair — even at food 0.0.

---

## Antipatterns (ADR-028)

Scar rules from `docs/executor/craft.md` § Narrative antipatterns apply across all voice versions. Check before committing.

---

## Reference example

*food 0.33 (wry whine register), day 7 hypothetical — approved by author 2026-04-19*

---

The bark on the counting tree was warm before YY had finished his first stretch of the morning.

He pulled his paw back. The heat had come back. He could feel it through his feet before he'd gone twenty steps — the kind of hot that made foraging feel like a personal insult. YY squinted at the canopy. The canopy did not apologize.

He went west anyway. A squirrel had to eat.

The west spot produced three acorns and what appeared to be half a pinecone. YY held it up and looked at it.

"You are *barely* a snack," he informed it. "You know that?"

He ate it anyway.

On the way back, a CRACK — somewhere behind him, close. YY went absolutely still. His ears rotated. Another sound. Something large, moving slow.

He did not wait to confirm.

*When in doubt, get myself out!*

YY was back at the treehouse before he'd finished the thought, panting in the doorway, pinecone already a memory.

He caught his breath. Looked out at the east boundary, just visible through the gap in the trees. The grey squirrel's offer — still sitting there, unresolved.

*Tomorrow,* he thought. Then he lay down to rest.

---

## Promotion checklist

Before renaming this file to `v2.md`:
- [x] At least one example narrative written and approved by author
- [ ] ADR written for the v1→v2 transition
- [ ] Target root's `yy_baseline.json` declares `voice_version: "v2"`
