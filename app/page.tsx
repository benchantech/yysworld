import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { homeBreadcrumbs } from '@/lib/nav'
import { schemaBreadcrumbList, schemaWebSite } from '@/lib/jsonld'
import { getStaticRuns, getDayArtifact, getActiveDay } from '@/lib/runs'
import { PageHeader, EventAnchor, SplitPanel, PathStateRow, BranchTree, PageShell } from '@/components/canon/Layout'
import { MonoLabel, Pill, SectionRule, LinkButton } from '@/components/canon/Primitives'
import { AltBranchTabs } from '@/components/AltBranchTabs'

export const metadata: Metadata = {
  title: 'yysworld',
  description:
    'One character. Multiple timelines. YY (a squirrel) lives through the same real-world events across branching paths — diverging based on circumstance, burden, and accumulated state.',
  openGraph: {
    title: 'yysworld — branching life observatory',
    description:
      'One character. Multiple timelines. Watch how the same being drifts differently across paths shaped by circumstance. Every divergence is traceable.',
    type: 'website',
    url: 'https://yysworld.com/',
  },
}

export default function HomePage() {
  const breadcrumbs = homeBreadcrumbs()
  const runs = getStaticRuns()
  const latestRun = runs[0] ?? null

  const mainBranch = latestRun?.branches.find((b) => b.id === 'main') ?? latestRun?.branches[0]
  const altBranches = latestRun?.branches.filter((b) => b.id !== 'main') ?? []
  const activeDay = mainBranch ? getActiveDay(mainBranch) : null
  const activeDayStr = activeDay ? String(activeDay) : null

  const mainArtifact = latestRun && mainBranch && activeDayStr
    ? getDayArtifact(latestRun.runDate, mainBranch.id, activeDayStr)
    : null
  const altArtifacts = latestRun && activeDayStr
    ? Object.fromEntries(altBranches.map((b) => [b.id, getDayArtifact(latestRun.runDate, b.id, activeDayStr)]))
    : {}

  return (
    <PageShell wide>
      <JsonLd schema={[schemaWebSite(), schemaBreadcrumbList(breadcrumbs)]} />

      <PageHeader
        eyebrow="one being, multiple paths"
        title="The same world reaches YY every day. It never lands the same way twice."
        lede="YY's World is a branching life observatory: one squirrel, one shared world, many lived outcomes."
        note="story first, method intact"
      />

      {mainArtifact && (
        <EventAnchor
          date={mainArtifact.snapshotDate}
          title={mainArtifact.title}
          description={mainArtifact.summary}
        />
      )}

      {mainArtifact && altBranches.length > 0 && (
        <SplitPanel
          left={
            <article className="yy-storyPanel">
              <div className="yy-storyPanel__head">
                <MonoLabel>path · main</MonoLabel>
                <Pill>main path</Pill>
              </div>
              <h3>Main</h3>
              <div className="yy-storyCopy">
                {mainArtifact.narrative.split('\n\n').filter(Boolean).slice(0, 2).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <PathStateRow items={[
                { label: 'health', value: Math.round(mainArtifact.statsAfter.health * 100), tone: mainArtifact.statsAfter.health >= 0.6 ? 'up' : 'down' },
                { label: 'food', value: Math.round(mainArtifact.statsAfter.food * 100), tone: mainArtifact.statsAfter.food >= 0.6 ? 'up' : 'down' },
                { label: 'attention', value: Math.round(mainArtifact.statsAfter.attention * 100), tone: mainArtifact.statsAfter.attention >= 0.6 ? 'down' : 'neutral' },
              ]} />
            </article>
          }
          right={
            <AltBranchTabs
              tabs={altBranches.map((b) => {
                const art = altArtifacts[b.id]
                return {
                  branchId: b.id,
                  label: b.id,
                  sub: 'alt path',
                  children: art ? (
                    <article className="yy-storyPanel">
                      <div className="yy-storyPanel__head">
                        <MonoLabel>path · {b.id}</MonoLabel>
                        <Pill>alt path</Pill>
                      </div>
                      <h3>Alt · {b.id}</h3>
                      <div className="yy-storyCopy">
                        {art.narrative.split('\n\n').filter(Boolean).slice(0, 2).map((p, i) => (
                          <p key={i}>{p}</p>
                        ))}
                      </div>
                      <PathStateRow items={[
                        { label: 'health', value: Math.round(art.statsAfter.health * 100), tone: art.statsAfter.health >= 0.6 ? 'up' : 'down' },
                        { label: 'food', value: Math.round(art.statsAfter.food * 100), tone: art.statsAfter.food >= 0.6 ? 'up' : 'down' },
                        { label: 'attention', value: Math.round(art.statsAfter.attention * 100), tone: art.statsAfter.attention >= 0.6 ? 'down' : 'neutral' },
                      ]} />
                    </article>
                  ) : <p style={{ color: 'var(--ink-3)', fontSize: '13px' }}>No content yet.</p>,
                }
              })}
            />
          }
        />
      )}

      <SectionRule />

      <section className="yy-stepsGrid">
        {[
          ['1', 'One world event', 'A real-world condition arrives and becomes the shared seed of the day.'],
          ['2', 'Multiple paths', 'YY meets the same day with different reserves, timing, and burdens.'],
          ['3', 'Visible divergence', 'You read the gap between paths as the story, not just the output.'],
          ['4', 'Method below the surface', 'The builder layer still exists, but it no longer blocks entry.'],
        ].map(([n, title, copy]) => (
          <div key={n}>
            <MonoLabel>{n}</MonoLabel>
            <h3>{title}</h3>
            <p>{copy}</p>
          </div>
        ))}
      </section>

      <SectionRule />

      {latestRun && (
        <BranchTree
          root={`Run ${latestRun.runDate}`}
          branches={latestRun.branches.map((b, i) => ({
            label: b.id === 'main' ? 'Main' : `Alt · ${b.id}`,
            note: `${b.publishedDays} day${b.publishedDays !== 1 ? 's' : ''} published`,
            active: i === 0,
          }))}
        />
      )}

      <section className="pt-4 border-t border-rule" style={{ marginTop: '3rem' }}>
        <p className="font-mono text-xs text-ink-4">
          The reasoning behind every decision lives in the{' '}
          <Link
            href="/adrs/"
            className="text-ink-3 hover:text-ink transition-colors border-b border-ink-4 hover:border-ink"
          >
            architecture decisions (ADRs)
          </Link>
          {' · '}
          <a
            href="/llms.txt"
            className="text-ink-3 hover:text-ink transition-colors font-mono border-b border-ink-4 hover:border-ink"
          >
            /llms.txt
          </a>
        </p>
      </section>
    </PageShell>
  )
}
