import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHeader, PageShell } from '@/components/canon/Layout'
import { MonoLabel, NotebookCard, SectionRule } from '@/components/canon/Primitives'

export const metadata: Metadata = {
  title: 'Lab — yysworld',
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
        eyebrow="lab"
        title="The builder layer stays. It just stops being the front door."
        lede="ADRs, schemas, ledgers, APIs, and system maps remain available for builders and curious readers."
      />

      <section className="yy-labGrid" style={{ marginTop: '2rem' }}>
        {ARTIFACTS.map(({ key, title, copy, href, external }) => (
          <NotebookCard key={key}>
            <MonoLabel>builder artifact</MonoLabel>
            <h3>{title}</h3>
            <p>{copy}</p>
            <div style={{ marginTop: '1rem' }}>
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
          </NotebookCard>
        ))}
      </section>

      <SectionRule />

      <div className="yy-actionsRow" style={{ justifyContent: 'flex-start' }}>
        <Link className="yy-button yy-button--ghost" href="/">← home</Link>
      </div>
    </PageShell>
  )
}
