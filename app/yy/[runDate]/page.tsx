import { redirect } from 'next/navigation'

// Static export: no params generated → page not built.
// On Vercel (SSR mode): redirect() runs and sends a 307 to main/day/1.
export const dynamicParams = false
export function generateStaticParams() {
  // Populated by nightly pipeline from the run manifest.
  return []
}

// /yy/[runDate]/ → 307 to current day on main branch (ADR-022)
// When the run is active: redirect to the current day.
// When the run is complete: redirect to day 1.
// In production this would read the run manifest to determine currentDay.
export default async function RunDateIndexPage({
  params,
}: {
  params: Promise<{ runDate: string }>
}) {
  const { runDate } = await params
  redirect(`/yy/${runDate}/main/day/1`)
}
