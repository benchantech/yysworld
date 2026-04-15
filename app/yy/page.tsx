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
  openGraph: {
    title: 'YY — yysworld',
    description: "YY's runs, newest first. Same being, different paths.",
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
