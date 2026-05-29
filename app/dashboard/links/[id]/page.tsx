import Link from 'next/link'
import { db } from '@/lib/db'
import CopyButton from '@/app/components/CopyButton'

export const dynamic = 'force-dynamic'

async function getLink(id: string) {
  const link = await db.link.findUnique({ where: { id }, include: { clicks: true } })
  return link
}

export default async function LinkDetail({ params }: { params: { id: string } }) {
  const link = await getLink(params.id)

  if (!link) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="rounded-lg border border-edge bg-panel p-8 text-center">
          <h2 className="text-lg font-semibold text-fore">Link not found</h2>
          <p className="mt-2 text-sm text-fore-3">That link does not exist.</p>
          <Link href="/dashboard/links" className="mt-4 inline-block rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-white">Back to links</Link>
        </div>
      </div>
    )
  }

  const totalClicks = link.clicks.length

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-edge/70 bg-panel/90">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-fore">{link.slug}</h1>
              <p className="text-xs text-fore-3">{link.url}</p>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/${link.slug}`} target="_blank" rel="noreferrer" className="rounded-lg border border-edge px-3 py-1 text-sm">Open</a>
              <CopyButton text={`${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/${link.slug}`} />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Total clicks</p>
            <div className="mt-2 text-2xl font-semibold text-fore">{totalClicks}</div>
          </div>
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Created</p>
            <div className="mt-2 text-sm text-fore">{new Date(link.createdAt).toLocaleString()}</div>
          </div>
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Status</p>
            <div className="mt-2 text-sm text-fore">Active</div>
          </div>
        </div>

        <section className="mt-6 card p-4">
          {link.clicks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-fore">No clicks yet</h3>
              <p className="mt-2 text-sm text-fore-3">This link hasn't received any clicks. Share it to start collecting analytics.</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-fore-3">Recent activity</p>
              <ul className="mt-3 flex flex-col gap-2">
                {link.clicks.slice().reverse().map(c => (
                  <li key={c.id} className="flex items-center justify-between rounded-md border border-edge p-2">
                    <div className="text-xs text-fore-2">{c.referer ?? 'Direct'}</div>
                    <div className="text-xs text-fore-3">{new Date(c.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
