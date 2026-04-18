/**
 * Tests for buildCalendarCells + cellIsLink.
 *
 * DRIFT THIS PREVENTS:
 *   Archive calendar rendered all day cells as <div> elements.
 *   Published days must be links; unpublished/future/empty must not be.
 *   Root cause: CSS used .yy-calendar__day selector (no class on divs),
 *   and cells had no click handler despite showing cursor:pointer.
 */

import { describe, it, expect } from 'vitest'
import { buildCalendarCells, cellIsLink } from '../calendar'

// April 14 2026 is a Monday (getDay() = 1), so there should be 1 empty leading cell
const RUN_DATE = '2026-04-14'
const TODAY_STR = '2026-04-18' // midday on day 5 of the run

describe('buildCalendarCells', () => {
  it('adds leading empty cells matching the start day-of-week', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    // April 14 2026 is Monday (dow=1) → 1 leading empty cell
    expect(cells[0].kind).toBe('empty')
    expect(cells[1].kind).toBe('day')
  })

  it('marks days 1..publishedDays as published', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const dayCells = cells.filter((c) => c.kind === 'day')
    const published = dayCells.filter((c) => c.kind === 'day' && c.published)
    expect(published.length).toBe(5)
  })

  it('marks days beyond publishedDays as not published', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const day6 = cells.find((c) => c.kind === 'day' && c.day === 6)
    expect(day6?.kind === 'day' && day6.published).toBe(false)
  })

  it('marks exactly one cell as today', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const todayCells = cells.filter((c) => c.kind === 'day' && c.today)
    expect(todayCells.length).toBe(1)
    const todayCell = todayCells[0]
    expect(todayCell.kind === 'day' && todayCell.day).toBe(5) // Apr 18 = day 5
  })

  it('marks cells after today as future', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const futureCells = cells.filter((c) => c.kind === 'day' && c.future)
    expect(futureCells.length).toBeGreaterThan(0)
    futureCells.forEach((c) => {
      expect(c.kind === 'day' && c.day).toBeGreaterThan(5)
    })
  })

  it('produces totalDays day-cells plus leading empties', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR, 30)
    const dayCells = cells.filter((c) => c.kind === 'day')
    expect(dayCells.length).toBe(30)
  })
})

describe('cellIsLink', () => {
  it('returns true for a published day cell', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const day1 = cells.find((c) => c.kind === 'day' && c.day === 1)!
    expect(cellIsLink(day1)).toBe(true)
  })

  it('returns false for an empty cell', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const empty = cells[0] // leading Monday cell
    expect(cellIsLink(empty)).toBe(false)
  })

  it('returns false for an unpublished future day', () => {
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const day10 = cells.find((c) => c.kind === 'day' && c.day === 10)!
    expect(cellIsLink(day10)).toBe(false)
  })

  it('returns true for today if it is published', () => {
    // today (day 5) is within publishedDays=5 → should be a link
    const cells = buildCalendarCells(RUN_DATE, 5, TODAY_STR)
    const todayCell = cells.find((c) => c.kind === 'day' && c.today)!
    expect(cellIsLink(todayCell)).toBe(true)
  })

  it('returns false for today if it is not yet published', () => {
    // only 4 days published, but today is day 5
    const cells = buildCalendarCells(RUN_DATE, 4, TODAY_STR)
    const todayCell = cells.find((c) => c.kind === 'day' && c.today)!
    expect(cellIsLink(todayCell)).toBe(false)
  })
})
