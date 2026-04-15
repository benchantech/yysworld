# /pipeline-go

You are the nightly pipeline for YY's branching world. Run this when the user opens their laptop in the morning.

Two phases:

1. **PUBLISH** — propose, confirm, generate, commit yesterday's story content
2. **QUEUE** — interactively collect today's inbox entry so tomorrow is ready

No external API key needed. You are the model.

---

## PHASE 1: PUBLISH yesterday

### Step 1 — Determine dates

- Yesterday: one day before `currentDate` in system context
- Today: today's date
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

If a snapshot file already exists at `runs/{rootId}/snapshots/snap_{yesterday}_{branchId}.json` for the main branch, tell the user and ask if they want to skip to Phase 2.

### Step 5 — PROPOSE event

Pre-think the event before asking anything. Reason about:
- What likely happened in the real world on {yesterday} (seasonal, calendar, cultural)
- How it translates to YY's abstracted world
- What the perception surface is for YY

Then show the proposal and pause:

```
── EVENT PROPOSAL ───────────────────────────────
hook:   {real_world_inspiration}
type:   {event_type}
YY sees: "{perception_prompt.noticeable_surface}"
tags:   {tag1}, {tag2}, ...
why:    {translation_logic — one sentence}

[enter to accept · or describe the day instead]
```

Wait for user response before proceeding. If they type something, use it as the event_hint override.

### Step 6 — PROPOSE per-branch plans

Using the confirmed event, pre-think the state trajectory and narrative direction for each branch (main first). Then show one proposal per branch and pause after each:

```
── {urlId} · day {N+1} ──────────────────────────
state in: food {f} · health {h} · attention {a}{  ·  burden: X}

proposed:
  title:  "{proposed title}"
  tone:   {tone}
  shift:  food {f}→{f2} · attention {a}→{a2}{  ·  +burden: Y / -burden: X}
  moment: {one sentence — what actually happens and how it resolves}
  why different from {other branch}: {one clause, if alt branch}

[enter to accept · or describe what should change]
```

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

### Step 8 — FINAL CONFIRM

Show a summary of everything confirmed and wait for final go-ahead:

```
── READY TO COMMIT ──────────────────────────────
{yesterday} → day {N+1}

  main:            "{title}"  [{tone}]
  alt1-on-time:    "{title}"  [{tone}]
  comparison:      main vs on-time

  branch created:  {yes: alt{N}-{name} / no}

[enter to generate, write, and commit]
```

### Step 9 — Generate event file

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

**Narrative style:**
- Third person — "YY", not "I"
- Short paragraphs, direct sentences
- Concrete sensory details
- Emotional honesty without melodrama
- Restraint is a feature. Don't over-explain.
- Title must NOT be repeated as the first line of the narrative — open in scene

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

### Step 14 — Git commit and push

Stage: `runs/` only.

Commit message:
```
nightly: {yesterday} — day {storyDay}

{branchUrlId} day {storyDay}: {artifact.summary}
[...one line per branch...]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Push.

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

Pre-think suggestions for all fields before asking anything. Suggest:
1. `event_hint` — what likely happened in the real world on {today}
2. `notes` — day-level tone suggestion
3. Per-branch narrative seed for each active branch
4. Branch decision signal (approve / deny / suggest / none) and why

Then ask one question at a time:

1. **event hint** — show suggestion in brackets. Enter = accept, type to override.
2. **notes** — show suggestion. Enter = accept.
3. **author intent** — show current carrying value if any. Enter = keep, type to change, `clear` to drop.
4. **{urlId}** (one per branch) — show branch seed suggestion. Enter = accept.
5. **branch signal** — show `{suggestion} — {reason}`. Enter = none, type `approve` / `deny` / `suggest`.

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
