import Link from 'next/link'
import Logo from '../components/Logo'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function getOverview() {
  const [links, totalClicks] = await Promise.all([
    db.link.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { _count: { select: { clicks: true } } },
    }),
    db.click.count(),
  ])

  // fetch recent clicks (7d)
  const since = new Date()
  since.setDate(since.getDate() - 6)
  const clicks = await db.click.findMany({ where: { createdAt: { gte: since } }, orderBy: { createdAt: 'asc' } })

  return { links, totalClicks, clicks }
}

function bucketByDay(clicks: { createdAt: Date }[]) {
  const buckets: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const key = d.toISOString().slice(0, 10)
    buckets[key] = 0
  }
  for (const c of clicks) {
    const key = c.createdAt.toISOString().slice(0, 10)
    if (key in buckets) buckets[key]++
  }
  return Object.entries(buckets).map(([k, v]) => ({ date: k, count: v }))
}

function simpleUAParse(ua?: string) {
  const device = ua && /Mobi|Android/i.test(ua) ? 'Mobile' : 'Desktop'
  let browser = 'Other'
  if (ua) {
    if (/Chrome/i.test(ua) && !/Edg|OPR/i.test(ua)) browser = 'Chrome'
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari'
    else if (/Firefox/i.test(ua)) browser = 'Firefox'
    else if (/Edg/i.test(ua)) browser = 'Edge'
  }
  return { device, browser }
}

export default async function Dashboard() {
  const { links, totalClicks, clicks } = await getOverview()

  const linksCreated = await db.link.count()
  const activeLinks = linksCreated

  // top link by clicks
  const withCounts = await db.link.findMany({ include: { _count: { select: { clicks: true } } } })
  const topLink = withCounts.sort((a, b) => b._count.clicks - a._count.clicks)[0]

  const series = bucketByDay(clicks.map(c => ({ createdAt: c.createdAt })))

  // top referrers
  const refMap: Record<string, number> = {}
  const deviceMap: Record<string, number> = {}
  const browserMap: Record<string, number> = {}
  const recentActivity = await db.click.findMany({ orderBy: { createdAt: 'desc' }, take: 6 })
  for (const c of recentActivity) {
    let host = 'Direct'
    if (c.referer) {
      try {
        host = new URL(c.referer).host
      } catch {
        host = c.referer ?? 'Unknown'
      }
    }
    refMap[host] = (refMap[host] || 0) + 1
    const parsed = simpleUAParse(c.userAgent ?? undefined)
    deviceMap[parsed.device] = (deviceMap[parsed.device] || 0) + 1
    browserMap[parsed.browser] = (browserMap[parsed.browser] || 0) + 1
  }

  const referrers = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
  const devices = Object.entries(deviceMap).sort((a, b) => b[1] - a[1])
  const browsers = Object.entries(browserMap).sort((a, b) => b[1] - a[1])

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-edge/70 bg-panel/90">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex items-center">
                <Logo withText={false} />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-fore">Overview</h1>
                <p className="text-xs text-fore-3">Monitor your links and track performance.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-end min-w-0">
              <input placeholder="Search links, aliases or destinations..." className="min-w-0 flex-1 rounded-lg border border-edge px-3 py-2 text-sm text-fore-2" />
              <div className="flex-shrink-0 rounded-lg border border-edge bg-panel px-3 py-2 text-sm text-fore-2">7d</div>
              <Link href="/dashboard/links" className="flex-shrink-0 btn-outline">Create Link</Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Total Clicks</p>
            <div className="mt-2 text-2xl font-semibold">{totalClicks}</div>
          </div>
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Links Created</p>
            <div className="mt-2 text-2xl font-semibold">{linksCreated}</div>
          </div>
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Active Links</p>
            <div className="mt-2 text-2xl font-semibold">{activeLinks}</div>
          </div>
          <div className="card card-elevated p-4">
            <p className="text-xs text-fore-3">Top Link</p>
            <div className="mt-2 text-sm font-semibold text-primary truncate">{topLink ? `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/${topLink.slug}` : '—'}</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 card card-elevated p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-fore">Clicks over time</h3>
              <div className="text-xs text-fore-3">Last 7 days</div>
            </div>
            {series.every(s => s.count === 0) ? (
              <div className="mt-6 text-center py-12 text-sm text-fore-3">No clicks yet — share a link to see activity here.</div>
            ) : (
              <div className="mt-4 h-36">
                {/* Simple sparkline */}
                <svg viewBox="0 0 100 36" className="w-full h-full">
                  {(() => {
                    const max = Math.max(...series.map(s => s.count), 1)
                    const points = series.map((s, i) => {
                      const x = (i / (series.length - 1)) * 100
                      const y = 36 - (s.count / max) * 32
                      return `${x},${y}`
                    })
                    return <polyline fill="none" stroke="#4F46E5" strokeWidth="2" points={points.join(' ')} />
                  })()}
                </svg>
              </div>
            )}
          </div>

          <div className="card card-elevated p-4">
            <h3 className="text-sm font-semibold text-fore">Top Referrers</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {referrers.length === 0 ? (
                <li className="text-sm text-fore-3">No referrers yet</li>
              ) : (
                referrers.map(([host, count]) => (
                  <li key={host} className="flex items-center justify-between text-sm">
                    <span className="truncate">{host}</span>
                    <span className="text-fore-3">{count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card card-elevated p-4">
            <h4 className="text-sm font-semibold text-fore">Top Links</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {links.map(l => (
                <li key={l.id} className="flex items-center justify-between text-sm">
                  <a href={`/${l.slug}`} className="truncate text-primary">{l.slug}</a>
                  <span className="text-fore-3">{l._count.clicks}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card card-elevated p-4">
            <h4 className="text-sm font-semibold text-fore">Devices</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {devices.length === 0 ? <li className="text-fore-3">No data</li> : devices.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between"><span>{k}</span><span className="text-fore-3">{v}</span></li>
              ))}
            </ul>
          </div>

          <div className="card card-elevated p-4">
            <h4 className="text-sm font-semibold text-fore">Browsers</h4>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {browsers.length === 0 ? <li className="text-fore-3">No data</li> : browsers.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between"><span>{k}</span><span className="text-fore-3">{v}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-lg border border-edge bg-panel p-4">
            <h4 className="text-sm font-semibold text-fore">Recent Activity</h4>
            <ul className="mt-3 flex flex-col gap-2">
              {recentActivity.length === 0 ? (
                <li className="text-sm text-fore-3">No recent activity</li>
              ) : (
                recentActivity.map(r => (
                  <li key={r.id} className="flex items-center justify-between rounded-md border border-edge p-2">
                    <div className="text-sm text-fore-2">{(() => {
                      try {
                        return r.referer ? new URL(r.referer).host : 'Direct'
                      } catch {
                        return r.referer ?? 'Unknown'
                      }
                    })()}</div>
                    <div className="text-xs text-fore-3">{new Date(r.createdAt).toLocaleString()}</div>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="rounded-lg border border-edge bg-panel p-4">
            <h4 className="text-sm font-semibold text-fore">Quick Actions</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/dashboard/links" className="rounded-lg border border-edge px-3 py-2 text-sm text-fore-2">Manage links</Link>
              <Link href="/" className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white">Create a link</Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto border-t border-edge/50 py-5 text-center">
        <p className="text-xs text-fore-3">Built by <a href="https://www.linkedin.com/in/prince-kofi-frimpong-amissah/" target="_blank" rel="noreferrer" className="font-medium text-primary">MrrAmissah</a></p>
      </footer>
    </div>
  )
}
