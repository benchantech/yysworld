import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SiteHeader } from '@/components/nav/SiteHeader'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'yysworld',
    template: '%s — yysworld',
  },
  description: 'Same being, different paths. Watch how YY responds to the same world under different circumstances.',
  metadataBase: new URL('https://yysworld.com'),
  openGraph: {
    siteName: 'yysworld',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50 min-h-svh`}
      >
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
