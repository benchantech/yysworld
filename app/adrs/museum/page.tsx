import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { BASE_URL } from '@/lib/nav'
import { getMuseumReadme } from '@/lib/adrs'
import { schemaBreadcrumbList } from '@/lib/jsonld'
import { renderAdrMarkdown } from '@/lib/mdrender'

export const metadata: Metadata = {
  title: 'ADR Museum',
  description:
    '57 superseded ADRs preserved as scar records: Case-002 YY\'s World (24), Pre-Manifest (19), Starter Kit v0.1 (14). Full reasoning lineage for yysworld.',
  openGraph: {
    title: 'ADR Museum — yysworld',
    description:
      'The complete lineage of thinking that led to the current active ADR set. 57 superseded decisions preserved per the YY Method: corrections are new events, not silent rewrites.',
    type: 'article',
    url: `${BASE_URL}/adrs/museum/`,
  },
}

const breadcrumbs = [
  { label: 'yysworld', href: '/' as const },
  { label: 'adrs', href: '/adrs/' as const },
  { label: 'museum' },
]

export default function MuseumPage() {
  const readme = getMuseumReadme()

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'yysworld ADR Museum',
    description: '57 superseded ADRs. Full reasoning lineage preserved as scar records.',
    url: `${BASE_URL}/adrs/museum/`,
    isPartOf: {
      '@type': 'CollectionPage',
      name: 'yysworld Architecture Decision Records',
      url: `${BASE_URL}/adrs/`,
    },
  }

  return (
    <>
      <JsonLd schema={[schema, schemaBreadcrumbList(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6">
        <header className="space-y-2 mb-6 pb-4 border-b border-rule">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">museum</p>
          <h1 className="font-sans text-2xl font-medium text-ink tracking-tight">ADR Museum</h1>
          <p className="font-sans text-sm text-ink-2 leading-relaxed max-w-prose">
            57 superseded ADRs preserved as scar records. Old decisions are not deleted —
            they are inspectable history. Read them in order to understand how the system evolved.
          </p>
        </header>

        <article className="space-y-0">
          {readme ? renderAdrMarkdown(readme) : (
            <p className="font-mono text-xs text-ink-4">Museum README not found.</p>
          )}
        </article>

        <nav className="mt-8 pt-4 border-t border-rule font-mono text-xs text-ink-3">
          <a href="/adrs/" className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">
            ← active decisions
          </a>
        </nav>
      </div>
    </>
  )
}
