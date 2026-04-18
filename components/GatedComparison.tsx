'use client'

import { useEffect, useState } from 'react'

interface Props {
  releaseAt: string
  initialVisible: boolean  // computed at build time: true when releaseAt is already past
  branchALabel: string
  branchBLabel: string
  divergenceSummary: string
  branchAPath: string
  branchBPath: string
  keyDifferences: string[]
  sharedElements: string[]
}

export function GatedComparison({
  releaseAt,
  initialVisible,
  branchALabel,
  branchBLabel,
  divergenceSummary,
  branchAPath,
  branchBPath,
  keyDifferences,
  sharedElements,
}: Props) {
  const [visible, setVisible] = useState(initialVisible)

  useEffect(() => {
    if (visible) return
    const preview = new URLSearchParams(window.location.search).has('preview')
    const released = Date.now() >= new Date(releaseAt).getTime()
    if (preview || released) setVisible(true)
  }, [releaseAt, visible])

  if (!visible) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-6">
        <p className="text-xs text-zinc-600 italic">Available after midnight.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-base text-zinc-300 leading-7">{divergenceSummary}</p>

      {/* Branch path cards — A (main/reference) gets a brighter border and label */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-3 space-y-1">
          <p className="text-xs text-zinc-300 uppercase tracking-wider">{branchALabel}</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{branchAPath}</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">{branchBLabel}</p>
          <p className="text-sm text-zinc-300 leading-relaxed">{branchBPath}</p>
        </div>
      </div>

      {keyDifferences.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">key differences</p>
          <ul className="space-y-1.5">
            {keyDifferences.map((d, i) => (
              <li key={i} className="text-sm text-zinc-300 leading-relaxed before:content-['—'] before:mr-2 before:text-zinc-600">
                {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {sharedElements.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">still shared</p>
          <ul className="space-y-1">
            {sharedElements.map((s, i) => (
              <li key={i} className="text-sm text-zinc-600 leading-relaxed before:content-['·'] before:mr-2">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
