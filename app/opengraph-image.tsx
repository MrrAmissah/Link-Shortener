import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          backgroundImage: 'linear-gradient(135deg, #312e81 0%, #4f46e5 55%, #6366f1 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28, marginBottom: 28 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="52" height="52" viewBox="0 0 20 20" fill="none">
              <circle cx="4" cy="5.5" r="2.3" stroke="white" strokeWidth="1.6" />
              <circle cx="4" cy="14.5" r="2.3" stroke="white" strokeWidth="1.6" />
              <line x1="6" y1="6.5" x2="17.5" y2="13" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="6" y1="13.5" x2="17.5" y2="7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span
            style={{
              fontSize: 80,
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-3px',
              lineHeight: 1,
            }}
          >
            Snip
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: 30,
            color: 'rgba(255,255,255,0.75)',
            margin: 0,
            textAlign: 'center',
            fontWeight: 400,
            letterSpacing: '-0.3px',
          }}
        >
          Fast, clean link shortener with click analytics
        </p>

        {/* URL transform visual */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 52,
          }}
        >
          <div
            style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: 14,
              padding: '14px 26px',
              fontSize: 22,
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'monospace',
              letterSpacing: '-0.3px',
            }}
          >
            https://long-website.com/very/long/path
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 28, fontWeight: 300 }}>
            {'→'}
          </span>
          <div
            style={{
              background: 'rgba(255,255,255,0.18)',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: 14,
              padding: '14px 26px',
              fontSize: 22,
              color: 'white',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '-0.3px',
            }}
          >
            snipnow.vercel.app/abc1234
          </div>
        </div>

        {/* Bottom domain label */}
        <p
          style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.4)',
            marginTop: 48,
            marginBottom: 0,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          snipnow.vercel.app
        </p>
      </div>
    ),
    { ...size },
  )
}
