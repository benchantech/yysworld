'use client'

import { useEffect, useState } from 'react'
import { dayUrl, formatRunDate, formatBranch } from '@/lib/nav'
import type { RunSummary, BranchSummary } from '@/lib/runs'

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
  return branch.publishedDays > 0 ? 1 : 0
}

export function RunCard({ run }: { run: RunSummary }) {
  const mainBranch = run.branches.find((b) => b.id === 'main') ?? run.branches[0]
  const altBranches = run.branches.filter((b) => b.id !== 'main')

  const [visibleDay, setVisibleDay] = useState<Record<string, number>>(() =>
    Object.fromEntries(run.branches.map((b) => [b.id, defaultVisible(b)])),
  )

  useEffect(() => {
    setVisibleDay(Object.fromEntries(run.branches.map((b) => [b.id, latestVisible(b)])))
  }, [run.branches])

  const mainDay = visibleDay[mainBranch?.id ?? ''] ?? 0

  return (
    <div className="border border-rule bg-paper-2 px-5 py-4 space-y-3">
      <div className="flex items-center justify-between">
        {mainDay > 0 ? (
          <a
            href={dayUrl('yy', run.runDate, mainBranch.id, mainDay)}
            className="font-sans text-base font-medium text-ink hover:text-ink-2 transition-colors border-b border-ink-4 hover:border-ink"
          >
            {formatRunDate(run.runDate)}
          </a>
        ) : (
          <span className="font-sans text-base font-medium text-ink-3">
            {formatRunDate(run.runDate)}
          </span>
        )}
        <span className="font-mono text-xs text-ink-3 tabular-nums">
          {mainDay > 0 ? `day ${mainDay}` : 'starting tomorrow'}
        </span>
      </div>

      {mainDay === 0 && (
        <p className="font-mono text-xs text-ink-3">Day 1 available tomorrow.</p>
      )}

      {altBranches.length > 0 && mainDay > 0 && (
        <div className="flex items-center gap-3 flex-wrap pt-1 border-t border-rule-2">
          <span className="font-mono text-xs text-ink-4">other paths:</span>
          {altBranches.map((b) => {
            const day = visibleDay[b.id] ?? 0
            return day > 0 ? (
              <a
                key={b.id}
                href={dayUrl('yy', run.runDate, b.id, day)}
                className="font-mono text-xs border-b border-transparent hover:border-ink-3 transition-colors"
                style={{ color: 'var(--color-accent)' }}
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
