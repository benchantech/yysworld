import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { BranchSwitcher, type BranchOption } from '@/components/nav/BranchSwitcher'
import { DayNavigator } from '@/components/nav/DayNavigator'
import { JsonLd } from '@/components/JsonLd'
import {
  dayBreadcrumbs,
  dayUrl,
  vsUrl,
  dataUrl,
  formatBranch,
  formatRunDate,
} from '@/lib/nav'
import { schemaBreadcrumbList, schemaArticle } from '@/lib/jsonld'

// Static export: dynamicParams = false + empty generateStaticParams → no pages built yet.
// Nightly pipeline populates this from published manifests.
export const dynamicParams = false
export function generateStaticParams(): { runDate: string; branch: string; day: string }[] {
  // Seeded with the current run (2026-04-01, main, days 1–14).
  // The nightly pipeline regenerates this list from published manifests.
  // Days beyond the current count exist as placeholder pages until real snapshots land.
  const CURRENT_RUN = '2026-04-01'
  const PUBLISHED_DAYS = 14
  return Array.from({ length: PUBLISHED_DAYS }, (_, i) => ({
    runDate: CURRENT_RUN,
    branch: 'main',
    day: String(i + 1),
  }))
}

interface Params {
  runDate: string
  branch: string
  day: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { runDate, branch, day } = await params
  const title = `${formatRunDate(runDate)} · ${formatBranch(branch)} · day ${day}`
  const pageUrl = dayUrl('yy', runDate, branch, day)
  return {
    title,
    // link rel="alternate" type="application/json" → machine data layer (ADR-022)
    alternates: {
      types: { 'application/json': dataUrl(runDate, branch, day) },
    },
    openGraph: {
      title: `${title} — yysworld`,
      // In production: first sentence of the narrative from snapshot
      description: `Day ${day} on the ${formatBranch(branch)} path — ${formatRunDate(runDate)} run.`,
      type: 'article',
      url: pageUrl,
    },
  }
}

// Placeholder branch set — in production read from the run manifest.
function buildBranchOptions(runDate: string, currentBranch: string, day: string): BranchOption[] {
  const allBranches = ['main'] // expand as branches are added to the run
  return allBranches.map((b) => ({
    id: b,
    label: formatBranch(b),
    href: dayUrl('yy', runDate, b, day),
    isCurrent: b === currentBranch,
  }))
}

export default async function DayArtifactPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { runDate, branch, day } = await params
  const dayNum = parseInt(day, 10)
  const totalDays = 30 // read from manifest in production
  const pageUrl = dayUrl('yy', runDate, branch, day)
  const breadcrumbs = dayBreadcrumbs('yy', runDate, branch, day)
  const branches = buildBranchOptions(runDate, branch, day)
  const altBranches = branches.filter((b) => !b.isCurrent)

  // In production: headline from snapshot.change_summary.notable_shift
  const headline = `Day ${day} — ${formatBranch(branch)} path, ${formatRunDate(runDate)} run`

  return (
    <>
      <JsonLd
        schema={[
          schemaArticle({
            headline,
            datePublished: runDate,
            pageUrl,
            aboutName: 'YY',
            aboutUrl: '/yy',
          }),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BranchSwitcher branches={branches} label="switch branch" />
          <DayNavigator
            currentDay={dayNum}
            totalDays={totalDays}
            prevHref={dayNum > 1 ? dayUrl('yy', runDate, branch, dayNum - 1) : undefined}
            nextHref={dayNum < totalDays ? dayUrl('yy', runDate, branch, dayNum + 1) : undefined}
          />
        </div>

        <article className="space-y-4">
          <header className="space-y-1">
            <h1 className="text-sm font-medium text-zinc-200">
              {formatRunDate(runDate)} · {formatBranch(branch)} · day {day}
            </h1>
          </header>

          {/* Snapshot content — populated by the nightly pipeline */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-4">
            <p className="text-xs text-zinc-600 italic">
              Day {day} snapshot — populated by the nightly pipeline.
            </p>
          </div>
        </article>

        {altBranches.length > 0 && (
          <nav
            aria-label="compare branches"
            className="pt-2 border-t border-zinc-800 flex flex-wrap gap-3"
          >
            {altBranches.map((alt) => (
              <a
                key={alt.id}
                href={vsUrl('yy', runDate, branch, alt.id)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                compare {formatBranch(branch)} vs {alt.label} →
              </a>
            ))}
          </nav>
        )}
      </div>
    </>
  )
}
