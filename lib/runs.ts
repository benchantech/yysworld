/**
 * Build-time run data reader.
 * Derives static page params from the runs/ directory so generateStaticParams
 * never needs hardcoded values — the nightly pipeline updates the branch files
 * and the next build picks up the new days automatically.
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

interface BranchFile {
  branch_id: string
  root_id: string
  character_id?: string
  created_at: string
  status: string
  sandbox?: boolean
  state?: { story_day?: number }
}

interface ArtifactFile {
  artifact_id: string
  branch_id: string
  root_id: string
  snapshot_id: string
  content?: {
    title?: string
    narrative?: string
    state_note?: string
    summary?: string
    tone?: string
    world_anchor?: string
  }
}

interface ConditionData {
  health?: number
  food?: number
  attention?: number
}

interface StateData {
  condition?: ConditionData
}

interface SnapshotFile {
  story_day: number
  snapshot_date: string
  branch_id?: string
  state_before?: StateData
  state_after?: StateData
}

interface ComparisonFile {
  comparison_id: string
  branch_a: string
  branch_b: string
  story_day: number
  snapshot_date: string
  content?: {
    divergence_summary?: string
    branch_a_path?: string
    branch_b_path?: string
    key_differences?: string[]
    shared_elements?: string[]
  }
}

export interface ComparisonArtifact {
  storyDay: number
  snapshotDate: string
  releaseAt: string
  branchAUrlId: string
  branchBUrlId: string
  divergenceSummary: string
  branchAPath: string
  branchBPath: string
  keyDifferences: string[]
  sharedElements: string[]
}

export interface Condition {
  health: number
  food: number
  attention: number
}

export interface DayArtifact {
  storyDay: number
  snapshotDate: string  // "2026-04-14"
  releaseAt: string     // ISO — midnight EST of snapshot_date + 1 day
  title: string
  tone: string
  narrative: string
  stateNote: string
  summary: string
  statsBefore: Condition
  statsAfter: Condition
  worldAnchor: string   // real-world inspiration; empty string if not set (ADR-036)
}

export interface BranchSummary {
  id: string            // URL-facing id: "main", "alt1-time-slip"
  publishedDays: number
  dayReleaseAts: string[] // releaseAt ISO string per day (index 0 = day 1, etc.)
}

export interface RunSummary {
  runDate: string     // "2026-04-01"
  character: string   // "yy"
  branches: BranchSummary[]
  sandbox: boolean    // true = discoverable by URL but never surfaced in nav/sitemap/feeds
}

/**
 * Returns the latest story day whose releaseAt has already passed.
 * Prevents gated future days from surfacing on summary pages.
 *
 * Empty string '' means the branch did not yet exist on that day (pre-fork).
 * Those slots are skipped entirely — they are not treated as "released".
 * undefined/missing means no release date recorded (old-style branch) → treated as released.
 *
 * Falls back to firstContentDay when all content is still gated,
 * or 1 if the branch has no content at all.
 */
export function getActiveDay(branch: BranchSummary, now = Date.now()): number {
  let firstContentDay: number | null = null
  for (let i = branch.publishedDays - 1; i >= 0; i--) {
    const ra = branch.dayReleaseAts[i]
    if (ra === '') continue                                     // pre-fork: no content on this day
    firstContentDay = i + 1                                    // lowest seen so far (loop is descending)
    if (!ra || new Date(ra).getTime() <= now) return i + 1    // released (or legacy no-date branch)
  }
  return firstContentDay ?? 1
}

// midnight EST (UTC-5) of the day after snapshot_date
function releaseAtFromSnapshotDate(snapshotDate: string): string {
  const [year, month, day] = snapshotDate.split('-').map(Number)
  // next calendar day at 05:00 UTC = midnight US/Eastern (EST, UTC-5)
  return new Date(Date.UTC(year, month - 1, day + 1, 5, 0, 0)).toISOString()
}

export function getStaticRuns(includeSandbox = false): RunSummary[] {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) return []

  const runs: RunSummary[] = []

  for (const rootId of readdirSync(runsDir)) {
    const branchesDir = join(runsDir, rootId, 'branches')
    if (!existsSync(branchesDir)) continue

    const branchFiles = readdirSync(branchesDir).filter((f) => f.endsWith('.json'))
    if (branchFiles.length === 0) continue

    // Build day→releaseAt map per branch from snapshot files
    const snapshotsDir = join(runsDir, rootId, 'snapshots')
    const releaseByBranch = new Map<string, Map<number, string>>()
    if (existsSync(snapshotsDir)) {
      for (const file of readdirSync(snapshotsDir).filter((f) => f.endsWith('.json'))) {
        try {
          const snap: SnapshotFile = JSON.parse(readFileSync(join(snapshotsDir, file), 'utf-8'))
          if (!snap.branch_id || !snap.story_day || !snap.snapshot_date) continue
          const urlId = snap.branch_id.replace(`branch_${rootId}_`, '')
          if (!releaseByBranch.has(urlId)) releaseByBranch.set(urlId, new Map())
          releaseByBranch.get(urlId)!.set(snap.story_day, releaseAtFromSnapshotDate(snap.snapshot_date))
        } catch { /* skip */ }
      }
    }

    let runDate: string | null = null
    let character = 'yy'
    let isSandbox = false
    const branches: BranchSummary[] = []

    for (const file of branchFiles) {
      try {
        const data: BranchFile = JSON.parse(
          readFileSync(join(branchesDir, file), 'utf-8'),
        )

        if (!runDate && data.created_at) {
          runDate = data.created_at.slice(0, 10)
        }
        if (data.character_id) character = data.character_id
        if (data.sandbox) isSandbox = true

        const branchId = data.branch_id.replace(`branch_${data.root_id}_`, '')
        const publishedDays = data.state?.story_day ?? 0
        const dayMap = releaseByBranch.get(branchId) ?? new Map<number, string>()
        const dayReleaseAts: string[] = []
        for (let day = 1; day <= publishedDays; day++) {
          dayReleaseAts.push(dayMap.get(day) ?? '')
        }

        branches.push({ id: branchId, publishedDays, dayReleaseAts })
      } catch {
        // malformed — skip
      }
    }

    if (runDate && branches.length > 0) {
      if (!isSandbox || includeSandbox) {
        runs.push({ runDate, character, branches, sandbox: isSandbox })
      }
    }
  }

  return runs.sort((a, b) => b.runDate.localeCompare(a.runDate))
}

/**
 * Returns all branch urlIds for a given runDate.
 * Used by the day page to build the branch switcher from real data.
 */
export function getRunBranches(runDate: string): string[] {
  const run = getStaticRuns(true).find((r) => r.runDate === runDate)
  return run?.branches.map((b) => b.id) ?? ['main']
}

/**
 * All day artifact params — derived from artifact files, not story_day.
 * Any artifact that exists in runs/ gets a static day page built for it,
 * including content that hasn't crossed the midnight gate yet (?preview shows it).
 *
 * Used by: app/yy/[runDate]/[branch]/day/[day]/page.tsx
 */
export function getDayParams(): { runDate: string; branch: string; day: string }[] {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) return []

  const params: { runDate: string; branch: string; day: string }[] = []
  const seen = new Set<string>()

  for (const rootId of readdirSync(runsDir)) {
    const artifactsDir = join(runsDir, rootId, 'artifacts')
    const snapshotsDir = join(runsDir, rootId, 'snapshots')
    if (!existsSync(artifactsDir) || !existsSync(snapshotsDir)) continue

    // Derive runDate from the first branch file
    let runDate: string | null = null
    const branchesDir = join(runsDir, rootId, 'branches')
    if (existsSync(branchesDir)) {
      const first = readdirSync(branchesDir).filter((f) => f.endsWith('.json'))[0]
      if (first) {
        try {
          const b: BranchFile = JSON.parse(readFileSync(join(branchesDir, first), 'utf-8'))
          runDate = b.created_at.slice(0, 10)
        } catch { /* skip */ }
      }
    }
    if (!runDate) continue

    for (const file of readdirSync(artifactsDir).filter((f) => f.endsWith('.json'))) {
      try {
        const artifact: ArtifactFile = JSON.parse(
          readFileSync(join(artifactsDir, file), 'utf-8'),
        )
        const snapshotPath = join(snapshotsDir, `${artifact.snapshot_id}.json`)
        if (!existsSync(snapshotPath)) continue

        const snapshot: SnapshotFile = JSON.parse(readFileSync(snapshotPath, 'utf-8'))
        const urlBranch = artifact.branch_id.replace(`branch_${rootId}_`, '')
        const key = `${runDate}/${urlBranch}/${snapshot.story_day}`

        if (!seen.has(key)) {
          seen.add(key)
          params.push({ runDate, branch: urlBranch, day: String(snapshot.story_day) })
        }
      } catch { /* malformed — skip */ }
    }
  }

  return params
}

/**
 * All comparison params (run-level and day-level).
 * Run-level pages exist for any run with 2+ branches.
 * Day-level pages are derived from comparison artifact files (parallel to getDayParams).
 * Used by: app/yy/[runDate]/vs/[...comparison]/page.tsx
 */
export function getVsParams(): { runDate: string; comparison: string[] }[] {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) return []

  const params: { runDate: string; comparison: string[] }[] = []
  const seenRunLevel = new Set<string>()

  for (const rootId of readdirSync(runsDir)) {
    // Derive runDate from branches
    let runDate: string | null = null
    const branchesDir = join(runsDir, rootId, 'branches')
    if (!existsSync(branchesDir)) continue
    const branchFiles = readdirSync(branchesDir).filter((f) => f.endsWith('.json'))
    if (branchFiles.length < 2) continue  // need at least 2 branches for vs

    // Collect branch urlIds
    const urlIds: string[] = []
    for (const file of branchFiles) {
      try {
        const b: BranchFile = JSON.parse(readFileSync(join(branchesDir, file), 'utf-8'))
        if (!runDate && b.created_at) runDate = b.created_at.slice(0, 10)
        urlIds.push(b.branch_id.replace(`branch_${rootId}_`, ''))
      } catch { /* skip */ }
    }
    if (!runDate) continue

    // Run-level: one page per branch pair (always exists once 2 branches exist)
    const main = urlIds.find((id) => id === 'main')
    const alts = urlIds.filter((id) => id !== 'main')
    for (const alt of alts) {
      const key = `${runDate}/main/${alt}`
      if (!seenRunLevel.has(key)) {
        seenRunLevel.add(key)
        params.push({ runDate, comparison: [main ?? urlIds[0], alt] })
      }
    }

    // Day-level: derived from comparison artifact files
    const comparisonsDir = join(runsDir, rootId, 'comparisons')
    if (!existsSync(comparisonsDir)) continue

    for (const file of readdirSync(comparisonsDir).filter((f) => f.endsWith('.json'))) {
      try {
        const cmp: ComparisonFile = JSON.parse(readFileSync(join(comparisonsDir, file), 'utf-8'))
        const urlA = cmp.branch_a.replace(`branch_${rootId}_`, '')
        const urlB = cmp.branch_b.replace(`branch_${rootId}_`, '')
        const [a, b] = urlA === 'main' ? [urlA, urlB] : [urlB, urlA]
        params.push({ runDate, comparison: [a, b, 'day', String(cmp.story_day)] })
      } catch { /* skip */ }
    }
  }

  return params
}

/**
 * Returns comparison artifact content for a branch pair + day, or null if none exists.
 */
export function getComparisonArtifact(
  runDate: string,
  branchA: string,
  branchB: string,
  day: string,
): ComparisonArtifact | null {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) return null

  const targetDay = parseInt(day, 10)

  for (const rootId of readdirSync(runsDir)) {
    // Verify runDate matches
    const branchesDir = join(runsDir, rootId, 'branches')
    if (!existsSync(branchesDir)) continue
    const firstBranch = readdirSync(branchesDir).filter((f) => f.endsWith('.json'))[0]
    if (!firstBranch) continue
    try {
      const b: BranchFile = JSON.parse(readFileSync(join(branchesDir, firstBranch), 'utf-8'))
      if (b.created_at.slice(0, 10) !== runDate) continue
    } catch { continue }

    const comparisonsDir = join(runsDir, rootId, 'comparisons')
    if (!existsSync(comparisonsDir)) return null

    for (const file of readdirSync(comparisonsDir).filter((f) => f.endsWith('.json'))) {
      try {
        const cmp: ComparisonFile = JSON.parse(readFileSync(join(comparisonsDir, file), 'utf-8'))
        if (cmp.story_day !== targetDay) continue

        const urlA = cmp.branch_a.replace(`branch_${rootId}_`, '')
        const urlB = cmp.branch_b.replace(`branch_${rootId}_`, '')
        // Match regardless of argument order
        if (!((urlA === branchA && urlB === branchB) || (urlA === branchB && urlB === branchA))) continue

        const c = cmp.content ?? {}
        return {
          storyDay: cmp.story_day,
          snapshotDate: cmp.snapshot_date,
          releaseAt: releaseAtFromSnapshotDate(cmp.snapshot_date),
          branchAUrlId: urlA,
          branchBUrlId: urlB,
          divergenceSummary: c.divergence_summary ?? '',
          branchAPath: c.branch_a_path ?? '',
          branchBPath: c.branch_b_path ?? '',
          keyDifferences: c.key_differences ?? [],
          sharedElements: c.shared_elements ?? [],
        }
      } catch { /* skip */ }
    }
  }

  return null
}

/**
 * Finds the runDate for a given month prefix (e.g. "2026-04" → "2026-04-14").
 * Assumes at most one active run per calendar month.
 */
export function getRunDateByMonth(month: string): string | null {
  const run = getStaticRuns(true).find((r) => r.runDate.startsWith(month + '-'))
  return run?.runDate ?? null
}

/**
 * Like getDayArtifact but resolves runDate from a month string.
 * Used by the /yy/data/ JSON API routes.
 */
export function getDayArtifactByMonth(
  month: string,
  branch: string,
  day: string,
): DayArtifact | null {
  const runDate = getRunDateByMonth(month)
  return runDate ? getDayArtifact(runDate, branch, day) : null
}

/**
 * Like getComparisonArtifact but resolves runDate from a month string.
 * Used by the /yy/data/ JSON API routes.
 */
export function getComparisonArtifactByMonth(
  month: string,
  branchA: string,
  branchB: string,
  day: string,
): ComparisonArtifact | null {
  const runDate = getRunDateByMonth(month)
  return runDate ? getComparisonArtifact(runDate, branchA, branchB, day) : null
}

/**
 * Returns the artifact content for a specific day, or null if none exists.
 * Includes releaseAt — the midnight EST timestamp after which the gate opens
 * for regular visitors. ?preview bypasses this entirely client-side.
 */
export function getDayArtifact(
  runDate: string,
  branch: string,
  day: string,
): DayArtifact | null {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) return null

  const targetDay = parseInt(day, 10)

  for (const rootId of readdirSync(runsDir)) {
    const branchesDir = join(runsDir, rootId, 'branches')
    const branchFile = join(branchesDir, `branch_${rootId}_${branch}.json`)
    if (!existsSync(branchFile)) continue

    // Verify this rootId matches the requested runDate.
    // Use root_id (not created_at) because alt branches can be created mid-run
    // and their created_at does not match the run's start date.
    try {
      const b: BranchFile = JSON.parse(readFileSync(branchFile, 'utf-8'))
      const rootRunDate = b.root_id.replace(/^root_/, '').replace(/_/g, '-')
      if (rootRunDate !== runDate) continue
    } catch { continue }

    const artifactsDir = join(runsDir, rootId, 'artifacts')
    const snapshotsDir = join(runsDir, rootId, 'snapshots')
    if (!existsSync(artifactsDir) || !existsSync(snapshotsDir)) return null

    const branchTag = `branch_${rootId}_${branch}`
    for (const file of readdirSync(artifactsDir).filter(
      (f) => f.includes(branchTag) && f.endsWith('.json'),
    )) {
      try {
        const artifact: ArtifactFile = JSON.parse(
          readFileSync(join(artifactsDir, file), 'utf-8'),
        )
        const snapshotPath = join(snapshotsDir, `${artifact.snapshot_id}.json`)
        if (!existsSync(snapshotPath)) continue

        const snapshot: SnapshotFile = JSON.parse(readFileSync(snapshotPath, 'utf-8'))
        if (snapshot.story_day !== targetDay) continue

        const c = artifact.content ?? {}
        const zeroCondition: Condition = { health: 0, food: 0, attention: 0 }
        const sb = snapshot.state_before?.condition ?? {}
        const sa = snapshot.state_after?.condition ?? {}
        return {
          storyDay: snapshot.story_day,
          snapshotDate: snapshot.snapshot_date,
          releaseAt: releaseAtFromSnapshotDate(snapshot.snapshot_date),
          title: c.title ?? '',
          tone: c.tone ?? '',
          narrative: c.narrative ?? '',
          stateNote: c.state_note ?? '',
          summary: c.summary ?? '',
          worldAnchor: c.world_anchor ?? '',
          statsBefore: {
            health: sb.health ?? zeroCondition.health,
            food: sb.food ?? zeroCondition.food,
            attention: sb.attention ?? zeroCondition.attention,
          },
          statsAfter: {
            health: sa.health ?? zeroCondition.health,
            food: sa.food ?? zeroCondition.food,
            attention: sa.attention ?? zeroCondition.attention,
          },
        }
      } catch { /* malformed — skip */ }
    }
  }

  return null
}
