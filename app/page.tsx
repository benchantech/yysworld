import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd } from '@/components/JsonLd'
import { homeBreadcrumbs } from '@/lib/nav'
import { schemaBreadcrumbList, schemaWebSite } from '@/lib/jsonld'
import { getStaticRuns } from '@/lib/runs'
import { RunCard } from '@/components/nav/RunCard'

export const metadata: Metadata = {
  title: 'yysworld',
  description:
    'One character. Multiple timelines. YY (a squirrel) lives through the same real-world events across branching paths — diverging based on circumstance, burden, and accumulated state.',
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

      <div className="space-y-14">

        {/* Hero */}
        <section className="space-y-4">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">
            a slow daily story
          </p>
          <h1
            className="font-sans text-4xl sm:text-5xl font-medium leading-tight tracking-tight"
            style={{ maxWidth: '14ch', letterSpacing: '-0.02em' }}
          >
            Today, a squirrel named <em className="italic text-ink-2">YY</em> lived the same day twice.
          </h1>
          <p
            className="font-hand text-xl"
            style={{ color: 'var(--color-accent)' }}
          >
            — a slow daily story, for my kids and anyone else.
          </p>
          <p className="font-sans text-base text-ink-2 leading-relaxed max-w-prose">
            Real-world events reach every timeline — but land differently depending on what YY has
            accumulated. The gap between paths is the point.
          </p>
          <div className="flex items-center gap-3 flex-wrap pt-1">
            {runs.length > 0 && (
              <Link
                href="/yy/"
                className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 border border-ink text-ink bg-paper hover:bg-ink hover:text-paper transition-colors border-b border-b-ink"
              >
                read the latest →
              </Link>
            )}
            <Link
              href="/yy/about/"
              className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 border border-rule text-ink-2 hover:border-ink-2 hover:text-ink transition-colors border-b border-b-rule"
            >
              meet YY
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-mono text-xs text-ink-3 uppercase tracking-widest mb-5">
            How this works.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-rule">
            {[
              { n: '01', title: 'a character', body: 'YY is a squirrel. Curious, expressive, easily surprised. Calibrated through 22 scenarios before day one.' },
              { n: '02', title: 'a run', body: 'One month. A shared starting state. The same real-world events cross every path.' },
              { n: '03', title: 'a branch', body: 'When circumstances diverge, a new path starts. Tracked independently from that day forward.' },
              { n: '04', title: 'a day', body: 'You land here. You read both. The gap between them is the point.' },
            ].map(({ n, title, body }) => (
              <div
                key={n}
                className="px-4 py-5 border-r border-rule last:border-r-0 border-b border-b-rule sm:border-b-0"
              >
                <p
                  className="font-mono text-xs uppercase tracking-widest mb-2"
                  style={{ color: 'var(--color-accent)' }}
                >
                  {n}
                </p>
                <h3 className="font-sans text-base font-medium text-ink mb-2">{title}</h3>
                <p className="font-sans text-sm text-ink-3 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Runs */}
        {runs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-baseline justify-between">
              <h2 className="font-mono text-xs text-ink-3 uppercase tracking-widest">
                Published runs
              </h2>
              <Link
                href="/yy/"
                className="font-mono text-xs text-ink-3 hover:text-ink transition-colors border-b border-transparent hover:border-ink-4"
              >
                all →
              </Link>
            </div>
            <ul className="space-y-3">
              {runs.slice(0, 2).map((run) => (
                <li key={run.runDate}>
                  <RunCard run={run} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Builder layer */}
        <section className="pt-4 border-t border-rule space-y-1.5">
          <p className="font-mono text-xs text-ink-4">
            The reasoning behind every decision lives in the{' '}
            <Link
              href="/adrs/"
              className="text-ink-3 hover:text-ink transition-colors border-b border-ink-4 hover:border-ink"
            >
              architecture decisions (ADRs)
            </Link>
            {' · '}
            <a
              href="/llms.txt"
              className="text-ink-3 hover:text-ink transition-colors font-mono border-b border-ink-4 hover:border-ink"
            >
              /llms.txt
            </a>
          </p>
        </section>

      </div>
    </>
  )
}
