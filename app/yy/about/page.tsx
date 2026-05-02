import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/nav/Breadcrumbs'
import { JsonLd } from '@/components/JsonLd'
import { aboutBreadcrumbs, BASELINE_URL } from '@/lib/nav'
import { schemaBreadcrumbList, schemaCharacterPerson } from '@/lib/jsonld'

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

const CORE_TRAITS: { name: string; score: number; low?: boolean }[] = [
  { name: 'curious', score: 1.0 },
  { name: 'expressive', score: 0.9 },
  { name: 'easily surprised', score: 0.85 },
  { name: 'distractible', score: 0.85 },
  { name: 'stubborn', score: 0.75 },
  { name: 'prosocial', score: 0.75 },
  { name: 'pragmatic', score: 0.7 },
  { name: 'restless', score: 0.7 },
  { name: 'randomly eloquent', score: 0.65 },
  { name: 'stream of consciousness', score: 0.45 },
  { name: 'disciplined', score: 0.2, low: true },
]

const VALUES = ['friendship', 'food', 'music', 'language', 'technology', 'bedtime stories', 'fair trade']

const INTERVIEW: { q: string; a: string }[] = [
  { q: 'What do you do when you find something beautiful?', a: 'I get quiet. Then I tell someone later.' },
  { q: 'What about when a bigger squirrel wants what you have?', a: 'I trade. I don\'t hoard.' },
  { q: 'What do you do when you\'re behind?', a: 'I take three steps, then I check my hands. Then I decide whether to run.' },
  { q: 'What do you do at night?', a: 'I listen for stories. If nobody is telling one, I tell one.' },
]

const CALIBRATION_NOTES: { trait: string; note: string }[] = [
  { trait: 'naive', note: 'removed — responses showed social awareness (trade, pushback on attention-seekers)' },
  { trait: 'trash as treasure', note: 'removed from values — scenario 13 showed YY leaves broken things, does not hoard' },
  { trait: 'scarcity reaction', note: 'revised from hoard to trade_or_assess — scenario 15 showed transactional fairness over hoarding' },
  { trait: 'stream of consciousness', note: 'lowered from 0.8 — thoughts are associative but compressed, not rambling' },
  { trait: 'randomly eloquent', note: 'raised from 0.4 — "simply beamed" and "tasty, tradeable treat" are genuine compression events' },
  { trait: 'beauty reaction', note: 'added compress — YY responds to beauty with minimal, precise language' },
]

export default function YYAboutPage() {
  const breadcrumbs = aboutBreadcrumbs('yy')

  return (
    <>
      <JsonLd
        schema={[
          schemaCharacterPerson(
            'YY',
            '/yy/about',
            'Fictional character — curious (1.0), expressive (0.9), easily surprised (0.85). Values friendship, food, music, language, technology, bedtime stories, and fair trade. Calibrated via 22-scenario interview.',
          ),
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
            A squirrel. The center of this whole thing. He was calibrated over 22 scenarios before
            day one of any run — so when he reacts to a morning, it&apos;s him, not a guess.
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
                voice v2 · squirrel · calibrated apr 14, 2026
              </p>
            </div>
            <p className="font-sans text-base text-ink leading-relaxed">
              Curious. Expressive. Easily surprised. YY notices things other squirrels miss — and
              sometimes gets in his own way because of it. He doesn&apos;t hoard. He trades. He
              goes quiet around beauty.
            </p>
            <div className="flex flex-wrap gap-2">
              {['curious', 'expressive', 'easily surprised', 'stubborn', 'prosocial', 'pragmatic', 'restless'].map((tag) => (
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
              Loves: friendship · food · music · language · bedtime stories · fair trade
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
            <p className="font-mono text-xs text-ink-3 mt-1">from the 22-scenario calibration interview</p>
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

      </div>
    </>
  )
}
