import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-50 tracking-tight hover:text-zinc-300 transition-colors"
        >
          yysworld
        </Link>
        <nav aria-label="site" className="flex items-center gap-5">
          <Link
            href="/yy"
            className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            YY
          </Link>
          <Link
            href="/adrs/"
            className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            ADRs
          </Link>
        </nav>
      </div>
    </header>
  )
}
