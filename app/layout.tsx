import type { Metadata } from 'next'
import { Spectral, IBM_Plex_Mono, Caveat } from 'next/font/google'
import { SiteHeader } from '@/components/nav/SiteHeader'
import Link from 'next/link'
import './globals.css'

const spectral = Spectral({
  variable: '--font-spectral',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
})

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    default: 'yysworld',
    template: '%s — yysworld',
  },
  description:
    'Same being, different paths. Watch how YY (a squirrel) responds to the same world under different circumstances — branching, diverging, drifting over time.',
  metadataBase: new URL('https://yysworld.com'),
  keywords: [
    'branching narrative',
    'character simulation',
    'life observatory',
    'YY',
    'branching world',
    'daily story',
    'alternate paths',
  ],
  openGraph: {
    siteName: 'yysworld',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    types: {
      'text/plain': 'https://yysworld.com/llms.txt',
      'application/rss+xml': 'https://yysworld.com/feed.xml',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${spectral.variable} ${ibmPlexMono.variable} ${caveat.variable} font-sans antialiased bg-paper text-ink min-h-svh`}
      >
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-rule mt-20 px-6 py-10">
      <div className="mx-auto max-w-3xl flex flex-col gap-5 sm:flex-row sm:justify-between">
        <div className="space-y-1">
          <p className="font-mono text-xs text-ink-3 uppercase tracking-widest">yysworld</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-ink-3 mt-2">
            <Link href="/today" className="hover:text-ink transition-colors border-b-0">today</Link>
            <Link href="/compare" className="hover:text-ink transition-colors border-b-0">compare</Link>
            <Link href="/yy/about/" className="hover:text-ink transition-colors border-b-0">meet yy</Link>
            <Link href="/archive" className="hover:text-ink transition-colors border-b-0">archive</Link>
            <Link href="/lab" className="hover:text-ink transition-colors border-b-0">lab</Link>
          </nav>
        </div>
        <div className="space-y-1 text-right">
          <p
            className="font-hand text-xl"
            style={{ color: 'var(--color-accent)' }}
          >
            — Ben, writing for his kids.
          </p>
          <p className="font-mono text-xs text-ink-4">
            <a
              href="https://yymethod.com"
              className="hover:text-ink-2 transition-colors border-b-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              yymethod.com
            </a>
            {' · '}
            <a
              href="https://benchantech.com"
              className="hover:text-ink-2 transition-colors border-b-0"
              target="_blank"
              rel="noopener noreferrer"
            >
              benchantech.com
            </a>
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-3xl mt-6 pt-4 border-t border-rule-2 flex justify-between font-mono text-[10.5px] text-ink-4">
        <span>© 2026 · human-guided. ai-written. improving with time.</span>
        <span>
          <a href="/llms.txt" className="hover:text-ink-3 transition-colors border-b-0">/llms.txt</a>
          {' · '}
          <a href="/feed.xml" className="hover:text-ink-3 transition-colors border-b-0">/feed.xml</a>
        </span>
      </div>
    </footer>
  )
}
