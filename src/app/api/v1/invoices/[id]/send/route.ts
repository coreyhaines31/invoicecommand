import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireScope, createApiResponse } from '@/lib/api-auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and, isNull, inArray } from 'drizzle-orm'
import { sendInvoiceEmail } from '@/lib/email-service'
import { triggerWebhooks } from '@/lib/webhook-service'
import { dbInvoiceToInvoiceData } from '@/lib/api-utils'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024
const MAX_SENDER_MESSAGE_LENGTH = 5000

// POST /api/v1/invoices/:id/send - Send an invoice via email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  const authResult = requireScope(await authenticateRequest(request), 'invoices:write')
  if (!authResult.authenticated) {
    return NextResponse.json({ error: authResult.error }, { status: authResult.status })
  }

  // Cap per-user invoice-sending to bound Resend credit burn.
  const rl = checkRateLimit(authResult.userId, { bucket: 'v1-send-invoice', max: 20, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many invoice send requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
    )
  }

  const { id } = await params

  let body: { pdfBuffer: string; senderMessage?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { pdfBuffer, senderMessage } = body

  if (!pdfBuffer || typeof pdfBuffer !== 'string') {
    return NextResponse.json({ error: 'pdfBuffer (base64 encoded) is required' }, { status: 400 })
  }

  if (senderMessage != null && (typeof senderMessage !== 'string' || senderMessage.length > MAX_SENDER_MESSAGE_LENGTH)) {
    return NextResponse.json({ error: 'Invalid sender message' }, { status: 400 })
  }

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, authResult.userId)))

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  if (!invoice.clientEmail) {
    return NextResponse.json({ error: 'Client email is required to send invoice' }, { status: 400 })
  }

  if (!invoice.senderEmail) {
    return NextResponse.json({ error: 'Sender email is required to send invoice' }, { status: 400 })
  }

  const invoiceData = dbInvoiceToInvoiceData(invoice)

  const pdfBufferData = Buffer.from(pdfBuffer, 'base64')
  if (pdfBufferData.length === 0 || pdfBufferData.length > MAX_PDF_SIZE_BYTES) {
    return NextResponse.json({ error: 'PDF attachment is invalid or too large' }, { status: 400 })
  }
  if (pdfBufferData.subarray(0, 4).toString() !== '%PDF') {
    return NextResponse.json({ error: 'Attachment must be a valid PDF' }, { status: 400 })
  }

  // Reserve the send before calling Resend. Three things this protects:
  //   1. signedAt guard: a signed estimate is immutable; refuse to mutate it.
  //   2. status state-machine: only flip from draft/sent → sent (idempotent re-send).
  //      Never regress paid → sent.
  //   3. ordering: if Resend fails after the DB write, the row reflects the truth
  //      we tried to assert and the operator can retry. If Resend ran first and the
  //      DB write failed, the recipient would have an email and the row would say
  //      "draft" — recovery is worse.
  const [reserved] = await db
    .update(invoices)
    .set({ status: 'sent', updatedAt: new Date() })
    .where(and(
      eq(invoices.id, id),
      eq(invoices.userId, authResult.userId),
      isNull(invoices.signedAt),
      inArray(invoices.status, ['draft', 'sent']),
    ))
    .returning()

  if (!reserved) {
    const [current] = await db
      .select({ status: invoices.status, signedAt: invoices.signedAt })
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, authResult.userId)))

    if (!current) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }
    if (current.signedAt) {
      return NextResponse.json(
        { error: 'This estimate has been signed and can no longer be sent' },
        { status: 409 }
      )
    }
    return NextResponse.json(
      { error: `Invoice is in '${current.status}' state and cannot be sent` },
      { status: 409 }
    )
  }

  const result = await sendInvoiceEmail({ invoice: invoiceData, pdfBuffer: pdfBufferData, senderMessage })

  // Trigger webhooks AFTER successful delivery so subscribers don't see a "sent"
  // event for an invoice the recipient never got.
  await triggerWebhooks(authResult.userId, 'invoice.sent', {
    invoice: reserved,
  })

  return createApiResponse({
    success: true,
    emailId: result?.id,
    message: 'Invoice sent successfully',
  }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to send invoice email')
  }
}
