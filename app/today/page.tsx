import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticRuns, getDayArtifact, getActiveDay, type DayArtifact } from '@/lib/runs'
import { PageShell } from '@/components/canon/Layout'
import { MonoLabel, Pill, SectionRule } from '@/components/canon/Primitives'
import { DayStrip } from '@/components/nav/DayStrip'
import { dayUrl } from '@/lib/nav'

export const metadata: Metadata = {
  title: 'Today — yysworld',
  description: 'One event. Two lived versions of it. The same day, different paths.',
}

function StoryPanel({
  artifact,
  branchId,
  runDate,
}: {
  artifact: DayArtifact
  branchId: string
  runDate: string
}) {
  const isAlt = branchId !== 'main'
  const stateItems = [
    { label: 'health', value: Math.round(artifact.statsAfter.health * 100), tone: artifact.statsAfter.health >= 0.6 ? 'up' as const : 'down' as const },
    { label: 'food', value: Math.round(artifact.statsAfter.food * 100), tone: artifact.statsAfter.food >= 0.6 ? 'up' as const : 'down' as const },
    { label: 'attention', value: Math.round(artifact.statsAfter.attention * 100), tone: artifact.statsAfter.attention >= 0.6 ? 'down' as const : 'neutral' as const },
  ]

  return (
    <article className="yy-storyPanel">
      <div className="yy-storyPanel__head">
        <MonoLabel>path · {isAlt ? 'on-time' : 'main'}</MonoLabel>
        <Pill>{isAlt ? 'alt path' : 'main path'}</Pill>
      </div>
      <h3>{artifact.title}</h3>
      <div className="yy-storyCopy">
        {artifact.narrative.split('\n\n').filter(Boolean).slice(0, 2).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <div className="yy-stateRow">
        {stateItems.map((item) => (
          <span key={item.label} className={item.tone === 'up' ? 'is-up' : item.tone === 'down' ? 'is-down' : ''}>
            <b>{item.label}</b> {item.value}
          </span>
        ))}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link
          href={dayUrl('yy', runDate, branchId, String(artifact.storyDay))}
          className="yy-button yy-button--primary"
          style={{ fontSize: '11px' }}
        >
          read full story →
        </Link>
      </div>
    </article>
  )
}

export default function TodayPage() {
  const runs = getStaticRuns()
  const latestRun = runs[0]

  if (!latestRun) {
    return (
      <PageShell>
        <MonoLabel>today</MonoLabel>
        <h1 className="yy-title" style={{ marginTop: '0.5rem' }}>No runs yet.</h1>
      </PageShell>
    )
  }

  const mainBranch = latestRun.branches.find((b) => b.id === 'main') ?? latestRun.branches[0]
  const altBranch = latestRun.branches.find((b) => b.id !== 'main')

  const activeDay = getActiveDay(mainBranch)

  const nextDay = mainBranch.publishedDays > activeDay ? activeDay + 1 : null
  const nextDayReleaseAt = nextDay ? mainBranch.dayReleaseAts[nextDay - 1] : null

  const mainArtifact = getDayArtifact(latestRun.runDate, mainBranch.id, String(activeDay))
  const altArtifact = altBranch
    ? getDayArtifact(latestRun.runDate, altBranch.id, String(activeDay))
    : null

  // Format "tomorrow" label for gated next day
  let tomorrowLabel = 'tomorrow'
  if (nextDayReleaseAt) {
    const d = new Date(nextDayReleaseAt)
    tomorrowLabel = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', timeZone: 'America/New_York' })
  }

  return (
    <PageShell wide>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <MonoLabel>today · day {activeDay}</MonoLabel>
        {activeDay > 1 && (
          <Link
            href={dayUrl('yy', latestRun.runDate, mainBranch.id, String(activeDay - 1))}
            className="yy-button yy-button--ghost"
            style={{ fontSize: '11px' }}
          >
            ← day {activeDay - 1}
          </Link>
        )}
      </div>

      {/* Event anchor */}
      {mainArtifact && (
        <section className="yy-eventAnchor">
          <div className="yy-eventAnchor__meta">
            <span>world event</span>
            <span>{mainArtifact.snapshotDate}</span>
          </div>
          <h2>{mainArtifact.title}</h2>
          <p>{mainArtifact.summary}</p>
        </section>
      )}

      {/* Side-by-side stories */}
      {mainArtifact && altArtifact ? (
        <section className="yy-splitPanel" style={{ marginTop: '24px' }}>
          <div><StoryPanel artifact={mainArtifact} branchId={mainBranch.id} runDate={latestRun.runDate} /></div>
          <div><StoryPanel artifact={altArtifact} branchId={altBranch!.id} runDate={latestRun.runDate} /></div>
        </section>
      ) : mainArtifact ? (
        <section style={{ marginTop: '24px' }}>
          <StoryPanel artifact={mainArtifact} branchId={mainBranch.id} runDate={latestRun.runDate} />
        </section>
      ) : (
        <p className="yy-lede" style={{ marginTop: '1.5rem', color: 'var(--ink-3)' }}>
          Day {activeDay} content coming soon.
        </p>
      )}

      {/* Branch strip — choose which path to read in full */}
      {altBranch && (
        <div className="yy-branchNav">
          <MonoLabel>choose a path</MonoLabel>
          <div className="yy-branchNav__options">
            <Link href={dayUrl('yy', latestRun.runDate, mainBranch.id, String(activeDay))} className="yy-branchNav__item">
              <span className="yy-branchNav__label">main</span>
              <span className="yy-branchNav__sub">default sequence</span>
            </Link>
            <Link href={dayUrl('yy', latestRun.runDate, altBranch.id, String(activeDay))} className="yy-branchNav__item">
              <span className="yy-branchNav__label">{altBranch.id}</span>
              <span className="yy-branchNav__sub">alternate path</span>
            </Link>
          </div>
        </div>
      )}

      {/* Day navigation strip */}
      <DayStrip
        totalDays={mainBranch.publishedDays}
        currentDay={activeDay}
        releaseAts={mainBranch.dayReleaseAts}
        makeDayHref={(d) => dayUrl('yy', latestRun.runDate, mainBranch.id, String(d))}
      />

      {/* Gated next day teaser */}
      {nextDay && (
        <div className="yy-nextTeaser">
          <MonoLabel>day {nextDay}</MonoLabel>
          <p>arrives {tomorrowLabel}</p>
        </div>
      )}

      <SectionRule />

      <div className="yy-actionsRow">
        <Link className="yy-button yy-button--secondary" href="/compare">compare paths</Link>
        <Link className="yy-button yy-button--secondary" href="/archive">all days</Link>
        <span className="yy-provenance">human-guided · ai-assisted · archived nightly</span>
      </div>

    </PageShell>
  )
}
