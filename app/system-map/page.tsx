import type { Metadata } from 'next'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { BASE_URL } from '@/lib/nav'
import { schemaBreadcrumbList } from '@/lib/jsonld'
import { renderAdrMarkdown } from '@/lib/mdrender'

export const metadata: Metadata = {
  title: 'System Map v1.0',
  description:
    'A true diagram of the YY Branching World system as currently constituted — ADR graph, world model, projection layer, execution stack, and update loop. Every unlabelled box exists. Every [planned] label is honest.',
  openGraph: {
    title: 'System Map v1.0 — yysworld',
    description:
      'The intentional architecture of yysworld. ADR graph → world model → projection layer → audiences → execution stack → update loop. Version 1.0.',
    type: 'article',
    url: `${BASE_URL}/system-map/`,
  },
  alternates: {
    types: { 'text/plain': '/llms.txt' },
  },
}

const breadcrumbs = [
  { label: 'yysworld', href: '/' as const },
  { label: 'system map' },
]

const techArticleSchema = {
  '@context': 'https://schema.org',
  '@type': 'TechArticle',
  name: 'YY Branching World — System Map v1.0',
  headline: 'System Map v1.0',
  description:
    'True diagram of the yysworld system as constituted. Every unlabelled box exists; every [planned] label is honest.',
  url: `${BASE_URL}/system-map/`,
  datePublished: '2026-04-16',
  author: { '@type': 'Person', name: 'Ben Chan' },
  isPartOf: { '@type': 'WebSite', name: 'yysworld', url: BASE_URL },
}

export default function SystemMapPage() {
  const mapPath = join(process.cwd(), 'docs/system-map-v1.0.md')
  const content = existsSync(mapPath) ? readFileSync(mapPath, 'utf-8') : ''

  return (
    <>
      <JsonLd schema={[techArticleSchema, schemaBreadcrumbList(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6">
        <header className="mb-6 space-y-2 pb-4 border-b border-rule">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">for builders</p>
          <h1 className="font-sans text-2xl font-medium text-ink tracking-tight">System Map</h1>
          <p className="font-mono text-xs text-ink-3">v1.0 · 2026-04-16 · current</p>
          <p className="font-sans text-sm text-ink-2 max-w-prose leading-relaxed">
            Every unlabelled box exists in this repo.
            Every <span className="font-mono text-xs text-ink-3">[planned]</span> label is honest about what does not.
            When the structure changes materially, v1.1 is written — v1.0 is not deleted.
          </p>
        </header>

        <article className="space-y-0">
          {content ? renderAdrMarkdown(content) : (
            <p className="font-mono text-xs text-ink-4">System map not found.</p>
          )}
        </article>

        <nav className="mt-8 pt-4 border-t border-rule flex justify-between font-mono text-xs text-ink-3">
          <a href="/" className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">← home</a>
          <a href="/adrs/" className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">architecture decisions →</a>
        </nav>
      </div>
    </>
  )
}
