import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { sendInvoiceEmail } from '@/lib/email-service'
import { dbInvoiceToInvoiceData } from '@/lib/api-utils'
import { renderInvoicePdf } from '@/lib/invoice-pdf-server'
import { checkRateLimit } from '@/lib/rate-limit'
import { buildShareUrl, generateShareToken } from '@/lib/share-link'
import { jsonErrorResponse } from '@/lib/error-response'

const MAX_SENDER_MESSAGE_LENGTH = 5000

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Cap per-user invoice-sending to bound Resend credit burn and reputation.
    const rl = checkRateLimit(session.user.id, { bucket: 'send-invoice', max: 20, windowMs: 60 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many invoice send requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    const body = await request.json()
    // A legacy `pdfBuffer` field is ignored: the attachment is always rendered
    // here from the stored invoice.
    const { invoiceId, senderMessage, clientEmail: clientEmailOverride } = body

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 })
    }

    if (typeof invoiceId !== 'string') {
      return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
    }

    if (senderMessage != null && (typeof senderMessage !== 'string' || senderMessage.length > MAX_SENDER_MESSAGE_LENGTH)) {
      return NextResponse.json({ error: 'Invalid sender message' }, { status: 400 })
    }

    // The dialog lets the sender override the on-file client email at send
    // time (typo fixes, alternate contact). Validate it has a sane shape; the
    // canonical client_email on the invoice row stays unchanged.
    let overrideEmail: string | undefined
    if (clientEmailOverride != null) {
      if (typeof clientEmailOverride !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmailOverride) || clientEmailOverride.length > 254) {
        return NextResponse.json({ error: 'Invalid client email' }, { status: 400 })
      }
      overrideEmail = clientEmailOverride
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    const recipientEmail = overrideEmail || invoice.clientEmail
    if (!recipientEmail) {
      return NextResponse.json({ error: 'Client email is required to send invoice' }, { status: 400 })
    }

    if (!invoice.senderEmail) {
      return NextResponse.json({ error: 'Sender email is required to send invoice' }, { status: 400 })
    }

    // The PDF matches the stored invoice (what /api/generate-pdf renders); only
    // the email goes to the override address.
    const storedInvoiceData = dbInvoiceToInvoiceData(invoice)
    const pdfBufferData = await renderInvoicePdf(storedInvoiceData)
    const invoiceData = { ...storedInvoiceData, clientEmail: recipientEmail }

    // Ensure the recipient has a usable share link in the email. Reuse the
    // existing token if one was already minted; otherwise generate one and
    // enable sharing as part of the send.
    //
    // The token MUST be persisted before the email goes out — otherwise a
    // failed UPDATE would leave the email containing a /i/[token] URL that
    // resolves to 404 because no row references that token.
    const shareToken = invoice.shareToken ?? generateShareToken()
    if (!invoice.shareToken || !invoice.shareEnabled) {
      await db
        .update(invoices)
        .set({ shareToken, shareEnabled: true, updatedAt: new Date() })
        .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))
    }
    const shareUrl = buildShareUrl(shareToken)

    const result = await sendInvoiceEmail({
      invoice: invoiceData,
      pdfBuffer: pdfBufferData,
      senderMessage,
      shareUrl,
    })

    await db
      .update(invoices)
      .set({ status: 'sent', updatedAt: new Date() })
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))

    return NextResponse.json({ success: true, emailId: result?.id, message: 'Invoice sent successfully' })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to send invoice email')
  }
}
