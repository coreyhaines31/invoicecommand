import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { InvoiceValidationError, parseInvoicePayload } from '@/lib/invoice-payload'

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)

  // Support invoice number generation: return latest invoice number for a document type
  if (searchParams.get('latestNumber') === 'true') {
    const documentType = searchParams.get('documentType') || 'invoice'
    if (documentType !== 'invoice' && documentType !== 'estimate') {
      return NextResponse.json({ error: 'Invalid documentType' }, { status: 400 })
    }
    const [latest] = await db
      .select({ invoiceNumber: invoices.invoiceNumber })
      .from(invoices)
      .where(and(eq(invoices.userId, session.user.id), eq(invoices.documentType, documentType)))
      .orderBy(desc(invoices.createdAt))
      .limit(1)
    return NextResponse.json({ latestNumber: latest?.invoiceNumber ?? null })
  }

  const rows = await db
    .select()
    .from(invoices)
    .where(eq(invoices.userId, session.user.id))
    .orderBy(desc(invoices.createdAt))

  return NextResponse.json(rows)
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }
  let payload
  try {
    payload = parseInvoicePayload(body, 'create')
  } catch (error) {
    if (error instanceof InvoiceValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    throw error
  }

  if (!payload.clientName || !payload.invoiceNumber || !payload.items) {
    return NextResponse.json({ error: 'clientName, invoiceNumber, and items are required' }, { status: 400 })
  }

  const createValues = {
    ...payload,
    userId: session.user.id,
    clientName: payload.clientName,
    invoiceNumber: payload.invoiceNumber,
    items: payload.items,
  }

  const [row] = await db
    .insert(invoices)
    .values(createValues)
    .returning()

  return NextResponse.json(row)
}
