# ADR 023 — Temporal Accuracy: Pipeline Timing, Run ID Scheme, and the Day-Zero Exception

- **ID:** YYBW-023
- **Status:** Decided
- **Date:** 2026-04-14
- **Scope:** YY Branching World
- **Depends on:** YYBW-009, YYBW-012, YYBW-022
- **Supersedes / clarifies:** Amends YYBW-022 §"Internal data references" — date-based root IDs are now also used for internal identifiers, not only public URLs

---

## Context

On 2026-04-14, the first real content was written for the April run. During setup, two questions surfaced simultaneously:

1. **When should Day 1 appear on the site?** The event occurred on April 14. The overnight pipeline had not yet run. Setting `story_day: 1` immediately would publish Day 1 on the same calendar day the event occurred — which violates the pipeline's natural timing.

2. **How should internal run identifiers be structured?** The existing directory was `root_2026_04` (month-based). YYBW-022 explicitly left internal identifiers unchanged while scoping that ADR to public URLs only. Under examination, month-based internal IDs create naming collisions if a run starts mid-month or if two runs occur in the same month — the same ambiguity that was rejected for public URLs.

These two questions are separate but share a common root: **temporal honesty**. The identifier scheme and the publication state both need to accurately reflect when things actually happened.

---

## Decision

### 1. The nightly pipeline owns `story_day` increments

`story_day` in a branch file records the number of days that have completed the full pipeline cycle:

```
event occurs on date D
  → author logs event (same day)
  → nightly pipeline runs overnight D → D+1
  → pipeline writes artifact, increments story_day, triggers rebuild
  → Day N becomes visible starting D+1
```

`story_day` is never incremented manually ahead of the pipeline. Content written today is not visible today. The site always reflects up to yesterday's completed day.

**Today (April 14):** `story_day: 0`. No days published. The pipeline runs tonight.  
**Tomorrow (April 15):** pipeline sets `story_day: 1`. Day 1 (event date April 14) becomes visible.

### 2. Root IDs are date-based

Internal run identifiers use full start dates, not month slugs:

```
root_2026_04_14    ← started April 14
root_2026_04_20    ← hypothetical restart April 20 (no collision)
root_2026_05_01    ← May run
```

All child IDs follow suit:

```
branch_root_2026_04_14_main
snap_2026-04-14_branch_root_2026_04_14_main
art_2026-04-14_branch_root_2026_04_14_main_summary
```

The full date is used in every context — public URL, internal identifier, and file path — because a run starts on a specific day, not a specific month.

### 3. The day/0 build stub (a named exception)

With `story_day: 0`, `getDayParams()` returns `[]`. Next.js 16 with `output: export` fails to build if a dynamic route's `generateStaticParams` returns an empty array. This is a framework constraint, not a design choice.

The workaround: when no days are published, `generateStaticParams` returns a stub entry with `day: '0'` for each active run. The page at `/yy/2026-04-14/main/day/0` renders:

```
Apr 2026 run
Day 1 available tomorrow.
```

It is not linked from anywhere, not in the sitemap, and not indexed. Once `story_day` reaches 1, the stub is never generated again. This exception is expected to occur exactly once per run — on the day the run is set up before the first overnight pipeline cycle.

The stub is a framework accommodation, not a content decision. The user-facing state it produces is honest: nothing has been published yet.

---

## Why

**One day behind:** The pipeline exists because LLM generation happens overnight and must process the day's completed events. A day is not done while it is still happening. Publishing on the same day the event occurred would require either running the pipeline intraday (expensive, breaks the nightly cadence) or publishing unprocessed content (breaks immutability and canon integrity).

**Temporal accuracy over appearance:** Setting `story_day: 1` on April 14 — before the pipeline ran — would have made the site look active sooner. It would also have been a lie. The artifact existed, but it had not gone through the pipeline's generation and provenance step. The branch file's `state` must reflect pipeline-confirmed truth, not author-side drafts.

**Date-based root IDs:** Month encoding was a convenience shorthand that failed the same test as month-only public URLs (rejected in YYBW-022). A run starts on a specific day. Its identifier should say so. Flexibility to restart on any day is not a hypothetical: the author may want to restart if a month's arc finishes early, if a significant real-world event warrants a fresh root, or if the pipeline fails and a clean slate is preferable. Month IDs make that awkward; date IDs make it natural.

**Named exception rather than silent workaround:** The `day/0` stub could have been implemented without documentation. Leaving it undocumented would mean a future reader of the codebase would find a `day: '0'` sentinel and have no idea why it exists or when it goes away. Naming it here makes the workaround transparent and bounded.

---

## Alternatives considered

1. **Publish Day 1 on April 14 (set `story_day: 1` immediately).** Rejected. Violates the pipeline-owns-publication invariant. Creates a precedent where manual override of `story_day` is acceptable, which erodes trust in the state field as a reliable source of truth.

2. **Run the pipeline intraday on setup day only.** Rejected. One-time special-case pipeline runs are operationally risky and require reasoning about partial state. The overnight cadence exists specifically to avoid partial-day content.

3. **Skip the day/0 stub; accept that the site has no day routes during pre-publication.** The build would fail under Next.js 16's `output: export` constraint. Rejected as non-viable.

4. **Add a catch-all 404 fallback route instead of the day/0 stub.** Static export has no runtime; a 404 fallback still requires at least one pre-generated path. Rejected for the same reason.

5. **Keep month-based root IDs for internal use.** YYBW-022 left this open intentionally to avoid scope creep. On examination, the ambiguity risk is real — not hypothetical — and the cost of the rename was low while the data was still shallow. Rejected once the flexibility argument was tested against the first real restart scenario.

6. **Allow two runs on the same start date using a suffix (`root_2026_04_14b`).** Considered and left as a soft constraint. The invariant "one run per start date" is not enforced in code; it is a practical constraint. If two runs on the same day are ever needed, the `b` suffix is the escape hatch. Not documented as a hard rule.

---

## Reversals / scars preserved

- YYBW-022 stated: *"Internal data references using `root_2026_04` IDs remain unchanged."* That statement is superseded by this ADR. The rename was deferred in YYBW-022 to keep scope narrow; it is resolved here.
- The `story_day: 14` placeholder in the original branch file was seed data committed during infrastructure setup. It was never pipeline-confirmed truth. It has been corrected and this ADR records why.

---

## Consequences

- The nightly pipeline is the sole authority for incrementing `story_day`. Manual increments are a canon violation.
- The `day/0` stub must be removed from `generateStaticParams` logic if the framework constraint is ever lifted (e.g., if a future Next.js version handles empty `generateStaticParams` gracefully with `output: export`).
- All future run directories, branch files, snapshot files, and artifact files use `root_YYYY_MM_DD` naming.
- The `/yy` character page must handle the zero-days state gracefully and communicate "starting tomorrow" rather than showing a broken or empty run card.
- The sitemap must never include `day/0` paths.

---

## Invariants preserved

Immutable truth via pipeline-owned publication; Timestamping via full-date run IDs; Transparency via the named day/0 exception; Discipline via the one-day-behind model as a hard boundary, not a soft default.

---

## Freshness boundary

Revisit the day/0 stub if Next.js `output: export` behaviour changes for empty `generateStaticParams`. Revisit the one-day-behind model only if intraday pipeline runs become economically viable and operationally stable.
