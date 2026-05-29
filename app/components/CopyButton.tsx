'use client'

import { useState } from 'react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  async function onClick() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Copy failed')
    }
  }

  return (
    <button onClick={onClick} className="rounded-lg bg-primary px-3 py-1 text-sm font-semibold text-white">
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
