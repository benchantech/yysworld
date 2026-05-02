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

  const allAdrs = getActiveAdrs()
  const currentIndex = allAdrs.findIndex(a => a.slug === slug)
  const prevAdr = currentIndex > 0 ? allAdrs[currentIndex - 1] : null
  const nextAdr = currentIndex < allAdrs.length - 1 ? allAdrs[currentIndex + 1] : null

  // Build id→slug map so dependsOn citations resolve to specific ADR pages.
  // Old ADRs use "YYBW-NNN" identity; new ADRs use "ADR-NNN". Alias both
  // forms to the same slug so cross-format references always resolve.
  const adrSlugMap: Record<string, string> = {}
  for (const a of allAdrs) {
    if (a.id) adrSlugMap[a.id] = a.slug
    if (a.num) {
      const padded = String(a.num).padStart(3, '0')
      adrSlugMap[`ADR-${padded}`] = a.slug
      adrSlugMap[`YYBW-${padded}`] = a.slug
    }
  }

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

      <div className="mt-6">
        {/* Header */}
        <header className="space-y-2 mb-6 pb-4 border-b border-rule">
          <div className="flex items-center gap-2 font-mono text-xs text-ink-3">
            <span>{meta.id}</span>
            <span className="text-ink-4">·</span>
            <span>{meta.status}</span>
            <span className="text-ink-4">·</span>
            <span>{meta.date}</span>
          </div>
          <h1 className="font-sans text-xl font-medium text-ink tracking-tight">{meta.title}</h1>
          {meta.dependsOn.length > 0 && (
            <p className="font-mono text-xs text-ink-3">
              depends on{' '}
              {meta.dependsOn.map((dep, i) => (
                <span key={dep}>
                  {i > 0 && ', '}
                  <a
                    href={adrSlugMap[dep] ? `/adrs/${adrSlugMap[dep]}/` : '/adrs/'}
                    className="text-ink-2 hover:text-ink transition-colors border-b border-rule hover:border-ink"
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
          className="mt-8 pt-4 border-t border-rule flex justify-between font-mono text-xs text-ink-3"
        >
          <div>
            {prevAdr ? (
              <a href={`/adrs/${prevAdr.slug}/`} className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">
                ← {prevAdr.id}
              </a>
            ) : (
              <a href="/adrs/" className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">
                ← all decisions
              </a>
            )}
          </div>
          <div>
            {nextAdr ? (
              <a href={`/adrs/${nextAdr.slug}/`} className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">
                {nextAdr.id} →
              </a>
            ) : (
              <a href="/adrs/" className="hover:text-ink transition-colors border-b border-transparent hover:border-ink-4">
                index →
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
