/**
 * Static JSON data API for yysworld — machine-readable layer (ADR-022, ADR-040).
 *
 * All responses are generated statically at build time (force-static).
 * Every JSON response carries `$schema` and `_links` so AI agents can
 * traverse the system without out-of-band knowledge.
 *
 * Endpoint map (ADR-040):
 *   /yy/data/index.json                                     → discovery manifest
 *   /yy/data/{month}/manifest.json                          → per-run manifest
 *   /yy/data/{month}/world-seed.json                        → world rules
 *   /yy/data/{month}/baseline.json                          → per-run baseline
 *   /yy/data/{month}/ledger.jsonl                           → ND-JSON event stream
 *   /yy/data/{month}/events/{file}                          → individual event
 *   /yy/data/{month}/decisions/{file}                       → individual decision
 *   /yy/data/{month}/{branch}/index.json                    → branch series
 *   /yy/data/{month}/{branch}/snapshots/{day}.json          → snapshot
 *   /yy/data/{month}/{branch}/day/{day}.json                → artifact
 *   /yy/data/{month}/vs/{a}/{b}/day/{day}.json              → comparison
 */

import {
  getDayParams,
  getVsParams,
  getDayArtifactByMonth,
  getComparisonArtifactByMonth,
  getStaticRuns,
  getRunDateByMonth,
  getRootIdByMonth,
  rootIdFromRunDate,
  readBaseline,
  readWorldSeed,
  listEventFiles,
  listDecisionFiles,
  listComparisonFiles,
  readEventFile,
  readDecisionFile,
  getSnapshotByDay,
  getLedger,
  type BaselineRecord,
  type RunSummary,
} from '@/lib/runs'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-static'
export const dynamicParams = false

const SCHEMAS = {
  index: '/yy/data/schemas/index.json',
  manifest: '/yy/data/schemas/manifest.json',
  branchIndex: '/yy/data/schemas/branch-index.json',
  artifact: '/yy/data/schemas/artifact.json',
  comparison: '/yy/data/schemas/comparison.json',
  snapshot: '/yy/data/schemas/snapshot.json',
  event: '/yy/data/schemas/event.json',
  decision: '/yy/data/schemas/decision.json',
  worldSeed: '/yy/data/schemas/world-seed.json',
  baseline: '/yy/data/schemas/baseline.json',
} as const

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=3600',
}

const NDJSON_HEADERS = {
  'Content-Type': 'application/x-ndjson',
  'Cache-Control': 'public, max-age=3600',
}

// ─── Static params ──────────────────────────────────────────────────────────

export function generateStaticParams(): { path: string[] }[] {
  const params: { path: string[] }[] = []

  // Top-level discovery manifest
  params.push({ path: ['index.json'] })

  // Per-run / per-branch
  for (const run of getStaticRuns(true)) {
    const month = run.runDate.slice(0, 7)
    const rootId = rootIdFromRunDate(run.runDate)

    params.push({ path: [month, 'manifest.json'] })
    params.push({ path: [month, 'world-seed.json'] })
    params.push({ path: [month, 'baseline.json'] })
    params.push({ path: [month, 'ledger.jsonl'] })

    for (const f of listEventFiles(rootId)) {
      params.push({ path: [month, 'events', f] })
    }
    for (const f of listDecisionFiles(rootId)) {
      params.push({ path: [month, 'decisions', f] })
    }

    for (const branch of run.branches) {
      params.push({ path: [month, branch.id, 'index.json'] })
      for (let day = 1; day <= branch.publishedDays; day++) {
        params.push({ path: [month, branch.id, 'snapshots', `${day}.json`] })
      }
    }
  }

  // Existing day artifacts
  for (const { runDate, branch, day } of getDayParams()) {
    const month = runDate.slice(0, 7)
    params.push({ path: [month, branch, 'day', `${day}.json`] })
  }

  // Existing comparisons
  for (const { runDate, comparison } of getVsParams()) {
    if (comparison.length !== 4 || comparison[2] !== 'day') continue
    const [branchA, branchB, , dayNum] = comparison
    const month = runDate.slice(0, 7)
    params.push({ path: [month, 'vs', branchA, branchB, 'day', `${dayNum}.json`] })
  }

  return params
}

// ─── Response helpers ───────────────────────────────────────────────────────

interface Envelope {
  $schema: string
  _links: Record<string, string | string[] | null>
  [key: string]: unknown
}

function envelope(schema: string, links: Record<string, string | string[] | null>, body: object): Envelope {
  return { $schema: schema, ...body, _links: links }
}

function jsonResponse(body: object): Response {
  return new Response(JSON.stringify(body, null, 2), { headers: JSON_HEADERS })
}

function notFound(): Response {
  return new Response(JSON.stringify({ error: 'not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  })
}

// ─── Builders ───────────────────────────────────────────────────────────────

function urlForRun(month: string) {
  return {
    self: `/yy/data/${month}`,
    manifest: `/yy/data/${month}/manifest.json`,
    worldSeed: `/yy/data/${month}/world-seed.json`,
    baseline: `/yy/data/${month}/baseline.json`,
    ledger: `/yy/data/${month}/ledger.jsonl`,
    branchIndex: (branch: string) => `/yy/data/${month}/${branch}/index.json`,
    artifact: (branch: string, day: number | string) => `/yy/data/${month}/${branch}/day/${day}.json`,
    snapshot: (branch: string, day: number | string) => `/yy/data/${month}/${branch}/snapshots/${day}.json`,
    comparison: (a: string, b: string, day: number | string) => `/yy/data/${month}/vs/${a}/${b}/day/${day}.json`,
    event: (file: string) => `/yy/data/${month}/events/${file}`,
    decision: (file: string) => `/yy/data/${month}/decisions/${file}`,
  }
}

interface ComparisonOnDisk {
  branch_a: string
  branch_b: string
  story_day: number
}

interface RunComparisons {
  pairs: { a: string; b: string; days: number[] }[]
}

function comparisonsForRun(rootId: string): RunComparisons {
  const map = new Map<string, number[]>()
  for (const f of listComparisonFiles(rootId)) {
    try {
      const cmp = JSON.parse(
        readFileSync(join(process.cwd(), 'runs', rootId, 'comparisons', f), 'utf-8'),
      ) as ComparisonOnDisk
      const a = cmp.branch_a.replace(`branch_${rootId}_`, '')
      const b = cmp.branch_b.replace(`branch_${rootId}_`, '')
      const [first, second] = a === 'main' ? [a, b] : [b, a]
      const k = `${first}|${second}`
      if (!map.has(k)) map.set(k, [])
      map.get(k)!.push(cmp.story_day)
    } catch { continue }
  }
  const pairs: RunComparisons['pairs'] = []
  for (const [k, days] of map) {
    const [a, b] = k.split('|')
    pairs.push({ a, b, days: [...new Set(days)].sort((x, y) => x - y) })
  }
  return { pairs }
}

function buildIndex(): object {
  const runs = getStaticRuns(true).map((run: RunSummary) => {
    const month = run.runDate.slice(0, 7)
    const rootId = rootIdFromRunDate(run.runDate)
    const seed = readWorldSeed(rootId) as { world_version?: string } | null
    const baseline = readBaseline(rootId)
    const u = urlForRun(month)
    const cmps = comparisonsForRun(rootId)

    return {
      run_id: rootId,
      run_date: run.runDate,
      month,
      voice_version: baseline?.voice_version ?? null,
      world_version: seed?.world_version ?? null,
      world_seed: u.worldSeed,
      baseline: u.baseline,
      manifest: u.manifest,
      ledger: u.ledger,
      sandbox: run.sandbox,
      branches: run.branches.map(b => ({
        id: b.id,
        index: u.branchIndex(b.id),
        published_days: Array.from({ length: b.publishedDays }, (_, i) => i + 1),
      })),
      comparisons: cmps.pairs.map(p => ({
        a: p.a,
        b: p.b,
        days: p.days,
        urls: p.days.map(d => u.comparison(p.a, p.b, d)),
      })),
    }
  })

  return {
    $schema: SCHEMAS.index,
    schema_version: '0.1',
    character: { id: 'yy', baseline: '/yy/baseline.json' },
    runs,
    _links: {
      self: '/yy/data/index.json',
      character_baseline: '/yy/baseline.json',
      llms_txt: '/llms.txt',
      sitemap: '/sitemap.xml',
    },
  }
}

function buildManifest(month: string, rootId: string, run: RunSummary): object {
  const seed = readWorldSeed(rootId) as { world_version?: string } | null
  const baseline = readBaseline(rootId)
  const u = urlForRun(month)
  const cmps = comparisonsForRun(rootId)

  return {
    $schema: SCHEMAS.manifest,
    schema_version: '0.1',
    run_id: rootId,
    run_date: run.runDate,
    month,
    voice_version: baseline?.voice_version ?? null,
    world_version: seed?.world_version ?? null,
    branches: run.branches.map(b => ({
      id: b.id,
      index: u.branchIndex(b.id),
      published_days: Array.from({ length: b.publishedDays }, (_, i) => i + 1),
      day_release_ats: b.dayReleaseAts,
      artifacts: Array.from({ length: b.publishedDays }, (_, i) => u.artifact(b.id, i + 1)),
      snapshots: Array.from({ length: b.publishedDays }, (_, i) => u.snapshot(b.id, i + 1)),
    })),
    events: listEventFiles(rootId).map(file => ({ file, url: u.event(file) })),
    decisions: listDecisionFiles(rootId).map(file => ({ file, url: u.decision(file) })),
    comparisons: cmps.pairs.map(p => ({
      a: p.a,
      b: p.b,
      days: p.days,
      urls: p.days.map(d => u.comparison(p.a, p.b, d)),
    })),
    _links: {
      self: u.manifest,
      index: '/yy/data/index.json',
      world_seed: u.worldSeed,
      baseline: u.baseline,
      ledger: u.ledger,
    },
  }
}

function buildBranchIndex(month: string, rootId: string, run: RunSummary, branchId: string): object | null {
  const branch = run.branches.find(b => b.id === branchId)
  if (!branch) return null
  const u = urlForRun(month)
  const days = []
  for (let day = 1; day <= branch.publishedDays; day++) {
    days.push({
      day,
      release_at: branch.dayReleaseAts[day - 1] ?? null,
      artifact: u.artifact(branchId, day),
      snapshot: u.snapshot(branchId, day),
    })
  }
  return {
    $schema: SCHEMAS.branchIndex,
    schema_version: '0.1',
    run_id: rootId,
    run_date: run.runDate,
    month,
    branch_id: branchId,
    days,
    _links: {
      self: u.branchIndex(branchId),
      manifest: u.manifest,
      index: '/yy/data/index.json',
      world_seed: u.worldSeed,
    },
  }
}

// ─── GET handler ────────────────────────────────────────────────────────────

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  if (!path || path.length === 0) return notFound()

  // /yy/data/index.json
  if (path.length === 1 && path[0] === 'index.json') {
    return jsonResponse(buildIndex())
  }

  // From here, path[0] is the month
  const month = path[0]
  const rootId = getRootIdByMonth(month)
  const runDate = getRunDateByMonth(month)
  if (!rootId || !runDate) return notFound()
  const run = getStaticRuns(true).find(r => r.runDate === runDate)
  if (!run) return notFound()
  const u = urlForRun(month)

  // /yy/data/{month}/manifest.json
  if (path.length === 2 && path[1] === 'manifest.json') {
    return jsonResponse(buildManifest(month, rootId, run))
  }

  // /yy/data/{month}/world-seed.json
  if (path.length === 2 && path[1] === 'world-seed.json') {
    const seed = readWorldSeed(rootId)
    if (!seed) return notFound()
    return jsonResponse(envelope(SCHEMAS.worldSeed, {
      self: u.worldSeed,
      manifest: u.manifest,
      index: '/yy/data/index.json',
    }, seed as object))
  }

  // /yy/data/{month}/baseline.json
  if (path.length === 2 && path[1] === 'baseline.json') {
    const b = readBaseline(rootId)
    if (!b) return notFound()
    return jsonResponse(envelope(SCHEMAS.baseline, {
      self: u.baseline,
      manifest: u.manifest,
      character_baseline: '/yy/baseline.json',
    }, b as unknown as object))
  }

  // /yy/data/{month}/ledger.jsonl
  if (path.length === 2 && path[1] === 'ledger.jsonl') {
    const events = getLedger(rootId)
    const body = events.length === 0
      ? ''
      : events.map(e => JSON.stringify(e)).join('\n') + '\n'
    return new Response(body, { headers: NDJSON_HEADERS })
  }

  // /yy/data/{month}/events/{file}
  if (path.length === 3 && path[1] === 'events') {
    const file = path[2]
    const ev = readEventFile(rootId, file)
    if (!ev) return notFound()
    return jsonResponse(envelope(SCHEMAS.event, {
      self: u.event(file),
      manifest: u.manifest,
      ledger: u.ledger,
    }, ev as object))
  }

  // /yy/data/{month}/decisions/{file}
  if (path.length === 3 && path[1] === 'decisions') {
    const file = path[2]
    const dec = readDecisionFile(rootId, file)
    if (!dec) return notFound()
    return jsonResponse(envelope(SCHEMAS.decision, {
      self: u.decision(file),
      manifest: u.manifest,
    }, dec as object))
  }

  // /yy/data/{month}/vs/{a}/{b}/day/{day}.json
  if (path[1] === 'vs' && path.length === 6 && path[4] === 'day') {
    const branchA = path[2]
    const branchB = path[3]
    const last = path[5]
    const day = last.endsWith('.json') ? last.slice(0, -5) : last
    const artifact = getComparisonArtifactByMonth(month, branchA, branchB, day)
    if (!artifact) return notFound()
    return jsonResponse(envelope(SCHEMAS.comparison, {
      self: u.comparison(branchA, branchB, day),
      manifest: u.manifest,
      branch_a_artifact: u.artifact(branchA, day),
      branch_b_artifact: u.artifact(branchB, day),
      branch_a_snapshot: u.snapshot(branchA, day),
      branch_b_snapshot: u.snapshot(branchB, day),
    }, artifact as unknown as object))
  }

  // /yy/data/{month}/{branch}/index.json
  if (path.length === 3 && path[2] === 'index.json') {
    const branch = path[1]
    const idx = buildBranchIndex(month, rootId, run, branch)
    if (!idx) return notFound()
    return jsonResponse(idx)
  }

  // /yy/data/{month}/{branch}/snapshots/{day}.json
  if (path.length === 4 && path[2] === 'snapshots') {
    const branch = path[1]
    const last = path[3]
    const day = last.endsWith('.json') ? last.slice(0, -5) : last
    const snap = getSnapshotByDay(rootId, branch, day)
    if (!snap) return notFound()
    return jsonResponse(envelope(SCHEMAS.snapshot, {
      self: u.snapshot(branch, day),
      manifest: u.manifest,
      branch_index: u.branchIndex(branch),
      artifact: u.artifact(branch, day),
    }, snap as object))
  }

  // /yy/data/{month}/{branch}/day/{day}.json
  if (path.length === 4 && path[2] === 'day') {
    const branch = path[1]
    const last = path[3]
    const day = last.endsWith('.json') ? last.slice(0, -5) : last
    const artifact = getDayArtifactByMonth(month, branch, day)
    if (!artifact) return notFound()
    // Compute comparison links for this day
    const cmps = comparisonsForRun(rootId)
    const cmpUrls: string[] = []
    for (const p of cmps.pairs) {
      if ((p.a === branch || p.b === branch) && p.days.includes(parseInt(day, 10))) {
        cmpUrls.push(u.comparison(p.a, p.b, day))
      }
    }
    return jsonResponse(envelope(SCHEMAS.artifact, {
      self: u.artifact(branch, day),
      manifest: u.manifest,
      branch_index: u.branchIndex(branch),
      snapshot: u.snapshot(branch, day),
      world_seed: u.worldSeed,
      comparisons: cmpUrls,
    }, artifact as unknown as object))
  }

  return notFound()
}
