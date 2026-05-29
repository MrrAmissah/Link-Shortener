import Link from 'next/link'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getLinks() {
  return db.link.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
    include: { _count: { select: { clicks: true } } },
  })
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function Dashboard() {
  const links = await getLinks()

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-edge/70 bg-panel/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo text-white text-sm font-bold shadow-sm select-none hover:bg-indigo-hi transition-colors">
              S
            </Link>
            <span className="text-sm font-bold text-fore">Snip</span>
            <span className="hidden rounded-full bg-indigo-soft px-2 py-0.5 text-xs font-semibold text-indigo-dark sm:block">
              Dashboard
            </span>
          </div>
          <Link
            href="/"
            className="flex h-8 items-center gap-1.5 rounded-full border border-edge bg-raised px-3 text-xs font-semibold text-fore-3 transition-colors hover:border-indigo/40 hover:text-indigo"
          >
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
              <path d="M10 6H2M2 6l4-4M2 6l4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            New link
          </Link>
        </div>
      </header>

      <div className="border-b border-edge/40 bg-gradient-to-b from-indigo/5 to-transparent py-8 text-center">
        <h1 className="text-2xl font-bold text-fore sm:text-3xl">Your Links</h1>
        <p className="mt-1.5 text-sm text-fore-3">
          {links.length === 0 ? 'No links yet.' : `${links.length} most recent link${links.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <main className="mx-auto max-w-3xl px-3 py-8 sm:px-4">
        {links.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-edge bg-panel py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-soft">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.5 6.5L10 10M8.5 4.5l1.293-1.293a4.243 4.243 0 016 6L14.5 10.5M11.5 15.5l-1.293 1.293a4.243 4.243 0 01-6-6L5.5 9.5" stroke="#4f46e5" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-fore">No links yet</p>
              <p className="mt-0.5 text-sm text-fore-3">Shorten your first URL to see it here.</p>
            </div>
            <Link
              href="/"
              className="mt-1 flex h-9 items-center gap-2 rounded-lg bg-indigo px-4 text-sm font-semibold text-white shadow-md shadow-indigo/25 hover:bg-indigo-hi transition-colors"
            >
              Create a link
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {links.map((link: Awaited<ReturnType<typeof getLinks>>[number]) => (
              <div
                key={link.id}
                className="flex flex-col gap-2 rounded-xl border border-edge bg-panel px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <a
                    href={`/${link.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-semibold text-indigo hover:underline truncate"
                  >
                    /{link.slug}
                  </a>
                  <p className="truncate text-xs text-fore-3">{link.url}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5 rounded-full bg-indigo-soft px-2.5 py-1 text-xs font-semibold text-indigo-dark">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v5M6 6l-2.5 2.5M6 6l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M2 9.5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    {link._count.clicks} click{link._count.clicks !== 1 ? 's' : ''}
                  </div>
                  <span className="text-xs text-fore-3">{formatDate(link.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-edge/50 py-5 text-center">
        <p className="text-xs text-fore-3">
          Built by{' '}
          <a
            href="https://www.linkedin.com/in/prince-kofi-frimpong-amissah/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-indigo hover:underline"
          >
            MrrAmissah
          </a>
        </p>
      </footer>
    </div>
  )
}
