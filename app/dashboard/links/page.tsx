import Link from 'next/link'
import Logo from '../../components/Logo'
import { db } from '@/lib/db'
import LinksTableClient from './LinksTableClient'

export const dynamic = 'force-dynamic'

async function getLinks() {
  const links = await db.link.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { clicks: true } } },
  })

  return links.map(l => ({
    id: l.id,
    slug: l.slug,
    url: l.url,
    title: null,
    createdAt: l.createdAt.toISOString(),
    clicks: l._count.clicks,
    shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/${l.slug}`,
  }))
}

export default async function LinksPage() {
  const links = await getLinks()

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-edge/70 bg-panel/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Logo withText={false} />
            <div>
              <h1 className="text-base font-semibold text-fore">Links</h1>
              <p className="text-xs text-fore-3">Manage all your short links</p>
            </div>
          </div>
          <Link href="/" className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-white">Create link</Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {links.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-edge bg-panel py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.5 6.5L10 10M8.5 4.5l1.293-1.293a4.243 4.243 0 016 6L14.5 10.5M11.5 15.5l-1.293 1.293a4.243 4.243 0 01-6-6L5.5 9.5" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-fore">No links yet</p>
              <p className="mt-0.5 text-sm text-fore-3">Create your first short link to get started.</p>
            </div>
            <Link href="/" className="mt-1 flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-white">Create a link</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <LinksTableClient links={links} />
          </div>
        )}
      </main>
    </div>
  )
}
