import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { dbInvoiceToInvoiceData } from '@/lib/api-utils'
import { renderInvoicePdf } from '@/lib/invoice-pdf-server'
import { checkIpRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

// Same shape check as the /i/[token] page.
const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/

function notFound() {
  return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
}

// The PDF a share link recipient downloads. The token is the only access
// check, so this mirrors the /i/[token] page: unknown, disabled and expired
// links are all refused the same way.
export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params
    if (!TOKEN_RE.test(token)) return notFound()

    // Rendering is CPU-heavy and this route needs no session.
    const rl = checkIpRateLimit(request, { bucket: 'share-pdf', max: 20, windowMs: 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many PDF requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.shareToken, token))

    if (!invoice || !invoice.shareEnabled) return notFound()
    if (invoice.shareExpiresAt && invoice.shareExpiresAt.getTime() < Date.now()) return notFound()

    const invoiceData = dbInvoiceToInvoiceData(invoice)
    const pdfBuffer = await renderInvoicePdf(invoiceData)

    const safeFilename = (invoiceData.invoiceNumber || invoiceData.documentType)
      .replace(/[^\w\-\.]/g, '_')
      .slice(0, 100)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceData.documentType}-${safeFilename}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to generate PDF')
  }
}
