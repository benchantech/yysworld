# ADR 024 — Time-Gated Publication Replaces Deploy-Gated story_day

- **ID:** YYBW-024
- **Status:** Decided
- **Date:** 2026-04-14
- **Scope:** YY Branching World
- **Depends on:** YYBW-009, YYBW-020, YYBW-023
- **Supersedes / clarifies:** Amends YYBW-023 §"The nightly pipeline owns story_day increments" — the pipeline still writes artifacts, but publication is now time-gated client-side, not deploy-gated via story_day

---

## Context

YYBW-023 established that `story_day` in a branch file records the number of days that have completed the full pipeline cycle, and that "the nightly pipeline is the sole authority for incrementing `story_day`." The implied model was:

```
pipeline runs overnight
  → increments story_day
  → triggers a site rebuild
  → rebuilt site reveals the new day to visitors
```

When the first real artifact was written on 2026-04-14, this model was tested against the actual constraints:

1. **Static export has no runtime.** The site builds to static files at deploy time. If publication requires a deploy, every overnight pipeline run must trigger a Vercel rebuild. That is viable but brittle — a failed deploy silently stalls publication.

2. **The artifact already contains the release date.** Every artifact file carries `snapshot_date` (the date the event occurred). The correct release time — midnight EST of the day after `snapshot_date` — is fully derivable from data already in the artifact. No separate deploy or `story_day` increment is needed to know when to reveal the content.

3. **Content embedded at build time is not a secret.** The static build embeds all artifact content — the gate is UX, not a data access boundary. Withholding content until midnight is a product decision about when to surface it, not a security constraint. A lightweight client-side time check is the right mechanism for this.

These three observations together make the deploy-gated model unnecessary. The pipeline still writes artifacts and updates branch state, but publication is now controlled by a client-side time comparison against a `releaseAt` field derived from the artifact.

---

## Decision

### 1. The pipeline writes artifacts; the artifact controls its own release time

The pipeline's role is unchanged: it runs overnight, generates the artifact for the completed day, writes it to `runs/`, and updates the branch file's `story_day` for bookkeeping. What changed is what `story_day` does: it is now a record of pipeline-confirmed days, not a publication gate.

Publication is controlled by `releaseAt`, a field derived at artifact read time:

```
releaseAt = midnight EST of (snapshot_date + 1 day)
           = new Date(Date.UTC(year, month-1, day+1, 5, 0, 0)).toISOString()
```

This is computed in `lib/runs.ts:releaseAtFromSnapshotDate()` and passed to the `GatedArticle` client component.

### 2. GatedArticle is the publication gate

`GatedArticle` is a client component that runs this check on mount:

```
visible = (?preview present) OR (Date.now() >= new Date(releaseAt).getTime())
```

Before the gate opens, it renders: *"Available after midnight."*  
After the gate opens, it renders the full artifact content.

The gate opens without a redeploy. Visitors who load the page before midnight see the placeholder; those who load after midnight see the content. No pipeline action, no rebuild, no deploy required for the transition.

### 3. story_day is retained as a consistency check, not a gate

`story_day` in the branch file is still incremented by the pipeline each run. It serves as:
- a human-readable count of how many days have been processed
- a consistency check (if `story_day` and the number of artifact files disagree, something went wrong)
- a potential signal for `generateStaticParams` if the day/1 stub logic is ever revisited

It is not the publication gate. Code must not use `story_day` to determine whether to show content.

### 4. The gate is a UX boundary, not an auth boundary

Content is embedded in the static build at deploy time. `?preview` bypasses the gate (see YYBW-025). A determined user can read the raw JSON artifact or inspect the page source before midnight. This is acceptable — the product is not paywalled or access-controlled. The midnight gate reflects the natural cadence of the product ("yesterday's day becomes visible today") and is a UX convention, not a security control.

When the product moves to Vercel's auth layer (a future state noted in `GatedArticle`'s comment), this may change. That transition will warrant a new ADR at that time.

---

## Why

**Simplicity over correctness theater:** The deploy-gated model required the pipeline to trigger a rebuild, the rebuild to succeed, and Vercel to propagate the new static files — three failure points, all in the overnight window when no one is watching. A time comparison has zero failure points for the publication event itself.

**The data already knows when it should be visible:** `snapshot_date` is in every artifact. Deriving `releaseAt` from it is a one-line calculation. Adding a pipeline step to control publication when the answer is already in the data is unnecessary indirection.

**Preserves the one-day-behind cadence:** The product contract from YYBW-023 — "events from yesterday become visible today" — is fully preserved. The implementation mechanism changed; the user-facing behavior did not.

---

## Alternatives considered

1. **Keep the deploy-gated model; trigger a Vercel deploy from the pipeline.** Viable but fragile. A failed overnight deploy silently stalls publication. The pipeline's job is to generate artifacts, not to manage deploys. Rejected in favor of decoupling generation from publication timing.

2. **Use Next.js ISR (Incremental Static Regeneration) with a revalidation interval.** ISR requires a server runtime, which conflicts with `output: export` and the static-first constraint from YYBW-017. Rejected as incompatible with current infrastructure.

3. **Keep story_day as the gate; rebuild on story_day increment.** This is the YYBW-023 model. Rejected — see §Why above.

4. **Use a server-side route with auth to gate content.** Appropriate when content is genuinely private. Not appropriate here — this is a UX cadence gate, not access control. Over-engineering for the current requirement. Noted as the correct path if auth is introduced.

---

## Reversals / scars preserved

- YYBW-023 stated: *"story_day is never incremented manually ahead of the pipeline"* and *"the nightly pipeline is the sole authority for incrementing story_day."* Both statements remain true for `story_day` as a counter. What is superseded: the implication that `story_day` is the publication gate. That role is now held by `releaseAt` in the artifact.
- The day/0 stub described in YYBW-023 was also superseded by this change. `getDayParams()` now scans artifact files directly; any artifact file creates a static route. The day/1 stub (not day/0) is the pre-content placeholder. This is the natural consequence of switching from `story_day`-based routing to artifact-based routing.

---

## Consequences

- The pipeline must write `snapshot_date` accurately on every artifact. It is the source of truth for `releaseAt`. An incorrect `snapshot_date` will cause the wrong release time.
- `story_day` remains in branch files and is incremented by the pipeline, but must not be used as a display gate in any component.
- `GatedArticle` and `GatedComparison` carry a comment noting the gate will be replaced with proper auth when moving to Vercel. That migration will require a new ADR.
- The static build embeds all artifact content regardless of `releaseAt`. This is intentional and acceptable under the current non-auth model.

---

## Invariants preserved

Temporal honesty via `releaseAt` derived directly from `snapshot_date`; Pipeline authority over artifact generation preserved; User-facing one-day-behind cadence unchanged; Simplicity via removal of a deploy dependency from the publication path.

---

## Freshness boundary

Revisit when auth is introduced (Vercel auth layer or equivalent). At that point the gate becomes a true access control and the static-embed model must change. Also revisit if `output: export` is abandoned in favour of a server runtime — ISR becomes available at that point.
