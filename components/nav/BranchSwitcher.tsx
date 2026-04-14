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
                className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-50 border border-zinc-700"
                aria-current="page"
              >
                {branch.label}
              </span>
            </li>
          ) : (
            <li key={branch.id}>
              <Link
                href={branch.href}
                className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-zinc-400 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
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
