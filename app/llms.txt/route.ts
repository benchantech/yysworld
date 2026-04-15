/**
 * Generated llms.txt — the AI agent entry point for yysworld (ADR-021).
 *
 * Built at static-export time from live data so it never drifts from the
 * actual ADR list, published days, artifact titles, or comparison summaries.
 * Replaces the hand-maintained public/llms.txt.
 */

import { readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { getActiveAdrs } from '@/lib/adrs'
import { getStaticRuns, getDayArtifact, getComparisonArtifact, getVsParams } from '@/lib/runs'
import { formatBranch, formatRunDate } from '@/lib/nav'

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
    .map((a) => `- [${a.id} — ${a.title}](/adrs/${a.slug}/)`)
    .join('\n')

  // ── Current run section ────────────────────────────────────────────────────
  const currentRunLines: string[] = []
  const latestRun = runs[0] ?? null

  if (latestRun) {
    // Per-branch published days
    for (const branch of latestRun.branches) {
      for (let day = 1; day <= branch.publishedDays; day++) {
        const artifact = getDayArtifact(latestRun.runDate, branch.id, String(day))
        const label = formatBranch(branch.id)
        const title = artifact?.title ?? `${label} day ${day}`
        currentRunLines.push(
          `- [Day ${day} — ${label}](/yy/${latestRun.runDate}/${branch.id}/day/${day}/): ${title}`,
        )
      }
    }

    // Comparison links from comparison artifacts
    const vsParams = getVsParams()
    for (const { runDate, comparison } of vsParams) {
      if (runDate !== latestRun.runDate) continue
      const [a, b, , day] = comparison
      if (!day) continue // skip run-level pages, only day-level comparisons
      const cmp = getComparisonArtifact(runDate, a, b, day)
      if (!cmp) continue
      const labelA = formatBranch(a)
      const labelB = formatBranch(b)
      const desc = cmp.divergenceSummary || `${labelA} vs ${labelB}`
      currentRunLines.push(
        `- [Day ${day} comparison](/yy/${runDate}/vs/${a}/${b}/day/${day}/): ${desc}`,
      )
    }
  }

  const runHeader = latestRun
    ? `## Current run (${formatRunDate(latestRun.runDate)}, started ${latestRun.runDate})`
    : `## Current run`

  const runBody =
    currentRunLines.length > 0
      ? currentRunLines.join('\n')
      : '_No published days yet._'

  const museumN = museumCount()

  const text = `# yysworld

> A branching life observatory. Same character (YY, a squirrel), different paths. Watch how one being
> responds to the same world under different circumstances — branching, diverging, drifting over time.
> Every artifact, decision, and divergence is publicly traceable.

## Start here

The ADRs are the reasoning layer. Reading them gives you a complete mental model of the system —
what it is, why it was built this way, and what invariants must never be violated.

- [ADR Index](/adrs/): All ${adrs.length} active architecture decisions
- [YY character page](/yy): Current runs, branches, published days
- [YY profile](/yy/about): Traits, values, species, calibration notes
- [YY baseline JSON](/yy/baseline.json): Machine-readable character baseline

## Active ADRs (full index)

${adrLines}

${runHeader}

${runBody}

## Machine-readable data

- [YY baseline JSON](/yy/baseline.json): Character profile — species, traits, values, calibration
- [Sitemap](/sitemap.xml): All published pages, generated at build time
- [RSS feed](/feed.xml): Latest published day artifacts
- [ADR Museum](/adrs/museum/): ${museumN} superseded decisions — full reasoning lineage

## Key concepts

**YY** is a squirrel. Curious (1.0), expressive (0.9), easily surprised (0.85), restless (0.7).
Values: friendship, food, music, language, technology, bedtime stories, fair trade.

**Branches** emerge from divergence events — a missed meal, a different wakeup time. Each branch
tracks how the same character drifts differently over time under controlled changes.

**The pipeline** runs nightly. Events happen; the pipeline generates artifacts; the site rebuilds.
Content written today is never visible today — the site always reflects up to yesterday's completed day.

**Immutability** is a hard invariant. The ledger is append-only. Corrections are new events,
not rewrites. Every artifact carries full provenance: model ID, parameters, event refs, timestamps.
`

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
