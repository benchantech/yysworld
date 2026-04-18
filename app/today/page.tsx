import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticRuns, getDayArtifact, type DayArtifact } from '@/lib/runs'
import { PageHeader, EventAnchor, SplitPanel, PathStateRow, PageShell } from '@/components/canon/Layout'
import { MonoLabel, Pill, SectionRule } from '@/components/canon/Primitives'

export const metadata: Metadata = {
  title: 'Today — yysworld',
  description: 'One event. Two lived versions of it. The same day, different paths.',
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
      <h3>{isAlt ? 'on-time' : 'main'}</h3>
      <div className="yy-storyCopy">
        {artifact.narrative.split('\n\n').filter(Boolean).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <PathStateRow items={stateItems} />
    </article>
  )
}

export default function TodayPage() {
  const runs = getStaticRuns()
  const latestRun = runs[0]

  if (!latestRun) {
    return (
      <PageShell>
        <PageHeader eyebrow="today" title="No runs yet." />
      </PageShell>
    )
  }

  const mainBranch = latestRun.branches.find((b) => b.id === 'main') ?? latestRun.branches[0]
  const altBranch = latestRun.branches.find((b) => b.id !== 'main') ?? latestRun.branches[1]
  const latestDay = String(mainBranch.publishedDays)

  const mainArtifact = getDayArtifact(latestRun.runDate, mainBranch.id, latestDay)
  const altArtifact = altBranch ? getDayArtifact(latestRun.runDate, altBranch.id, latestDay) : null

  const eventDate = mainArtifact?.snapshotDate ?? latestRun.runDate
  const eventTitle = mainArtifact?.title ?? 'Today\'s conditions.'
  const eventDescription = mainArtifact?.summary ?? 'The same world event reaches every timeline.'

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="today"
        title="One event. Two lived versions of it."
        lede="The day page makes comparison effortless: event first, path spread second, state and provenance third."
      />

      <EventAnchor
        date={eventDate}
        title={eventTitle}
        description={eventDescription}
      />

      {mainArtifact && altArtifact ? (
        <SplitPanel
          left={<StoryPanel artifact={mainArtifact} branchId={mainBranch.id} />}
          right={<StoryPanel artifact={altArtifact} branchId={altBranch!.id} />}
        />
      ) : mainArtifact ? (
        <article className="yy-storyPanel">
          <div className="yy-storyCopy">
            {mainArtifact.narrative.split('\n\n').filter(Boolean).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </article>
      ) : null}

      <div className="yy-actionsRow">
        {Number(latestDay) > 1 && (
          <Link
            className="yy-button yy-button--ghost"
            href={`/yy/${latestRun.runDate}/${mainBranch.id}/day/${Number(latestDay) - 1}`}
          >
            previous day
          </Link>
        )}
        <Link
          className="yy-button yy-button--ghost"
          href={`/yy/${latestRun.runDate}/${mainBranch.id}/day/${latestDay}`}
        >
          full day →
        </Link>
        <span className="yy-provenance">human-guided · ai-assisted · archived nightly</span>
      </div>

      <SectionRule />

      <div className="yy-actionsRow" style={{ justifyContent: 'flex-start', gap: '1rem' }}>
        <Link className="yy-button yy-button--secondary" href="/compare">compare paths</Link>
        <Link className="yy-button yy-button--secondary" href="/archive">see archive</Link>
      </div>
    </PageShell>
  )
}
