import { describe, it, expect } from 'vitest'
import { generateSlug, isValidSlug, isValidUrl, RESERVED_SLUGS } from './slug'

describe('generateSlug', () => {
  it('generates a 7-character slug', () => {
    expect(generateSlug()).toHaveLength(7)
  })

  it('only contains URL-safe characters', () => {
    for (let i = 0; i < 50; i++) {
      expect(generateSlug()).toMatch(/^[a-zA-Z0-9_-]+$/)
    }
  })

  it('generates unique values', () => {
    const slugs = new Set(Array.from({ length: 100 }, generateSlug))
    expect(slugs.size).toBe(100)
  })
})

describe('isValidSlug', () => {
  it('accepts valid slugs', () => {
    expect(isValidSlug('abc')).toBe(true)
    expect(isValidSlug('my-link')).toBe(true)
    expect(isValidSlug('link_123')).toBe(true)
    expect(isValidSlug('A'.repeat(30))).toBe(true)
  })

  it('rejects slugs that are too short', () => {
    expect(isValidSlug('ab')).toBe(false)
    expect(isValidSlug('')).toBe(false)
  })

  it('rejects slugs that are too long', () => {
    expect(isValidSlug('a'.repeat(31))).toBe(false)
  })

  it('rejects slugs with invalid characters', () => {
    expect(isValidSlug('my link')).toBe(false)
    expect(isValidSlug('my/link')).toBe(false)
    expect(isValidSlug('link!')).toBe(false)
  })
})

describe('isValidUrl', () => {
  it('accepts http and https URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true)
    expect(isValidUrl('http://example.com/path?q=1')).toBe(true)
  })

  it('rejects non-http protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false)
    expect(isValidUrl('ftp://files.example.com')).toBe(false)
    expect(isValidUrl('data:text/html,<h1>hi</h1>')).toBe(false)
  })

  it('rejects bare strings', () => {
    expect(isValidUrl('example.com')).toBe(false)
    expect(isValidUrl('')).toBe(false)
    expect(isValidUrl('not a url')).toBe(false)
  })
})

describe('RESERVED_SLUGS', () => {
  it('contains expected reserved values', () => {
    expect(RESERVED_SLUGS.has('api')).toBe(true)
    expect(RESERVED_SLUGS.has('dashboard')).toBe(true)
    expect(RESERVED_SLUGS.has('_next')).toBe(true)
    expect(RESERVED_SLUGS.has('favicon.ico')).toBe(true)
  })
})
