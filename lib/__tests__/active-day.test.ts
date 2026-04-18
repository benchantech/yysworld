/**
 * Tests for getActiveDay — the gate that prevents gated/future days from
 * surfacing on summary pages (home, today, compare).
 *
 * DRIFT THIS PREVENTS:
 *   Session saw /today and home showing Day 5 (snapshotDate 2026-04-18, gated)
 *   instead of Day 4 (snapshotDate 2026-04-17, already released).
 *   Root cause: pages used branch.publishedDays directly instead of checking releaseAt.
 */

import { describe, it, expect } from 'vitest'
import { getActiveDay } from '../runs'
import type { BranchSummary } from '../runs'

// releaseAt for a given snapshot date = next calendar day at 05:00 UTC (midnight EST)
function releaseAt(snapshotDate: string): string {
  const [y, m, d] = snapshotDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + 1, 5, 0, 0)).toISOString()
}

function makeBranch(days: string[]): BranchSummary {
  return {
    id: 'main',
    publishedDays: days.length,
    dayReleaseAts: days.map(releaseAt),
  }
}

// Fixed reference point: midday on Apr 18 UTC (after Day 4 released, before Day 5)
const APR_18_MIDDAY = new Date('2026-04-18T12:00:00Z').getTime()

describe('getActiveDay', () => {
  it('returns the latest day when all days are released', () => {
    const branch = makeBranch(['2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17'])
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(4)
  })

  it('skips the latest day when it is still gated', () => {
    // Day 4 released (2026-04-17 → releaseAt 2026-04-18T05:00Z, past)
    // Day 5 gated  (2026-04-18 → releaseAt 2026-04-19T05:00Z, future)
    const branch = makeBranch(['2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18'])
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(4)
  })

  it('skips multiple gated days at the end', () => {
    // Days 4 and 5 both gated; Day 3 is released
    const branch = makeBranch(['2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18'])
    const beforeApr18 = new Date('2026-04-17T12:00:00Z').getTime()
    expect(getActiveDay(branch, beforeApr18)).toBe(3)
  })

  it('returns 1 as fallback when all days are gated', () => {
    const branch = makeBranch(['2026-04-19', '2026-04-20'])
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(1)
  })

  it('handles a branch with a single released day', () => {
    const branch = makeBranch(['2026-04-14'])
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(1)
  })

  it('handles empty dayReleaseAts (pipeline bug fallback)', () => {
    const branch: BranchSummary = { id: 'main', publishedDays: 3, dayReleaseAts: [] }
    // No releaseAt dates → treats all as released, returns publishedDays
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(3)
  })

  it('treats a day as released at exactly its releaseAt timestamp', () => {
    const exactRelease = new Date('2026-04-18T05:00:00.000Z').getTime()
    const branch = makeBranch(['2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17'])
    // Day 4 releaseAt = exactly APR_18 05:00Z — boundary should be released (<=)
    expect(getActiveDay(branch, exactRelease)).toBe(4)
  })

  it('treats a day as gated 1ms before its releaseAt', () => {
    const justBefore = new Date('2026-04-18T05:00:00.000Z').getTime() - 1
    const branch = makeBranch(['2026-04-14', '2026-04-15', '2026-04-16', '2026-04-17'])
    // Day 4 releaseAt = APR_18 05:00Z; 1ms before → Day 4 still gated
    expect(getActiveDay(branch, justBefore)).toBe(3)
  })
})
