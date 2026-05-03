# ADR-041 — Pipeline v0.2: Minimal Context Loading and Carry-Forward Discipline

**Status:** Accepted
**Date:** 2026-05-03
**Affects:** `/pipeline-go` skill, `pipeline/lib/files.ts`, `docs/pipeline/schemas.md`, `package_id` written into all snapshots/artifacts/comparisons going forward

---

## Context

Each `/pipeline-go` run was loading more files than the prior day:

- `runs/{rootId}/snapshots/*.json` (one wildcard, growing N per run)
- `runs/{rootId}/artifacts/*.json` (same)
- `runs/{rootId}/inbox/queue/*.json` (same)

The skill described these as "recent" but did not bound the recency. As a run grew from day 3 toward the typical monthly horizon set by ADR-003, the per-day token cost grew with it — even though the only state actually needed to write day N+1 lives in two files: the **branch file** (current `state` + `identity_notes` carryover) and **yesterday's artifact** (last day's prose, for voice continuity).

Older snapshots are an audit trail, not a context input. Older artifacts have already been distilled into the branch file's `identity_notes`. Older events are settled — yesterday's event-anchor lives in yesterday's artifact's `world_anchor`. Re-reading any of these every morning relitigates settled history and inflates token burn linearly with run length.

---

## Decision

Bump the pipeline package to **v0.2** and tighten three things:

1. **Step 2 loads a fixed, capped set of files.** Always: baseline + active branch files. Per-branch, capped at one prior day: yesterday's artifact only. Optional, only if it exists for today: `inbox/{targetDate}.json` (no glob fallback). Everything else — `snapshots/`, older `artifacts/`, `events/`, `comparisons/`, `decisions/` — is **not loaded** unless the user explicitly asks. Look-back hard cap: 1 day by default, never more than 2 prior days without explicit user direction.

2. **Step 10 enforces carry-forward discipline.** The next day's run will only see `branches/{branchId}.json` + this day's artifact. So:
   - `state_after.identity_notes` must be 2–4 lines: yesterday's tail beat, today's beat, any standing thread that outlives today.
   - `state_after.inventory` and `active_burdens` are the durable record of anything that persists past today.
   - The artifact's `narrative` is the only prose tomorrow's run sees. Voice cues that should propagate must appear there.

3. **`package_id` becomes `yysworld-pipeline-v0.2`.** New snapshots, artifacts, and comparisons stamp v0.2; existing v0.1 files are not rewritten (immutable truth, invariant 2). The bump exists so the author can roll back or re-tighten in v0.3 if quality drops, and so the provenance trail makes the change visible.

`PIPELINE_VERSION` and `PACKAGE_ID` constants in `pipeline/lib/files.ts` move to `0.2` / `yysworld-pipeline-v0.2`. The schema reference in `docs/pipeline/schemas.md` and the schema block in `pipeline-go.md` follow.

---

## Why Not Leave As-Is

The cost of unbounded context loading is not theoretical. By day 30 of a monthly root, a wildcard read of `snapshots/` and `artifacts/` is roughly 60 files of dense JSON, the largest of which contain multi-paragraph narrative prose. Most of that content cannot inform tomorrow's writing — narrative continuity is anchored by yesterday alone, and state continuity is already captured in the branch file. The pipeline was paying for re-reading content that had already been compressed into the branch state.

The carry-forward discipline is the other half of the change. If `identity_notes` is allowed to drift toward minimal stubs, then tomorrow's run lacks the context it needs and has to reach further back — re-introducing the cost we just removed. Pinning the discipline on the writer side (today's run) keeps the reader side (tomorrow's run) cheap.

---

## What This Is Not

- Not a schema break. The shape of every file is unchanged. Only `package_ref.package_id` changes for newly written files. Tests do not pin the old value.
- Not a reduction in canon integrity or audit. All snapshots, comparisons, decisions, and events continue to be written and committed exactly as before. They remain available for explicit lookup, debugging, post-hoc analysis, or museum exports — they are simply not loaded into normal pipeline runs.
- Not a change to the proposal/confirmation discipline. Steps 5–7 still pause for author input. The token savings come from what the pipeline reads, not from what the author confirms.

---

## Rollback

If quality drops on v0.2, the change is reversible:

- Set `PACKAGE_ID = 'yysworld-pipeline-v0.1'` and `PIPELINE_VERSION = '0.1'` in `pipeline/lib/files.ts`.
- Restore Step 2's wildcard reads in `.claude/commands/pipeline-go.md`.
- Roll the schema-doc reference back to v0.1.

Files written under v0.2 keep their v0.2 stamp — they are truth, not configuration. The `package_id` becomes the in-the-record signal of when the tightened context regime was active.
