import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 36,
          background: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="108" height="108" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="5.5" r="2.3" stroke="white" strokeWidth="1.6" />
          <circle cx="4" cy="14.5" r="2.3" stroke="white" strokeWidth="1.6" />
          <line x1="6" y1="6.5" x2="17.5" y2="13" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="6" y1="13.5" x2="17.5" y2="7" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size },
  )
}
