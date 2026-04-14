import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/nav'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers — the public layer is designed to be fully readable (ADR-020).
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    // llms.txt — the AI agent entry point (ADR-021 priority 1).
    // Browsers and crawlers that respect this header will find it here.
    host: BASE_URL,
  }
}
