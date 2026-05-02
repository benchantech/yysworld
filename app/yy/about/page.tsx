import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { aboutBreadcrumbs, BASELINE_URL } from '@/lib/nav'
import { schemaBreadcrumbList, schemaCharacterPerson } from '@/lib/jsonld'
import { getLatestBaseline } from '@/lib/runs'

function loadBaselineOrThrow() {
  const b = getLatestBaseline()
  if (!b) throw new Error('Meet YY page requires a baseline from the latest run; none found.')
  return b
}

const baseline = loadBaselineOrThrow()

// "bedtime_stories" → "bedtime stories"; "easily_surprised" → "easily surprised"
const humanize = (s: string) => s.replace(/_/g, ' ')

// "2026-04-14T00:00:00Z" → "apr 14, 2026"
function formatBaselineDate(iso: string): string {
  const d = new Date(iso)
  return d
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    .toLowerCase()
}

// "22_scenario_interview" → 22
function parseScenarioCount(method: string): number | null {
  const m = method.match(/^(\d+)_scenario/)
  return m ? parseInt(m[1], 10) : null
}

const CORE_TRAITS = Object.entries(baseline.core_traits)
  .map(([key, score]) => ({
    name: humanize(key),
    score,
    low: score < 0.3,
  }))
  .sort((a, b) => b.score - a.score)

const VALUES = baseline.values.map(humanize)

const CALIBRATION_NOTES = Object.entries(baseline.calibration_notes ?? {}).map(([trait, note]) => ({
  trait: humanize(trait),
  note,
}))

const SCENARIO_COUNT = parseScenarioCount(baseline.calibration_method)
const CALIBRATION_LABEL = SCENARIO_COUNT
  ? `${SCENARIO_COUNT}-scenario calibration interview`
  : `${baseline.calibration_method} calibration`

const IDENTITY_BADGE = [
  `voice ${baseline.voice_version}`,
  baseline.species,
  `calibrated ${formatBaselineDate(baseline.baseline_calibrated_at)}`,
].join(' · ')

// Top 3 traits, formatted as "name (score)" for the JSON-LD description.
const TOP_TRAITS_PHRASE = CORE_TRAITS.slice(0, 3)
  .map((t) => `${t.name} (${t.score.toFixed(2).replace(/\.?0+$/, '')})`)
  .join(', ')

const VALUES_PHRASE = (() => {
  if (VALUES.length === 0) return ''
  if (VALUES.length === 1) return VALUES[0]
  return `${VALUES.slice(0, -1).join(', ')}, and ${VALUES[VALUES.length - 1]}`
})()

const JSONLD_DESCRIPTION = `Fictional character — ${TOP_TRAITS_PHRASE}. Values ${VALUES_PHRASE}. Calibrated via ${SCENARIO_COUNT ?? 'multi'}-scenario interview.`

// Curated subset of traits surfaced as identity tags on the card. Strict subset
// of the baseline's core_traits — if a key here doesn't exist there, the build
// flags it. The selection is editorial (positive-framing identity), not a
// straight top-N.
const IDENTITY_TAG_KEYS = ['curious', 'expressive', 'easily_surprised', 'stubborn', 'prosocial', 'pragmatic', 'restless']
const baselineKeys = new Set(Object.keys(baseline.core_traits))
for (const k of IDENTITY_TAG_KEYS) {
  if (!baselineKeys.has(k)) {
    throw new Error(`Identity tag "${k}" is not in the latest baseline core_traits.`)
  }
}
const IDENTITY_TAGS = IDENTITY_TAG_KEYS.map(humanize)

// In-his-own-words is hand-authored Q&A — kept here, not in the baseline.
const INTERVIEW: { q: string; a: string }[] = [
  { q: 'What do you do when you find something beautiful?', a: 'I get quiet. Then I tell someone later.' },
  { q: 'What about when a bigger squirrel wants what you have?', a: "I trade. I don't hoard." },
  { q: "What do you do when you're behind?", a: 'I take three steps, then I check my hands. Then I decide whether to run.' },
  { q: 'What do you do at night?', a: 'I listen for stories. If nobody is telling one, I tell one.' },
]

export const metadata: Metadata = {
  title: 'YY — profile',
  alternates: {
    types: { 'application/json': BASELINE_URL },
  },
  openGraph: {
    title: 'YY profile — yysworld',
    description: "YY's traits, values, calibration notes, and version history.",
    type: 'profile',
    url: '/yy/about',
  },
}

export default function YYAboutPage() {
  const breadcrumbs = aboutBreadcrumbs('yy')

  return (
    <>
      <JsonLd
        schema={[
          schemaCharacterPerson('YY', '/yy/about', JSONLD_DESCRIPTION),
          schemaBreadcrumbList(breadcrumbs),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />

      <div className="mt-6 space-y-12">

        {/* Header */}
        <div className="space-y-1">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">the character</p>
          <h1 className="font-sans text-4xl font-medium text-ink tracking-tight">Meet YY.</h1>
          <p className="font-sans text-lg text-ink-2 leading-relaxed max-w-prose mt-3">
            A {baseline.species}. The center of this whole thing. He was calibrated over{' '}
            {SCENARIO_COUNT ?? 'many'} scenarios before day one of any run — so when he reacts to
            a morning, it&apos;s him, not a guess.
          </p>
        </div>

        {/* Card + Traits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">

          {/* Identity card */}
          <div className="border border-ink bg-paper-2 px-6 py-5 space-y-4 relative">
            <div
              className="absolute inset-1 border border-rule pointer-events-none"
              aria-hidden="true"
            />
            <div>
              <p className="font-sans text-5xl font-medium text-ink tracking-tight leading-none">YY</p>
              <p className="font-mono text-xs text-ink-3 uppercase tracking-widest mt-1">
                {IDENTITY_BADGE}
              </p>
            </div>
            <p className="font-sans text-base text-ink leading-relaxed">
              Curious. Expressive. Easily surprised. YY notices things other squirrels miss — and
              sometimes gets in his own way because of it. He doesn&apos;t hoard. He trades. He
              goes quiet around beauty.
            </p>
            <div className="flex flex-wrap gap-2">
              {IDENTITY_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-2.5 py-1 border border-rule text-ink-2"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p
              className="font-hand text-lg leading-relaxed"
              style={{ color: 'var(--color-accent)' }}
            >
              Loves: {VALUES.join(' · ')}
            </p>
          </div>

          {/* Trait bars */}
          <div className="space-y-1">
            <p className="font-mono text-xs text-ink-3 uppercase tracking-widest mb-4">core traits</p>
            {CORE_TRAITS.map((t) => (
              <div
                key={t.name}
                className="grid items-center gap-3 py-2 border-b border-rule-2 last:border-0"
                style={{ gridTemplateColumns: '140px 1fr 40px' }}
              >
                <span className="font-mono text-xs text-ink-2">{t.name}</span>
                <div className="h-1 bg-rule-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${t.score * 100}%`,
                      background: t.low ? 'var(--color-accent)' : 'var(--color-ink)',
                    }}
                  />
                </div>
                <span className="font-mono text-xs text-ink-3 text-right tabular-nums">
                  {t.score.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <section className="space-y-3">
          <h2 className="font-mono text-xs text-ink-3 uppercase tracking-widest">Values</h2>
          <ul className="flex flex-wrap gap-2">
            {VALUES.map((v) => (
              <li
                key={v}
                className="font-mono text-xs px-3 py-1.5 border border-rule text-ink-2"
              >
                {v}
              </li>
            ))}
          </ul>
        </section>

        {/* Interview */}
        <section className="space-y-6">
          <div>
            <h2 className="font-sans text-2xl font-medium text-ink tracking-tight">
              In his own words.
            </h2>
            <p className="font-mono text-xs text-ink-3 mt-1">from the {CALIBRATION_LABEL}</p>
            <div className="mt-4 h-px bg-ink w-16" />
          </div>

          {INTERVIEW.map(({ q, a }) => (
            <div key={q} className="space-y-1">
              <p className="font-sans text-base italic text-ink-2 leading-relaxed">
                &ldquo;{q}&rdquo;
              </p>
              <p className="font-sans text-base text-ink leading-relaxed">
                <span
                  className="font-mono text-xs uppercase tracking-widest mr-3"
                  style={{ color: 'var(--color-accent)' }}
                >
                  YY —
                </span>
                {a}
              </p>
            </div>
          ))}
        </section>

        {/* Calibration notes */}
        {CALIBRATION_NOTES.length > 0 && (
          <section className="space-y-3 border-t border-rule pt-8">
            <h2 className="font-mono text-xs text-ink-3 uppercase tracking-widest">Calibration notes</h2>
            <ul className="space-y-3">
              {CALIBRATION_NOTES.map((n) => (
                <li key={n.trait} className="flex gap-3 text-sm">
                  <span className="font-mono text-ink-2 shrink-0">{n.trait}</span>
                  <span className="text-ink-4">—</span>
                  <span className="font-sans text-ink-3 leading-relaxed">{n.note}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

      </div>
    </>
  )
}
