import Link from 'next/link'
import type { BreadcrumbItem } from '@/lib/nav'

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex items-center flex-wrap gap-x-1 gap-y-0.5 text-xs text-zinc-500">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-zinc-700" aria-hidden="true">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-zinc-300 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-300" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
