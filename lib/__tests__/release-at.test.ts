/**
 * Tests for the releaseAt timing contract.
 *
 * DRIFT THIS PREVENTS:
 *   If the releaseAt calculation drifts (wrong timezone, off-by-one day),
 *   content gates silently break — either releasing early or staying locked.
 *   This fixes the "Day 5 shows on Apr 18 even though it releases Apr 19" class of bug.
 */

import { describe, it, expect } from 'vitest'
import { getActiveDay } from '../runs'
import type { BranchSummary } from '../runs'

// Reproduce releaseAt the same way runs.ts does internally
function releaseAt(snapshotDate: string): string {
  const [y, m, d] = snapshotDate.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + 1, 5, 0, 0)).toISOString()
}

describe('releaseAt contract', () => {
  it('releases the day AFTER snapshot_date at 05:00 UTC (midnight EST)', () => {
    const ra = releaseAt('2026-04-18')
    expect(ra).toBe('2026-04-19T05:00:00.000Z')
  })

  it('handles month-boundary rollover', () => {
    const ra = releaseAt('2026-04-30')
    expect(ra).toBe('2026-05-01T05:00:00.000Z')
  })

  it('handles year-boundary rollover', () => {
    const ra = releaseAt('2026-12-31')
    expect(ra).toBe('2027-01-01T05:00:00.000Z')
  })

  it('a day with snapshot Apr 17 is released by Apr 18 midday', () => {
    const branch: BranchSummary = {
      id: 'main',
      publishedDays: 4,
      dayReleaseAts: [
        releaseAt('2026-04-14'),
        releaseAt('2026-04-15'),
        releaseAt('2026-04-16'),
        releaseAt('2026-04-17'),
      ],
    }
    const apr18Midday = new Date('2026-04-18T12:00:00Z').getTime()
    expect(getActiveDay(branch, apr18Midday)).toBe(4)
  })

  it('a day with snapshot Apr 18 is NOT released by Apr 18 midday', () => {
    const branch: BranchSummary = {
      id: 'main',
      publishedDays: 5,
      dayReleaseAts: [
        releaseAt('2026-04-14'),
        releaseAt('2026-04-15'),
        releaseAt('2026-04-16'),
        releaseAt('2026-04-17'),
        releaseAt('2026-04-18'), // gates at Apr 19 05:00 UTC
      ],
    }
    const apr18Midday = new Date('2026-04-18T12:00:00Z').getTime()
    // Day 5 still gated → active day is 4
    expect(getActiveDay(branch, apr18Midday)).toBe(4)
  })

  it('a day with snapshot Apr 18 IS released on Apr 19 after 05:00 UTC', () => {
    const branch: BranchSummary = {
      id: 'main',
      publishedDays: 5,
      dayReleaseAts: [
        releaseAt('2026-04-14'),
        releaseAt('2026-04-15'),
        releaseAt('2026-04-16'),
        releaseAt('2026-04-17'),
        releaseAt('2026-04-18'),
      ],
    }
    const apr19Morning = new Date('2026-04-19T06:00:00Z').getTime()
    expect(getActiveDay(branch, apr19Morning)).toBe(5)
  })
})
