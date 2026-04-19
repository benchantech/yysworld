export type CalendarCell =
  | { kind: 'empty' }
  | { kind: 'day'; day: number; published: boolean; today: boolean; future: boolean }

/**
 * Build a flat array of calendar cells for a run month.
 * Leading empty cells pad to the correct day-of-week start.
 * `publishedDays` is the count of days with artifacts (1-indexed).
 */
export function buildCalendarCells(
  runDate: string,
  publishedDays: number,
  todayStr: string,
  totalDays = 30,
): CalendarCell[] {
  const startDate = new Date(runDate)
  const startDow = startDate.getDay() // 0 = Sunday

  const cells: CalendarCell[] = []

  for (let i = 0; i < startDow; i++) {
    cells.push({ kind: 'empty' })
  }

  for (let d = 1; d <= totalDays; d++) {
    const cellDate = new Date(startDate)
    cellDate.setDate(cellDate.getDate() + d - 1)
    const dateStr = cellDate.toISOString().slice(0, 10)
    cells.push({
      kind: 'day',
      day: d,
      published: d <= publishedDays,
      today: dateStr === todayStr,
      future: dateStr > todayStr,
    })
  }

  return cells
}

/** Returns true if a cell should render as a navigable link. */
export function cellIsLink(cell: CalendarCell): cell is { kind: 'day'; day: number; published: true; today: boolean; future: boolean } {
  return cell.kind === 'day' && cell.published
}
