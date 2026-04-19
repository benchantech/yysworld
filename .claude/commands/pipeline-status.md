# /pipeline-status

Show the current state of the nightly pipeline without generating anything.

Read these files and report:

```
runs/{rootId}/branches/*.json
runs/{rootId}/snapshots/*.json      ← list, don't read contents
runs/{rootId}/inbox/*.json          ← list dates
runs/{rootId}/inbox/queue/*.json    ← list if any
```

Then show:

```
── PIPELINE STATUS ──────────────────────────────
today:     {confirmed or system-context date}
root:      {rootId}

branches:
  {branchId}   story_day {N}   food {f} · health {h} · attention {a}
  {branchId}   story_day {N}   food {f} · health {h} · attention {a}

published snapshots:
  {YYYY-MM-DD}  day {N}   ← list one line per unique snapshot date, most recent first

inbox queued:
  {YYYY-MM-DD}  ← dates with inbox files, mark (used) if snapshot exists for that date
  {YYYY-MM-DD}  ← mark (pending) if no snapshot yet

next to generate:
  date:       {next calendar date with no snapshot}
  story_day:  {current story_day + 1}
  inbox:      {found / not found}

phase 1 status:  {complete / pending}
phase 2 status:  {queued for YYYY-MM-DD / not queued}
─────────────────────────────────────────────────
```

Do not generate, write, or commit anything. Read only.

If the most recent snapshot date is today (same as confirmed today date), note it:
"⚠ today already published — next pipeline run will generate tomorrow's content"

If branch story_day and snapshot count are out of sync, flag it:
"⚠ branch declares day {N} but {M} snapshots found — check for drift"
