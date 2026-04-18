# ADR-032 — Character Name Anchoring: Prevents Branch-ID Drift into Narrative

**Status:** Accepted  
**Date:** 2026-04-18  
**Affects:** pipeline-go, narrative generation, all artifact and snapshot content

---

## Context

On Day 4 (2026-04-17), the alt1-on-time branch artifact and snapshot used "Alt1" and "alt1" as the character's name throughout the narrative and identity_notes. The canonical character name is "YY", established in `runs/root_2026_04_14/baseline/yy_baseline.json` and ADR-002.

The branch identifier `alt1-on-time` is a path label — it identifies which timeline fork is being rendered, not who the character is. Both branches follow the same character, YY, through divergent circumstances. The character's name never changes based on which branch is active.

---

## Why It Happened

This was context drift inside a single pipeline session, not a logic error in the schema or template.

During the nightly run, the pipeline processes branches sequentially: main first, then alts. When generating the alt1-on-time narrative, the session context included the branch identifier "alt1-on-time" prominently in file paths, branch labels, and the ORIENT block. The pipeline prompt at Step 6 labels proposals by urlId ("alt1-on-time"), and comparison artifacts reference the branch pair as "main vs alt1-on-time."

By the time the generator reached prose production for the alt branch, "alt1" had accumulated enough salience in context that it surfaced as a character label. The session had no explicit anchor pulling it back to the baseline name. The main branch ran first with "YY" correctly and no drift occurred there — because "main" carries no character-like connotation. "alt1" does, superficially: it reads like a name placeholder.

The failure is subtle. The model knows the character is YY. But when branch labels are the last referent in context, they can substitute silently into generation slots that expect a proper noun.

---

## Why We Fixed It Retroactively

The Day 4 alt1-on-time artifact and snapshot are canon-level truth records. Leaving "alt1" as a character name in those files would mean every downstream reader — the website, future pipeline runs loading continuity, any LLM reading prior snapshots for style — would inherit the wrong name. The drift would compound: Day 5 context would include Day 4 identity_notes with "alt1", making the next session more likely to repeat or deepen the error.

This is exactly the class of error ADR-030 anticipates: drift that is real, detectable, and correctable without retroactive rewrite of intent. The events and states are accurate. Only the character label was wrong. We corrected the label.

The correction is recorded here as a scar record per executor responsibility §10 of CLAUDE.md.

---

## Decision

1. **Retroactive correction applied** (2026-04-18): All instances of "Alt1" and "alt1" used as a character name in `art_2026-04-17_branch_root_2026_04_14_alt1-on-time_summary.json` and `snap_2026-04-17_branch_root_2026_04_14_alt1-on-time.json` replaced with "YY".

2. **Character name must be derived from baseline**: The active character's name in all narrative prose and identity_notes must always equal `baseline.name` read from `yy_baseline.json` at pipeline runtime. Branch IDs and urlIds are path identifiers, never character labels. The name is not assumed to be "YY" — it is read from the file, making this rule portable to any future root with a different character.

3. **Pipeline-go enforcement**: The pipeline-go command now carries an explicit character name anchor at Step 6 and Step 10. Before generating any prose, the character name is resolved from `baseline.name` and stated as a hard constraint. Branch labels (urlId, branchId) are explicitly distinguished from the character name in the prompt.

---

## Consequences

- Day 4 alt1-on-time content is corrected and canon-consistent.
- Future pipeline sessions have an explicit anchor preventing this class of drift.
- The distinction between branch identifier (path label) and character name (person label) is now a named invariant, not an implicit assumption.
- Any future correction of this type follows this same pattern: correct the content, write a scar-record ADR, add a pipeline constraint.
