import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/nav'
import { getStaticRuns, getVsParams } from '@/lib/runs'
import { getAdrSlugs } from '@/lib/adrs'

export const dynamic = 'force-static'

// Dynamic pages (snapshots, comparisons) are appended by the nightly pipeline,
// which regenerates this file from published manifests (ADR-021, ADR-009).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── Static shell pages ───────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/yy/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/yy/about/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // ADRs — GEO crown jewels (ADR-021)
    {
      url: `${BASE_URL}/adrs/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/adrs/museum/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // ── Individual ADR pages ─────────────────────────────────────────────────
  const adrPages: MetadataRoute.Sitemap = getAdrSlugs().map(slug => ({
    url: `${BASE_URL}/adrs/${slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ── Published day artifact pages (from real run data) ────────────────────
  const runs = getStaticRuns()
  const snapshotPages: MetadataRoute.Sitemap = []

  for (const run of runs) {
    for (const branch of run.branches) {
      if (branch.publishedDays === 0) continue
      for (let day = 1; day <= branch.publishedDays; day++) {
        snapshotPages.push({
          url: `${BASE_URL}/yy/${run.runDate}/${branch.id}/day/${day}/`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.8,
        })
      }
    }
  }

  // ── Branch comparison pages ──────────────────────────────────────────────
  const vsPages: MetadataRoute.Sitemap = getVsParams().map(({ runDate, comparison }) => {
    const [a, b, , day] = comparison
    const url = day
      ? `${BASE_URL}/yy/${runDate}/vs/${a}/${b}/day/${day}/`
      : `${BASE_URL}/yy/${runDate}/vs/${a}/${b}/`
    return {
      url,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    }
  })

  return [...staticPages, ...adrPages, ...snapshotPages, ...vsPages]
}
