import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 7,
          background: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
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
