import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { DayNavigator } from '@/components/nav/DayNavigator'
import { JsonLd } from '@/components/JsonLd'
import { GatedComparison } from '@/components/GatedComparison'
import {
  vsBreadcrumbs,
  vsDayBreadcrumbs,
  vsUrl,
  vsDayUrl,
  dayUrl,
  formatBranch,
  formatRunDate,
} from '@/lib/nav'
import { schemaBreadcrumbList, schemaDataset } from '@/lib/jsonld'
import { getVsParams, getComparisonArtifact, getStaticRuns } from '@/lib/runs'

export const dynamicParams = false
export const revalidate = 3600

export function generateStaticParams(): { runDate: string; comparison: string[] }[] {
  return getVsParams()
}

interface Params {
  runDate: string
  comparison: string[]
}

function parseComparison(comparison: string[]): {
  branchA: string
  branchB: string
  day: string | null
} {
  const [branchA, branchB, , day = null] = comparison
  return { branchA, branchB, day }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { runDate, comparison } = await params
  const { branchA, branchB, day } = parseComparison(comparison)
  const labelA = formatBranch(branchA)
  const labelB = formatBranch(branchB)
  const runLabel = formatRunDate(runDate)

  const title = day
    ? `${runLabel} · ${labelA} vs ${labelB} · day ${day}`
    : `${runLabel} · ${labelA} vs ${labelB}`

  const pageUrl = day
    ? vsDayUrl('yy', runDate, branchA, branchB, day)
    : vsUrl('yy', runDate, branchA, branchB)

  const cmp = day ? getComparisonArtifact(runDate, branchA, branchB, day) : null

  return {
    title,
    openGraph: {
      title: `${title} — yysworld`,
      description: cmp?.divergenceSummary
        ?? (day
          ? `Day ${day} comparison: ${labelA} vs ${labelB} paths — ${runLabel} run.`
          : `Branch comparison: ${labelA} vs ${labelB} — ${runLabel} run.`),
      type: 'article',
      url: pageUrl,
    },
  }
}

export default async function VsPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { runDate, comparison } = await params
  const { branchA, branchB, day } = parseComparison(comparison)
  const labelA = formatBranch(branchA)
  const labelB = formatBranch(branchB)
  const runLabel = formatRunDate(runDate)
  const dayNum = day ? parseInt(day, 10) : null

  const pageUrl = day
    ? vsDayUrl('yy', runDate, branchA, branchB, day)
    : vsUrl('yy', runDate, branchA, branchB)

  const breadcrumbs = day
    ? vsDayBreadcrumbs('yy', runDate, branchA, branchB, day)
    : vsBreadcrumbs('yy', runDate, branchA, branchB)

  const datasetName = day
    ? `${labelA} vs ${labelB} · day ${day} — ${runLabel}`
    : `${labelA} vs ${labelB} — ${runLabel}`

  const datasetDescription = day
    ? `YY branch comparison for day ${day}: ${labelA} path vs ${labelB} path, ${runLabel} run.`
    : `YY branch comparison: ${labelA} path vs ${labelB} path across all published days, ${runLabel} run.`

  const cmp = day ? getComparisonArtifact(runDate, branchA, branchB, day) : null

  const run = getStaticRuns(true).find((r) => r.runDate === runDate)
  const maxDays = run
    ? Math.max(...run.branches.map((b) => b.publishedDays), dayNum ?? 0)
    : dayNum ?? 1

  const branchFirstDay = (branchId: string): number => {
    const b = run?.branches.find((br) => br.id === branchId)
    if (!b) return 1
    const idx = b.dayReleaseAts.findIndex((ra) => ra !== '')
    return idx >= 0 ? idx + 1 : 1
  }
  // Comparison is only meaningful from the day both branches have content
  const firstComparisonDay = Math.max(branchFirstDay(branchA), branchFirstDay(branchB))

  return (
    <>
      <JsonLd
        schema={[
          schemaDataset({ name: datasetName, description: datasetDescription, pageUrl }),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 space-y-6">

        {/* Header */}
        <header className="space-y-1 pb-4 border-b border-rule">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">compare</p>
          <h1 className="font-sans text-2xl font-medium text-ink tracking-tight">
            {labelA} <span className="text-ink-3">vs</span> {labelB}
            {day && <span className="text-ink-3"> · day {day}</span>}
          </h1>
          <p className="font-mono text-xs text-ink-3">{runLabel}</p>
        </header>

        {/* Day nav */}
        {dayNum !== null && (
          <DayNavigator
            currentDay={dayNum}
            totalDays={maxDays}
            prevHref={dayNum > firstComparisonDay ? vsDayUrl('yy', runDate, branchA, branchB, dayNum - 1) : undefined}
            nextHref={dayNum < maxDays ? vsDayUrl('yy', runDate, branchA, branchB, dayNum + 1) : undefined}
          />
        )}

        {/* Comparison content */}
        {day && cmp ? (
          <GatedComparison
            releaseAt={cmp.releaseAt}
            initialVisible={Date.now() >= new Date(cmp.releaseAt).getTime()}
            branchALabel={labelA}
            branchBLabel={labelB}
            divergenceSummary={cmp.divergenceSummary}
            branchAPath={cmp.branchAPath}
            branchBPath={cmp.branchBPath}
            keyDifferences={cmp.keyDifferences}
            sharedElements={cmp.sharedElements}
          />
        ) : day ? (
          <div className="border border-rule bg-paper-2 px-5 py-5">
            <p className="font-mono text-xs text-ink-4 italic">Day {day} comparison — coming soon.</p>
          </div>
        ) : null}

        {/* Run-level: day links */}
        {!day && (
          <nav
            aria-label="day-level comparisons"
            className="pt-3 border-t border-rule flex flex-wrap gap-3"
          >
            <span className="font-mono text-xs text-ink-4 self-center">by day:</span>
            {Array.from({ length: maxDays - firstComparisonDay + 1 }, (_, i) => i + firstComparisonDay).map((d) => (
              <Link
                key={d}
                href={vsDayUrl('yy', runDate, branchA, branchB, d)}
                className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink-2 pb-0.5"
              >
                day {d} →
              </Link>
            ))}
            {maxDays === 0 && (
              <Link
                href={vsDayUrl('yy', runDate, branchA, branchB, 1)}
                className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b border-rule"
              >
                compare day by day →
              </Link>
            )}
          </nav>
        )}

        {/* Per-branch day links */}
        {day && (
          <nav
            aria-label="individual branch days"
            className="pt-3 border-t border-rule flex flex-wrap gap-4"
          >
            <Link
              href={dayUrl('yy', runDate, branchA, day)}
              className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink-2 pb-0.5"
            >
              {labelA} day {day} →
            </Link>
            <Link
              href={dayUrl('yy', runDate, branchB, day)}
              className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink-2 pb-0.5"
            >
              {labelB} day {day} →
            </Link>
          </nav>
        )}

      </div>
    </>
  )
}
