import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { InvoiceValidationError, parseInvoicePayload } from '@/lib/invoice-payload'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [row] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))

  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(row)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  let payload
  try {
    payload = parseInvoicePayload(body, 'update')
  } catch (error) {
    if (error instanceof InvoiceValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }

  // Signed estimates are immutable — once a recipient has signed,
  // the owner can no longer change line items, dates, or any other field.
  // Atomic gate: only update rows where signed_at IS NULL so a concurrent
  // sign cannot slip a post-signing edit through.
  const [row] = await db
    .update(invoices)
    .set({ ...payload, updatedAt: new Date() })
    .where(and(
      eq(invoices.id, id),
      eq(invoices.userId, session.user.id),
      isNull(invoices.signedAt),
    ))
    .returning()

  if (!row) {
    const [existing] = await db
      .select({ signedAt: invoices.signedAt })
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))

    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (existing.signedAt) {
      return NextResponse.json(
        { error: 'This estimate has been signed and can no longer be edited' },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: 'Update conflict, please retry' }, { status: 409 })
  }

  return NextResponse.json(row)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const [deleted] = await db
    .delete(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
    .returning({ id: invoices.id })

  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
