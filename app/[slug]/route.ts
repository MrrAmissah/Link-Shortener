import { NextRequest, NextResponse } from 'next/server'
import { after } from 'next/server'
import { db } from '@/lib/db'
import { RESERVED_SLUGS } from '@/lib/slug'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params

  if (RESERVED_SLUGS.has(slug)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const link = await db.link.findUnique({ where: { slug } })

  if (!link) {
    return NextResponse.redirect(new URL('/?not_found=1', req.url))
  }

  after(async () => {
    await db.click.create({
      data: {
        linkId: link.id,
        userAgent: req.headers.get('user-agent') ?? undefined,
        referer: req.headers.get('referer') ?? undefined,
      },
    })
  })

  return NextResponse.redirect(link.url, 302)
}
