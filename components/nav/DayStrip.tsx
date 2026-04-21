import Link from 'next/link'

interface DayStripProps {
  totalDays: number
  currentDay: number
  releaseAts: string[]        // index 0 = day 1 releaseAt
  makeDayHref: (day: number) => string
}

export function DayStrip({ totalDays, currentDay, releaseAts, makeDayHref }: DayStripProps) {
  const now = Date.now()
  return (
    <nav className="yy-dayStrip scrollbar-none" aria-label="day navigation">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
        const ra = releaseAts[d - 1]
        const hasContent = ra !== '' && ra !== undefined
        const isGated = hasContent && new Date(ra).getTime() > now
        const isCurrent = d === currentDay

        if (!hasContent) {
          return (
            <span key={d} className="yy-dayStrip__item is-empty" aria-hidden="true">
              {d}
            </span>
          )
        }
        if (isGated) {
          return (
            <span key={d} className="yy-dayStrip__item is-gated" title="not yet released">
              {d}
            </span>
          )
        }
        if (isCurrent) {
          return (
            <span key={d} className="yy-dayStrip__item is-current" aria-current="page">
              {d}
            </span>
          )
        }
        return (
          <Link key={d} href={makeDayHref(d)} className="yy-dayStrip__item">
            {d}
          </Link>
        )
      })}
    </nav>
  )
}
