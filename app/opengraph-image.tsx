import { ImageResponse } from 'next/og'

export const alt = 'yysworld — branching life observatory'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
        {/* Top-left domain label */}
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

        {/* Branch lines — decorative */}
        <svg
          style={{ position: 'absolute', top: 0, right: 0, opacity: 0.06 }}
          width="480"
          height="630"
          viewBox="0 0 480 630"
          fill="none"
        >
          <line x1="240" y1="0" x2="240" y2="630" stroke="#fafafa" strokeWidth="1" />
          <line x1="240" y1="200" x2="400" y2="630" stroke="#fafafa" strokeWidth="1" />
          <line x1="240" y1="200" x2="80" y2="630" stroke="#fafafa" strokeWidth="1" />
          <circle cx="240" cy="200" r="4" fill="#fafafa" />
        </svg>

        {/* Main wordmark */}
        <div
          style={{
            fontSize: '96px',
            fontWeight: 600,
            color: '#fafafa',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            marginBottom: '28px',
          }}
        >
          yysworld
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#71717a',
            lineHeight: 1.4,
            maxWidth: '600px',
          }}
        >
          Same being. Different paths.
        </div>

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
