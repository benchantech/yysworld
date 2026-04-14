import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/nav'

// Static pages always in the sitemap.
// Dynamic pages (snapshots, comparisons) are appended by the nightly pipeline,
// which regenerates this file from published manifests (ADR-021, ADR-009).
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/yy`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/yy/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // ADRs — the GEO crown jewels (ADR-021). Served statically from /adrs/.
    {
      url: `${BASE_URL}/adrs/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  // Placeholder: April 2026 run, main branch, day 1–14 (current).
  // In production: generated from the nightly manifest — all published snapshots.
  const currentRunDate = '2026-04-01'
  const currentBranch = 'main'
  const publishedDays = 14

  const snapshotPages: MetadataRoute.Sitemap = Array.from(
    { length: publishedDays },
    (_, i) => ({
      url: `${BASE_URL}/yy/${currentRunDate}/${currentBranch}/day/${i + 1}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }),
  )

  return [...staticPages, ...snapshotPages]
}
