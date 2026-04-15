/**
 * Minimal markdown → React renderer for ADR content.
 * Handles the specific patterns used in yysworld ADR files:
 * headings, paragraphs, bold, inline code, links, lists,
 * tables, fenced code blocks, blockquotes, and horizontal rules.
 * Does NOT use dangerouslySetInnerHTML — all output is typed React nodes.
 */

import React from 'react'
import { toSlug } from '@/lib/adrs'

// ─── Link resolver ───────────────────────────────────────────────────────────

function resolveHref(url: string): string {
  if (url.startsWith('http') || url.startsWith('#') || url.startsWith('/')) return url
  // ./001-foo.md → /adrs/001-foo (semicolons stripped via toSlug)
  if (url.startsWith('./') && url.endsWith('.md')) {
    const raw = url.slice(2, -3)
    if (raw.startsWith('museum/')) return '/adrs/museum/'
    return `/adrs/${toSlug(raw)}/`
  }
  return url
}

// ─── Inline renderer ─────────────────────────────────────────────────────────

export function renderInline(text: string): React.ReactNode {
  // Split on: **bold**, `code`, [text](url)
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
          return <strong key={i} className="text-zinc-300 font-medium">{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          return (
            <code key={i} className="font-mono text-xs bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded">
              {part.slice(1, -1)}
            </code>
          )
        }
        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
        if (m) {
          const href = resolveHref(m[2])
          const isExt = href.startsWith('http')
          return (
            <a
              key={i}
              href={href}
              className="text-zinc-300 hover:text-zinc-100 underline underline-offset-2 decoration-zinc-600"
              {...(isExt ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
            >
              {m[1]}
            </a>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}

// ─── Table renderer ───────────────────────────────────────────────────────────

function renderTable(lines: string[], k: number): React.ReactNode {
  const dataRows = lines
    .filter(l => l.trim())
    .filter(l => !/^[\s|:\-]+$/.test(l)) // remove separator rows |---|---|
    .map(l => l.split('|').slice(1, -1).map(c => c.trim()))

  if (dataRows.length === 0) return null
  const [headers, ...rows] = dataRows

  return (
    <div key={k} className="overflow-x-auto my-3">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="border-b border-zinc-800">
            {(headers ?? []).map((h, i) => (
              <th key={i} className="text-left py-1.5 pr-4 text-zinc-500 font-medium whitespace-nowrap">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-zinc-900/60">
              {row.map((cell, j) => (
                <td key={j} className="py-1.5 pr-4 text-zinc-500 align-top leading-relaxed">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Block renderer ───────────────────────────────────────────────────────────

/**
 * Renders ADR markdown content as an array of React nodes.
 * Skips the H1 title line (rendered separately by the page).
 */
export function renderAdrMarkdown(content: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  let key = 0

  // Split on fenced code blocks first so we don't process their contents
  const segments = content.split(/(^```[\s\S]*?^```$)/gm)

  for (const seg of segments) {
    // ── Fenced code block ─────────────────────────────────────────────────
    if (seg.startsWith('```')) {
      const lines = seg.split('\n')
      const lang = lines[0].slice(3).trim()
      const code = lines.slice(1, -1).join('\n')
      nodes.push(
        <pre
          key={key++}
          className="bg-zinc-900 border border-zinc-800 rounded p-3 overflow-x-auto my-3 text-xs font-mono text-zinc-400 leading-relaxed"
        >
          <code className={lang ? `language-${lang}` : undefined}>{code}</code>
        </pre>
      )
      continue
    }

    // ── Regular text ──────────────────────────────────────────────────────
    const lines = seg.split('\n')
    let i = 0

    while (i < lines.length) {
      const line = lines[i]
      const trimmed = line.trim()

      if (!trimmed) { i++; continue }

      // Skip H1 (rendered by page header)
      if (/^# [^#]/.test(line)) { i++; continue }

      // H2
      if (line.startsWith('## ')) {
        nodes.push(
          <h2 key={key++} className="text-sm font-medium text-zinc-200 mt-6 mb-2 pt-2 border-t border-zinc-800 first:border-0 first:mt-0">
            {renderInline(line.slice(3).trim())}
          </h2>
        )
        i++; continue
      }

      // H3
      if (line.startsWith('### ')) {
        nodes.push(
          <h3 key={key++} className="text-xs font-medium text-zinc-300 mt-4 mb-1">
            {renderInline(line.slice(4).trim())}
          </h3>
        )
        i++; continue
      }

      // HR
      if (trimmed === '---') {
        nodes.push(<hr key={key++} className="border-zinc-800 my-4" />)
        i++; continue
      }

      // Table
      if (line.trimStart().startsWith('|')) {
        const tableLines: string[] = []
        while (i < lines.length && lines[i].trimStart().startsWith('|')) {
          tableLines.push(lines[i])
          i++
        }
        const t = renderTable(tableLines, key++)
        if (t) nodes.push(t)
        continue
      }

      // Unordered list
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const items: string[] = []
        while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
          items.push(lines[i].slice(2))
          i++
        }
        nodes.push(
          <ul key={key++} className="list-disc list-outside pl-4 space-y-0.5 text-xs text-zinc-500 my-2">
            {items.map((item, j) => <li key={j} className="leading-relaxed">{renderInline(item)}</li>)}
          </ul>
        )
        continue
      }

      // Ordered list
      if (/^\d+\.\s/.test(line)) {
        const items: string[] = []
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s/, ''))
          i++
        }
        nodes.push(
          <ol key={key++} className="list-decimal list-outside pl-4 space-y-0.5 text-xs text-zinc-500 my-2">
            {items.map((item, j) => <li key={j} className="leading-relaxed">{renderInline(item)}</li>)}
          </ol>
        )
        continue
      }

      // Blockquote
      if (line.startsWith('> ')) {
        const qLines: string[] = []
        while (i < lines.length && lines[i].startsWith('> ')) {
          qLines.push(lines[i].slice(2))
          i++
        }
        nodes.push(
          <blockquote key={key++} className="border-l-2 border-zinc-700 pl-3 my-2 text-xs text-zinc-500 italic">
            {renderInline(qLines.join(' '))}
          </blockquote>
        )
        continue
      }

      // Paragraph: collect consecutive non-special lines
      const paraLines: string[] = []
      while (
        i < lines.length &&
        lines[i].trim() &&
        !/^#{1,3} /.test(lines[i]) &&
        !lines[i].startsWith('- ') &&
        !lines[i].startsWith('* ') &&
        !lines[i].startsWith('> ') &&
        !lines[i].trimStart().startsWith('|') &&
        lines[i].trim() !== '---' &&
        !/^\d+\.\s/.test(lines[i])
      ) {
        paraLines.push(lines[i])
        i++
      }
      if (paraLines.length > 0) {
        nodes.push(
          <p key={key++} className="text-xs text-zinc-500 leading-relaxed my-2">
            {renderInline(paraLines.join(' '))}
          </p>
        )
      }
    }
  }

  return nodes.filter(n => n !== null && n !== undefined)
}
