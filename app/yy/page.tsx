import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { charBreadcrumbs } from '@/lib/nav'
import { schemaBreadcrumbList, schemaCharacterPerson } from '@/lib/jsonld'
import { getStaticRuns } from '@/lib/runs'
import { RunCard } from '@/components/nav/RunCard'

export const metadata: Metadata = {
  title: 'YY',
  description:
    'YY is a squirrel — the canonical character at the center of yysworld. Curious (1.0), expressive (0.9), easily surprised (0.85). Branches from real starting states; drifts over time.',
  openGraph: {
    title: 'YY — yysworld',
    description: "YY's runs and branches. Same being, different paths — traceable from the same starting state.",
    type: 'profile',
    url: '/yy',
  },
}

export default function YYPage() {
  const runs = getStaticRuns()
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
              squirrel · curious · expressive · easily surprised
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
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Runs
            </h2>
          </div>
          <p className="text-xs text-zinc-600 mb-3">
            Each run is a bounded arc — usually one month. Branches diverge when circumstances differ
            and are tracked independently from that point.
          </p>
          {runs.length === 0 ? (
            <p className="text-xs text-zinc-600">No runs yet.</p>
          ) : (
            <ul className="space-y-3">
              {runs.map((run) => (
                <li key={run.runDate}>
                  <RunCard run={run} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
