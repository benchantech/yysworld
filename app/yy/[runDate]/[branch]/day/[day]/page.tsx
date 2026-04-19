import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { BranchSwitcher, type BranchOption } from '@/components/nav/BranchSwitcher'
import { DayNavigator } from '@/components/nav/DayNavigator'
import { DayStrip } from '@/components/nav/DayStrip'
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

  const covered = new Set(params.map((p) => `${p.runDate}/${p.branch}`))
  for (const run of getStaticRuns(true)) {
    for (const b of run.branches) {
      if (!covered.has(`${run.runDate}/${b.id}`)) {
        params.push({ runDate: run.runDate, branch: b.id, day: '1' })
      }
    }
  }

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

  const allBranches = getRunBranches(runDate)
  const branchOptions: BranchOption[] = allBranches.map((b) => ({
    id: b,
    label: formatBranch(b),
    href: dayUrl('yy', runDate, b, day),
    isCurrent: b === branch,
  }))
  const altBranches = branchOptions.filter((b) => !b.isCurrent)

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

      <div className="mt-6 space-y-6">

        {/* Event anchor */}
        {artifact && (
          <div className="border-t border-ink border-b border-b-rule py-3 flex items-baseline gap-3 flex-wrap font-mono text-xs">
            <span className="text-ink-3 uppercase tracking-widest">run</span>
            <span className="text-ink-2">{formatRunDate(runDate)}</span>
            <span className="text-ink-4">·</span>
            <span
              className="uppercase tracking-widest"
              style={{ color: 'var(--color-accent)' }}
            >
              {formatBranch(branch)}
            </span>
            <span className="text-ink-4">·</span>
            <span className="text-ink-2">day {day}</span>
          </div>
        )}

        {/* Article */}
        {artifact ? (
          <GatedArticle
            releaseAt={artifact.releaseAt}
            initialVisible={Date.now() >= new Date(artifact.releaseAt).getTime()}
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
          <div className="border border-rule bg-paper-2 px-5 py-5">
            <p className="font-mono text-xs text-ink-4 italic">
              Day {day} — content coming soon.
            </p>
          </div>
        )}

        {/* Compare across branches */}
        {altBranches.length > 0 && (
          <nav
            aria-label="compare branches"
            className="pt-4 border-t border-rule flex flex-wrap gap-4"
          >
            <span className="font-mono text-xs text-ink-4 self-center">compare:</span>
            {altBranches.map((alt) => (
              <Link
                key={alt.id}
                href={vsDayUrl(
                  'yy',
                  runDate,
                  branch === 'main' ? branch : alt.id,
                  branch === 'main' ? alt.id : branch,
                  day,
                )}
                className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink-2 pb-0.5"
              >
                {formatBranch(branch)} vs {alt.label} →
              </Link>
            ))}
          </nav>
        )}

        {/* Day strip — all days for this branch */}
        {run && (() => {
          const thisBranch = run.branches.find((b) => b.id === branch) ?? run.branches[0]
          return (
            <DayStrip
              totalDays={thisBranch.publishedDays}
              currentDay={dayNum}
              releaseAts={thisBranch.dayReleaseAts}
              makeDayHref={(d) => dayUrl('yy', runDate, branch, String(d))}
            />
          )
        })()}

        {/* Branch switcher */}
        {branchOptions.length > 1 && (
          <div className="yy-branchNav">
            <div className="yy-branchNav__options">
              {branchOptions.map((b) => (
                b.isCurrent ? (
                  <span key={b.id} className="yy-branchNav__item is-current">
                    <span className="yy-branchNav__label">{b.label}</span>
                    <span className="yy-branchNav__sub">reading now</span>
                  </span>
                ) : (
                  <Link key={b.id} href={b.href} className="yy-branchNav__item">
                    <span className="yy-branchNav__label">{b.label}</span>
                    <span className="yy-branchNav__sub">switch path</span>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}

        {/* Prev / next day nav */}
        <div className="flex items-center justify-between">
          <DayNavigator
            currentDay={dayNum}
            totalDays={totalDays}
            prevHref={dayNum > 1 ? dayUrl('yy', runDate, branch, dayNum - 1) : undefined}
            nextHref={dayNum < totalDays ? dayUrl('yy', runDate, branch, dayNum + 1) : undefined}
          />
          <Link href="/today" className="font-mono text-xs text-ink-3 hover:text-ink transition-colors border-b-0">
            today →
          </Link>
        </div>

      </div>
    </>
  )
}
