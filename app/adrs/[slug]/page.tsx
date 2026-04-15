import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { BASE_URL } from '@/lib/nav'
import { getAdrBySlug, getAdrSlugs, getActiveAdrs } from '@/lib/adrs'
import { schemaBreadcrumbList } from '@/lib/jsonld'
import { renderAdrMarkdown } from '@/lib/mdrender'

export const dynamicParams = false

export function generateStaticParams(): { slug: string }[] {
  return getAdrSlugs().map(slug => ({ slug }))
}

interface Params {
  slug: string
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const adr = getAdrBySlug(slug)
  if (!adr) return {}

  const { meta } = adr
  const pageUrl = `${BASE_URL}/adrs/${slug}/`

  return {
    title: `${meta.id} — ${meta.title}`,
    description: meta.summary || `${meta.id}: ${meta.title}. Status: ${meta.status}. Date: ${meta.date}.`,
    openGraph: {
      title: `${meta.id} — ${meta.title} — yysworld ADRs`,
      description: meta.summary || `Architecture decision ${meta.id}: ${meta.title}.`,
      type: 'article',
      url: pageUrl,
      publishedTime: meta.date,
    },
  }
}

export default async function AdrPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const adr = getAdrBySlug(slug)
  if (!adr) notFound()

  const { meta } = adr
  const pageUrl = `${BASE_URL}/adrs/${slug}/`

  const breadcrumbs = [
    { label: 'yysworld', href: '/' as const },
    { label: 'adrs', href: '/adrs/' as const },
    { label: meta.id },
  ]

  // Build id→slug map so dependsOn citations resolve to specific ADR URLs
  const adrSlugMap: Record<string, string> = Object.fromEntries(
    getActiveAdrs().map(a => [a.id, a.slug]),
  )

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    identifier: meta.id,
    name: meta.title,
    headline: `${meta.id} — ${meta.title}`,
    datePublished: meta.date,
    url: pageUrl,
    description: meta.summary,
    author: { '@type': 'Person', name: 'Ben Chan' },
    isPartOf: {
      '@type': 'CollectionPage',
      name: 'yysworld Architecture Decision Records',
      url: `${BASE_URL}/adrs/`,
    },
    ...(meta.dependsOn.length > 0 && {
      citation: meta.dependsOn.map(dep => ({
        '@type': 'TechArticle',
        identifier: dep,
        url: adrSlugMap[dep]
          ? `${BASE_URL}/adrs/${adrSlugMap[dep]}/`
          : `${BASE_URL}/adrs/`,
      })),
    }),
  }

  return (
    <>
      <JsonLd schema={[techArticleSchema, schemaBreadcrumbList(breadcrumbs)]} />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-4">
        {/* Header */}
        <header className="space-y-1 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-600">{meta.id}</span>
            <span className="text-xs text-zinc-700">·</span>
            <span className="text-xs text-zinc-600">{meta.status}</span>
            <span className="text-xs text-zinc-700">·</span>
            <span className="text-xs text-zinc-600">{meta.date}</span>
          </div>
          <h1 className="text-sm font-medium text-zinc-200">{meta.title}</h1>
          {meta.dependsOn.length > 0 && (
            <p className="text-xs text-zinc-600">
              depends on{' '}
              {meta.dependsOn.map((dep, i) => (
                <span key={dep}>
                  {i > 0 && ', '}
                  <a
                    href={`/adrs/`}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {dep}
                  </a>
                </span>
              ))}
            </p>
          )}
        </header>

        {/* Rendered body */}
        <article className="space-y-0">
          {renderAdrMarkdown(adr.content)}
        </article>

        {/* Footer nav */}
        <nav
          aria-label="ADR navigation"
          className="mt-8 pt-4 border-t border-zinc-800 flex justify-between text-xs text-zinc-600"
        >
          <a href="/adrs/" className="hover:text-zinc-300 transition-colors">
            ← all decisions
          </a>
          {meta.num > 1 && (
            <a
              href={`/adrs/`}
              className="hover:text-zinc-300 transition-colors"
            >
              index →
            </a>
          )}
        </nav>
      </div>
    </>
  )
}
