import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import type { InboxEntry } from './types'

function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null
  try { return JSON.parse(readFileSync(path, 'utf-8')) as T } catch { return null }
}

export function inboxDir(rootDir: string): string {
  return join(rootDir, 'inbox')
}

export function readInbox(rootDir: string, date: string): InboxEntry | null {
  return readJson<InboxEntry>(join(inboxDir(rootDir), `${date}.json`))
}

export function writeInbox(rootDir: string, entry: InboxEntry): void {
  const dir = inboxDir(rootDir)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, `${entry.date}.json`),
    JSON.stringify(entry, null, 2) + '\n',
  )
}

/**
 * Find the most recent default queue entry on or before the target date.
 * Returns the closest future default if none found before (gives author
 * a chance to pre-queue defaults ahead of time).
 */
export function findQueueEntry(rootDir: string, targetDate: string): InboxEntry | null {
  const dir = inboxDir(rootDir)
  if (!existsSync(dir)) return null

  const files = readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort()

  // Exact match first
  if (files.includes(targetDate)) {
    const entry = readJson<InboxEntry>(join(dir, `${targetDate}.json`))
    if (entry) return entry
  }

  // Most recent default before the target date
  const before = files.filter(d => d < targetDate).reverse()
  for (const date of before) {
    const entry = readJson<InboxEntry>(join(dir, `${date}.json`))
    if (entry?.is_default) return entry
  }

  return null
}

/**
 * List all queued dates (for display in init command).
 */
export function listQueuedDates(rootDir: string): string[] {
  const dir = inboxDir(rootDir)
  if (!existsSync(dir)) return []
  return readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''))
    .sort()
}
