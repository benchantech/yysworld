import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { BASE_URL, adrsBreadcrumbs } from '@/lib/nav'
import { getActiveAdrs, getMuseumCount } from '@/lib/adrs'
import { schemaBreadcrumbList } from '@/lib/jsonld'

export async function generateMetadata(): Promise<Metadata> {
  const adrs = getActiveAdrs()
  return {
    title: 'Architecture Decisions',
    description: `${adrs.length} active ADRs covering product thesis, character design, data architecture, URL structure, and discoverability. The complete reasoning chain behind yysworld.`,
    openGraph: {
      title: 'Architecture Decisions — yysworld',
      description: `${adrs.length} active ADRs. Every decision that shapes YY Branching World, with full context, alternatives considered, and invariants preserved.`,
      type: 'article',
      url: `${BASE_URL}/adrs/`,
    },
    alternates: {
      types: { 'text/plain': '/llms.txt' },
    },
  }
}

const breadcrumbs = adrsBreadcrumbs()

export default function AdrsIndexPage() {
  const adrs = getActiveAdrs()
  const museumCount = getMuseumCount()

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'yysworld Architecture Decision Records',
    description: `Complete ADR index for YY Branching World — ${adrs.length} active decisions with full context, alternatives, and invariants.`,
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

      <div className="mt-6 space-y-8">
        <header className="space-y-2">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">for builders</p>
          <h1 className="font-sans text-2xl font-medium text-ink tracking-tight">The Lab.</h1>
          <p className="font-sans text-base text-ink-2 leading-relaxed max-w-prose">
            {adrs.length} active decisions covering product thesis, character design, data
            architecture, URL structure, and discoverability. Everything on the human surface
            exists because of what lives here.
          </p>
          <p className="font-mono text-xs text-ink-3">
            <a href="/llms.txt" className="hover:text-ink transition-colors border-b border-rule hover:border-ink">
              /llms.txt
            </a>
            {' · '}
            <a href="/adrs/museum/" className="hover:text-ink transition-colors border-b border-rule hover:border-ink">
              museum ({museumCount} superseded)
            </a>
          </p>
        </header>

        <section aria-label="active decisions">
          <table className="w-full font-mono text-xs">
            <thead>
              <tr className="text-left border-b border-rule">
                <th className="pb-2 pr-4 font-medium text-ink-3 w-24 whitespace-nowrap uppercase tracking-widest">ID</th>
                <th className="pb-2 pr-4 font-medium text-ink-3 uppercase tracking-widest">Decision</th>
                <th className="pb-2 font-medium text-ink-3 w-24 text-right hidden sm:table-cell uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody>
              {adrs.map(adr => (
                <tr key={adr.slug} className="border-b border-rule-2 align-top">
                  <td className="py-3 pr-4 text-ink-3 whitespace-nowrap">
                    {adr.id}
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={`/adrs/${adr.slug}/`}
                      className="text-ink hover:text-ink-2 transition-colors border-b border-rule hover:border-ink"
                    >
                      {adr.title}
                    </a>
                    {adr.summary && (
                      <p className="mt-1 text-ink-3 leading-relaxed font-sans text-xs">{adr.summary}</p>
                    )}
                  </td>
                  <td className="py-3 text-ink-4 text-right whitespace-nowrap hidden sm:table-cell">
                    {adr.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="pt-2 border-t border-rule space-y-2">
          <h2 className="font-mono text-xs text-ink-3 uppercase tracking-widest">Museum</h2>
          <p className="font-sans text-sm text-ink-3 leading-relaxed">
            {museumCount} superseded ADRs preserved as scar records in the{' '}
            <a href="/adrs/museum/" className="text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink">
              museum
            </a>
            . Covers three eras: Case-002: YY&apos;s World (24), Pre-Manifest (19), Starter Kit v0.1 (14).
            Corrections are new events, not silent rewrites.
          </p>
        </section>
      </div>
    </>
  )
}
