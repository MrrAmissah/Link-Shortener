import { customAlphabet } from 'nanoid'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
const nanoid = customAlphabet(ALPHABET, 7)

export const RESERVED_SLUGS = new Set(['api', 'dashboard', '_next', 'favicon.ico'])

export function generateSlug(): string {
  return nanoid()
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(slug)
}

export function isValidUrl(raw: string): boolean {
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}
