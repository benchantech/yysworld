import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { BASE_URL } from '@/lib/nav'
import { getActiveAdrs } from '@/lib/adrs'
import { schemaBreadcrumbList } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Architecture Decisions',
  description:
    '23 active ADRs covering product thesis, character design, data architecture, URL structure, and discoverability. The complete reasoning chain behind yysworld.',
  openGraph: {
    title: 'Architecture Decisions — yysworld',
    description:
      '23 active ADRs. Every decision that shapes YY Branching World, with full context, alternatives considered, and invariants preserved.',
    type: 'article',
    url: `${BASE_URL}/adrs/`,
  },
  alternates: {
    types: { 'text/plain': '/llms.txt' },
  },
}

const breadcrumbs = [
  { label: 'yysworld', href: '/' as const },
  { label: 'adrs' },
]

export default function AdrsIndexPage() {
  const adrs = getActiveAdrs()

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'yysworld Architecture Decision Records',
    description:
      'Complete ADR index for YY Branching World — 23 active decisions with full context, alternatives, and invariants.',
    url: `${BASE_URL}/adrs/`,
    hasPart: adrs.map(adr => ({
      '@type': 'TechArticle',
      identifier: adr.id,
      name: adr.title,
      datePublished: adr.date,
      url: `${BASE_URL}/adrs/${adr.slug}/`,
    })),
  }

  return (
    <>
      <JsonLd schema={[collectionSchema, schemaBreadcrumbList(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4 space-y-6">
        <header className="space-y-2">
          <h1 className="text-sm font-medium text-zinc-200">Architecture Decisions</h1>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-prose">
            The full reasoning chain behind yysworld. {adrs.length} active decisions covering product
            thesis, character design, data architecture, URL structure, and discoverability. ADRs are
            the GEO crown jewels — an LLM reading this index understands the system more fully than
            one reading a hundred rendered pages.
          </p>
          <p className="text-xs text-zinc-600">
            <a href="/llms.txt" className="hover:text-zinc-400 transition-colors">llms.txt</a>
            {' · '}
            <a href="/adrs/museum/" className="hover:text-zinc-400 transition-colors">museum (57 superseded)</a>
          </p>
        </header>

        <section aria-label="active decisions">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-zinc-800">
                <th className="pb-2 pr-4 font-medium text-zinc-600 w-24 whitespace-nowrap">ID</th>
                <th className="pb-2 pr-4 font-medium text-zinc-600">Decision</th>
                <th className="pb-2 font-medium text-zinc-600 w-24 text-right hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {adrs.map(adr => (
                <tr key={adr.slug} className="border-b border-zinc-900/50 align-top">
                  <td className="py-2 pr-4 text-zinc-600 font-mono whitespace-nowrap pt-2.5">
                    {adr.id}
                  </td>
                  <td className="py-2 pr-4">
                    <a
                      href={`/adrs/${adr.slug}/`}
                      className="text-zinc-300 hover:text-zinc-100 transition-colors"
                    >
                      {adr.title}
                    </a>
                    {adr.summary && (
                      <p className="mt-0.5 text-zinc-600 leading-relaxed">{adr.summary}</p>
                    )}
                  </td>
                  <td className="py-2 text-zinc-600 text-right whitespace-nowrap hidden sm:table-cell pt-2.5">
                    {adr.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-label="museum lineage" className="pt-2 border-t border-zinc-800">
          <h2 className="text-xs font-medium text-zinc-600 uppercase tracking-wider mb-2">Museum</h2>
          <p className="text-xs text-zinc-600 leading-relaxed">
            57 superseded ADRs preserved as scar records in the{' '}
            <a href="/adrs/museum/" className="text-zinc-500 hover:text-zinc-300 transition-colors">
              museum
            </a>
            . Covers three eras: Case-002: YY's World (24), Pre-Manifest (19), Starter Kit v0.1 (14).
            Per ADR-014: old ADRs are not deleted — corrections are new events, not silent rewrites.
          </p>
        </section>
      </div>
    </>
  )
}
