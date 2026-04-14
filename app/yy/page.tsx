import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { charBreadcrumbs, dayUrl, formatRunDate, formatBranch } from '@/lib/nav'
import { schemaBreadcrumbList, schemaCharacterPerson } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'YY',
  openGraph: {
    title: 'YY — yysworld',
    description: "YY's runs, newest first. Same being, different paths.",
    type: 'profile',
    url: '/yy',
  },
}

// Placeholder — populated by the nightly pipeline once the data layer is wired in.
const PLACEHOLDER_RUNS: RunSummary[] = [
  {
    runDate: '2026-04-01',
    currentDay: 14,
    totalDays: 30,
    branches: [{ id: 'main', label: 'main', isMain: true }],
    latestShift:
      'missed routine produced expressive reaction with no resolution; burden carried into the day',
  },
]

interface BranchMeta {
  id: string
  label: string
  isMain: boolean
}

interface RunSummary {
  runDate: string
  currentDay: number
  totalDays: number
  branches: BranchMeta[]
  latestShift: string
}

export default function YYPage() {
  const breadcrumbs = charBreadcrumbs('yy')

  return (
    <>
      <JsonLd
        schema={[
          schemaCharacterPerson(
            'YY',
            '/yy',
            'Fictional character — curious, expressive, easily surprised. Lives through shared world events across branching paths.',
          ),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 space-y-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-base font-medium text-zinc-50">YY</h1>
            <p className="mt-1 text-xs text-zinc-500">
              curious · expressive · easily surprised
            </p>
          </div>
          <Link
            href="/yy/about"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            profile →
          </Link>
        </div>

        <section>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Runs
          </h2>
          <ul className="space-y-3">
            {PLACEHOLDER_RUNS.map((run) => (
              <li key={run.runDate}>
                <RunCard run={run} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

function RunCard({ run }: { run: RunSummary }) {
  const mainBranch = run.branches.find((b) => b.isMain) ?? run.branches[0]
  const altBranches = run.branches.filter((b) => !b.isMain)

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        <Link
          href={dayUrl('yy', run.runDate, mainBranch.id, run.currentDay)}
          className="text-sm font-medium text-zinc-50 hover:text-zinc-300 transition-colors"
        >
          {formatRunDate(run.runDate)}
        </Link>
        <span className="text-xs text-zinc-600 tabular-nums">
          day {run.currentDay} / {run.totalDays}
        </span>
      </div>

      {run.latestShift && (
        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2">
          {run.latestShift}
        </p>
      )}

      {altBranches.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-zinc-600">branches:</span>
          {altBranches.map((b) => (
            <Link
              key={b.id}
              href={dayUrl('yy', run.runDate, b.id, 1)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {formatBranch(b.label)}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
