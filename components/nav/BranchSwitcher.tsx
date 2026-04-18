import Link from 'next/link'

export interface BranchOption {
  id: string
  label: string
  href: string
  isCurrent: boolean
}

interface BranchSwitcherProps {
  branches: BranchOption[]
  label?: string
}

export function BranchSwitcher({ branches, label = 'branch' }: BranchSwitcherProps) {
  if (branches.length <= 1) return null

  return (
    <nav aria-label={label}>
      <ol className="flex items-center gap-2 flex-wrap">
        {branches.map((branch) =>
          branch.isCurrent ? (
            <li key={branch.id}>
              <span
                className="inline-flex px-3 py-1 font-mono text-xs border border-ink text-ink bg-paper-2"
                aria-current="page"
              >
                {branch.label}
              </span>
            </li>
          ) : (
            <li key={branch.id}>
              <Link
                href={branch.href}
                className="inline-flex px-3 py-1 font-mono text-xs text-ink-2 border border-rule hover:border-ink-2 hover:text-ink transition-colors border-b border-b-rule"
              >
                {branch.label}
              </Link>
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}
