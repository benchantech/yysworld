import type { Condition } from '@/lib/runs'

interface Props {
  statsAfter: Condition
  statsBefore: Condition
  storyDay: number
}

const BAR_LEN = 10

function barColor(value: number): string {
  if (value < 0.20) return 'text-red-500'
  if (value < 0.40) return 'text-orange-500'
  if (value < 0.60) return 'text-yellow-500'
  if (value < 0.80) return 'text-blue-400'
  return 'text-green-500'
}

function StatRow({
  emoji,
  value,
  delta,
  showDelta,
}: {
  emoji: string
  value: number
  delta: number
  showDelta: boolean
}) {
  const clamped = Math.max(0, Math.min(1, isNaN(value) ? 0 : value))
  const filled = Math.round(clamped * BAR_LEN)
  const sign = delta >= 0 ? '+' : '−'
  const abs = Math.abs(Math.round(delta * 100))

  return (
    <div className="flex items-center gap-1">
      <span className="w-5 text-center text-sm leading-none">{emoji}</span>
      <span className="font-mono text-xs leading-none">
        <span className={barColor(clamped)}>{'█'.repeat(filled)}</span>
        <span className="text-zinc-800">{'█'.repeat(BAR_LEN - filled)}</span>
      </span>
      {showDelta && (
        <span className="font-mono text-xs text-zinc-500 w-7 text-right leading-none">
          {sign}{abs}
        </span>
      )}
    </div>
  )
}

export function StatsBlock({ statsAfter, statsBefore, storyDay }: Props) {
  const showDelta = storyDay > 1

  return (
    <div className="flex flex-col gap-1 shrink-0">
      <StatRow
        emoji="🍗"
        value={statsAfter.food}
        delta={statsAfter.food - statsBefore.food}
        showDelta={showDelta}
      />
      <StatRow
        emoji="❤️"
        value={statsAfter.health}
        delta={statsAfter.health - statsBefore.health}
        showDelta={showDelta}
      />
      <StatRow
        emoji="👀"
        value={statsAfter.attention}
        delta={statsAfter.attention - statsBefore.attention}
        showDelta={showDelta}
      />
    </div>
  )
}
