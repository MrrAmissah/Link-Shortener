import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Snip - URL Shortener',
    short_name: 'Snip',
    description: 'Shorten any URL and track clicks in real time.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f8f7f6',
    theme_color: '#4f46e5',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
