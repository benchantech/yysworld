import type { Condition } from '@/lib/runs'

interface Props {
  statsAfter: Condition
  statsBefore: Condition
  storyDay: number
}

function statColor(value: number): string {
  if (value < 0.25) return 'var(--color-accent)'
  if (value < 0.50) return 'var(--color-ink-3)'
  if (value < 0.75) return 'var(--color-ink-2)'
  return 'var(--color-ink)'
}

function StatRow({
  label,
  value,
  delta,
  showDelta,
}: {
  label: string
  value: number
  delta: number
  showDelta: boolean
}) {
  const clamped = Math.max(0, Math.min(1, isNaN(value) ? 0 : value))
  const sign = delta >= 0 ? '↑' : '↓'
  const abs = Math.abs(Math.round(delta * 100))
  const deltaColor = delta >= 0 ? 'var(--color-green-soft)' : 'var(--color-accent)'

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-xs text-ink-3 w-14">{label}</span>
      <div className="w-20 h-1 bg-rule-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${clamped * 100}%`, background: statColor(clamped) }}
        />
      </div>
      <span className="font-mono text-xs text-ink-2 tabular-nums w-8">{clamped.toFixed(2)}</span>
      {showDelta && (
        <span
          className="font-mono text-xs tabular-nums w-8"
          style={{ color: deltaColor }}
        >
          {sign}{abs}
        </span>
      )}
    </div>
  )
}

export function StatsBlock({ statsAfter, statsBefore, storyDay }: Props) {
  const showDelta = storyDay > 1

  return (
    <div className="flex flex-col gap-1.5 shrink-0 border-t border-rule pt-3 mt-1">
      <p className="font-mono text-[10px] text-ink-4 uppercase tracking-widest mb-1">state</p>
      <StatRow
        label="food"
        value={statsAfter.food}
        delta={statsAfter.food - statsBefore.food}
        showDelta={showDelta}
      />
      <StatRow
        label="health"
        value={statsAfter.health}
        delta={statsAfter.health - statsBefore.health}
        showDelta={showDelta}
      />
      <StatRow
        label="attention"
        value={statsAfter.attention}
        delta={statsAfter.attention - statsBefore.attention}
        showDelta={showDelta}
      />
    </div>
  )
}
