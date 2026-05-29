import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, isValidUrl, isValidSlug, RESERVED_SLUGS } from '@/lib/slug'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { url, customSlug } = body as { url?: string; customSlug?: string }

  if (!url || !isValidUrl(url)) {
    return NextResponse.json({ error: 'A valid http/https URL is required' }, { status: 422 })
  }

  if (customSlug !== undefined && customSlug !== '') {
    if (!isValidSlug(customSlug)) {
      return NextResponse.json(
        { error: 'Custom slug must be 3-30 characters: letters, digits, - or _' },
        { status: 422 },
      )
    }
    if (RESERVED_SLUGS.has(customSlug)) {
      return NextResponse.json({ error: 'That slug is reserved' }, { status: 409 })
    }
    try {
      const link = await db.link.create({ data: { slug: customSlug, url } })
      const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin}/${link.slug}`
      return NextResponse.json({ id: link.id, slug: link.slug, url: link.url, shortUrl }, { status: 201 })
    } catch (err: unknown) {
      if (isPrismaUniqueError(err)) {
        return NextResponse.json({ error: 'That slug is already taken' }, { status: 409 })
      }
      throw err
    }
  }

  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = generateSlug()
    if (RESERVED_SLUGS.has(slug)) continue
    try {
      const link = await db.link.create({ data: { slug, url } })
      const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin}/${link.slug}`
      return NextResponse.json({ id: link.id, slug: link.slug, url: link.url, shortUrl }, { status: 201 })
    } catch (err: unknown) {
      if (isPrismaUniqueError(err)) continue
      throw err
    }
  }

  return NextResponse.json({ error: 'Could not generate a unique slug' }, { status: 500 })
}

function isPrismaUniqueError(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  )
}
