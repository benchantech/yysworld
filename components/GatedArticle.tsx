'use client'

import { useEffect, useState } from 'react'

interface Props {
  releaseAt: string   // ISO string — gate opens at this time unless ?preview
  title: string
  tone: string
  narrative: string
  stateNote: string
  summary: string
}

/**
 * Renders artifact content behind a midnight gate.
 *
 * Gate logic (client-side only — content is embedded in the static build):
 *   - ?preview present → always visible
 *   - Date.now() >= releaseAt → visible (the day has passed)
 *   - Otherwise → "available after midnight" placeholder
 *
 * The gate will be replaced with proper auth when moving to Vercel.
 */
export function GatedArticle({ releaseAt, title, tone, narrative, stateNote, summary }: Props) {
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

  const paragraphs = narrative.split('\n\n').filter(Boolean)

  return (
    <article className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-sm font-medium text-zinc-200">{title}</h2>
        {tone && (
          <p className="text-xs text-zinc-600">{tone.replace(/_/g, ' ')}</p>
        )}
      </header>

      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-zinc-300 leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      {stateNote && (
        <p className="text-xs text-zinc-500 leading-relaxed border-t border-zinc-800 pt-3">
          {stateNote}
        </p>
      )}

      {summary && (
        <p className="text-xs text-zinc-600 italic">{summary}</p>
      )}
    </article>
  )
}
