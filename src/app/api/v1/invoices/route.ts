import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireScope, createApiResponse } from '@/lib/api-auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'
import { InvoiceValidationError, parseInvoicePayload } from '@/lib/invoice-payload'
import { triggerWebhooks } from '@/lib/webhook-service'
import { jsonErrorResponse } from '@/lib/error-response'

// GET /api/v1/invoices - List all invoices
export async function GET(request: NextRequest) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'invoices:read')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const documentType = searchParams.get('documentType')
    const status = searchParams.get('status')
    // parseInt('abc') → NaN; Math.min(NaN, 100) → NaN; negatives are invalid.
    // Clamp to [1, 100] for limit and [0, ∞) for offset, defaulting on garbage.
    const rawLimit = parseInt(searchParams.get('limit') || '50', 10)
    const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(1, rawLimit), 100) : 50
    const rawOffset = parseInt(searchParams.get('offset') || '0', 10)
    const offset = Number.isFinite(rawOffset) && rawOffset >= 0 ? rawOffset : 0

    // Build filter conditions
    const conditions = [eq(invoices.userId, authResult.userId)]

    if (documentType && ['invoice', 'estimate'].includes(documentType)) {
      conditions.push(eq(invoices.documentType, documentType as 'invoice' | 'estimate'))
    }

    if (status && ['draft', 'sent', 'paid'].includes(status)) {
      conditions.push(eq(invoices.status, status as 'draft' | 'sent' | 'paid'))
    }

    const rows = await db
      .select()
      .from(invoices)
      .where(and(...conditions))
      .orderBy(desc(invoices.createdAt))
      .limit(limit)
      .offset(offset)

    return createApiResponse({
      data: rows,
      pagination: {
        limit,
        offset,
        hasMore: rows.length === limit,
      },
    }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to list invoices')
  }
}

// POST /api/v1/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'invoices:write')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

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
      return NextResponse.json(
        { error: 'clientName, invoiceNumber, and items are required' },
        { status: 400 }
      )
    }

    const createValues = {
      ...payload,
      userId: authResult.userId,
      clientName: payload.clientName,
      invoiceNumber: payload.invoiceNumber,
      items: payload.items,
    }

    const [row] = await db.insert(invoices).values(createValues).returning()

    // Trigger webhooks
    await triggerWebhooks(authResult.userId, 'invoice.created', {
      invoice: row,
    })

    return createApiResponse({ data: row }, authResult, { status: 201 })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create invoice')
  }
}
