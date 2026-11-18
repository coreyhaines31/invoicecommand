import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { dbInvoiceToInvoiceData } from '@/lib/api-utils'
import { renderInvoicePdf } from '@/lib/invoice-pdf-server'
import { checkIpRateLimit, checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

// A render takes about a second; anything much longer is stuck.
export const maxDuration = 15

// Same shape check as the /i/[token] page.
const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/

function notFound() {
  return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
}

function tooManyRequests(retryAfter: number) {
  return NextResponse.json(
    { error: 'Too many PDF requests. Please try again later.' },
    { status: 429, headers: { 'Retry-After': retryAfter.toString() } }
  )
}

// The PDF a share link recipient downloads. The token is the only access
// check, so this mirrors the /i/[token] page: unknown, disabled and expired
// links are all refused the same way.
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    if (!TOKEN_RE.test(token)) return notFound()

    // Rendering is CPU-heavy and this route needs no session, so cap it per IP
    // and per token (a leaked link shouldn't be a render-on-demand endpoint).
    // The token check runs only after the IP check passes, so blocked requests
    // don't use up the recipient's allowance.
    const ipLimit = checkIpRateLimit(request, { bucket: 'share-pdf', max: 20, windowMs: 60 * 1000 })
    if (!ipLimit.allowed) return tooManyRequests(ipLimit.retryAfter)
    const tokenLimit = checkRateLimit(token, { bucket: 'share-pdf-token', max: 20, windowMs: 10 * 60 * 1000 })
    if (!tokenLimit.allowed) return tooManyRequests(tokenLimit.retryAfter)

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.shareToken, token))

    if (!invoice || !invoice.shareEnabled) return notFound()
    if (invoice.shareExpiresAt && invoice.shareExpiresAt.getTime() < Date.now()) return notFound()

    const invoiceData = dbInvoiceToInvoiceData(invoice)
    const pdfBuffer = await renderInvoicePdf(invoiceData)

    const documentType = invoiceData.documentType === 'estimate' ? 'estimate' : 'invoice'
    const safeFilename = (invoiceData.invoiceNumber || 'document')
      .replace(/[^\w\-\.]/g, '_')
      .slice(0, 100)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${documentType}-${safeFilename}.pdf"`,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex',
      },
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to generate PDF')
  }
}
