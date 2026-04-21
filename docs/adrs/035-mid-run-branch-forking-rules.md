# ADR 035 — Mid-Run Branch Forking Rules

- **ID:** YYBW-035
- **Status:** Decided
- **Date:** 2026-04-21
- **Scope:** YY Branching World / pipeline, navigation, comparison
- **Depends on:** YYBW-004 (branches arise from acquisitions), YYBW-023 (temporal accuracy), YYBW-024 (time-gated publication)
- **Supersedes / clarifies:** Extends YYBW-004 to cover branches that fork mid-run rather than at run start

## Context

The first two branches in `root_2026_04_14` (main, alt1-on-time) were created at the start of the run and have content from day 1. On day 7, a third branch (`alt2-migration`) was forked from main to explore a divergent path: YY follows the migration column east at full sprint, crosses the boundary for the first time, and finds wild honeycomb in an unmapped clearing.

This created a class of branch the system had not previously encountered: a branch whose `created_at` is mid-run rather than at the run start. Several assumptions in the codebase treated `branch.created_at` as a proxy for the run date, which broke artifact lookup for mid-run branches entirely — `getDayArtifact` returned null for all alt2 content because the branch's `created_at` (`2026-04-20`) did not match the run date (`2026-04-14`).

## Decision

### 1. Run identity comes from `root_id`, not `created_at`

A branch belongs to a run if `branch.root_id` matches, regardless of when the branch was created. The `created_at` field on a branch records when that fork was made; it is not the run start date. Any code that verifies run membership must use `root_id`, not `created_at`.

### 2. A branch's first published day is authoritative

`branch.dayReleaseAts` is indexed from day 1 regardless of when the branch forked. Days before the branch's first artifact have an empty string at those indices. The first non-empty index defines `firstPublishedDay`. Navigation and comparison must respect this boundary.

### 3. Pre-fork navigation is non-interactive, not hidden

On the day page branch switcher, branches that have not yet forked on the current day are shown as a disabled block with the label "forks day N". They are visible — so readers know the branch exists — but carry no link. On the day strip, pre-fork cells render as `—` (em dash) rather than a day number, with `title="branch starts day N"`.

The rationale: hiding branches entirely before their first day would make them invisible until the reader stumbles onto day 7. Showing them as inert makes the fork a visible event in the timeline.

### 4. Comparisons start from `max(firstDayA, firstDayB)`

A comparison between two branches is only meaningful once both have content. The `/compare` page stat chart, the vs page "by day" links, and the vs page DayNavigator all start from `firstComparisonDay = max(branchFirstDay(A), branchFirstDay(B))`. For main vs alt2-migration, this is day 7.

Days before `firstComparisonDay` are not shown in any comparison surface — not as empty bars, not as dead links, not as placeholders.

### 5. Time gating works normally for mid-run branches

A mid-run branch's `releaseAt` is derived from `snapshot.snapshot_date` exactly as for any other branch (midnight EST the following day). The gate opens at the right time regardless of when the branch was forked.

## Why

- **Run identity from `root_id`**: `created_at` on a branch is an event timestamp; treating it as a run identifier was a category error. `root_id` is explicit and stable.
- **Pre-fork visible but inert**: the fork is a narrative event. Hiding alt2 on days 1–6 would make the timeline harder to read; showing it as "not yet" is informative. Linking it to day 7 was confusing (reader could jump forward involuntarily); inert is correct.
- **Comparisons from firstComparisonDay**: a chart with 6 empty alt bars before the first data point misrepresents the divergence. The comparison starts where the story actually splits.

## Alternatives considered

1. **Backfill days 1–6 for alt2 with inherited main state** — rejected; fabricating data for days the branch did not exist violates immutable truth (YYBW-012).
2. **Hide alt2 entirely until day 7** — rejected; readers navigating days 1–6 would not know the branch exists, making the fork feel abrupt rather than anticipated.
3. **Link pre-fork branch switcher to day 7** — initially implemented; rejected after user feedback. Clicking a branch on day 1 and landing on day 7 is disorienting. Inert is better.

## Consequences

- `getDayArtifact` uses `root_id` for run verification (not `created_at`)
- `branchFirstDay()` helper derived from `dayReleaseAts.findIndex` is used across day page, compare page, and vs page
- `getStaticRuns` currently derives `runDate` from the first branch file's `created_at` — this works only because the first branch alphabetically (alt1-on-time) was created at run start; future runs should not rely on this ordering and should use `root_id` as the canonical source
