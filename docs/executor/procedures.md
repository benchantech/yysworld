# Executor Procedures Reference

Operational how-to reference for AI executors working on YY Branching World.
Read CLAUDE.md first. Return here when performing a specific operation.

---

## AI executor responsibilities

When working on any task in this project:

1. Read canon and manifests first.
2. Determine whether the task changes truth, projection, or presentation.
3. Never overwrite source truth in place.
4. When uncertain, create a proposal artifact rather than mutating canon.
5. Preserve timestamps and provenance metadata.
6. Prefer structured outputs over long prose unless prose is explicitly required.
7. Track which YY version, root, branch, and event any generated artifact belongs to.
8. Mark stale outputs clearly when dependencies change.
9. Avoid widening scope casually.
10. Leave a scar record when reversing a previous assumption.

---

## Change taxonomy

Use the correct change type before touching anything.

### Canon change
Examples: YY v1.1 introduced, voice profile changes, baseline trait model refined.

Action:
- append new canonical version
- compute YY version diff
- do not rewrite old roots silently

### Story change
Examples: new monthly root, new branch, new event day, branch extension.

Action:
- append ledger events
- refresh projections
- compute diffs as needed

### Projection change
Examples: branch comparison page improved, manifest refreshed, feed card layout changed.

Action:
- rebuild projection/artifact
- preserve dependency metadata

### Correction
Examples: a generated branch day was wrong, a diff was stale or malformed.

Action:
- append correction/supersession events
- rebuild affected projections
- preserve the original

---

## Diff policy

### Always valuable
- branch vs root
- YY version vs previous YY version

### Often valuable
- sibling branch vs sibling branch
- selected historical comparisons

### Optional / lazy
- rare pairwise branch comparisons not yet viewed or featured

Diffs are artifacts. Cache them.

---

## Nightly pipeline

The nightly pipeline is driven by the `/pipeline-go` skill. The steps below are a high-level summary — follow the skill for authoritative procedure.

1. Confirm today's date with the author (do not trust system context date)
2. Load baseline, branch files, recent snapshots
3. Orient: show branch states and publishing status
4. Resolve targetDate (check for existing snapshots)
5. Search for real-world events on targetDate
6. Propose event translation per ADR-028
7. Propose per-branch plans (all three stats required — ADR-033)
8. Evaluate branch signal
9. Generate event, snapshot, artifact, comparison, decision files
10. Update branch files
11. Run `npm test` — fix drift before committing
12. Commit and push `runs/` only
13. Trigger post-midnight rebuild

For full schema specs, see `docs/pipeline/schemas.md`.  
For narrative antipatterns, see `docs/executor/craft.md`.  
For schema decisions, see `docs/adrs/`.

---

## Naming conventions

### Run file paths (active patterns)

```
runs/{rootId}/baseline/yy_baseline.json
runs/{rootId}/events/evt_{YYYY-MM-DD}_{NNN}.json
runs/{rootId}/decisions/dec_{YYYY-MM-DD}_{NNN}.json
runs/{rootId}/snapshots/snap_{YYYY-MM-DD}_{branchId}.json
runs/{rootId}/artifacts/art_{YYYY-MM-DD}_{branchId}_summary.json
runs/{rootId}/comparisons/cmp_{YYYY-MM-DD}_{storyDay}_main_vs_{altUrlId}.json
runs/{rootId}/branches/branch_{rootId}_{name}.json
```

### ID examples

- rootId: `root_2026_04_14`
- branchId: `branch_root_2026_04_14_main`, `branch_root_2026_04_14_alt1-on-time`
- eventId: `evt_2026-04-27_015`
- decisionId: `dec_2026-04-27_013`
- snapshotId: `snap_2026-04-27_branch_root_2026_04_14_main`

### NNN counter

Zero-padded to 3 digits. Count of existing files of that type in the directory + 1 at time of generation. Note: early decision files (days 1–3) have a NNN collision — `_001` appears three times. See ADR-037.

### Slugs
Use stable, human-readable slugs where practical for published artifacts.

### Timestamps
Always store full timestamps in UTC; render local/story time separately.
