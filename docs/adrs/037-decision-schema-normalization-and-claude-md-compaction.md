# ADR-037 — Decision Schema Normalization and CLAUDE.md Compaction

**Status:** Accepted  
**Date:** 2026-04-27  
**Refs:** ADR-026 (stat naming), ADR-028 (event translation), ADR-032 (character name), ADR-033 (stat completeness)

---

## Context

On 2026-04-27, a full audit of all pipeline-generated files in `runs/root_2026_04_14/` was performed across 125 JSON files. Two structural issues were found. A third observation was documented as intentional historical drift.

---

## Finding 1 — Decision file schema drift (days 3–9)

Decision files from days 3–9 (2026-04-15 through 2026-04-22) were generated with five incompatible field name patterns:

| File | Schema style | Problem |
|------|-------------|---------|
| `dec_2026-04-15_001` | flat `signal` / `confidence` / `reason` | No `branch_signal` wrapper |
| `dec_2026-04-16_001` | flat `signal` / `confidence` / `reason` | No `branch_signal` wrapper |
| `dec_2026-04-18_004` | `signal_strength` + `evaluation` object | Different key names and nesting |
| `dec_2026-04-19_005` | flat `signal` / `confidence` / `reason` | No `branch_signal` wrapper; uses `snapshot_date` not `decision_date` |
| `dec_2026-04-20_006` | `branch_evaluation` wrapper | Different wrapper name; missing `decision_date` |
| `dec_2026-04-21_007` | `branch_evaluation` wrapper | Different wrapper name; uses `snapshot_date` not `decision_date` |
| `dec_2026-04-22_008` | `evaluated_branches` / `signal_strength` / `branch_focus` | Three non-standard field names |

Days 10–14 (2026-04-23 onwards) already use the canonical `branch_signal` schema.

`dec_2026-04-14_001` is an intentional exception: it is an author-created branch-inception decision with a bespoke schema (`decision_type`, `proposed_mutation`, `signaled_by`). It represents a human authorial act, not a pipeline output, and must not be normalized.

### Why this happened

The pipeline skill was written before the decision schema was formally specified. Each early session improvised a reasonable-looking structure. Once `branch_signal` was established via the existing ADR pattern (days 10+), the earlier files were never retroactively normalized.

### Why it matters

The pipeline reads branch files at runtime, not decision files — so the inconsistency causes no immediate functional failure. However:
- A downstream system that parses decisions to reconstruct branch history will fail on the inconsistent files
- The schema inconsistency is a provenance reliability problem: the record of why each branch decision was made cannot be queried uniformly
- GEO / AI-agent discoverability of the decision record is degraded

### Decision

Normalize the 7 non-standard decision files to the `branch_signal` schema. Preserve all content (reason, confidence, focus) — only restructure the field names. `dec_2026-04-14_001` is preserved as-is.

For files where `event_refs` or `snapshot_refs` were absent (days 6, 7, 8, 9), set to empty arrays rather than fabricating IDs.

**Canonical decision schema going forward:**
```json
{
  "branch_signal": {
    "should_branch": false | true,
    "confidence": 0.0–1.0,
    "reason": "...",
    "focus": null | "..."
  }
}
```

---

## Finding 2 — NNN counter collision in early decision IDs

`dec_2026-04-14_001`, `dec_2026-04-15_001`, and `dec_2026-04-16_001` all have `NNN = 001`. The NNN counter was supposed to be globally sequential within the decisions directory.

The IDs remain unique because they are prefixed with the date (`dec_YYYY-MM-DD_NNN`). No functional breakage occurs.

### Decision

Do not rename the files. The IDs are unique and renaming would require updating all references across the codebase and would silently alter the provenance record. Document as known early-generator drift. The pipeline spec already says "NNN = count of existing files + 1" — this produces correct sequential values for all days after day 4.

---

## Observation — `story_day` in early snapshot `state_before`

Snapshots for days 1–5 (April 14–18) include a `story_day` field inside `state_before`. This field does not appear in the snapshot schema spec and does not appear in any snapshot from day 6 onward.

The early generator included it; a later revision removed it. The field is harmless — the authoritative `story_day` is at the top level of the snapshot, not inside `state_before`. 

### Decision

Do not remove the field from historical snapshots. Silent mutation of historical truth records violates canonical invariant 2. Document as known early-version drift. The field may safely be ignored by any consumer.

---

## CLAUDE.md compaction

The 2026-04-27 review also rationalized `CLAUDE.md` and its supporting docs:

1. **Section 4 (AI executor responsibilities) moved to `docs/executor/procedures.md`** — the 10 executor rules belong with operational procedures, not the project identity document. CLAUDE.md routes to procedures.md.

2. **`docs/pipeline/schemas.md` created** — canonical JSON schemas extracted from the inline pipeline skill into a referenceable document. The skill continues to carry inline schemas (the executor needs them); the schemas doc serves as a compact reference for debugging and non-pipeline tasks.

3. **`docs/executor/procedures.md` updated** — naming conventions corrected to match actual run file patterns; executor responsibilities section added.

4. **`docs/adrs/` added to CLAUDE.md reference docs** — ADRs are the live reasoning record for every schema and pipeline decision. Executors must be able to find them from the project entry point.

---

## What this does not change

- No narrative content or branch state is altered
- No canonical invariants are changed
- No test files are modified — all 167 tests continue to pass
- The `/pipeline-go` skill schema definitions remain authoritative for generation; this ADR's schemas doc is a companion reference, not a replacement
