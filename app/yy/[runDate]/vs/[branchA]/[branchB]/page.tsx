import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import {
  vsBreadcrumbs,
  vsDayUrl,
  vsUrl,
  dayUrl,
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
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { runDate, branchA, branchB } = await params
  const title = `${formatRunDate(runDate)} · ${formatBranch(branchA)} vs ${formatBranch(branchB)}`
  return {
    title,
    openGraph: {
      title: `${title} — yysworld`,
      description: `Compare ${formatBranch(branchA)} and ${formatBranch(branchB)} across the full ${formatRunDate(runDate)} run.`,
      type: 'website',
      url: vsUrl('yy', runDate, branchA, branchB),
    },
  }
}

export default async function RunComparisonPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { runDate, branchA, branchB } = await params
  const totalDays = 30 // read from manifest in production
  const pageUrl = vsUrl('yy', runDate, branchA, branchB)
  const breadcrumbs = vsBreadcrumbs('yy', runDate, branchA, branchB)

  return (
    <>
      <JsonLd
        schema={[
          schemaDataset({
            name: `${formatBranch(branchA)} vs ${formatBranch(branchB)} — ${formatRunDate(runDate)}`,
            description: `Branch comparison: ${formatBranch(branchA)} and ${formatBranch(branchB)} paths across the ${formatRunDate(runDate)} run. Tracks divergence in hunger, attention, and active burdens day by day.`,
            pageUrl,
          }),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium text-zinc-200">
            {formatRunDate(runDate)} · {formatBranch(branchA)} vs {formatBranch(branchB)}
          </h1>
          <p className="text-xs text-zinc-500">
            Run-level comparison — select a day to see the divergence.
          </p>
        </div>

        <section>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Days
          </h2>
          <ol className="grid grid-cols-6 gap-1.5 sm:grid-cols-10">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
              <li key={d}>
                <Link
                  href={vsDayUrl('yy', runDate, branchA, branchB, d)}
                  className="flex items-center justify-center h-8 rounded text-xs text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-colors tabular-nums"
                >
                  {d}
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <nav
          aria-label="view individual branches"
          className="pt-2 border-t border-zinc-800 flex flex-wrap gap-4 text-xs text-zinc-500"
        >
          <Link href={dayUrl('yy', runDate, branchA, 1)} className="hover:text-zinc-300 transition-colors">
            view {formatBranch(branchA)} →
          </Link>
          <Link href={dayUrl('yy', runDate, branchB, 1)} className="hover:text-zinc-300 transition-colors">
            view {formatBranch(branchB)} →
          </Link>
        </nav>
      </div>
    </>
  )
}
