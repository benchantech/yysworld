'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/today', label: 'today', exact: false },
  { href: '/compare', label: 'compare', exact: false },
  { href: '/yy/about/', label: 'meet yy', exact: false },
  { href: '/archive', label: 'archive', exact: false },
  { href: '/lab', label: 'AI', exact: false },
]

export function SiteHeader() {
  const pathname = usePathname()

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href || pathname === href.replace(/\/$/, '')
    return pathname.startsWith(href)
  }

  return (
    <header
      className="sticky top-0 z-40 border-b border-rule backdrop-blur-sm"
      style={{ background: 'color-mix(in oklch, var(--color-paper) 92%, transparent)' }}
    >
      <div className="mx-auto max-w-[1080px] px-6 py-3.5 flex items-center gap-4 min-w-0">
        <Link
          href="/"
          className="font-mono text-sm font-medium text-ink tracking-tight flex items-center gap-2 border-b-0 shrink-0"
        >
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ background: 'var(--color-accent)' }}
            aria-hidden="true"
          />
          yysworld
        </Link>

        <nav aria-label="site" className="flex items-center gap-3 sm:gap-5 ml-auto overflow-x-auto scrollbar-none min-w-0 flex-nowrap">
          {NAV.map(({ href, label, exact }) => {
            const active = isActive(href, exact)
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'font-mono text-[11px] sm:text-xs tracking-wide whitespace-nowrap pb-0.5 border-b transition-colors shrink-0',
                  active
                    ? 'text-ink border-ink'
                    : 'text-ink-2 border-transparent hover:text-ink hover:border-ink-4',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
