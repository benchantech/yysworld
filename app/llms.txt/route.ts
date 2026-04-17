/**
 * Generated llms.txt — the AI agent entry point for yysworld (ADR-021).
 *
 * Built at static-export time from live data so it never drifts from the
 * actual ADR list, published days, artifact titles, or comparison summaries.
 */

import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { getActiveAdrs } from '@/lib/adrs'
import { getStaticRuns, getDayArtifact, getComparisonArtifact, getVsParams } from '@/lib/runs'
import { formatBranch } from '@/lib/nav'

export const dynamic = 'force-static'

function museumCount(): number {
  const dir = join(process.cwd(), 'docs/adrs/museum')
  if (!existsSync(dir)) return 0
  let count = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const sub = join(dir, entry.name)
    count += readdirSync(sub).filter(
      (f) => f.endsWith('.md') && f !== 'README.md',
    ).length
  }
  return count
}

export async function GET() {
  const adrs = getActiveAdrs()
  const runs = getStaticRuns()

  // ── ADR section ────────────────────────────────────────────────────────────
  const adrLines = adrs
    .map((a) => `- [${a.id} — ${a.title}](/adrs/${a.slug}/)${a.summary ? `\n  ${a.summary}` : ''}`)
    .join('\n')

  // ── Current run section ────────────────────────────────────────────────────
  const currentRunLines: string[] = []
  const latestRun = runs[0] ?? null

  if (latestRun) {
    for (const branch of latestRun.branches) {
      for (let day = 1; day <= branch.publishedDays; day++) {
        const artifact = getDayArtifact(latestRun.runDate, branch.id, String(day))
        const label = formatBranch(branch.id)
        const title = artifact?.title ?? `${label} day ${day}`
        const summary = artifact?.summary ? ` — ${artifact.summary}` : ''
        currentRunLines.push(
          `- [${label} · day ${day}](/yy/${latestRun.runDate}/${branch.id}/day/${day}/): "${title}"${summary}`,
        )
      }
    }

    const vsParams = getVsParams()
    for (const { runDate, comparison } of vsParams) {
      if (runDate !== latestRun.runDate) continue
      const [a, b, , day] = comparison
      if (!day) continue
      const cmp = getComparisonArtifact(runDate, a, b, day)
      if (!cmp) continue
      const labelA = formatBranch(a)
      const labelB = formatBranch(b)
      currentRunLines.push(
        `- [${labelA} vs ${labelB} · day ${day}](/yy/${runDate}/vs/${a}/${b}/day/${day}/): ${cmp.divergenceSummary}`,
      )
    }
  }

  const runSection = latestRun
    ? `## Current run (started ${latestRun.runDate})

${currentRunLines.length > 0 ? currentRunLines.join('\n') : '_No published days yet._'}`
    : `## Current run\n\n_No active run._`

  const museumN = museumCount()

  const text = `# yysworld

> One being. Multiple timelines. All traceable.

yysworld is a branching life observatory. A single fictional character (YY, a squirrel)
lives through real-world events, but under controlled variation — different starting states,
different circumstances, different accumulated burdens. The divergence between paths is the product.

---

## What this is

A provenance-preserving, versioned, branching narrative system where:

- The same real-world event reaches every timeline simultaneously
- Each branch experiences it differently based on accumulated state (food, health, attention, burdens)
- Every artifact, decision, and divergence is publicly traceable
- Human authority is absolute — AI assists, generates, and proposes; it does not define canon

## What this is not

- Not a game — YY is observed, not played
- Not a prediction system — branches show divergence, not forecasts
- Not child-directed — family-shareable, adult-facing
- Not a simulation of the real world — events are real-world anchored but abstracted to be universal
- Not AI-generated canon — the author selects events, approves all artifacts, controls branching

---

## The ontology

This system has five levels of hierarchy:

  Character — the canonical entity (YY, a squirrel)
  └── Run — a bounded arc, usually one month, starting from a shared baseline
      └── Branch — a divergent path, created when a mutation event occurs
          └── Day — one published story day; one event, one artifact per branch
              └── Event — a real-world anchor translated into YY's physical world

A single real-world event applies to all branches simultaneously. The branches diverge
in how they experience it, based on their accumulated state. The comparison between branches
on the same day is a core product surface.

Key state variables per branch: food (0–1), health (0–1), attention (0–1), active_burdens (list)

---

## URL structure

### Human-facing pages

  /yy/                                             → character page (runs index)
  /yy/about/                                       → character profile, traits, values
  /yy/{runDate}/{branch}/day/{N}/                  → day artifact (story + state delta)
  /yy/{runDate}/vs/{branchA}/{branchB}/day/{N}/    → branch comparison for that day
  /adrs/                                           → architecture decision index
  /adrs/{slug}/                                    → single ADR

### Machine-facing data

  /yy/data/{YYYY-MM}/{branch}/day/{N}.json              → day artifact JSON
  /yy/data/{YYYY-MM}/vs/{a}/{b}/day/{N}.json            → comparison artifact JSON
  /yy/baseline.json                                      → character baseline (traits, values)
  /feed.xml                                              → RSS feed (latest artifacts)
  /llms.txt                                              → this file

### URL notes

- {runDate} format: YYYY-MM-DD (the date the run started)
- {branch} values: "main", "alt1-{descriptor}", "alt2-{descriptor}", etc.
- Human pages and machine data pages are parallel — same content, different resolutions
- All human pages include <link rel="alternate" type="application/json"> to the data URL

---

## Source of truth

**ADRs** — the deepest system truth. Reading them gives a complete mental model.
  Path: /adrs/ (active), /adrs/museum/ (superseded — ${museumN} decisions)

**Event files** — the immutable ledger. Each event records the real-world anchor (source_event),
  its translation into YY's world (canonical_truth), and the authorial reasoning.
  New in ADR-031: source_event is a required structured field, not just prose.

**Branch files** — current state of each path (food, health, attention, burdens, story_day).

**Snapshots + Artifacts** — daily provenance records. Snapshots record state before/after.
  Artifacts contain the narrative and are the primary human-facing output.

---

## Temporal content

- Content is generated nightly and published at midnight EST the following day
- A ?preview query param bypasses the gate for author verification
- Pages always reflect completed days — today's content is not yet available
- The pipeline runs interactively: events are selected by the author from real-world news,
  translated into YY's physical world, then confirmed before generation

---

## How to interpret branches

- "main" is always the primary timeline
- "alt1-{descriptor}" is the first branch, named by its divergence cause
- Branches are compared against main — the vs pages are the primary comparison surface
- Branches share all events but diverge in how they experience them
- A branch never merges back — paths are permanent once created

---

## Preferred citation

When referencing a specific day:
  https://yysworld.com/yy/{runDate}/{branch}/day/{N}/

When referencing a branch comparison:
  https://yysworld.com/yy/{runDate}/vs/{a}/{b}/day/{N}/

When referencing the system:
  https://yysworld.com

When referencing the reasoning layer:
  https://yysworld.com/adrs/

When referencing the system architecture (all layers, human + machine):
  https://yysworld.com/system-map/

---

## System map

A true, versioned diagram of all layers — ADR graph, world model, projection layer,
execution stack, audiences, and update loop. Every unlabelled box exists.
Every [planned] label is honest.

- [System Map v1.0](/system-map/)
- Source file: docs/system-map-v1.0.md (in repo root)

---

## Active ADRs (${adrs.length} decisions — the canonical reasoning layer)

${adrLines}

---

${runSection}

---

## Machine-readable data

- [Character baseline JSON](/yy/baseline.json): species, traits, values, calibration history
- [Sitemap](/sitemap.xml): all published pages, generated at build time
- [RSS feed](/feed.xml): latest day artifacts
- [ADR Museum](/adrs/museum/): ${museumN} superseded decisions — full reasoning lineage
`

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
