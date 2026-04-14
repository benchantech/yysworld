import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { homeBreadcrumbs } from '@/lib/nav'
import { schemaBreadcrumbList, schemaWebSite } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'yysworld',
  openGraph: {
    title: 'yysworld',
    description: 'Same being, different paths.',
    type: 'website',
    url: '/',
  },
}

export default function HomePage() {
  const breadcrumbs = homeBreadcrumbs()

  return (
    <>
      <JsonLd schema={[schemaWebSite(), schemaBreadcrumbList(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 space-y-10">
        <section>
          <h1 className="text-base font-medium text-zinc-50">yysworld</h1>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-prose">
            Same being. Different paths. Watch how a single character responds to the same
            world under different circumstances — branching, diverging, drifting over time.
          </p>
        </section>

        <section>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Characters
          </h2>
          <ul className="space-y-2">
            <li>
              <CharacterCard
                id="yy"
                name="YY"
                traitSummary="curious · expressive · easily surprised"
                activeRuns={1}
              />
            </li>
          </ul>
        </section>
      </div>
    </>
  )
}

function CharacterCard({
  id,
  name,
  traitSummary,
  activeRuns,
}: {
  id: string
  name: string
  traitSummary: string
  activeRuns: number
}) {
  return (
    <Link
      href={`/${id}`}
      className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 hover:border-zinc-600 hover:bg-zinc-900 transition-colors"
    >
      <div className="min-w-0">
        <span className="text-sm font-medium text-zinc-50">{name}</span>
        <span className="ml-3 text-xs text-zinc-500">{traitSummary}</span>
      </div>
      <span className="ml-4 shrink-0 text-xs text-zinc-600 tabular-nums">
        {activeRuns} run{activeRuns !== 1 ? 's' : ''}
      </span>
    </Link>
  )
}
