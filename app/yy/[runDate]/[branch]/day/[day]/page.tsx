import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { BranchSwitcher, type BranchOption } from '@/components/nav/BranchSwitcher'
import { DayNavigator } from '@/components/nav/DayNavigator'
import { JsonLd } from '@/components/JsonLd'
import { GatedArticle } from '@/components/GatedArticle'
import {
  dayBreadcrumbs,
  dayUrl,
  vsDayUrl,
  dataUrl,
  formatBranch,
  formatRunDate,
} from '@/lib/nav'
import { schemaBreadcrumbList, schemaArticle } from '@/lib/jsonld'
import { getDayParams, getDayArtifact, getRunBranches, getStaticRuns } from '@/lib/runs'

export const dynamicParams = false

export function generateStaticParams(): { runDate: string; branch: string; day: string }[] {
  const params = getDayParams()

  // Add a day/1 stub for any branch that has no artifact yet so every active
  // branch always has at least one routable page (renders "content coming soon").
  const covered = new Set(params.map((p) => `${p.runDate}/${p.branch}`))
  for (const run of getStaticRuns(true)) {
    for (const b of run.branches) {
      if (!covered.has(`${run.runDate}/${b.id}`)) {
        params.push({ runDate: run.runDate, branch: b.id, day: '1' })
      }
    }
  }

  // Last-resort fallback: no runs at all yet
  if (params.length === 0) {
    return [{ runDate: '0000-00-00', branch: 'main', day: '1' }]
  }

  return params
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
  const artifact = getDayArtifact(runDate, branch, day)
  const title = artifact?.title
    ? `${artifact.title} — ${formatBranch(branch)} day ${day}`
    : `${formatRunDate(runDate)} · ${formatBranch(branch)} · day ${day}`
  const pageUrl = dayUrl('yy', runDate, branch, day)
  return {
    title,
    alternates: {
      types: { 'application/json': dataUrl(runDate, branch, day) },
    },
    openGraph: {
      title: `${title} — yysworld`,
      description: artifact?.summary
        ?? `Day ${day} on the ${formatBranch(branch)} path — ${formatRunDate(runDate)} run.`,
      type: 'article',
      url: pageUrl,
    },
  }
}

export default async function DayArtifactPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { runDate, branch, day } = await params
  const artifact = getDayArtifact(runDate, branch, day)
  const dayNum = parseInt(day, 10)
  const pageUrl = dayUrl('yy', runDate, branch, day)
  const breadcrumbs = dayBreadcrumbs('yy', runDate, branch, day)

  // Build branch switcher from real run data
  const allBranches = getRunBranches(runDate)
  const branchOptions: BranchOption[] = allBranches.map((b) => ({
    id: b,
    label: formatBranch(b),
    href: dayUrl('yy', runDate, b, day),
    isCurrent: b === branch,
  }))
  const altBranches = branchOptions.filter((b) => !b.isCurrent)

  // totalDays: max published across all branches in this run (include sandbox so nav works on test pages)
  const run = getStaticRuns(true).find((r) => r.runDate === runDate)
  const totalDays = run
    ? Math.max(...run.branches.map((b) => b.publishedDays), dayNum)
    : dayNum

  return (
    <>
      <JsonLd
        schema={[
          schemaArticle({
            headline: artifact?.title ?? `Day ${day} — ${formatBranch(branch)}`,
            datePublished: artifact?.snapshotDate ?? runDate,
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
          <BranchSwitcher branches={branchOptions} label="switch branch" />
          <DayNavigator
            currentDay={dayNum}
            totalDays={totalDays}
            prevHref={dayNum > 1 ? dayUrl('yy', runDate, branch, dayNum - 1) : undefined}
            nextHref={dayNum < totalDays ? dayUrl('yy', runDate, branch, dayNum + 1) : undefined}
          />
        </div>

        {artifact ? (
          <GatedArticle
            releaseAt={artifact.releaseAt}
            title={artifact.title}
            tone={artifact.tone}
            narrative={artifact.narrative}
            stateNote={artifact.stateNote}
            summary={artifact.summary}
            storyDay={artifact.storyDay}
            statsBefore={artifact.statsBefore}
            statsAfter={artifact.statsAfter}
          />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-4">
            <p className="text-xs text-zinc-600 italic">
              Day {day} — content coming soon.
            </p>
          </div>
        )}

        {altBranches.length > 0 && (
          <nav
            aria-label="compare branches"
            className="pt-2 border-t border-zinc-800 flex flex-wrap gap-3"
          >
            {altBranches.map((alt) => (
              <a
                key={alt.id}
                href={vsDayUrl(
                  'yy',
                  runDate,
                  branch === 'main' ? branch : alt.id,
                  branch === 'main' ? alt.id : branch,
                  day,
                )}
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
