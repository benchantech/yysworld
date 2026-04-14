import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export — deploys to GitHub Pages via GitHub Actions (ADR-020 public layer).
  // The Vercel private layer can still use this same build; Vercel ignores `output: 'export'`
  // when deploying as a standard Next.js app if this config is overridden per environment.
  output: 'export',

  // Trailing slashes so GitHub Pages serves /yy/about/ → /yy/about/index.html correctly.
  trailingSlash: true,

  // typedRoutes: true — enable once `next typegen` is wired into CI
}

export default nextConfig
