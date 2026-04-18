import type { Metadata } from 'next'
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

  // Load comparison content for day-level pages
  const cmp = day ? getComparisonArtifact(runDate, branchA, branchB, day) : null

  // Total days with comparison artifacts for this pair
  const run = getStaticRuns(true).find((r) => r.runDate === runDate)
  const maxDays = run
    ? Math.max(...run.branches.map((b) => b.publishedDays), dayNum ?? 0)
    : dayNum ?? 1

  return (
    <>
      <JsonLd
        schema={[
          schemaDataset({ name: datasetName, description: datasetDescription, pageUrl }),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-5">
        <header className="space-y-1">
          <h1 className="text-sm font-medium text-zinc-200">
            {runLabel} · {labelA} vs {labelB}
            {day && <span> · day {day}</span>}
          </h1>
        </header>

        {dayNum !== null && (
          <DayNavigator
            currentDay={dayNum}
            totalDays={maxDays}
            prevHref={dayNum > 1 ? vsDayUrl('yy', runDate, branchA, branchB, dayNum - 1) : undefined}
            nextHref={dayNum < maxDays ? vsDayUrl('yy', runDate, branchA, branchB, dayNum + 1) : undefined}
          />
        )}

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
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-4">
            <p className="text-xs text-zinc-600 italic">Day {day} comparison — coming soon.</p>
          </div>
        ) : null}

        {/* Run-level: link to day-by-day comparisons */}
        {!day && (
          <nav
            aria-label="day-level comparisons"
            className="pt-2 border-t border-zinc-800 flex flex-wrap gap-3"
          >
            {Array.from({ length: maxDays }, (_, i) => i + 1).map((d) => (
              <a
                key={d}
                href={vsDayUrl('yy', runDate, branchA, branchB, d)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                day {d} →
              </a>
            ))}
            {maxDays === 0 && (
              <a
                href={vsDayUrl('yy', runDate, branchA, branchB, 1)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                compare day by day →
              </a>
            )}
          </nav>
        )}

        {/* Per-branch day links */}
        {day && (
          <nav
            aria-label="individual branch days"
            className="pt-2 border-t border-zinc-800 flex flex-wrap gap-3"
          >
            <a
              href={dayUrl('yy', runDate, branchA, day)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {labelA} day {day} →
            </a>
            <a
              href={dayUrl('yy', runDate, branchB, day)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {labelB} day {day} →
            </a>
          </nav>
        )}
      </div>
    </>
  )
}
