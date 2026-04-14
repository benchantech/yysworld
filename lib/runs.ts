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

export interface BranchSummary {
  id: string          // URL-facing id: "main", "alt1-time-slip"
  publishedDays: number
}

export interface RunSummary {
  runDate: string     // "2026-04-01"
  character: string   // "yy"
  branches: BranchSummary[]
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

        // Run start date from branch created_at
        if (!runDate && data.created_at) {
          runDate = data.created_at.slice(0, 10)
        }
        if (data.character_id) character = data.character_id

        // Strip "branch_{root_id}_" prefix to get the URL-facing branch id.
        // "branch_root_2026_04_main" → "main"
        // "branch_root_2026_04_alt1-time-slip" → "alt1-time-slip"
        const branchId = data.branch_id.replace(`branch_${data.root_id}_`, '')

        branches.push({
          id: branchId,
          publishedDays: data.state?.story_day ?? 0,
        })
      } catch {
        // Malformed file — skip
      }
    }

    if (runDate && branches.length > 0) {
      runs.push({ runDate, character, branches })
    }
  }

  // Newest first
  return runs.sort((a, b) => b.runDate.localeCompare(a.runDate))
}

/**
 * All published day artifact params.
 * Used by: app/yy/[runDate]/[branch]/day/[day]/page.tsx
 */
export function getDayParams(): { runDate: string; branch: string; day: string }[] {
  const params: { runDate: string; branch: string; day: string }[] = []
  for (const run of getStaticRuns()) {
    for (const branch of run.branches) {
      for (let d = 1; d <= branch.publishedDays; d++) {
        params.push({ runDate: run.runDate, branch: branch.id, day: String(d) })
      }
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
    // Generate all unique branch pairs
    for (let i = 0; i < branches.length; i++) {
      for (let j = i + 1; j < branches.length; j++) {
        // main always comes first in the URL
        const [a, b] =
          branches[i].id === 'main'
            ? [branches[i].id, branches[j].id]
            : [branches[j].id, branches[i].id]
        const maxDays = Math.max(branches[i].publishedDays, branches[j].publishedDays)

        // Run-level: /vs/main/alt1-time-slip
        params.push({ runDate: run.runDate, comparison: [a, b] })

        // Day-level: /vs/main/alt1-time-slip/day/N
        for (let d = 1; d <= maxDays; d++) {
          params.push({ runDate: run.runDate, comparison: [a, b, 'day', String(d)] })
        }
      }
    }
  }

  return params
}
