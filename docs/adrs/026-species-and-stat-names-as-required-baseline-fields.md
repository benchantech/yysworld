# ADR 026 — species and Stat Names as Required Baseline Fields

- **ID:** YYBW-026
- **Status:** Decided
- **Date:** 2026-04-14
- **Scope:** YY Branching World
- **Depends on:** YYBW-002, YYBW-011, YYBW-012
- **Supersedes / clarifies:** Clarifies YYBW-002 — the baseline schema must be complete before first content generation; any field that could be referenced in surface rendering is required, not optional

---

## Context

On 2026-04-14, two canon integrity failures were caught during first-content validation:

**1. YY's species was absent from `yy_baseline.json`.**

YY is a squirrel. This is established identity. The `yy_baseline.json` file at launch contained `character_id`, `name`, `core_traits`, `values`, `default_reactions`, `failure_boundaries`, and `identity_rules` — but no `species` field. When the stats block and site identity content were built, they had no machine-readable source of truth for species. The squirrel identity was known to the author but not recorded in the canonical baseline.

The fix was a one-line addition: `"species": "squirrel"`. The scar is that this line was absent at all.

**2. The stat surface used "hunger" but the values array said "food".**

`yy_baseline.json`'s `values` array listed `"food"` as a core value — the thing YY cares about. The site stats block and seed artifacts independently used `"hunger"` as the stat name — the dimension being tracked. These are related but distinct: `food` is what YY values, `hunger` is what gets depleted.

The name `hunger` for a stat implies scarcity-framing. `food` is the neutral, values-aligned term. The fix renamed the stat to `food` across `StatsBlock.tsx`, `lib/runs.ts`, seed artifacts, and JSON-LD. The scar is that the divergence was not caught until the stats block made it visible on screen.

Both failures share the same root: **fields that appear in the rendered surface were not present in the baseline at the time artifacts were first generated.** The baseline was calibrated (22-scenario interview, calibration notes present), but it was incomplete for surface rendering.

---

## Decision

### 1. species is a required field in the character baseline

Every character baseline must include a `species` field before any content is generated. The field is a string, lowercase, species name only:

```json
{
  "species": "squirrel"
}
```

`species` must appear in every surface that names or describes the character: the stats block, the character profile page (`/yy/about`), `llms.txt`, and JSON-LD. It is not cosmetic — it is identity.

### 2. Stat names must be derived from the baseline values array, not invented at render time

Stats tracked in snapshots and displayed in `StatsBlock` must use names drawn from or consistent with the `values` array in the baseline. The rule:

- If a stat corresponds to something in `values`, use that name.
- If a stat represents a depletion dimension (e.g., `food` depletes), the stat name is the value being tracked, not a framing label (e.g., `hunger`).
- Stat names are frozen once the first artifact uses them. Renaming requires a correction event logged to the ledger and a search-and-replace across all existing artifacts.

Current stat names (locked as of first artifact, 2026-04-14):

```
food       ← from values["food"]
energy
mood
social
```

Any future stat addition must be approved against the baseline before any artifact uses it.

### 3. The baseline is frozen before first artifact generation

The baseline may be calibrated and revised until the first artifact for a run is generated. Once any artifact file is committed to `runs/`, the baseline for that run is frozen for the current YY version. Changes to identity fields at that point constitute a version increment under YYBW-011.

The calibration process must explicitly verify that all surface-rendering fields are present before marking the baseline as ready for artifact generation:

- [ ] `species` present
- [ ] `values` array matches stat names in snapshot schema
- [ ] `core_traits` complete
- [ ] `failure_boundaries` complete
- [ ] `calibration_notes` documents any removed or revised traits

This is not a code check — it is an author responsibility. It should be verified by reading the baseline against the snapshot schema before committing the first artifact.

---

## Why

**A baseline is a contract, not a sketch.** The 22-scenario calibration established YY's psychological profile with precision. The same rigor must apply to identity fields. `species` is not a detail — it is the first thing a reader or AI agent needs to construct a mental model of YY.

**Drift is invisible until it appears on screen.** The `hunger` vs `food` divergence existed from the first commit. It was only caught when the stats block rendered side by side with the values. In a system designed for immutable truth, invisible drift is the worst kind — it accumulates silently and must be corrected retroactively, generating noise in the artifact history.

**Stat names are schema.** Once an artifact uses `"food": 7`, all downstream code (StatsBlock, comparisons, pipeline generation) assumes `food` is the key. Treating stat names as informal and mutable is a schema without versioning — the worst combination.

---

## Alternatives considered

1. **Allow species to be inferred from narrative content.** Rejected. Inference is not truth. The baseline is the machine-readable source of truth for all character properties. If it is not in the baseline, it does not officially exist in the system, regardless of what any narrative says.

2. **Keep "hunger" as the stat name; add a separate "food" dimension.** Two stats for the same underlying dimension adds noise without signal. The values array establishes the correct vocabulary. Use it. Rejected.

3. **Add a JSON Schema validator to the pipeline that enforces required fields.** Correct direction, but not yet implemented. The current enforcement is this ADR — a documented rule that the author checks before first artifact generation. A schema validator would be the right future implementation.

---

## Reversals / scars preserved

- The `hunger` → `food` rename required corrections to `StatsBlock.tsx`, `lib/runs.ts`, `jsonld.ts`, both seed artifact JSON files, and the snapshot files. This is the correction event. Future readers: the original stat name was `hunger`; it was renamed to `food` on 2026-04-14 to align with the `values` array. No ledger entry was required because no pipeline-confirmed artifacts had been produced under `hunger` — the correction happened before the first real pipeline run.
- The absence of `species` from the baseline is recorded here. The field was added on 2026-04-14 as a one-line correction. Because no artifacts under the incomplete baseline had been pipeline-confirmed, this is not a version increment under YYBW-011 — it is a pre-launch correction. Future baselines must not require this correction.

---

## Consequences

- `yy_baseline.json` now includes `species: "squirrel"` and is the authoritative source for YY's species.
- Stat names `food`, `energy`, `mood`, `social` are locked for the current YY version. New stats require baseline amendment and YYBW-011 versioning.
- The author must verify the baseline completeness checklist before committing the first artifact of any new run or YY version.
- A future schema validator in the pipeline should enforce required baseline fields automatically. Until then, this ADR is the enforcement mechanism.

---

## Invariants preserved

Canon integrity via species as a required machine-readable field; Immutable truth via frozen stat names from first artifact forward; Surface simplicity via a single vocabulary (values array = stat names) rather than two parallel naming systems.

---

## Freshness boundary

Revisit if a second character is introduced — their baseline schema should derive from this one but may need additional required fields. Revisit when a JSON Schema validator is added to the pipeline — at that point the checklist in §Decision 3 should be replaced by a schema test.
