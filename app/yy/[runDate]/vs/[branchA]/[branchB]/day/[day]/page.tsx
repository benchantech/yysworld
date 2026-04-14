import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { DayNavigator } from '@/components/nav/DayNavigator'
import { JsonLd } from '@/components/JsonLd'
import {
  vsDayBreadcrumbs,
  vsDayUrl,
  vsUrl,
  dayUrl,
  dataUrl,
  formatBranch,
  formatRunDate,
} from '@/lib/nav'
import { schemaBreadcrumbList, schemaDataset } from '@/lib/jsonld'

export const dynamicParams = false
export function generateStaticParams() {
  return []
}

interface Params {
  runDate: string
  branchA: string
  branchB: string
  day: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { runDate, branchA, branchB, day } = await params
  const title = `${formatRunDate(runDate)} · ${formatBranch(branchA)} vs ${formatBranch(branchB)} · day ${day}`
  return {
    title,
    // link rel="alternate" for both branch data files
    alternates: {
      types: {
        'application/json': dataUrl(runDate, branchA, day),
      },
    },
    openGraph: {
      title: `${title} — yysworld`,
      description: `Day ${day}: ${formatBranch(branchA)} vs ${formatBranch(branchB)} in the ${formatRunDate(runDate)} run.`,
      type: 'website',
      url: vsDayUrl('yy', runDate, branchA, branchB, day),
    },
  }
}

export default async function DayComparisonPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { runDate, branchA, branchB, day } = await params
  const dayNum = parseInt(day, 10)
  const totalDays = 30 // read from manifest in production
  const pageUrl = vsDayUrl('yy', runDate, branchA, branchB, day)
  const breadcrumbs = vsDayBreadcrumbs('yy', runDate, branchA, branchB, day)

  return (
    <>
      <JsonLd
        schema={[
          schemaDataset({
            name: `${formatBranch(branchA)} vs ${formatBranch(branchB)} · day ${day} — ${formatRunDate(runDate)}`,
            description: `Day ${day} comparison: ${formatBranch(branchA)} and ${formatBranch(branchB)} paths in the ${formatRunDate(runDate)} run. Divergence in hunger, attention, and active burdens.`,
            pageUrl,
          }),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-sm font-medium text-zinc-200">
            {formatBranch(branchA)} vs {formatBranch(branchB)} · day {day}
          </h1>
          <DayNavigator
            currentDay={dayNum}
            totalDays={totalDays}
            prevHref={dayNum > 1 ? vsDayUrl('yy', runDate, branchA, branchB, dayNum - 1) : undefined}
            nextHref={dayNum < totalDays ? vsDayUrl('yy', runDate, branchA, branchB, dayNum + 1) : undefined}
          />
        </div>

        {/* Side-by-side branch columns */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <BranchColumn char="yy" runDate={runDate} branch={branchA} day={day} />
          <BranchColumn char="yy" runDate={runDate} branch={branchB} day={day} />
        </div>

        <nav
          aria-label="run overview"
          className="pt-2 border-t border-zinc-800 text-xs text-zinc-500"
        >
          <Link
            href={vsUrl('yy', runDate, branchA, branchB)}
            className="hover:text-zinc-300 transition-colors"
          >
            ← all days
          </Link>
        </nav>
      </div>
    </>
  )
}

function BranchColumn({
  char,
  runDate,
  branch,
  day,
}: {
  char: string
  runDate: string
  branch: string
  day: string
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 space-y-2">
      <Link
        href={dayUrl(char, runDate, branch, day)}
        className="text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
      >
        {formatBranch(branch)} →
      </Link>
      {/* Day snapshot — populated by the nightly pipeline */}
      <p className="text-xs text-zinc-600 italic">
        Day {day} snapshot — populated by the nightly pipeline.
      </p>
    </div>
  )
}
