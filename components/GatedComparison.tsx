'use client'

import { useEffect, useState } from 'react'

interface Props {
  releaseAt: string
  initialVisible: boolean
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
      <div className="border border-rule bg-paper-2 px-5 py-6">
        <p className="font-mono text-xs text-ink-4 italic">Available after midnight.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="font-sans text-base text-ink leading-relaxed">{divergenceSummary}</p>

      {/* Side-by-side paths */}
      <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 border border-rule">
        <div className="px-5 py-4 space-y-2">
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-ink)' }}
          >
            {branchALabel}
          </p>
          <p className="font-sans text-sm text-ink leading-relaxed">{branchAPath}</p>
        </div>
        <div className="px-5 py-4 space-y-2 border-t border-rule sm:border-t-0 sm:border-l bg-paper-2">
          <p
            className="font-mono text-xs uppercase tracking-widest"
            style={{ color: 'var(--color-accent)' }}
          >
            {branchBLabel}
          </p>
          <p className="font-sans text-sm text-ink leading-relaxed">{branchBPath}</p>
        </div>
      </div>

      {keyDifferences.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">key differences</p>
          <ul className="space-y-2">
            {keyDifferences.map((d, i) => (
              <li key={i} className="font-sans text-sm text-ink leading-relaxed flex gap-2">
                <span className="text-ink-4 shrink-0">—</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {sharedElements.length > 0 && (
        <div className="space-y-2">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">still shared</p>
          <ul className="space-y-1.5">
            {sharedElements.map((s, i) => (
              <li key={i} className="font-sans text-sm text-ink-3 leading-relaxed flex gap-2">
                <span className="text-ink-4 shrink-0">·</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
