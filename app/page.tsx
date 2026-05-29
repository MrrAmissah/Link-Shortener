"use client"

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Logo from './components/Logo'
import { isValidUrl, isValidSlug } from '@/lib/slug'

interface Result {
  id: string
  slug: string
  url: string
  shortUrl: string
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [mobilePlatform, setMobilePlatform] = useState<'ios' | 'android' | 'other' | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const dismissed = window.localStorage.getItem('snip-install-prompt-dismissed') === 'true'
    if (dismissed) return

    const ua = navigator.userAgent || navigator.vendor || ''
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua)
    if (!isMobile) return

    const platform = /android/i.test(ua)
      ? 'android'
      : /iPad|iPhone|iPod/i.test(ua)
      ? 'ios'
      : 'other'

    setMobilePlatform(platform)
    setShowInstallPrompt(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!isValidUrl(url.trim())) return setError('Please enter a valid http(s) URL')
    if (customSlug && !isValidSlug(customSlug)) return setError('Custom alias must be 3-30 characters: letters, digits, - or _')

    setLoading(true)

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim(), customSlug: customSlug.trim() || undefined }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong')
      } else {
        setResult(data as Result)
        setUrl('')
        setCustomSlug('')
      }
    } catch {
      setError('Network error - please try again')
    } finally {
      setLoading(false)
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function pasteFromClipboard() {
    try {
      const t = await navigator.clipboard.readText()
      setUrl(t)
      if (inputRef.current) inputRef.current.focus()
    } catch {
      setError('Clipboard access denied')
    }
  }

  function dismissInstallPrompt() {
    setShowInstallPrompt(false)
    window.localStorage.setItem('snip-install-prompt-dismissed', 'true')
  }

  const urlValid = isValidUrl(url.trim())

  return (
    <div className="min-h-screen bg-canvas overflow-x-hidden">
      <header className="sticky top-0 z-10 border-b border-edge/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-4">
            <Logo withText />
            <span className="hidden sm:inline product-badge">URL Shortener</span>
          </div>

          <div className="flex flex-shrink-0 items-center gap-3">
            <Link href="/dashboard" className="btn-outline">Dashboard</Link>
          </div>
        </div>
      </header>

      {showInstallPrompt && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="rounded-3xl border border-edge bg-primary-soft p-4 shadow-sm sm:flex sm:items-start sm:justify-between sm:gap-4">
            <div>
              <p className="text-sm font-semibold text-primary">Add Snip to your home screen</p>
              <p className="mt-2 text-sm text-fore-2 max-w-2xl">Install this shortcut on your phone for instant access to link creation.</p>
              <div className="mt-3 grid gap-2 text-sm text-fore-3">
                {mobilePlatform === 'ios' ? (
                  <p>Tap the share icon, then choose <span className="font-semibold text-fore">Add to Home Screen</span>.</p>
                ) : mobilePlatform === 'android' ? (
                  <p>Open the browser menu, then choose <span className="font-semibold text-fore">Add to Home screen</span>.</p>
                ) : (
                  <>
                    <p>On iOS: tap the share icon, then choose <span className="font-semibold text-fore">Add to Home Screen</span>.</p>
                    <p>On Android: open the browser menu, then choose <span className="font-semibold text-fore">Add to Home screen</span>.</p>
                  </>
                )}
              </div>
            </div>
            <button type="button" onClick={dismissInstallPrompt} className="btn-outline mt-4 sm:mt-0">Dismiss</button>
          </div>
        </div>
      )}

      <div className="hero-tight text-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full bg-primary-soft px-4 py-2 text-xs font-semibold text-primary mb-4 tracking-[0.08em]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-sm">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
              </svg>
              <span>Fast</span>
            </span>
            <span className="h-4 w-px bg-edge/80" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-sm">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                <path d="M9.5 11.5h5" />
              </svg>
              <span>Secure</span>
            </span>
            <span className="h-4 w-px bg-edge/80" />
            <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 shadow-sm">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19h16" />
                <path d="M8 14v5" />
                <path d="M12 10v9" />
                <path d="M16 6v13" />
              </svg>
              <span>Trackable</span>
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-fore leading-tight">Short links with analytics built in</h1>
          <p className="mt-4 text-base sm:text-lg text-fore-2 max-w-2xl mx-auto">Create custom, trackable links for campaigns, socials, SMS, and QR codes.</p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-6xl space-y-5">
          <div className="card card-elevated-2 p-8">
            <div className="grid gap-6 lg:grid-cols-[1.4fr_0.95fr]">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-xs font-semibold text-fore-3">1. Destination URL</label>
                  <span className="text-xs text-fore-3">Required</span>
                </div>
                <input
                  id="url"
                  ref={inputRef}
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://example.com/very/long/url"
                  className="mt-3 w-full rounded-2xl border border-edge input-dense text-sm text-fore outline-none focus:border-primary"
                />
                <p className="mt-3 text-sm text-fore-3">Enter the long URL you want to shorten.</p>
                {!urlValid && url.trim().length > 0 && <div className="mt-2 text-xs text-error">Enter a valid http or https URL</div>}
              </div>

              <div>
                <div className="flex items-center justify-between gap-4">
                  <label className="block text-xs font-semibold text-fore-3">2. Custom alias <span className="font-normal">(optional)</span></label>
                  <span className="text-xs text-fore-3">3-30 characters</span>
                </div>
                <div className="mt-3 flex min-w-0 items-center rounded-2xl border border-edge bg-panel input-dense overflow-hidden">
                  <span className="px-4 text-sm text-fore-3 select-none bg-panel-muted border-r border-edge/70">{process.env.NEXT_PUBLIC_BASE_URL ?? 'snipnow.vercel.app'}/</span>
                  <input value={customSlug} onChange={e => setCustomSlug(e.target.value)} placeholder="my-link" className="flex-1 min-w-0 bg-transparent text-sm text-fore outline-none" />
                </div>
                <p className="mt-3 text-sm text-fore-3">Choose a custom ending for your link.</p>
                {customSlug && !isValidSlug(customSlug) && <div className="mt-2 text-xs text-error">Custom alias must be 3-30 characters: letters, digits, - or _</div>}
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-sm text-fore-3">Paste a URL from your clipboard and create it instantly.</span>
              <button type="button" onClick={pasteFromClipboard} className="btn-secondary w-full sm:w-auto">Paste from clipboard</button>
            </div>

            {error && <div className="mt-4 text-sm text-error">{error}</div>}
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={loading || !urlValid} className="btn-primary whitespace-nowrap disabled:opacity-60">
              {loading ? 'Shortening...' : 'Create short link'}
            </button>
          </div>
        </form>

        <div className="mx-auto max-w-6xl space-y-8 mt-8">
          {result ? (
            <div className="result-panel">
              <div className="icon-badge" style={{ width: 48, height: 48, borderRadius: 12 }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="11" fill="#EEF2FF"/><path d="M7 12l3 3 7-7" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-fore-2">Your short link is ready</div>
                <a href={result.shortUrl} target="_blank" rel="noreferrer" className="block mt-1 mono-link text-base font-semibold text-primary truncate">{result.shortUrl}</a>
                <div className="mt-1 text-xs text-fore-3 truncate">{result.url}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="status-badge">Active</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyToClipboard(result.shortUrl)} className="btn-outline">Copy</button>
                  <a href={result.shortUrl} target="_blank" rel="noreferrer" className="btn-primary">Open</a>
                  <Link href={`/dashboard/links/${result.id}`} className="btn-outline">Analytics</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-4">
              <div className="text-sm text-fore-3">Create a short link to see a polished result card with copy, open, and analytics actions.</div>
            </div>
          )}
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="feature-card card-hover">
            <div className="icon" style={{ background: 'linear-gradient(180deg, rgba(79,70,229,0.12), rgba(124,58,237,0.06))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17h3V9H3v8zM10 17h3V5h-3v12zM17 17h3V13h-3v4z" fill="#4F46E5"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-fore">Click Analytics</div>
              <div className="text-xs text-fore-3 mt-1">Track clicks, referrers, devices, and conversion-ready metrics in real time.</div>
            </div>
          </div>

          <div className="feature-card card-hover">
            <div className="icon" style={{ background: 'linear-gradient(180deg, rgba(79,70,229,0.08), rgba(124,58,237,0.04))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10.59 13.41a2 2 0 0 0 2.83 0l4.24-4.24a3.5 3.5 0 0 0-4.95-4.95L12.47 8.46" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-fore">Custom Aliases</div>
              <div className="text-xs text-fore-3 mt-1">Create memorable branded links for campaigns and socials.</div>
            </div>
          </div>

          <div className="feature-card card-hover">
            <div className="icon" style={{ background: 'linear-gradient(180deg, rgba(16,185,129,0.06), rgba(79,70,229,0.03))' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v6c0 5-3.58 9-7 10-3.42-1-7-5-7-10V6l7-4z" stroke="#4F46E5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-fore">Link Safety</div>
              <div className="text-xs text-fore-3 mt-1">Preview destinations and flag suspicious or unsafe links before sharing.</div>
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
