'use client'

import Link from 'next/link'

export default function Logo({ withText = true, size = 36, href = '/' }: { withText?: boolean; size?: number; href?: string }) {
  const markSize = Math.min(48, Math.max(20, Math.floor(size * 0.9)))
  return (
    <Link href={href} className="inline-flex items-center gap-3">
      <div style={{ width: markSize, height: markSize }} className="flex items-center justify-center rounded-lg bg-primary text-white">
        <svg width="19" height="19" viewBox="0 0 20 20" fill="none">
          <circle cx="4" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="4" cy="14.5" r="2.3" stroke="currentColor" strokeWidth="1.6" />
          <line x1="6" y1="6.5" x2="17.5" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="6" y1="13.5" x2="17.5" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      {withText && (
        <div>
          <div className="text-sm font-semibold text-fore">Snip</div>
        </div>
      )}
    </Link>
  )
}
