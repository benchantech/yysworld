import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/nav'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center flex-wrap gap-x-1 gap-y-0.5 font-mono text-xs text-ink-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-ink-4" aria-hidden="true">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-ink transition-colors border-b-0"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-2" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
