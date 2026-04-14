'use client'

import { useEffect, useState } from 'react'
import type { PendingDay } from '@/lib/runs'

/**
 * Easter egg preview — renders pending day content only when ?preview is
 * present in the URL. Content is embedded in the page at build time;
 * this component just controls visibility client-side.
 */
export function PreviewReveal({ pending }: { pending: PendingDay }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(new URLSearchParams(window.location.search).has('preview'))
  }, [])

  if (!show) return null

  const paragraphs = pending.narrative.split('\n\n').filter(Boolean)

  return (
    <div className="mt-6 space-y-4">
      <p className="text-xs text-zinc-600 uppercase tracking-wider">
        day {pending.storyDay} — early
      </p>

      <article className="space-y-4">
        <h1 className="text-sm font-medium text-zinc-200">{pending.title}</h1>

        <div className="space-y-3">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm text-zinc-300 leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {pending.stateNote && (
          <p className="text-xs text-zinc-500 leading-relaxed border-t border-zinc-800 pt-3">
            {pending.stateNote}
          </p>
        )}

        {pending.summary && (
          <p className="text-xs text-zinc-600 italic">{pending.summary}</p>
        )}
      </article>
    </div>
  )
}
