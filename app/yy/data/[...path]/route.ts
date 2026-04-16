/**
 * Static JSON data API for yysworld — machine-readable layer (ADR-022).
 *
 * Handles two URL patterns:
 *   /yy/data/{month}/{branch}/day/{day}.json       → day artifact
 *   /yy/data/{month}/vs/{branchA}/{branchB}/day/{day}.json → comparison
 *
 * All responses are generated statically at build time (force-static).
 * Pages link to these via <link rel="alternate" type="application/json">.
 */

import { getDayParams, getVsParams, getDayArtifactByMonth, getComparisonArtifactByMonth } from '@/lib/runs'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams(): { path: string[] }[] {
  const params: { path: string[] }[] = []

  // Day artifacts: /yy/data/2026-04/main/day/3.json
  for (const { runDate, branch, day } of getDayParams()) {
    const month = runDate.slice(0, 7)
    params.push({ path: [month, branch, 'day', `${day}.json`] })
  }

  // Comparison artifacts: /yy/data/2026-04/vs/main/alt1-on-time/day/3.json
  for (const { runDate, comparison } of getVsParams()) {
    if (comparison.length !== 4 || comparison[2] !== 'day') continue
    const [branchA, branchB, , dayNum] = comparison
    const month = runDate.slice(0, 7)
    params.push({ path: [month, 'vs', branchA, branchB, 'day', `${dayNum}.json`] })
  }

  return params
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600',
}

function notFound() {
  return new Response(JSON.stringify({ error: 'not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params

  if (!path || path.length < 4) return notFound()

  const month = path[0]
  const lastSegment = path[path.length - 1]
  const day = lastSegment.endsWith('.json') ? lastSegment.slice(0, -5) : lastSegment

  // /yy/data/{month}/vs/{branchA}/{branchB}/day/{day}.json
  if (path[1] === 'vs' && path.length === 6 && path[4] === 'day') {
    const branchA = path[2]
    const branchB = path[3]
    const artifact = getComparisonArtifactByMonth(month, branchA, branchB, day)
    if (!artifact) return notFound()
    return new Response(JSON.stringify(artifact, null, 2), { headers: JSON_HEADERS })
  }

  // /yy/data/{month}/{branch}/day/{day}.json
  if (path.length === 4 && path[2] === 'day') {
    const branch = path[1]
    const artifact = getDayArtifactByMonth(month, branch, day)
    if (!artifact) return notFound()
    return new Response(JSON.stringify(artifact, null, 2), { headers: JSON_HEADERS })
  }

  return notFound()
}
