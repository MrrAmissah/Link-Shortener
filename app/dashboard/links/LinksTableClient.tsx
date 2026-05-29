'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

type LinkItem = {
  id: string
  slug: string
  url: string
  shortUrl: string
  title?: string | null
  createdAt: string
  clicks: number
}

export default function LinksTableClient({ links }: { links: LinkItem[] }) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('Delete this link? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      router.refresh()
    } catch (err) {
      alert('Could not delete link')
    }
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // small feedback
      // using alert is coarse but reliable across environments
      void 0
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {links.map(link => (
        <div key={link.id} className="card card-elevated p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <a href={link.shortUrl} target="_blank" rel="noreferrer" className="font-mono text-sm font-semibold text-primary hover:underline truncate">
                    {link.shortUrl}
                  </a>
                  <span className="text-xs text-fore-3 truncate">{link.title ?? ''}</span>
                </div>
                <p className="mt-1 truncate text-xs text-fore-2">{link.url}</p>
              </div>
            </div>
          </div>

            <div className="mt-3 flex items-center gap-2 sm:mt-0">
            <div className="flex items-center gap-2 text-xs text-fore-3">
              <span className="px-2 py-1 rounded-md bg-primary-soft text-primary">{link.clicks} clicks</span>
              <span className="px-2 py-1 rounded-md bg-panel-muted text-fore-2">{new Date(link.createdAt).toLocaleDateString()}</span>
            </div>

            <button onClick={() => copy(link.shortUrl)} className="btn-outline">Copy</button>
            <a href={link.shortUrl} target="_blank" rel="noreferrer" className="btn-outline">Open</a>
            <a href={`/dashboard/links/${link.id}`} className="btn-outline">Analytics</a>
            <button onClick={() => handleDelete(link.id)} className="rounded-lg border border-edge px-3 py-1 text-xs text-error hover:bg-panel-muted">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
