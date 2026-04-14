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
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="previous day"
        >
          ← prev
        </Link>
      ) : (
        <span className="text-xs text-zinc-700 select-none" aria-hidden="true">
          ← prev
        </span>
      )}

      <span className="text-xs text-zinc-300 tabular-nums">
        day {currentDay}
        {totalDays !== undefined && (
          <span className="text-zinc-600"> / {totalDays}</span>
        )}
      </span>

      {nextHref ? (
        <Link
          href={nextHref}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          aria-label="next day"
        >
          next →
        </Link>
      ) : (
        <span className="text-xs text-zinc-700 select-none" aria-hidden="true">
          next →
        </span>
      )}
    </nav>
  )
}
