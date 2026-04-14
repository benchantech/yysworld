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
  }
}

interface SnapshotFile {
  story_day: number
  snapshot_date: string
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
}

export interface BranchSummary {
  id: string          // URL-facing id: "main", "alt1-time-slip"
  publishedDays: number
}

export interface RunSummary {
  runDate: string     // "2026-04-01"
  character: string   // "yy"
  branches: BranchSummary[]
}

// midnight EST (UTC-5) of the day after snapshot_date
function releaseAtFromSnapshotDate(snapshotDate: string): string {
  const [year, month, day] = snapshotDate.split('-').map(Number)
  // next calendar day at 05:00 UTC = midnight US/Eastern (EST, UTC-5)
  return new Date(Date.UTC(year, month - 1, day + 1, 5, 0, 0)).toISOString()
}

export function getStaticRuns(): RunSummary[] {
  const runsDir = join(process.cwd(), 'runs')
  if (!existsSync(runsDir)) return []

  const runs: RunSummary[] = []

  for (const rootId of readdirSync(runsDir)) {
    const branchesDir = join(runsDir, rootId, 'branches')
    if (!existsSync(branchesDir)) continue

    const branchFiles = readdirSync(branchesDir).filter((f) => f.endsWith('.json'))
    if (branchFiles.length === 0) continue

    let runDate: string | null = null
    let character = 'yy'
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

        const branchId = data.branch_id.replace(`branch_${data.root_id}_`, '')

        branches.push({
          id: branchId,
          publishedDays: data.state?.story_day ?? 0,
        })
      } catch {
        // malformed — skip
      }
    }

    if (runDate && branches.length > 0) {
      runs.push({ runDate, character, branches })
    }
  }

  return runs.sort((a, b) => b.runDate.localeCompare(a.runDate))
}

/**
 * Returns all branch urlIds for a given runDate.
 * Used by the day page to build the branch switcher from real data.
 */
export function getRunBranches(runDate: string): string[] {
  const run = getStaticRuns().find((r) => r.runDate === runDate)
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
 * All published comparison params (run-level and day-level).
 * Used by: app/yy/[runDate]/vs/[...comparison]/page.tsx
 * Returns [] until a second branch is added to a run.
 */
export function getVsParams(): { runDate: string; comparison: string[] }[] {
  const params: { runDate: string; comparison: string[] }[] = []

  for (const run of getStaticRuns()) {
    const branches = run.branches
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        const [a, b] =
          branches[i].id === 'main'
            ? [branches[i].id, branches[j].id]
            : [branches[j].id, branches[i].id]
        const maxDays = Math.max(branches[i].publishedDays, branches[j].publishedDays)

        params.push({ runDate: run.runDate, comparison: [a, b] })

        for (let d = 1; d <= maxDays; d++) {
          params.push({ runDate: run.runDate, comparison: [a, b, 'day', String(d)] })
        }
      }
    }
  }

  return params
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

    // Verify this rootId matches the requested runDate
    try {
      const b: BranchFile = JSON.parse(readFileSync(branchFile, 'utf-8'))
      if (b.created_at.slice(0, 10) !== runDate) continue
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
        return {
          storyDay: snapshot.story_day,
          snapshotDate: snapshot.snapshot_date,
          releaseAt: releaseAtFromSnapshotDate(snapshot.snapshot_date),
          title: c.title ?? '',
          tone: c.tone ?? '',
          narrative: c.narrative ?? '',
          stateNote: c.state_note ?? '',
          summary: c.summary ?? '',
        }
      } catch { /* malformed — skip */ }
    }
  }

  return null
}
