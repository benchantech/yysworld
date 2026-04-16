/**
 * Build-time ADR reader. Parses docs/adrs/*.md into structured metadata
 * for the /adrs/ index and individual ADR pages.
 */

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'

export interface AdrMeta {
  slug: string       // URL-safe slug, e.g. "009-nightly-snapshot-build-daytime-static-exploration"
  filename: string   // filename without .md, preserved exactly
  id: string         // "YYBW-001"
  num: number        // 1
  title: string      // "Product Thesis: From World Builder to Branching Life Observatory"
  status: string     // "Decided"
  date: string       // "2026-04-14"
  dependsOn: string[]
  summary: string    // First paragraph of Context, link-stripped, ≤240 chars
}

const ADRS_DIR = join(process.cwd(), 'docs/adrs')

/** Converts a filename to a URL-safe slug. */
export function toSlug(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/;/g, '')
}

function extractField(lines: string[], key: string): string {
  const line = lines.find(l => l.includes(`**${key}:**`))
  if (!line) return ''
  // Remove the "- **Key:** " prefix
  return line.replace(/.*\*\*[^*]+\*\*:?\s*/, '').trim()
}

function extractSummary(content: string): string {
  const match = content.match(/## Context\r?\n+([\s\S]+?)(?:\r?\n## |\r?\n---\r?\n|$)/)
  if (!match) return ''
  const firstPara = match[1].trim().split(/\r?\n\r?\n/)[0]
  const cleaned = firstPara
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // strip links → keep text
    .replace(/\*\*/g, '')                      // strip bold
    .replace(/\r?\n/g, ' ')
    .trim()

  if (cleaned.length <= 240) return cleaned

  // Prefer truncating at the last sentence boundary before 240 chars
  const cut = cleaned.slice(0, 240)
  const lastPeriod = cut.lastIndexOf('. ')
  if (lastPeriod > 60) return cut.slice(0, lastPeriod + 1)

  // Fall back to last word boundary + ellipsis
  return cut.replace(/\s\S+$/, '') + '…'
}

export function parseAdrMeta(content: string, slug: string, filename: string): AdrMeta {
  const lines = content.split('\n')

  // Title: first # line, strip "ADR NNN — " prefix
  const titleLine = lines.find(l => /^# ADR \d+/.test(l)) ?? ''
  const title = titleLine
    .replace(/^# ADR \d+\s*[—–-]+\s*/, '')
    .trim()

  const numMatch = slug.match(/^(\d+)/)
  const num = numMatch ? parseInt(numMatch[1], 10) : 0

  const id = extractField(lines, 'ID')
  const status = extractField(lines, 'Status')
  const date = extractField(lines, 'Date')

  const depStr = extractField(lines, 'Depends on')
  const dependsOn = depStr && depStr.toLowerCase() !== 'none'
    ? depStr.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const summary = extractSummary(content)

  return { slug, filename, id, num, title, status, date, dependsOn, summary }
}

export function getActiveAdrs(): AdrMeta[] {
  if (!existsSync(ADRS_DIR)) return []

  return readdirSync(ADRS_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('.'))
    .sort()
    .map(file => {
      const filename = file.replace(/\.md$/, '')
      const slug = toSlug(file)
      const content = readFileSync(join(ADRS_DIR, file), 'utf-8')
      return parseAdrMeta(content, slug, filename)
    })
}

export function getAdrBySlug(slug: string): { meta: AdrMeta; content: string } | null {
  if (!existsSync(ADRS_DIR)) return null

  const file = readdirSync(ADRS_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('.'))
    .find(f => toSlug(f) === slug)

  if (!file) return null

  const content = readFileSync(join(ADRS_DIR, file), 'utf-8')
  const filename = file.replace(/\.md$/, '')
  const meta = parseAdrMeta(content, slug, filename)
  return { meta, content }
}

export function getAdrSlugs(): string[] {
  if (!existsSync(ADRS_DIR)) return []
  return readdirSync(ADRS_DIR)
    .filter(f => f.endsWith('.md') && f !== 'README.md' && !f.startsWith('.'))
    .map(toSlug)
}

export function getMuseumReadme(): string {
  const p = join(ADRS_DIR, 'museum', 'README.md')
  return existsSync(p) ? readFileSync(p, 'utf-8') : ''
}
