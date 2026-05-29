'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'

interface Result {
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
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)
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

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-edge/70 bg-panel/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo text-white text-sm font-bold shadow-sm select-none">
              S
            </div>
            <span className="text-sm font-bold text-fore">Snip</span>
            <span className="hidden rounded-full bg-indigo-soft px-2 py-0.5 text-xs font-semibold text-indigo-dark sm:block">
              URL Shortener
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex h-8 items-center gap-1.5 rounded-full border border-edge bg-raised px-3 text-xs font-semibold text-fore-3 transition-colors hover:border-indigo/40 hover:text-indigo"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
              <rect x="7" y="1" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
              <rect x="1" y="7" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
              <rect x="7" y="7" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      <div className="border-b border-edge/40 bg-gradient-to-b from-indigo/5 to-transparent py-10 text-center">
        <h1 className="text-2xl font-bold text-fore sm:text-3xl">Shorten any URL</h1>
        <p className="mt-1.5 text-sm text-fore-3">Paste a long link, get a short one with click analytics.</p>
      </div>

      <main className="mx-auto max-w-2xl px-3 py-8 sm:px-4">
        <div className="rounded-2xl border border-edge bg-panel shadow-xl shadow-stone-900/5">
          <div className="border-b border-edge px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo text-white shadow-md shadow-indigo/25">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M13.5 6.5L10 10M8.5 4.5l1.293-1.293a4.243 4.243 0 016 6L14.5 10.5M11.5 15.5l-1.293 1.293a4.243 4.243 0 01-6-6L5.5 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className="text-base font-bold text-fore">New Short Link</h2>
                <p className="text-xs text-fore-3">Paste any http/https URL below</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="url" className="text-xs font-semibold uppercase tracking-wider text-fore-3">
                Destination URL
              </label>
              <input
                id="url"
                ref={inputRef}
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                required
                className={[
                  'w-full rounded-xl border border-edge bg-canvas px-4 py-3',
                  'text-sm font-medium text-fore placeholder:text-fore-3',
                  'outline-none shadow-sm transition-all',
                  'focus:border-indigo/60 focus:ring-2 focus:ring-indigo/15 focus:bg-panel',
                  'hover:border-edge-hi',
                ].join(' ')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="custom-slug" className="text-xs font-semibold uppercase tracking-wider text-fore-3">
                Custom alias <span className="normal-case font-normal text-fore-3">(optional)</span>
              </label>
              <div className="flex items-center rounded-xl border border-edge bg-canvas shadow-sm transition-all focus-within:border-indigo/60 focus-within:ring-2 focus-within:ring-indigo/15 focus-within:bg-panel hover:border-edge-hi">
                <span className="shrink-0 pl-4 text-xs text-fore-3 select-none">snip-by-mrramissah.vercel.app/</span>
                <input
                  id="custom-slug"
                  type="text"
                  value={customSlug}
                  onChange={e => setCustomSlug(e.target.value)}
                  placeholder="my-link"
                  className="min-w-0 flex-1 bg-transparent py-3 pr-4 text-sm font-medium text-fore placeholder:text-fore-3 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-error/30 bg-error/5 px-3 py-2.5 text-sm text-error">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 12H1L7 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                  <line x1="7" y1="5.5" x2="7" y2="8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7" cy="10.5" r="0.7" fill="currentColor" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !url.trim()}
              className={[
                'flex h-11 items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all',
                'bg-indigo text-white shadow-md shadow-indigo/25',
                'hover:bg-indigo-hi active:scale-[0.98]',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
              ].join(' ')}
            >
              {loading ? (
                <>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity=".2" />
                    <path d="M12 2a10 10 0 0110 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Shortening...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6.5 9.5l5-5M11.5 4.5H8M11.5 4.5V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 3H3.5A1.5 1.5 0 002 4.5v8A1.5 1.5 0 003.5 14h8A1.5 1.5 0 0013 12.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  Shorten URL
                </>
              )}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-4 rounded-2xl border border-indigo/20 bg-indigo-soft px-5 py-4 sm:px-6">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-ok/15">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2 2 4-4" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-indigo-dark">Link created</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate font-mono text-sm font-semibold text-indigo hover:underline"
              >
                {result.shortUrl}
              </a>
              <button
                onClick={() => copyToClipboard(result.shortUrl)}
                className="shrink-0 flex h-8 items-center gap-1.5 rounded-lg border border-indigo/30 bg-panel px-3 text-xs font-semibold text-indigo transition-colors hover:bg-indigo hover:text-white"
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="4" y="4" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M4 4V3a1 1 0 00-1-1H3a1 1 0 00-1 1v5a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 truncate text-xs text-fore-3">{result.url}</p>
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
