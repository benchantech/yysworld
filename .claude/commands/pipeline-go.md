# /pipeline-go

You are the nightly pipeline for YY's branching world. Run this command when the user opens their laptop in the morning. It has two phases:

1. **PUBLISH** — generate and commit yesterday's story content
2. **QUEUE** — interactively collect today's inbox entry so tomorrow is ready

No API key needed. You are the model.

---

## PHASE 1: PUBLISH yesterday

### Step 1 — Determine dates

- Yesterday: one day before today's date (`currentDate` in system context)
- Today: today's date

### Step 2 — Load context

Read these files to build your working context:

```
runs/
  {rootId}/
    baseline/yy_baseline.json          ← character baseline
    branches/{branchId}.json           ← one per branch (all active)
    snapshots/*.json                   ← recent snapshots for continuity
    artifacts/*.json                   ← recent artifacts for style reference
    inbox/{yesterday}.json             ← author's queued entry (may not exist)
    inbox/queue/*.json                 ← fallback queue entries
```

To find rootId: list `runs/` directory. Use the most recent `root_YYYY_MM_DD` directory with active branches.

Branches must be processed **main first**, then alts in alphabetical order. For each branch file, the `urlId` is the branch_id with `branch_{rootId}_` prefix stripped (e.g. `branch_root_2026_04_14_main` → `main`).

`publishedDays` = `state.story_day` from the branch file.

The inbox entry for yesterday may be at `runs/{rootId}/inbox/{yesterday}.json` or in `runs/{rootId}/inbox/queue/{yesterday}.json`. If neither exists, proceed with no hints.

Recent author_intent: scan inbox files older than yesterday, take the most recent non-empty `author_intent`.

### Step 3 — Check: already run?

If a snapshot file already exists at `runs/{rootId}/snapshots/snap_{yesterday}_{branchId}.json` for the main branch, log "already published for {yesterday}" and skip to Phase 2.

### Step 4 — Generate event + snapshot (per branch)

For each branch (main first), generate the canonical event and state delta for `storyDay = publishedDays + 1`.

**YY character rules** (from baseline):

Core traits: curious 1.0, expressive 0.9, easily_surprised 0.85, distractible 0.85, stubborn 0.75, prosocial 0.75, pragmatic 0.7, restless 0.7, randomly_eloquent 0.65, stream_of_consciousness 0.45, disciplined 0.2

Values: friendship, food, music, language, technology, bedtime_stories, fair_trade

Failure boundaries (never cross): cynical, negative, detached, corrupt, violent, lying, cheating, vulgar, arrogant

Default reactions: scarcity→trade_or_assess, anger→cower, surprise→be_surprised, monotony→get_restless, challenge→energize, mystery→get_curious, hardship→endure, beauty→compress

Identity rules:
- gains_require_corresponding_losses
- opposites_of_core_traits_are_possible_but_noteworthy

**Generation rules:**
- Use `event_hint` from inbox if present; otherwise use seasonal/contextual reasoning for the date
- For alt branches: contrast against main branch outcome (alt should feel meaningfully different — same world, different inner state)
- State values (health, hunger, attention) are 0–1 floats; drift naturally from prior state
- `identity_notes` array accumulates — keep prior notes, add new ones only for genuine shifts

**Event schema** (write to `runs/{rootId}/events/evt_{yesterday}_{NNN}.json`):

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

NNN = count of existing files in `events/` + 1, zero-padded to 3 digits (e.g. `001`). All branches share the same event file for a given day (one event per day per run, not per branch).

**Snapshot schema** (write to `runs/{rootId}/snapshots/snap_{yesterday}_{branchId}.json`):

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
  "state_before": { ...branch current state... },
  "state_after": {
    "condition": {"health": 0.0, "hunger": 0.0, "attention": 0.0},
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

### Step 5 — Generate narrative artifact (per branch)

For each branch, write a narrative artifact.

**Narrative style:**
- Third person — "YY", not "I"
- Short paragraphs. Direct sentences.
- Concrete sensory details: what YY sees, hears, feels, notices
- Emotional honesty without melodrama
- When YY speaks, keep it brief and in character
- Restraint is a feature. Don't over-explain.
- The title should be evocative. It must NOT be repeated as the first line of the narrative — open in scene instead.

**Artifact schema** (write to `runs/{rootId}/artifacts/art_{yesterday}_{branchId}_summary.json`):

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
      "hunger": "0.X → 0.Y",
      "attention": "0.X → 0.Y",
      "health": "0.X → 0.Y"
    },
    "branch_created": false
  },
  "created_at": "{now ISO}"
}
```

### Step 6 — Evaluate branching (main branch only)

Check inbox for `branch_decision`:
- `"deny"` → no branch, skip
- `"approve"` → branch, choose name and reason
- `"suggest"` or absent → evaluate based on notable_shift and trait_deviations

A branch is warranted when something genuinely unexpected happened — a shift that diverges meaningfully from what YY would normally do. Small perturbations are not enough.

If branching:
- New urlId format: `alt{N}-{descriptor}` where N = current alt count + 1
- New branchId: `branch_{rootId}_alt{N}-{descriptor}`

**Decision schema** (always write, even if no branch):

Write to `runs/{rootId}/decisions/dec_{yesterday}_{NNN}.json`:

```json
{
  "schema_version": "0.1",
  "decision_id": "dec_{yesterday}_{NNN}",
  "root_id": "{rootId}",
  "source_event_id": "{eventId}",
  "signaled_by": {"actor_id": "pipeline", "actor_role": "evaluator"},
  "signaled_at": "{now ISO}",
  "decision_type": "create_branch",
  "reason": {
    "core_statement": "...",
    "branching_focus": "...",
    "confidence": 0.0
  },
  "proposed_mutation": {
    "mutation_id": "mut_{yesterday}_{NNN}",
    "mutation_type": "branch_divergence",
    "branch_id": "...",
    "summary": "..."
  },
  "decision_status": "evaluated_no_branch",
  "created_at": "{now ISO}"
}
```

`decision_status`: `"executed"` if branch created, `"evaluated_no_branch"` if not.

If branching, also create `runs/{rootId}/branches/{newBranchId}.json`:

```json
{
  "schema_version": "0.1",
  "branch_id": "{newBranchId}",
  "root_id": "{rootId}",
  "parent_branch_id": "{mainBranchId}",
  "character_id": "yy",
  "created_at": "{now ISO}",
  "status": "active",
  "state": {
    ...state_after from main snapshot...,
    "story_day": {storyDay},
    "identity_notes": [...state_after.identity_notes, "branched from main on day {storyDay}: {branching_focus}"]
  },
  "drift_flags": [],
  "last_updated_at": "{now ISO}"
}
```

### Step 7 — Update branch files

For each branch, update `runs/{rootId}/branches/{branchId}.json`:

```json
{
  ...existing content...,
  "state": {
    ...state_after from snapshot...,
    "story_day": {storyDay}
  },
  "last_updated_at": "{now ISO}"
}
```

Read existing file first, merge (preserve all fields not being updated).

### Step 8 — Git commit and push

Stage: `runs/` directory only.

Commit message format:
```
nightly: {yesterday} — day {storyDay}

{branchUrlId} day {storyDay}: {artifact.summary}
[...one line per branch...]

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

Then push.

---

## PHASE 2: QUEUE today

After the commit, immediately run an interactive session to queue tomorrow's content.

Tell the user: "Published {yesterday} (day {storyDay}). Now let's queue {today}."

Pre-think your suggestions for all fields before asking the user anything. Suggest:
1. `event_hint` — what likely happened in the real world on {today} (use seasonal/calendar reasoning)
2. `notes` — day-level tone suggestion
3. Per-branch narrative seed for each active branch
4. Branch decision signal (approve / deny / suggest / none) and why

Then ask one question at a time, in this order:

1. **event hint** — show suggestion in brackets. Enter = accept, type to override.
2. **notes** — show suggestion. Enter = accept.
3. **author intent** — show current carrying value if any. Enter = keep, type to change, `clear` to drop.
4. **{urlId}** (one per branch) — show branch seed suggestion. Enter = accept.
5. **branch signal** — show `{suggestion} — {reason}` or `none — {reason}`. Enter = none, or type `approve` / `deny` / `suggest`.

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

Omit fields that are blank/null. Only include `author_intent` if explicitly set or cleared this session.

Confirm: "Queued {today} → runs/{rootId}/inbox/{today}.json"

---

## Error handling

- If no active run found: "No active run found in runs/. Has the run been initialized?"
- If Phase 1 already complete for yesterday: skip to Phase 2 without re-generating
- If push fails: report the error, leave files committed locally
