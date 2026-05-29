import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } | Promise<{ id: string }> },
) {
  const resolvedParams = 'then' in params ? await params : params
  const { id } = resolvedParams

  try {
    const existing = await db.link.findUnique({ where: { id } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.link.delete({ where: { id } })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    return NextResponse.json({ error: 'Could not delete' }, { status: 500 })
  }
}
