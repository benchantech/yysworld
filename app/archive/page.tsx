import type { Metadata } from 'next'
import Link from 'next/link'
import { getStaticRuns } from '@/lib/runs'
import { buildCalendarCells, cellIsLink } from '@/lib/calendar'
import { PageHeader, BranchTree, PageShell } from '@/components/canon/Layout'
import { MonoLabel, NotebookCard, SectionRule } from '@/components/canon/Primitives'

export const metadata: Metadata = {
  title: 'Archive — yysworld',
  description: 'A readable record of runs, days, and branch density.',
}

function CalendarGrid({
  runDate,
  branchId,
  publishedDays,
  totalDays = 30,
}: {
  runDate: string
  branchId: string
  publishedDays: number
  totalDays?: number
}) {
  const todayStr = new Date().toISOString().slice(0, 10)
  const cells = buildCalendarCells(runDate, publishedDays, todayStr, totalDays)

  return (
    <div className="yy-calendar">
      {cells.map((cell, i) => {
        if (cell.kind === 'empty') return <div key={`empty-${i}`} className="is-empty" />

        const cls = [
          cell.today ? 'is-today' : '',
          cell.future ? 'is-future' : '',
        ].filter(Boolean).join(' ') || undefined

        if (cellIsLink(cell)) {
          return (
            <Link
              key={cell.day}
              href={`/yy/${runDate}/${branchId}/day/${cell.day}`}
              className={cls}
            >
              {cell.day}
            </Link>
          )
        }

        return <div key={cell.day} className={cls}>{cell.day}</div>
      })}
    </div>
  )
}

export default function ArchivePage() {
  const runs = getStaticRuns()

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="archive"
        title="A readable record of runs, days, and branch density."
      />

      {runs.length === 0 ? (
        <p className="yy-lede" style={{ marginTop: '1.5rem' }}>No runs published yet.</p>
      ) : (
        runs.map((run) => {
          const mainBranch = run.branches.find((b) => b.id === 'main') ?? run.branches[0]
          const altBranches = run.branches.filter((b) => b.id !== 'main')
          const allBranches = [
            { label: `Main`, note: `${mainBranch.publishedDays} days published`, active: true },
            ...altBranches.map((b) => ({
              label: `Alt · ${b.id}`,
              note: `${b.publishedDays} days published`,
            })),
          ]

          return (
            <section key={run.runDate} style={{ marginTop: '3rem' }}>
              <MonoLabel>{run.runDate}</MonoLabel>
              <div className="yy-archiveGrid" style={{ marginTop: '1rem' }}>
                <NotebookCard>
                  <MonoLabel>calendar</MonoLabel>
                  <CalendarGrid runDate={run.runDate} branchId={mainBranch.id} publishedDays={mainBranch.publishedDays} />
                  <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {run.branches.map((branch) => (
                      <Link
                        key={branch.id}
                        href={`/yy/${run.runDate}/${branch.id}/day/${branch.publishedDays}`}
                        className="yy-button yy-button--ghost"
                        style={{ fontSize: '0.7rem' }}
                      >
                        {branch.id} · day {branch.publishedDays}
                      </Link>
                    ))}
                  </div>
                </NotebookCard>
                <BranchTree
                  root={run.runDate}
                  branches={allBranches}
                />
              </div>
            </section>
          )
        })
      )}

      <SectionRule />

      <div className="yy-actionsRow" style={{ justifyContent: 'flex-start' }}>
        <Link className="yy-button yy-button--secondary" href="/compare">compare paths</Link>
        <Link className="yy-button yy-button--ghost" href="/today">today</Link>
      </div>
    </PageShell>
  )
}
