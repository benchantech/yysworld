import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/nav'
import { getStaticRuns, getVsParams } from '@/lib/runs'
import { getActiveAdrs } from '@/lib/adrs'

export const dynamic = 'force-static'

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
    {
      url: `${BASE_URL}/system-map/`,
      lastModified: new Date('2026-04-16'),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
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

  // ── Individual ADR pages — lastmod from actual ADR date ──────────────────
  const adrPages: MetadataRoute.Sitemap = getActiveAdrs().map(adr => ({
    url: `${BASE_URL}/adrs/${adr.slug}/`,
    lastModified: adr.date ? new Date(adr.date) : now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // ── Published day artifact pages ─────────────────────────────────────────
  const runs = getStaticRuns()
  const snapshotPages: MetadataRoute.Sitemap = []

  for (const run of runs) {
    for (const branch of run.branches) {
      if (branch.publishedDays === 0) continue
      for (let day = 1; day <= branch.publishedDays; day++) {
        // lastmod: the releaseAt for this day (when it became public)
        const releaseAt = branch.dayReleaseAts[day - 1]
        snapshotPages.push({
          url: `${BASE_URL}/yy/${run.runDate}/${branch.id}/day/${day}/`,
          lastModified: releaseAt ? new Date(releaseAt) : now,
          changeFrequency: 'weekly' as const,
          priority: branch.id === 'main' ? 0.85 : 0.8,
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
