import Link from 'next/link'

interface DayNavigatorProps {
  currentDay: number
  totalDays?: number
  prevHref?: string
  nextHref?: string
}

export function DayNavigator({ currentDay, totalDays, prevHref, nextHref }: DayNavigatorProps) {
  return (
    <nav aria-label="day navigation" className="flex items-center gap-4">
      {prevHref ? (
        <Link
          href={prevHref}
          className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b-0"
          aria-label="previous day"
        >
          ← prev
        </Link>
      ) : (
        <span className="font-mono text-xs text-ink-4 select-none" aria-hidden="true">
          ← prev
        </span>
      )}

      <span className="font-mono text-xs text-ink-2 tabular-nums">
        day {currentDay}
        {totalDays !== undefined && (
          <span className="text-ink-4"> / {totalDays}</span>
        )}
      </span>

      {nextHref ? (
        <Link
          href={nextHref}
          className="font-mono text-xs text-ink-2 hover:text-ink transition-colors border-b-0"
          aria-label="next day"
        >
          next →
        </Link>
      ) : (
        <span className="font-mono text-xs text-ink-4 select-none" aria-hidden="true">
          next →
        </span>
      )}
    </nav>
  )
}
