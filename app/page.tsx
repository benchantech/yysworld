import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { homeBreadcrumbs } from '@/lib/nav'
import { schemaBreadcrumbList, schemaWebSite } from '@/lib/jsonld'
import { getStaticRuns } from '@/lib/runs'

export const metadata: Metadata = {
  title: 'yysworld',
  description:
    'One character. Multiple timelines. YY (a squirrel) lives through the same real-world events across branching paths — diverging based on circumstance, burden, and accumulated state. Every branch is traceable.',
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

  return (
    <>
      <JsonLd schema={[schemaWebSite(), schemaBreadcrumbList(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 space-y-10">

        {/* Hero */}
        <section className="space-y-4">
          <h1 className="text-sm font-medium text-zinc-50">
            One being. Multiple timelines. All traceable.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-prose">
            YY is a squirrel. Every day, the same real-world event reaches every timeline —
            but lands differently depending on what YY has accumulated: food, health, attention,
            burdens. The divergence between paths is the point.
          </p>
          <Link
            href="/yy/"
            className="inline-block text-xs text-zinc-400 border border-zinc-700 rounded px-3 py-1.5 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
          >
            Read the latest →
          </Link>
        </section>

        {/* Structure */}
        <section className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            How it works
          </h2>
          <dl className="space-y-2 text-xs">
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-zinc-300 font-medium">Character</dt>
              <dd className="text-zinc-500">A single being with calibrated traits, values, and a starting state.</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-zinc-300 font-medium pl-2">↳ Run</dt>
              <dd className="text-zinc-500">A bounded arc — usually one month — starting from a shared baseline.</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-zinc-300 font-medium pl-4">↳ Branch</dt>
              <dd className="text-zinc-500">A divergent path. Created when circumstances differ. Tracked independently from that point forward.</dd>
            </div>
            <div className="flex gap-3">
              <dt className="w-20 shrink-0 text-zinc-300 font-medium pl-6">↳ Day</dt>
              <dd className="text-zinc-500">One story day. The same real-world event; a different experience per branch.</dd>
            </div>
          </dl>
        </section>

        {/* Characters */}
        <section>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Characters
          </h2>
          <ul className="space-y-2">
            <li>
              <CharacterCard
                id="yy"
                name="YY"
                species="squirrel"
                traitSummary="curious · expressive · easily surprised"
                activeRuns={runs.length}
              />
            </li>
          </ul>
        </section>

        {/* Footer layer */}
        <section className="pt-4 border-t border-zinc-800 space-y-1.5">
          <p className="text-xs text-zinc-600">
            The reasoning behind every decision lives in the{' '}
            <Link href="/adrs/" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              architecture decisions (ADRs)
            </Link>
            .{' '}
            The full system architecture —  what exists, what is planned, how each layer connects — is in the{' '}
            <Link href="/system-map/" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              system map
            </Link>
            .
          </p>
          <p className="text-xs text-zinc-600">
            Machine-readable entry point:{' '}
            <a href="/llms.txt" className="text-zinc-500 hover:text-zinc-300 transition-colors font-mono">
              /llms.txt
            </a>
            . Data API:{' '}
            <span className="text-zinc-700 font-mono">/yy/data/{'{month}/{branch}/day/{N}.json'}</span>
          </p>
        </section>

      </div>
    </>
  )
}

function CharacterCard({
  id,
  name,
  species,
  traitSummary,
  activeRuns,
}: {
  id: string
  name: string
  species: string
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
        <span className="ml-2 text-xs text-zinc-600">{species}</span>
        <span className="ml-3 text-xs text-zinc-500">{traitSummary}</span>
      </div>
      <span className="ml-4 shrink-0 text-xs text-zinc-600 tabular-nums">
        {activeRuns} run{activeRuns !== 1 ? 's' : ''}
      </span>
    </Link>
  )
}
