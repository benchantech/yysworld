# ADR-031 — `source_event` as Required Event Field

**Status:** retired  
**Date:** 2026-04-16  
**Retired:** 2026-04-19  
**Scar type:** retroactive schema patch — never fully implemented

---

## Retirement note

The `source_event` field was planned and a unit test was written for the schema shape, but it was never added to actual event files. Event files continued to use `authorial_note.real_world_inspiration` (prose string) as the real-world anchor. The `source_event` test in `schema-fields.test.ts` tested a helper function in isolation — it did not validate the real data files.

On 2026-04-19 the gap was identified: the ADR, the test, and the real event files were all divergent. Rather than retroactively patch six event files with a field that adds overhead without current use, the decision was made to retire the ADR and remove the orphaned test.

If a structured real-world event index becomes necessary for querying or cross-branch drift detection in a future root, revisit with a fresh ADR that reflects actual usage patterns at that time.

---

---

## Context

Event files (`runs/{rootId}/events/evt_*.json`) record the real-world inspiration for each story day in `authorial_note.real_world_inspiration` as a prose string. This was sufficient to understand a single event in isolation but insufficient for:

1. **Querying across days** — "what events did I pick across the run?" requires parsing natural-language strings
2. **Cross-branch drift detection** — without a structured anchor, different branches could silently drift to different real-world events if the pipeline is run with inconsistent inputs; there is no machine-readable field to compare
3. **Provenance for readers and AI agents** — the `llms.txt` and public JSON layer should be queryable by event, not just by day

The gap was discovered on Day 3 (2026-04-16) when the author asked "are we cataloging the events I'm picking?" The answer was: loosely, in prose. That is not sufficient.

---

## Decision

Add `source_event` as a required top-level field in every event file.

**Schema:**

```json
"source_event": {
  "headline": "Short, human-readable event name",
  "date": "YYYY-MM-DD",
  "category": "politics | civic | science | culture | sports | other",
  "secondary": "Optional secondary event if two real-world events influenced the day"
}
```

Rules:
- `headline` and `date` are required
- `category` is required; use one of the controlled values above
- `secondary` is optional; use when two real-world events co-influenced the day (as in Day 2)
- The field records the event **as selected by the author**, not the event as translated into YY's world — the translation lives in `canonical_truth` and `authorial_note`
- `date` is the real-world date the event occurred or was reported, not the pipeline run date

---

## Retroactive patch

Days 1, 2, and 3 (root `root_2026_04_14`) were written before this field existed. The field has been added retroactively to all existing event files. The prose in `authorial_note.real_world_inspiration` was the source of truth for the retroactive values; nothing was invented.

Each patched file carries this ADR reference in a `schema_patch` field:

```json
"schema_patch": {
  "added_at": "2026-04-16T09:30:00Z",
  "added_by": "ADR-031",
  "reason": "source_event field did not exist at time of original creation"
}
```

This is not a correction to canonical truth — no event identity, state data, or narrative content was changed. This is a schema extension.

---

## Consequences

- All future pipeline runs must populate `source_event` at event generation time (Step 9)
- The pipeline prompt has been updated implicitly by this ADR; executors reading it should treat `source_event` as required
- Cross-branch drift is now detectable: if two event files for the same story day have different `source_event.headline` values, that is an error
- The field enables a future "real-world timeline" view alongside YY's story
