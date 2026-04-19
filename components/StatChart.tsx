'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MonoLabel, Pill } from '@/components/canon/Primitives'

type Stat = 'food' | 'health' | 'attention'

const STATS: Stat[] = ['food', 'health', 'attention']

interface StatPoint {
  label: string
  dayNum: number
  main: Record<Stat, number> | null
  alt: Record<Stat, number> | null
}

interface StatChartProps {
  series: StatPoint[]
  altBranchId: string
  vsDayHref: (day: number) => string
}

const toggleStyle = (active: boolean): React.CSSProperties => ({
  fontFamily: 'var(--font-mono)',
  fontSize: '10px',
  padding: '2px 6px',
  border: '1px solid var(--color-rule)',
  background: active ? 'var(--color-ink)' : 'transparent',
  color: active ? 'var(--color-paper)' : 'var(--color-ink-3)',
  cursor: 'pointer',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
})

export function StatChart({ series, altBranchId, vsDayHref }: StatChartProps) {
  const [stat, setStat] = useState<Stat>('food')

  return (
    <section className="yy-compareSeries">
      <div className="yy-compareSeries__head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MonoLabel>{stat} over time</MonoLabel>
          <div style={{ display: 'flex', gap: '4px' }}>
            {STATS.map((s) => (
              <button key={s} onClick={() => setStat(s)} style={toggleStyle(stat === s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="yy-legend">
          <Pill>main</Pill>
          <Pill>{altBranchId}</Pill>
        </div>
      </div>
      <div className="yy-bars">
        {series.map((point) => {
          const aVal = point.main ? Math.round(point.main[stat] * 100) : 0
          const bVal = point.alt ? Math.round(point.alt[stat] * 100) : 0
          return (
            <Link key={point.label} href={vsDayHref(point.dayNum)} className="yy-bars__row" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span>{point.label}</span>
              <div className="yy-bars__track">
                <i style={{ width: `${aVal}%` }} />
                <i className="is-second" style={{ width: `${bVal}%` }} />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
