'use client'

import { useEffect, useState } from 'react'
import { StatsBlock } from '@/components/StatsBlock'
import type { Condition } from '@/lib/runs'

interface Props {
  releaseAt: string   // ISO string — gate opens at this time unless ?preview
  title: string
  tone: string
  narrative: string
  stateNote: string
  summary: string
  storyDay: number
  statsBefore: Condition
  statsAfter: Condition
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
export function GatedArticle({ releaseAt, title, tone, narrative, stateNote, summary, storyDay, statsBefore, statsAfter }: Props) {
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

  // Strip the first paragraph if it echoes the title (LLMs sometimes repeat it)
  const normalize = (s: string) => s.replace(/[.\s]+$/, '').toLowerCase()
  const allParagraphs = narrative.split('\n\n').filter(Boolean)
  const paragraphs =
    allParagraphs.length > 0 && normalize(allParagraphs[0]) === normalize(title)
      ? allParagraphs.slice(1)
      : allParagraphs

  return (
    <article className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <h1 className="text-sm font-medium text-zinc-200">{title}</h1>
          {tone && (
            <p className="text-xs text-zinc-600">{tone.replace(/_/g, ' ')}</p>
          )}
        </div>
        <StatsBlock statsAfter={statsAfter} statsBefore={statsBefore} storyDay={storyDay} />
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
