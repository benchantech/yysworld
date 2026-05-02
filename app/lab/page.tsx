import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageShell } from '@/components/canon/Layout'
import { SectionRule } from '@/components/canon/Primitives'

export const metadata: Metadata = {
  title: 'AI — yysworld',
  description: 'ADRs, schemas, ledgers, APIs, and system maps for builders and curious readers.',
}

const ARTIFACTS = [
  {
    key: 'adrs',
    title: 'ADRs',
    copy: 'Architecture decisions that remain the source of truth for every design choice in the project.',
    href: '/adrs/',
    external: false,
  },
  {
    key: 'system-map',
    title: 'System map',
    copy: 'Operational view of generation, review, and publication — every layer, what exists vs. what is planned.',
    href: '/system-map/',
    external: false,
  },
  {
    key: 'data-api',
    title: 'Data API',
    copy: 'Structured artifacts, snapshots, and machine-readable access to all run data.',
    href: '/yy/data/',
    external: false,
  },
  {
    key: 'llms-txt',
    title: 'llms.txt',
    copy: 'Machine entry point for models and tooling. Canonical list of pages and artifacts.',
    href: '/llms.txt',
    external: true,
  },
]

export default function LabPage() {
  return (
    <PageShell wide>
      <PageHeader
        eyebrow="AI"
        title="The builder layer stays. It just stops being the front door."
        lede="ADRs, schemas, ledgers, APIs, and system maps remain available for builders and curious readers."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        {ARTIFACTS.map(({ key, title, copy, href, external }) => (
          <div
            key={key}
            className="border border-ink bg-paper-2 px-6 py-5 flex flex-col gap-3 relative"
          >
            <div
              className="absolute inset-1 border border-rule pointer-events-none"
              aria-hidden="true"
            />
            <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">builder artifact</p>
            <h3 className="font-sans text-lg font-medium text-ink tracking-tight">{title}</h3>
            <p className="font-mono text-xs text-ink-3 leading-relaxed flex-1">{copy}</p>
            <div>
              {external ? (
                <a className="yy-button yy-button--ghost" href={href}>
                  open →
                </a>
              ) : (
                <Link className="yy-button yy-button--ghost" href={href}>
                  open →
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <SectionRule />

      <div className="yy-actionsRow" style={{ justifyContent: 'flex-start' }}>
        <Link className="yy-button yy-button--ghost" href="/">← home</Link>
      </div>
    </PageShell>
  )
}
