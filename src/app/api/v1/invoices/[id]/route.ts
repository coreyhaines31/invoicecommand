import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireScope, createApiResponse } from '@/lib/api-auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and, isNull } from 'drizzle-orm'
import { InvoiceValidationError, parseInvoicePayload } from '@/lib/invoice-payload'
import { triggerWebhooks } from '@/lib/webhook-service'
import { jsonErrorResponse } from '@/lib/error-response'

// GET /api/v1/invoices/:id - Get a single invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'invoices:read')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = await params
    const [row] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, authResult.userId)))

    if (!row) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return createApiResponse({ data: row }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to fetch invoice')
  }
}

// PUT /api/v1/invoices/:id - Update an invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'invoices:write')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

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

    // Signed estimates are immutable
    const [row] = await db
      .update(invoices)
      .set({ ...payload, updatedAt: new Date() })
      .where(and(
        eq(invoices.id, id),
        eq(invoices.userId, authResult.userId),
        isNull(invoices.signedAt)
      ))
      .returning()

    if (!row) {
      const [existing] = await db
        .select({ signedAt: invoices.signedAt })
        .from(invoices)
        .where(and(eq(invoices.id, id), eq(invoices.userId, authResult.userId)))

      if (!existing) {
        return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
      }
      if (existing.signedAt) {
        return NextResponse.json(
          { error: 'This estimate has been signed and can no longer be edited' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: 'Update conflict, please retry' }, { status: 409 })
    }

    // Trigger webhooks
    await triggerWebhooks(authResult.userId, 'invoice.updated', {
      invoice: row,
    })

    return createApiResponse({ data: row }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to update invoice')
  }
}

// DELETE /api/v1/invoices/:id - Delete an invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'invoices:write')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = await params
    const [deleted] = await db
      .delete(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, authResult.userId)))
      .returning({ id: invoices.id })

    if (!deleted) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    return createApiResponse({ success: true }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to delete invoice')
  }
}
