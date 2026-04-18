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

      <div className="mt-6 space-y-10">

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">the character</p>
            <h1 className="font-sans text-3xl font-medium text-ink tracking-tight">YY.</h1>
            <p className="font-sans text-base text-ink-2">
              A squirrel. Curious. Expressive. Easily surprised.
            </p>
          </div>
          <Link
            href="/yy/about/"
            className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink pb-0.5"
          >
            full profile →
          </Link>
        </div>

        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs text-ink-3 uppercase tracking-widest">
              Runs
            </h2>
          </div>
          <p className="font-sans text-sm text-ink-3 leading-relaxed max-w-prose">
            Each run is a bounded arc — usually one month. Branches diverge when circumstances differ
            and are tracked independently from that point.
          </p>
          {runs.length === 0 ? (
            <p className="font-mono text-xs text-ink-4">No runs yet.</p>
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
