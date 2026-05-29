import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Snip - URL Shortener',
  description: 'Shorten any URL and track clicks in real time.',
  openGraph: {
    title: 'Snip - URL Shortener',
    description: 'Shorten any URL and track clicks in real time.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-canvas text-fore antialiased">
        {children}
      </body>
    </html>
  )
}
