'use client'

import { useEffect, useState } from 'react'
import { StatsBlock } from '@/components/StatsBlock'
import type { Condition } from '@/lib/runs'

interface Props {
  releaseAt: string
  initialVisible: boolean
  title: string
  tone: string
  narrative: string
  stateNote: string
  summary: string
  storyDay: number
  statsBefore: Condition
  statsAfter: Condition
}

export function GatedArticle({
  releaseAt,
  initialVisible,
  title,
  tone,
  narrative,
  stateNote,
  summary,
  storyDay,
  statsBefore,
  statsAfter,
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
      <div className="border border-rule bg-paper-2 px-5 py-6 space-y-1">
        {title && (
          <p className="font-sans text-sm font-medium text-ink-3">{title}</p>
        )}
        <p className="font-mono text-xs text-ink-4 italic">Available after midnight.</p>
      </div>
    )
  }

  // Strip first paragraph if it echoes the title
  const normalize = (s: string) => s.replace(/[.\s]+$/, '').toLowerCase()
  const allParagraphs = narrative.split('\n\n').filter(Boolean)
  const paragraphs =
    allParagraphs.length > 0 && normalize(allParagraphs[0]) === normalize(title)
      ? allParagraphs.slice(1)
      : allParagraphs

  return (
    <article className="space-y-5">
      <header className="space-y-1 pb-4 border-b border-rule">
        <h1 className="font-sans text-2xl font-medium text-ink leading-tight tracking-tight">
          {title}
        </h1>
        {tone && (
          <p className="font-mono text-xs text-ink-3 tracking-wide">
            {tone.replace(/_/g, ' ')}
          </p>
        )}
      </header>

      <div className="story-prose">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {stateNote && (
        <p className="font-mono text-xs text-ink-3 leading-relaxed border-t border-rule pt-3">
          {stateNote}
        </p>
      )}

      <StatsBlock statsAfter={statsAfter} statsBefore={statsBefore} storyDay={storyDay} />

      {summary && (
        <p className="font-sans text-sm text-ink-3 italic leading-relaxed pt-1">{summary}</p>
      )}
    </article>
  )
}
