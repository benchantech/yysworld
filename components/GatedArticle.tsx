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

export function GatedArticle({ releaseAt, title, tone, narrative, stateNote, summary, storyDay, statsBefore, statsAfter }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).has('preview')
    const released = Date.now() >= new Date(releaseAt).getTime()
    setVisible(preview || released)
  }, [releaseAt])

  if (!visible) {
    return (
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-6 space-y-1">
        {title && <p className="text-xs text-zinc-700 font-medium">{title}</p>}
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
          <h1 className="text-base font-medium text-zinc-100">{title}</h1>
          {tone && (
            <p className="text-xs text-zinc-500 tracking-wide">{tone.replace(/_/g, ' ')}</p>
          )}
        </div>
        <StatsBlock statsAfter={statsAfter} statsBefore={statsBefore} storyDay={storyDay} />
      </header>

      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-base text-zinc-300 leading-7">
            {p}
          </p>
        ))}
      </div>

      {stateNote && (
        <p className="font-mono text-xs text-zinc-500 leading-relaxed border-t border-zinc-800/60 pt-3">
          {stateNote}
        </p>
      )}

      {summary && (
        <p className="text-xs text-zinc-500 pt-1">{summary}</p>
      )}
    </article>
  )
}
