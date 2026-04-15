'use client'

import { useEffect, useState } from 'react'
import { dayUrl, formatRunDate, formatBranch } from '@/lib/nav'
import type { RunSummary, BranchSummary } from '@/lib/runs'

/**
 * Computes the latest day that has passed its releaseAt gate.
 * Returns 0 if none are visible yet.
 *
 * Static default (before useEffect): day 1 (always safe when publishedDays > 0).
 * Client-side: recomputed with actual Date.now() so the link auto-upgrades
 * to the newest visible day without a redeploy — same pattern as GatedArticle.
 */
function latestVisible(branch: BranchSummary): number {
  const now = Date.now()
  let latest = 0
  for (let i = 0; i < branch.dayReleaseAts.length; i++) {
    const t = branch.dayReleaseAts[i]
    if (t && now >= new Date(t).getTime()) latest = i + 1
  }
  return latest
}

function defaultVisible(branch: BranchSummary): number {
  // Safe static default: day 1 if any days exist, 0 if none.
  // useEffect will immediately correct this to the real latest visible day.
  return branch.publishedDays > 0 ? 1 : 0
}

export function RunCard({ run }: { run: RunSummary }) {
  const mainBranch = run.branches.find((b) => b.id === 'main') ?? run.branches[0]
  const altBranches = run.branches.filter((b) => b.id !== 'main')

  // Keyed by branch id — starts at day 1 defaults, upgrades after hydration
  const [visibleDay, setVisibleDay] = useState<Record<string, number>>(() =>
    Object.fromEntries(run.branches.map((b) => [b.id, defaultVisible(b)])),
  )

  useEffect(() => {
    setVisibleDay(Object.fromEntries(run.branches.map((b) => [b.id, latestVisible(b)])))
  }, [run.branches])

  const mainDay = visibleDay[mainBranch?.id ?? ''] ?? 0

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 space-y-3">
      <div className="flex items-center justify-between">
        {mainDay > 0 ? (
          <a
            href={dayUrl('yy', run.runDate, mainBranch.id, mainDay)}
            className="text-sm font-medium text-zinc-50 hover:text-zinc-300 transition-colors"
          >
            {formatRunDate(run.runDate)}
          </a>
        ) : (
          <span className="text-sm font-medium text-zinc-500">
            {formatRunDate(run.runDate)}
          </span>
        )}
        <span className="text-xs text-zinc-600 tabular-nums">
          {mainDay > 0 ? `day ${mainDay}` : 'starting tomorrow'}
        </span>
      </div>

      {mainDay === 0 && (
        <p className="text-xs text-zinc-600">Day 1 available tomorrow.</p>
      )}

      {altBranches.length > 0 && mainDay > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-zinc-600">branches:</span>
          {altBranches.map((b) => {
            const day = visibleDay[b.id] ?? 0
            return day > 0 ? (
              <a
                key={b.id}
                href={dayUrl('yy', run.runDate, b.id, day)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {formatBranch(b.id)}
              </a>
            ) : null
          })}
        </div>
      )}
    </div>
  )
}
