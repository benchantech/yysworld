# /pipeline-go

You are the nightly pipeline for YY's branching world. Run this when the user opens their laptop in the morning.

Two phases:

1. **PUBLISH** — propose, confirm, generate, commit yesterday's story content
2. **QUEUE** — interactively collect today's inbox entry so tomorrow is ready

No external API key needed. You are the model.

---

## PHASE 1: PUBLISH yesterday

### Step 1 — Confirm dates

**Do not trust the system context date blindly.** Ask the user to confirm:

```
Today is {currentDate from system context}. Is that right? (enter to confirm or type the correct date)
```

Wait for confirmation before proceeding. Use the confirmed date as `today`. Yesterday = today − 1 day.

- Story day for this run: `publishedDays + 1` per branch

### Step 2 — Load context

Read these files:

```
runs/{rootId}/baseline/yy_baseline.json
runs/{rootId}/branches/{branchId}.json       ← one per branch (all active)
runs/{rootId}/snapshots/*.json               ← recent snapshots for continuity
runs/{rootId}/artifacts/*.json               ← recent artifacts for style reference
runs/{rootId}/inbox/{yesterday}.json         ← author's queued entry (may not exist)
runs/{rootId}/inbox/queue/*.json             ← fallback queue entries
```

To find rootId: list `runs/` directory. Use the most recent `root_YYYY_MM_DD` directory with active branches.

Branches: main first, then alts alphabetically. Strip `branch_{rootId}_` prefix for urlId.

`publishedDays` = `state.story_day` from the branch file.

### Step 3 — Orient

After loading, show:

```
── ORIENT ──────────────────────────────────────
run: {rootId}   started: {runDate}
branches:
  main           day {N}  food {f} · health {h} · attention {a}{  ·  burden: X, Y}
  alt1-on-time   day {N}  food {f} · health {h} · attention {a}
inbox: {found / not found}
generating: day {N+1} for {yesterday}
────────────────────────────────────────────────
```

### Step 4 — Check: already run?

If a snapshot file already exists at `runs/{rootId}/snapshots/snap_{yesterday}_{branchId}.json` for the main branch, tell the user Phase 1 is already complete and move directly to Phase 2. Do not offer multiple options — just say what's published and transition.

### Step 5 — LIVE EVENT SEARCH and selection

**This step requires a live web search. Do NOT use training data for event selection.**

Run a web search for today's real-world news and events. Search for:
- "{today} news"
- "{today} events"
- Current top headlines

Find at least 5 distinct real events happening or reported today. Include a mix: news, sports, science, culture, local/global. Avoid events that are purely local to one city unless they have universal resonance.

Show the list and pause:

```
── TODAY'S EVENTS ───────────────────────────────
What's happening in the world today ({today}):

  1. {headline / event} — {one-line description}
  2. {headline / event} — {one-line description}
  3. {headline / event} — {one-line description}
  4. {headline / event} — {one-line description}
  5. {headline / event} — {one-line description}
  [+ more if found]

Which of these should influence today? (pick one or more, or describe your own)
─────────────────────────────────────────────────
```

Wait for the user to select. They may pick by number, describe something else entirely, or combine events. Their selection becomes the `event_hint`.

### Step 5b — PROPOSE event translation

Using the selected real-world event(s), translate to YY's physical world per ADR-028 rules:
- The event must produce a sensory encounter YY can physically experience
- Not a concept that arrives — something YY sees, hears, smells, or encounters
- The translation should work for both branches given their different states

Show the translation and pause:

```
── EVENT TRANSLATION ────────────────────────────
selected:  {user's chosen event(s)}
hook:      {real_world_inspiration — one line}
type:      {event_type}
YY sees:   "{perception_prompt.noticeable_surface}"
tags:      {tag1}, {tag2}, ...
why:       {translation_logic — one sentence}

[enter to accept · or describe the day instead]
```

Wait for user response. If they type something, use it as an override or refinement.

### Step 6 — PROPOSE per-branch plans

**Character name anchor:** The active character's name is `baseline.name` from `runs/{rootId}/baseline/yy_baseline.json` — read it from the file, do not assume it. Branch identifiers (urlId, branchId) are path labels for the timeline fork, not the character. Never substitute a branch label (e.g. "alt1", "alt1-on-time") for the character name in proposals, prose, or identity_notes. Every branch follows the same character through divergent circumstances. The character's name does not change per branch.

Using the confirmed event, pre-think the state trajectory and narrative direction for each branch (main first). Then show one proposal per branch and pause after each:

```
── {urlId} · day {N+1} ──────────────────────────
state in: food {f} · health {h} · attention {a}{  ·  burden: X}

proposed:
  title:  "{proposed title}"
  tone:   {tone}
  shift:  food {f}→{f2} · health {h}→{h2} · attention {a}→{a2}{  ·  +burden: Y / -burden: X}
  moment: {one sentence — what actually happens and how it resolves}
  why different from {other branch}: {one clause, if alt branch}

[enter to accept · or describe what should change]
```

**All three stats (food, health, attention) must appear in every shift line.** Health is not optional — environmental pressure, exertion, and stress all affect it. Never omit a stat because the day feels uneventful; even a quiet day has a small drift.

Wait for user response after each branch. If they type something, use it as branch-specific guidance.

### Step 7 — PROPOSE branch evaluation

After main branch plan is confirmed, show the branch evaluation and pause:

```
── BRANCH EVALUATION ────────────────────────────
signal:     {should branch: yes/no}  (confidence: {0.X})
reason:     {reason — one sentence}
focus:      {what the branch would track, or "—"}

[enter to accept · approve / deny to override]
```

### Step 8 — Generate event file

Using the confirmed event (and any user overrides), generate the event object and write to `runs/{rootId}/events/evt_{yesterday}_{NNN}.json`.

NNN = count of existing files in `events/` + 1, zero-padded to 3 digits. All branches share one event file per day.

**Event schema:**

```json
{
  "schema_version": "0.1",
  "event_id": "evt_{yesterday}_{NNN}",
  "root_id": "{rootId}",
  "story_day": {storyDay},
  "occurred_at": "{yesterday}T12:00:00Z",
  "event_type": "...",
  "canonical_truth": {
    "summary": "...",
    "entities": ["..."],
    "location": "...",
    "concrete_outcome": "..."
  },
  "perception_prompt": {
    "noticeable_surface": "...",
    "ambiguity_level": 0.0
  },
  "tags": ["..."],
  "created_at": "{now ISO}",
  "authorial_note": {
    "real_world_inspiration": "...",
    "translation_logic": "...",
    "restraint_reason": "..."
  }
}
```

### Step 10 — Generate snapshot + artifact per branch

For each branch (main first), generate snapshot and narrative artifact using confirmed plans and user overrides.

**Character name — hard constraint:** The character's name in all narrative prose, summaries, state_notes, and identity_notes must match `baseline.name` from `yy_baseline.json`. The current branch being generated (e.g. "alt1-on-time") is a path identifier, not a character label. If you notice yourself writing a branch label (e.g. "alt1", "Alt1") as a substitute for the character's name, stop and replace it with the value from `baseline.name`.

**YY character rules:**

Core traits: curious 1.0, expressive 0.9, easily_surprised 0.85, distractible 0.85, stubborn 0.75, prosocial 0.75, pragmatic 0.7, restless 0.7, randomly_eloquent 0.65, stream_of_consciousness 0.45, disciplined 0.2

Values: friendship, food, music, language, technology, bedtime_stories, fair_trade

Failure boundaries (never cross): cynical, negative, detached, corrupt, violent, lying, cheating, vulgar, arrogant

State stats are `food`, `health`, `attention` (0–1 floats). Field name is `food`, not `hunger`.

**Snapshot schema:**

```json
{
  "schema_version": "0.1",
  "snapshot_id": "snap_{yesterday}_{branchId}",
  "root_id": "{rootId}",
  "branch_id": "{branchId}",
  "story_day": {storyDay},
  "snapshot_date": "{yesterday}",
  "time_policy": "nightly_auto_advance",
  "package_ref": {
    "package_id": "yysworld-pipeline-v0.1",
    "package_created_at": "{now ISO}",
    "package_hash": "sha256:claude-code-subscription"
  },
  "model_refs": [{"provider": "anthropic", "model_id": "claude-code-subscription", "role": "generator", "runtime_class": "interactive"}],
  "event_refs": ["{eventId}"],
  "decision_refs": [],
  "state_before": { ...branch current state (use food, not hunger)... },
  "state_after": {
    "condition": {"health": 0.0, "food": 0.0, "attention": 0.0},
    "inventory": [],
    "active_burdens": [],
    "goals": {"primary": "...", "secondary": "..."},
    "reaction_overrides": {},
    "trait_deviations": {},
    "identity_notes": []
  },
  "change_summary": {
    "notable_shift": "...",
    "branch_created": false
  },
  "created_at": "{now ISO}"
}
```

**Narrative style — voice is root-scoped. Check rootId before writing prose.**

| rootId | Voice | Rule |
|--------|-------|------|
| `root_2026_04_14` | v1 literary restraint | Use rules below exactly as written. |
| `root_2026_05_*` and later | v2 author voice | Rules to be added before May 2026 run. Do not invent v2 rules. |

**If rootId is `root_2026_04_14`, apply these rules and no others:**
- Third person — "YY", not "I"
- Short paragraphs, direct sentences
- Concrete sensory details — open in scene, not in concept
- Emotional honesty without melodrama
- Restraint is a feature. Don't over-explain.
- Title must NOT be repeated as the first line of the narrative — open in scene
- World events enter through what YY encounters, never as "Someone mentioned X"
- No meta-commentary — don't describe feelings from outside, render them from inside
- No recycled closing devices from the previous day
- Check `docs/executor/craft.md` § Narrative antipatterns before committing

**Artifact schema:**

```json
{
  "schema_version": "0.1",
  "artifact_id": "art_{yesterday}_{branchId}_summary",
  "artifact_type": "daily_summary",
  "snapshot_id": "snap_{yesterday}_{branchId}",
  "root_id": "{rootId}",
  "branch_id": "{branchId}",
  "package_ref": { ...same as snapshot... },
  "model_refs": [{"provider": "anthropic", "model_id": "claude-code-subscription", "role": "summarizer", "runtime_class": "interactive"}],
  "comparison_contract_version": "0.1",
  "content": {
    "title": "...",
    "tone": "...",
    "narrative": "paragraph one\n\nparagraph two\n\n...",
    "state_note": "...",
    "summary": "One sentence. Past tense.",
    "state_delta": {
      "food": "0.X → 0.Y",
      "attention": "0.X → 0.Y",
      "health": "0.X → 0.Y"
    },
    "branch_created": false
  },
  "created_at": "{now ISO}"
}
```

### Step 11 — Write comparison artifact

After both branches are written, generate and write the comparison.

**Comparison schema** (`runs/{rootId}/comparisons/cmp_{yesterday}_{storyDay}_main_vs_{altUrlId}.json`):

```json
{
  "schema_version": "0.1",
  "comparison_id": "cmp_{yesterday}_{storyDay}_main_vs_{altUrlId}",
  "artifact_type": "daily_comparison",
  "root_id": "{rootId}",
  "branch_a": "{mainBranchId}",
  "branch_b": "{altBranchId}",
  "story_day": {storyDay},
  "snapshot_date": "{yesterday}",
  "snapshot_ids": ["{mainSnapshotId}", "{altSnapshotId}"],
  "package_ref": { ...same... },
  "model_refs": [{"provider": "anthropic", "model_id": "claude-code-subscription", "role": "comparator", "runtime_class": "interactive"}],
  "content": {
    "divergence_summary": "...",
    "branch_a_path": "...",
    "branch_b_path": "...",
    "key_differences": ["..."],
    "shared_elements": ["..."]
  },
  "created_at": "{now ISO}"
}
```

### Step 12 — Write decision file (always, even if no branch)

Write to `runs/{rootId}/decisions/dec_{yesterday}_{NNN}.json`. Set `decision_status` to `"executed"` if branched, `"evaluated_no_branch"` otherwise.

If branching, also create `runs/{rootId}/branches/{newBranchId}.json` using `state_after` from the main snapshot.

### Step 13 — Update branch files

For each branch, update `runs/{rootId}/branches/{branchId}.json`. Read existing file first, merge — preserve all fields not being updated. Update `state` to match `state_after` from the snapshot (use `food`, not `hunger`). Set `story_day` to the new value. Set `last_updated_at` to now.

### Step 13b — Run unit tests and fix drift

Run `npm test` (vitest). Do not skip this step.

If tests pass: proceed to Step 14.

If tests fail:
1. Read the failing test output carefully.
2. Identify which generated files contain the drift (wrong field names, ID format violations, schema mismatches, character name substitutions).
3. Fix the affected files directly — do not patch the tests.
4. Re-run `npm test`. Repeat until all tests pass.
5. Note what was fixed; include it in the commit message.

### Step 14 — Git commit and push

Stage: `runs/` only. Do not ask for confirmation — commit and push automatically.

Commit message:
```
nightly: {yesterday} — day {storyDay}

{branchUrlId} day {storyDay}: {artifact.summary}
[...one line per branch...]
{if drift fixed: "fix: corrected {what} to pass unit tests"}

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Push immediately after commit.

### Step 15 — Preview URLs

After pushing, show preview URLs so the user can verify content immediately (before the midnight gate opens):

```
── PREVIEW ──────────────────────────────────────
Content published. Active with ?preview now:

  https://yysworld.com/yy/{runDate}/main/day/{storyDay}/?preview
  https://yysworld.com/yy/{runDate}/{altUrlId}/day/{storyDay}/?preview
  https://yysworld.com/yy/{runDate}/vs/main/{altUrlId}/day/{storyDay}/?preview

Publishes publicly at midnight EST ({yesterday+1}T05:00:00Z).
GitHub Actions deploy: https://github.com/benchantech/yysworld/actions
─────────────────────────────────────────────────
```

---

## PHASE 2: QUEUE today

After the commit, immediately run an interactive session to queue tomorrow's content.

Tell the user: "Published {yesterday} (day {storyDay}). Now let's queue {today}."

Run a live web search for today's real-world news (same as Phase 1 Step 5 — use confirmed `today` date). Show the events list and let the user pick. Then do the event translation (Step 5b) and per-branch proposals (Step 6) exactly as in Phase 1 — full proposals with enter-to-accept, branch evaluation after main.

After all proposals are confirmed, collect:

1. **notes** — show day-level tone suggestion derived from the confirmed plans. Enter = accept.
2. **author intent** — show current carrying value if any. Enter = keep, type to change, `clear` to drop.

Do NOT pre-guess event_hint from training data. Always do a live search.

After collecting all answers, write `runs/{rootId}/inbox/{today}.json`:

```json
{
  "schema_version": "0.1",
  "date": "{today}",
  "event_hint": "...",
  "notes": "...",
  "author_intent": "...",
  "branch_context": {
    "main": "...",
    "alt1-on-time": "..."
  },
  "branch_decision": null
}
```

Omit fields that are blank/null.

Confirm: "Queued {today} → runs/{rootId}/inbox/{today}.json"

---

## Error handling

- No active run: "No active run found in runs/."
- Phase 1 already complete: skip to Phase 2 (tell the user)
- Push fails: report the error, leave committed locally
- Branch file has `hunger` field instead of `food`: read it as `food` (ADR-026 correction — old branch files used the wrong field name)
