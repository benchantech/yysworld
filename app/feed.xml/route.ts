import { BASE_URL } from '@/lib/nav'
import { getStaticRuns, getDayArtifact } from '@/lib/runs'

export const dynamic = 'force-static'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function rfcDate(iso: string): string {
  return new Date(iso).toUTCString()
}

export async function GET() {
  const runs = getStaticRuns()

  interface FeedItem {
    title: string
    url: string
    description: string
    pubDate: string
    guid: string
  }

  const items: FeedItem[] = []

  for (const run of runs) {
    for (const branch of run.branches) {
      if (branch.publishedDays === 0) continue
      for (let day = 1; day <= branch.publishedDays; day++) {
        const artifact = getDayArtifact(run.runDate, branch.id, String(day))
        if (!artifact) continue

        const branchLabel = branch.id.replace(/^alt\d+-/, '')
        const title = artifact.title
          ? `${artifact.title} — ${branchLabel} day ${day}`
          : `${branchLabel} · day ${day} — ${run.runDate}`

        const url = `${BASE_URL}/yy/${run.runDate}/${branch.id}/day/${day}/`

        items.push({
          title,
          url,
          description: artifact.summary || title,
          pubDate: artifact.releaseAt,
          guid: url,
        })
      }
    }
  }

  // Newest first
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const itemsXml = items
    .map(
      (item) => `
    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${rfcDate(item.pubDate)}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.guid)}</guid>
    </item>`,
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>yysworld</title>
    <link>${BASE_URL}/</link>
    <description>Same being, different paths. Daily artifacts from YY&#x2019;s branching life observatory.</description>
    <language>en-us</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
