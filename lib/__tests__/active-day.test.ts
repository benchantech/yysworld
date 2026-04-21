/**
 * Tests for getActiveDay — the gate that prevents gated/future days from
 * surfacing on summary pages (home, today, compare).
 *
 * DRIFT THIS PREVENTS:
 *   Session saw /today and home showing Day 5 (snapshotDate 2026-04-18, gated)
 *   instead of Day 4 (snapshotDate 2026-04-17, already released).
 *   Root cause: pages used branch.publishedDays directly instead of checking releaseAt.
 *
 *   ADR-035: mid-run branches (e.g. alt2-migration, forked on day 7) have empty string
 *   '' at dayReleaseAts indices for pre-fork days. The old logic treated !'' as truthy
 *   and returned a pre-fork day as "active", causing getDayArtifact to return null and
 *   content to show as locked. Empty string must be treated as "no content on this day",
 *   not "already released". When all content is still gated, return firstContentDay (the
 *   first non-empty index), not day 1.
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
    // No releaseAt dates → treats all as released (legacy), returns publishedDays
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(3)
  })
})

// ─── ADR-035: mid-run branch behaviour ────────────────────────────────────────
//
// A branch forked mid-run has '' (empty string) at dayReleaseAts indices for
// days before it existed. These must be treated as "no content" — not "released".
//
// alt2-migration example: publishedDays=8, forked on day 7.
// dayReleaseAts = ['','','','','','', releaseAtDay7, releaseAtDay8]

function makeMidRunBranch(
  publishedDays: number,
  forkDay: number,         // 1-based: first day this branch has content
  snapshotDates: string[], // one per day from forkDay..publishedDays
): BranchSummary {
  const dayReleaseAts: string[] = []
  for (let d = 1; d <= publishedDays; d++) {
    if (d < forkDay) {
      dayReleaseAts.push('')                             // pre-fork: no content
    } else {
      const snapshotDate = snapshotDates[d - forkDay]
      const [y, mo, day] = snapshotDate.split('-').map(Number)
      dayReleaseAts.push(new Date(Date.UTC(y, mo - 1, day + 1, 5, 0, 0)).toISOString())
    }
  }
  return { id: 'alt2-migration', publishedDays, dayReleaseAts }
}

// Reference points bracketing the day-7 gate for a branch with snapshot 2026-04-20
// releaseAt = 2026-04-21T05:00:00Z
const BEFORE_DAY7_GATE = new Date('2026-04-21T04:59:59Z').getTime()
const AFTER_DAY7_GATE  = new Date('2026-04-21T05:00:01Z').getTime()
const AFTER_DAY8_GATE  = new Date('2026-04-22T05:00:01Z').getTime()

describe('getActiveDay — mid-run branch (ADR-035)', () => {
  it('returns firstContentDay when all content is still gated — not a pre-fork day', () => {
    // The ADR-035 bug: old logic returned day 6 (first empty slot hit going backwards)
    const branch = makeMidRunBranch(8, 7, ['2026-04-20', '2026-04-21'])
    expect(getActiveDay(branch, BEFORE_DAY7_GATE)).toBe(7)
  })

  it('returns firstContentDay (7) when day 7 releases, day 8 still gated', () => {
    const branch = makeMidRunBranch(8, 7, ['2026-04-20', '2026-04-21'])
    expect(getActiveDay(branch, AFTER_DAY7_GATE)).toBe(7)
  })

  it('returns day 8 once day 8 gate passes', () => {
    const branch = makeMidRunBranch(8, 7, ['2026-04-20', '2026-04-21'])
    expect(getActiveDay(branch, AFTER_DAY8_GATE)).toBe(8)
  })

  it('works for a branch that forks on day 1 (no pre-fork slots)', () => {
    // Standard branch — behaviour unchanged
    const branch = makeMidRunBranch(4, 1, ['2026-04-14','2026-04-15','2026-04-16','2026-04-17'])
    expect(getActiveDay(branch, APR_18_MIDDAY)).toBe(4)
  })

  it('pre-fork slots do not contribute to active day when content is released', () => {
    // Days 1-5 are '', day 6 released, day 7 gated
    const branch = makeMidRunBranch(7, 6, ['2026-04-19', '2026-04-20'])
    const afterDay6Gate = new Date('2026-04-20T06:00:00Z').getTime()
    expect(getActiveDay(branch, afterDay6Gate)).toBe(6)
  })
})

// ─── branchFirstDay — first non-empty dayReleaseAt index ──────────────────────
//
// Used by navigation, compare series, and vs pages to clip to the day
// a branch actually starts. ADR-035 formalises this as firstContentDay.

function branchFirstDay(branch: BranchSummary): number {
  const idx = branch.dayReleaseAts.findIndex((ra) => ra !== '')
  return idx >= 0 ? idx + 1 : 1
}

describe('branchFirstDay (ADR-035)', () => {
  it('returns 1 for a branch starting from day 1', () => {
    const branch = makeMidRunBranch(4, 1, ['2026-04-14','2026-04-15','2026-04-16','2026-04-17'])
    expect(branchFirstDay(branch)).toBe(1)
  })

  it('returns 7 for alt2-migration forked on day 7', () => {
    const branch = makeMidRunBranch(8, 7, ['2026-04-20', '2026-04-21'])
    expect(branchFirstDay(branch)).toBe(7)
  })

  it('returns 1 for a legacy branch with no dayReleaseAts', () => {
    const branch: BranchSummary = { id: 'legacy', publishedDays: 5, dayReleaseAts: [] }
    expect(branchFirstDay(branch)).toBe(1)
  })
})

// ─── firstComparisonDay — max of two branches' firstContentDay ────────────────
//
// ADR-035: comparison is only meaningful once both branches have content.
// main vs alt2 comparison starts at day 7, not day 1.

describe('firstComparisonDay (ADR-035)', () => {
  it('equals 1 when both branches start at day 1', () => {
    const main = makeMidRunBranch(8, 1, Array.from({length:8}, (_,i) => `2026-04-${14+i}`))
    const alt1 = makeMidRunBranch(8, 1, Array.from({length:8}, (_,i) => `2026-04-${14+i}`))
    const firstComparisonDay = Math.max(branchFirstDay(main), branchFirstDay(alt1))
    expect(firstComparisonDay).toBe(1)
  })

  it('equals 7 when comparing main (starts day 1) with alt2-migration (starts day 7)', () => {
    const main = makeMidRunBranch(8, 1, Array.from({length:8}, (_,i) => `2026-04-${14+i}`))
    const alt2 = makeMidRunBranch(8, 7, ['2026-04-20', '2026-04-21'])
    const firstComparisonDay = Math.max(branchFirstDay(main), branchFirstDay(alt2))
    expect(firstComparisonDay).toBe(7)
  })

  it('equals the later fork day when both are mid-run branches', () => {
    const altA = makeMidRunBranch(10, 4, Array.from({length:7}, (_,i) => `2026-04-${17+i}`))
    const altB = makeMidRunBranch(10, 6, Array.from({length:5}, (_,i) => `2026-04-${19+i}`))
    const firstComparisonDay = Math.max(branchFirstDay(altA), branchFirstDay(altB))
    expect(firstComparisonDay).toBe(6)
  })
})

describe('getActiveDay — boundary conditions', () => {

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
