/**
 * Serves the YY character baseline as JSON at /yy/baseline.json (ADR-021).
 * Referenced from /yy/about metadata, llms.txt, and llms.txt data section.
 *
 * Reads from the most recent run's baseline file. Static — regenerated at deploy.
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-static'

export function GET() {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) {
    return new Response(JSON.stringify({ error: 'no runs found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Most recent run first (dirs are named root_YYYY_MM_DD, so lexicographic desc = recency)
  const rootDirs = readdirSync(runsDir).sort().reverse()
  for (const rootId of rootDirs) {
    const baselinePath = join(runsDir, rootId, 'baseline', 'yy_baseline.json')
    if (existsSync(baselinePath)) {
      const content = readFileSync(baselinePath, 'utf-8')
      return new Response(content, {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
        },
      })
    }
  }

  return new Response(JSON.stringify({ error: 'baseline not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}
