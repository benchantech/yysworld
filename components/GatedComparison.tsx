'use client'

import { useEffect, useState } from 'react'

interface Props {
  releaseAt: string
  branchALabel: string
  branchBLabel: string
  divergenceSummary: string
  branchAPath: string
  branchBPath: string
  keyDifferences: string[]
  sharedElements: string[]
}

/**
 * Renders branch comparison content behind the same midnight gate as GatedArticle.
 * ?preview bypasses the gate; otherwise content appears after releaseAt.
 */
export function GatedComparison({
  releaseAt,
  branchALabel,
  branchBLabel,
  divergenceSummary,
  branchAPath,
  branchBPath,
  keyDifferences,
  sharedElements,
}: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has('preview')
    const released = Date.now() >= new Date(releaseAt).getTime()
    setVisible(preview || released)
  }, [releaseAt])

  if (!visible) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-6">
        <p className="text-xs text-zinc-600 italic">Available after midnight.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-zinc-300 leading-relaxed">{divergenceSummary}</p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 space-y-1">
          <p className="text-xs text-zinc-500 uppercase tracking-wider">{branchALabel}</p>
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
          <ul className="space-y-1">
            {keyDifferences.map((d, i) => (
              <li key={i} className="text-sm text-zinc-400 leading-relaxed before:content-['—'] before:mr-2 before:text-zinc-600">
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
