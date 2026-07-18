import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: "YY's World",
    template: "%s | YY's World",
  },
  description:
    "YY's World is a branching, versioned world rebuilt from a preserved canon substrate.",
  metadataBase: new URL('https://yysworld.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
