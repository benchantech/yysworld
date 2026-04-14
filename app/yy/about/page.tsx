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

const CORE_TRAITS: { name: string; score: number }[] = [
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
  { name: 'disciplined', score: 0.2 },
]

const VALUES = ['friendship', 'food', 'music', 'language', 'technology', 'bedtime stories', 'fair trade']

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

      <div className="mt-6 space-y-10">
        <div>
          <h1 className="text-base font-medium text-zinc-50">YY — profile</h1>
          <p className="mt-1 text-xs text-zinc-500">
            calibrated via 22-scenario interview · v1.0
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Core traits
          </h2>
          <ul className="space-y-1.5">
            {CORE_TRAITS.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <div className="w-36 shrink-0">
                  <span className="text-xs text-zinc-300">{t.name}</span>
                </div>
                <div className="flex-1 max-w-40">
                  <div className="h-1 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-zinc-500"
                      style={{ width: `${t.score * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-zinc-600 tabular-nums w-8 text-right">
                  {t.score.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Values
          </h2>
          <ul className="flex flex-wrap gap-2">
            {VALUES.map((v) => (
              <li
                key={v}
                className="px-2.5 py-1 rounded-full text-xs text-zinc-400 border border-zinc-800"
              >
                {v}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Calibration notes
          </h2>
          <ul className="space-y-3">
            {CALIBRATION_NOTES.map((n) => (
              <li key={n.trait} className="text-xs">
                <span className="text-zinc-400 font-medium">{n.trait}</span>
                <span className="text-zinc-600 ml-2">—</span>
                <span className="text-zinc-500 ml-2">{n.note}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
