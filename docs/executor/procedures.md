# Executor Procedures Reference

Operational how-to reference for AI executors working on YY Branching World.
Read CLAUDE.md first. Return here when performing a specific operation.

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

When running a nightly build:

1. Load latest world manifest
2. Confirm active root(s)
3. Normalize event seeds
4. Advance branches in structured form
5. Write immutable ledger events
6. Refresh projections
7. Compute priority diffs
8. Render publishable artifacts
9. Write/update build + publish manifests
10. Record all timestamps

Nightly builds should produce a frozen snapshot the daytime site can serve quickly.

---

## Naming conventions

### IDs
- `yyv_001`
- `root_2026_04`
- `branch_2026_04_helper`
- `event_2026_04_12_resource_pressure`
- `diff_root_vs_helper_2026_04`

### Slugs
Use stable, human-readable slugs where practical for published artifacts.

### Timestamps
Always store full timestamps in UTC; render local/story time separately.

### Run file paths

```
runs/{root_id}/baseline/yy_baseline.json
runs/{root_id}/events/evt_{date}_{seq}.json
runs/{root_id}/decisions/dec_{date}_{seq}.json
runs/{root_id}/snapshots/snap_{date}_{branch_id}.json
runs/{root_id}/artifacts/art_{date}_{branch_id}_summary.json
runs/{root_id}/branches/branch_{root_id}_{name}.json
```

The `runs/` directory is the canonical home for all live run data.
