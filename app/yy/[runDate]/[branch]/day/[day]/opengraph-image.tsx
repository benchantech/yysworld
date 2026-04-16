import { ImageResponse } from 'next/og'
import { getDayParams, getDayArtifact, getStaticRuns } from '@/lib/runs'
import { formatBranch, formatRunDate } from '@/lib/nav'

export const dynamic = 'force-static'
export const alt = 'YY — yysworld'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams(): { runDate: string; branch: string; day: string }[] {
  const params = getDayParams()
  const covered = new Set(params.map((p) => `${p.runDate}/${p.branch}`))
  for (const run of getStaticRuns(true)) {
    for (const b of run.branches) {
      if (!covered.has(`${run.runDate}/${b.id}`)) {
        params.push({ runDate: run.runDate, branch: b.id, day: '1' })
      }
    }
  }
  if (params.length === 0) {
    return [{ runDate: '0000-00-00', branch: 'main', day: '1' }]
  }
  return params
}

interface Props {
  params: Promise<{ runDate: string; branch: string; day: string }>
}

export default async function DayOgImage({ params }: Props) {
  const { runDate, branch, day } = await params
  const artifact = getDayArtifact(runDate, branch, day)
  const branchLabel = formatBranch(branch)
  const runLabel = formatRunDate(runDate)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          backgroundColor: '#09090b',
          padding: '80px 96px',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Top-left: site label */}
        <div
          style={{
            position: 'absolute',
            top: '52px',
            left: '96px',
            fontSize: '14px',
            color: '#3f3f46',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '0.05em',
          }}
        >
          yysworld.com
        </div>

        {/* Top-right: run label */}
        <div
          style={{
            position: 'absolute',
            top: '52px',
            right: '96px',
            fontSize: '14px',
            color: '#3f3f46',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '0.05em',
          }}
        >
          {runLabel}
        </div>

        {/* Branch label */}
        <div
          style={{
            fontSize: '15px',
            color: '#52525b',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '0.06em',
            marginBottom: '16px',
          }}
        >
          {branchLabel}
        </div>

        {/* Day number — large */}
        <div
          style={{
            fontSize: '88px',
            fontWeight: 600,
            color: '#fafafa',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            marginBottom: '28px',
          }}
        >
          {`Day ${day}`}
        </div>

        {/* Artifact title if available */}
        {artifact?.title ? (
          <div
            style={{
              fontSize: '24px',
              color: '#71717a',
              lineHeight: 1.4,
              maxWidth: '680px',
            }}
          >
            {artifact.title}
          </div>
        ) : null}

        {/* Bottom label */}
        <div
          style={{
            position: 'absolute',
            bottom: '52px',
            left: '96px',
            fontSize: '13px',
            color: '#3f3f46',
            fontFamily: 'ui-monospace, monospace',
            letterSpacing: '0.05em',
          }}
        >
          branching life observatory
        </div>
      </div>
    ),
    { ...size },
  )
}
