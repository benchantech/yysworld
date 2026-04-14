import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { DayNavigator } from '@/components/nav/DayNavigator'
import { JsonLd } from '@/components/JsonLd'
import {
  vsBreadcrumbs,
  vsDayBreadcrumbs,
  vsUrl,
  vsDayUrl,
  formatBranch,
  formatRunDate,
} from '@/lib/nav'
import { schemaBreadcrumbList, schemaDataset } from '@/lib/jsonld'
import { getVsParams } from '@/lib/runs'

export function generateStaticParams(): { runDate: string; comparison: string[] }[] {
  return getVsParams()
}

interface Params {
  runDate: string
  comparison: string[]
}

// comparison array shapes:
//   run-level:  ['main', 'alt1-time-slip']
//   day-level:  ['main', 'alt1-time-slip', 'day', '3']
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

  return {
    title,
    openGraph: {
      title: `${title} — yysworld`,
      description: day
        ? `Day ${day} comparison: ${labelA} vs ${labelB} paths — ${runLabel} run.`
        : `Branch comparison: ${labelA} vs ${labelB} — ${runLabel} run.`,
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
            totalDays={dayNum} // updated from manifest in production
            prevHref={dayNum > 1 ? vsDayUrl('yy', runDate, branchA, branchB, dayNum - 1) : undefined}
            nextHref={undefined}
          />
        )}

        {/* Comparison content — populated by the nightly pipeline */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-4">
          <p className="text-xs text-zinc-600 italic">
            {day
              ? `Day ${day} comparison snapshot — populated by the nightly pipeline.`
              : 'Run-level comparison — populated by the nightly pipeline.'}
          </p>
        </div>

        {!day && (
          <nav
            aria-label="day-level comparisons"
            className="pt-2 border-t border-zinc-800 flex flex-wrap gap-3"
          >
            <a
              href={vsDayUrl('yy', runDate, branchA, branchB, 1)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              compare day by day →
            </a>
          </nav>
        )}
      </div>
    </>
  )
}
