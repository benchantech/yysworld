/**
 * Nav utilities for yysworld.
 * All URL patterns follow ADR-022.
 */

export interface BreadcrumbItem {
  label: string
  href?: string // omit for the current (last) item
}

export const BASE_URL = 'https://yysworld.com'
export const BASELINE_URL = '/yy/baseline.json'

// ─── URL builders ────────────────────────────────────────────────────────────

/** /yy, /zz, … */
export function charUrl(char: string): string {
  return `/${char}`
}

/** /yy/about */
export function aboutUrl(char: string): string {
  return `/${char}/about`
}

/**
 * Day artifact URL.
 * e.g. /yy/2026-04-01/main/day/1
 *      /yy/2026-04-01/alt1-time-slip/day/3
 */
export function dayUrl(
  char: string,
  runDate: string,
  branch: string,
  day: number | string,
): string {
  return `/${char}/${runDate}/${branch}/day/${day}`
}

/**
 * Run-level comparison URL.
 * e.g. /yy/2026-04-01/vs/main/alt1-time-slip
 */
export function vsUrl(
  char: string,
  runDate: string,
  branchA: string,
  branchB: string,
): string {
  return `/${char}/${runDate}/vs/${branchA}/${branchB}`
}

/**
 * Day-level comparison URL.
 * e.g. /yy/2026-04-01/vs/main/alt1-time-slip/day/1
 */
export function vsDayUrl(
  char: string,
  runDate: string,
  branchA: string,
  branchB: string,
  day: number | string,
): string {
  return `/${char}/${runDate}/vs/${branchA}/${branchB}/day/${day}`
}

/**
 * Machine-layer data URL for a day snapshot (ADR-022).
 * "/yy/2026-04-01/main/day/3" → "/yy/data/2026-04/main/day/3.json"
 */
export function dataUrl(runDate: string, branch: string, day: number | string): string {
  const month = runDate.slice(0, 7) // "2026-04" from "2026-04-01"
  return `/yy/data/${month}/${branch}/day/${day}.json`
}

// ─── Display formatters ───────────────────────────────────────────────────────

/**
 * Format a run start date for display.
 * "2026-04-01" → "Apr 2026"
 */
export function formatRunDate(runDate: string): string {
  const [year, month] = runDate.split('-')
  const d = new Date(`${year}-${month}-01T00:00:00Z`)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })
}

/**
 * Strip the ordinal prefix from a branch name for display.
 * "alt1-time-slip" → "time-slip"
 * "main" → "main"
 */
export function formatBranch(branch: string): string {
  return branch.replace(/^alt\d+-/, '')
}

// ─── Breadcrumb builders ──────────────────────────────────────────────────────

export function homeBreadcrumbs(): BreadcrumbItem[] {
  return [{ label: 'yysworld' }]
}

export function charBreadcrumbs(char: string): BreadcrumbItem[] {
  return [
    { label: 'yysworld', href: '/' },
    { label: char.toUpperCase() },
  ]
}

export function aboutBreadcrumbs(char: string): BreadcrumbItem[] {
  return [
    { label: 'yysworld', href: '/' },
    { label: char.toUpperCase(), href: charUrl(char) },
    { label: 'about' },
  ]
}

export function dayBreadcrumbs(
  char: string,
  runDate: string,
  branch: string,
  day: string,
): BreadcrumbItem[] {
  return [
    { label: 'yysworld', href: '/' },
    { label: char.toUpperCase(), href: charUrl(char) },
    { label: formatRunDate(runDate), href: dayUrl(char, runDate, 'main', 1) },
    { label: formatBranch(branch), href: dayUrl(char, runDate, branch, 1) },
    { label: `day ${day}` },
  ]
}

export function vsBreadcrumbs(
  char: string,
  runDate: string,
  branchA: string,
  branchB: string,
): BreadcrumbItem[] {
  return [
    { label: 'yysworld', href: '/' },
    { label: char.toUpperCase(), href: charUrl(char) },
    { label: formatRunDate(runDate), href: dayUrl(char, runDate, 'main', 1) },
    { label: `${formatBranch(branchA)} vs ${formatBranch(branchB)}` },
  ]
}

export function vsDayBreadcrumbs(
  char: string,
  runDate: string,
  branchA: string,
  branchB: string,
  day: string,
): BreadcrumbItem[] {
  return [
    { label: 'yysworld', href: '/' },
    { label: char.toUpperCase(), href: charUrl(char) },
    { label: formatRunDate(runDate), href: dayUrl(char, runDate, 'main', 1) },
    {
      label: `${formatBranch(branchA)} vs ${formatBranch(branchB)}`,
      href: vsUrl(char, runDate, branchA, branchB),
    },
    { label: `day ${day}` },
  ]
}

// ─── JSON-LD breadcrumb schema (ADR-021) ─────────────────────────────────────

export function breadcrumbJsonLd(items: BreadcrumbItem[], baseUrl: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  }
}
