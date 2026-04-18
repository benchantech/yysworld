import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticRuns, getDayArtifact, type DayArtifact } from '@/lib/runs'
import { PageHeader, SplitPanel, PathStateRow, PageShell, BranchTree } from '@/components/canon/Layout'
import { MonoLabel, Pill, SectionRule } from '@/components/canon/Primitives'

export const metadata: Metadata = {
  title: 'Compare — yysworld',
  description: 'Same day. Different sequence. Different cost. Compare paths across time.',
}

function StoryPanel({ artifact, branchId }: { artifact: DayArtifact; branchId: string }) {
  const isAlt = branchId !== 'main'
  const stateItems = [
    { label: 'health', value: Math.round(artifact.statsAfter.health * 100), tone: artifact.statsAfter.health >= 0.6 ? 'up' as const : 'down' as const },
    { label: 'food', value: Math.round(artifact.statsAfter.food * 100), tone: artifact.statsAfter.food >= 0.6 ? 'up' as const : 'down' as const },
    { label: 'attention', value: Math.round(artifact.statsAfter.attention * 100), tone: artifact.statsAfter.attention >= 0.6 ? 'down' as const : 'neutral' as const },
  ]

  return (
    <article className="yy-storyPanel">
      <div className="yy-storyPanel__head">
        <MonoLabel>path</MonoLabel>
        <Pill>{isAlt ? 'alt path' : 'main path'}</Pill>
      </div>
      <h3>Day {artifact.storyDay} · {isAlt ? 'on-time' : 'main'}</h3>
      <div className="yy-storyCopy">
        {artifact.narrative.split('\n\n').filter(Boolean).slice(0, 2).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <PathStateRow items={stateItems} />
    </article>
  )
}

export default function ComparePage() {
  const runs = getStaticRuns()
  const latestRun = runs[0]

  if (!latestRun || latestRun.branches.length < 2) {
    return (
      <PageShell>
        <PageHeader eyebrow="compare" title="No comparison available yet." />
        <p className="yy-lede" style={{ marginTop: '1.5rem' }}>
          Comparisons become available once a run has two or more branches.
        </p>
      </PageShell>
    )
  }

  const mainBranch = latestRun.branches.find((b) => b.id === 'main') ?? latestRun.branches[0]
  const altBranch = latestRun.branches.find((b) => b.id !== 'main') ?? latestRun.branches[1]
  const latestDay = String(mainBranch.publishedDays)

  // Build series for all published days
  type SeriesPoint = { label: string; main: DayArtifact | null; alt: DayArtifact | null }
  const series: SeriesPoint[] = []
  for (let d = 1; d <= mainBranch.publishedDays; d++) {
    series.push({
      label: `Day ${d}`,
      main: getDayArtifact(latestRun.runDate, mainBranch.id, String(d)),
      alt: getDayArtifact(latestRun.runDate, altBranch.id, String(d)),
    })
  }

  const latestMain = series[series.length - 1]?.main
  const latestAlt = series[series.length - 1]?.alt

  const branches = latestRun.branches.map((b) => ({
    label: b.id === 'main' ? 'Main' : `Alt · ${b.id}`,
    note: `${b.publishedDays} day${b.publishedDays !== 1 ? 's' : ''} published`,
    active: b.id === 'main',
  }))

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="compare"
        title="Same day. Different sequence. Different cost."
        lede="Comparison should feel more natural than drilling into archives."
      />

      {series.length > 0 && (
        <section className="yy-compareSeries">
          <div className="yy-compareSeries__head">
            <MonoLabel>food state over time</MonoLabel>
            <div className="yy-legend">
              <Pill>main</Pill>
              <Pill>{altBranch.id}</Pill>
            </div>
          </div>
          <div className="yy-bars">
            {series.map((point) => {
              const aVal = point.main ? Math.round(point.main.statsAfter.food * 100) : 0
              const bVal = point.alt ? Math.round(point.alt.statsAfter.food * 100) : 0
              return (
                <div key={point.label} className="yy-bars__row">
                  <span>{point.label}</span>
                  <div className="yy-bars__track">
                    <i style={{ width: `${aVal}%` }} />
                    <i className="is-second" style={{ width: `${bVal}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {latestMain && latestAlt && (() => {
        const healthGap = Math.round((latestMain.statsAfter.health - latestAlt.statsAfter.health) * 100)
        const foodGap = Math.round((latestMain.statsAfter.food - latestAlt.statsAfter.food) * 100)
        const attGap = Math.round((latestMain.statsAfter.attention - latestAlt.statsAfter.attention) * 100)
        const items = [
          { label: 'health gap', val: Math.abs(healthGap), delta: healthGap, favor: healthGap > 0 ? 'main' : healthGap < 0 ? altBranch.id : 'tied' },
          { label: 'food gap', val: Math.abs(foodGap), delta: foodGap, favor: foodGap > 0 ? 'main' : foodGap < 0 ? altBranch.id : 'tied' },
          { label: 'attention gap', val: Math.abs(attGap), delta: attGap, favor: attGap > 0 ? 'main' : attGap < 0 ? altBranch.id : 'tied' },
        ]
        return (
          <section className="yy-gapSummary">
            {items.map(({ label, val, favor }) => (
              <div key={label}>
                <MonoLabel>{label}</MonoLabel>
                <div className="yy-gapSummary__val">{val} pts</div>
                <div className={`yy-gapSummary__delta ${favor === 'main' ? 'is-up' : favor === altBranch.id ? 'is-down' : ''}`}>
                  {favor === 'tied' ? 'tied' : `→ ${favor} leads`}
                </div>
              </div>
            ))}
          </section>
        )
      })()}

      <SectionRule />

      {latestMain && latestAlt && (
        <SplitPanel
          left={<StoryPanel artifact={latestMain} branchId={mainBranch.id} />}
          right={<StoryPanel artifact={latestAlt} branchId={altBranch.id} />}
        />
      )}

      <BranchTree
        root={`Run ${latestRun.runDate}`}
        branches={branches}
      />

      <div className="yy-actionsRow" style={{ justifyContent: 'flex-start' }}>
        <Link
          className="yy-button yy-button--secondary"
          href={`/yy/${latestRun.runDate}/${mainBranch.id}/day/${latestDay}`}
        >
          read full day →
        </Link>
        <Link className="yy-button yy-button--ghost" href="/archive">
          archive
        </Link>
      </div>
    </PageShell>
  )
}
