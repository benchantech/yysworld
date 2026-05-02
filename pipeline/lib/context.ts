import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import type { RunContext, BranchMeta, BranchState, DayRecord, Baseline, InboxEntry, WorldSeed } from './types'

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T
}

function safeReadJson<T>(path: string): T | null {
  if (!existsSync(path)) return null
  try { return readJson<T>(path) } catch { return null }
}

// ─── Find the active run ──────────────────────────────────────────────────────

export function findActiveRun(repoRoot: string): { rootId: string; rootDir: string; runDate: string } | null {
  const runsDir = join(repoRoot, 'runs')
  if (!existsSync(runsDir)) return null

  const candidates: { rootId: string; rootDir: string; runDate: string }[] = []

  for (const rootId of readdirSync(runsDir)) {
    const rootDir = join(runsDir, rootId)
    const branchesDir = join(rootDir, 'branches')
    if (!existsSync(branchesDir)) continue

    const branchFiles = readdirSync(branchesDir).filter(f => f.endsWith('.json'))
    for (const file of branchFiles) {
      const branch = safeReadJson<{ status: string; created_at: string }>(join(branchesDir, file))
      if (branch?.status === 'active' && branch.created_at) {
        candidates.push({ rootId, rootDir, runDate: branch.created_at.slice(0, 10) })
        break
      }
    }
  }

  if (candidates.length === 0) return null
  // Most recent run
  return candidates.sort((a, b) => b.runDate.localeCompare(a.runDate))[0]
}

// ─── Load branches ────────────────────────────────────────────────────────────

export function loadBranches(rootDir: string, rootId: string): BranchMeta[] {
  const branchesDir = join(rootDir, 'branches')
  if (!existsSync(branchesDir)) return []

  const branches: BranchMeta[] = []

  for (const file of readdirSync(branchesDir).filter(f => f.endsWith('.json'))) {
    const data = safeReadJson<{
      branch_id: string
      root_id: string
      parent_branch_id: string | null
      status: string
      state: BranchState
    }>(join(branchesDir, file))

    if (!data) continue

    const prefix = `branch_${rootId}_`
    const urlId = data.branch_id.replace(prefix, '')

    branches.push({
      branchId: data.branch_id,
      urlId,
      parentBranchId: data.parent_branch_id,
      publishedDays: data.state?.story_day ?? 0,
      currentState: data.state,
    })
  }

  // main first, then alts in order
  return branches.sort((a, b) => {
    if (a.urlId === 'main') return -1
    if (b.urlId === 'main') return 1
    return a.urlId.localeCompare(b.urlId)
  })
}

// ─── Load recent days (up to N) ──────────────────────────────────────────────

export function loadRecentDays(rootDir: string, rootId: string, n = 7): DayRecord[] {
  const snapshotsDir = join(rootDir, 'snapshots')
  const artifactsDir = join(rootDir, 'artifacts')
  if (!existsSync(snapshotsDir)) return []

  // Group snapshots by story_day
  const byDay = new Map<number, DayRecord>()

  for (const file of readdirSync(snapshotsDir).filter(f => f.endsWith('.json'))) {
    const snap = safeReadJson<{
      story_day: number
      snapshot_date: string
      branch_id: string
      state_before: BranchState
      state_after: BranchState
    }>(join(snapshotsDir, file))
    if (!snap) continue

    const prefix = `branch_${rootId}_`
    const urlId = snap.branch_id.replace(prefix, '')

    if (!byDay.has(snap.story_day)) {
      byDay.set(snap.story_day, {
        date: snap.snapshot_date,
        storyDay: snap.story_day,
        stateAfter: {},
        summaries: {},
        narrativeSnippets: {},
      })
    }
    const day = byDay.get(snap.story_day)!
    day.stateAfter[urlId] = snap.state_after
  }

  // Add narrative snippets from artifacts
  if (existsSync(artifactsDir)) {
    for (const file of readdirSync(artifactsDir).filter(f => f.endsWith('.json'))) {
      const art = safeReadJson<{
        branch_id: string
        snapshot_id: string
        content?: { summary?: string; narrative?: string }
      }>(join(artifactsDir, file))
      if (!art?.content) continue

      // Find which day this belongs to via snapshot
      const snapPath = join(snapshotsDir, `${art.snapshot_id}.json`)
      const snap = safeReadJson<{ story_day: number }>(snapPath)
      if (!snap) continue

      const prefix = `branch_${rootId}_`
      const urlId = art.branch_id.replace(prefix, '')
      const day = byDay.get(snap.story_day)
      if (!day) continue

      if (art.content.summary) day.summaries[urlId] = art.content.summary
      if (art.content.narrative) {
        day.narrativeSnippets[urlId] = art.content.narrative.slice(0, 250)
      }
    }
  }

  return Array.from(byDay.values())
    .sort((a, b) => b.storyDay - a.storyDay)
    .slice(0, n)
    .reverse()
}

// ─── Find most recent author_intent from inbox ────────────────────────────────

export function findRecentAuthorIntent(rootDir: string, beforeDate: string): string | null {
  const inboxDir = join(rootDir, 'inbox')
  if (!existsSync(inboxDir)) return null

  const files = readdirSync(inboxDir)
    .filter(f => f.endsWith('.json') && f.replace('.json', '') < beforeDate)
    .sort()
    .reverse()

  for (const file of files) {
    const entry = safeReadJson<InboxEntry>(join(inboxDir, file))
    if (entry?.author_intent) return entry.author_intent
  }
  return null
}

// ─── World seed (ADR-038) ────────────────────────────────────────────────────

// v1.0 was authored retroactively (ADR-029) and is not a pipeline input. Skip it.
function loadWorldSeed(rootDir: string): WorldSeed | null {
  const seed = safeReadJson<WorldSeed>(join(rootDir, 'world-seed.json'))
  if (!seed) return null
  if (seed.world_version === '1.0') return null
  return seed
}

// ─── Voice file (ADR-034 / ADR-039) ───────────────────────────────────────────

function loadVoiceText(repoRoot: string, voiceVersion: string | undefined): string | null {
  if (!voiceVersion) return null
  const voicePath = join(repoRoot, 'docs', 'voice', `${voiceVersion}.md`)
  if (!existsSync(voicePath)) return null
  return readFileSync(voicePath, 'utf-8')
}

// ─── Load full context ────────────────────────────────────────────────────────

export function loadContext(repoRoot: string, targetDate: string): RunContext | null {
  const run = findActiveRun(repoRoot)
  if (!run) return null

  const { rootId, rootDir, runDate } = run
  const runsDir = join(repoRoot, 'runs')

  const baselinePath = join(rootDir, 'baseline', 'yy_baseline.json')
  const baseline = safeReadJson<Baseline>(baselinePath)
  if (!baseline) throw new Error(`Baseline not found at ${baselinePath}`)

  const worldSeed = loadWorldSeed(rootDir)
  const voiceText = loadVoiceText(repoRoot, baseline.voice_version)
  const branches = loadBranches(rootDir, rootId)
  const recentDays = loadRecentDays(rootDir, rootId)
  const recentAuthorIntent = findRecentAuthorIntent(rootDir, targetDate)

  return { rootId, runDate, runsDir, rootDir, baseline, worldSeed, voiceText, branches, recentDays, recentAuthorIntent }
}
