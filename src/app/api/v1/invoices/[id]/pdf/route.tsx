import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireScope } from '@/lib/api-auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import { dbInvoiceToInvoiceData } from '@/lib/api-utils'
import { jsonErrorResponse } from '@/lib/error-response'

// GET /api/v1/invoices/:id/pdf - Download invoice as PDF
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

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, authResult.userId)))

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
    }

    const invoiceData = dbInvoiceToInvoiceData(invoice)

    const pdfBuffer = await renderToBuffer(<InvoicePDF invoice={invoiceData} />)

    const safeFilename = (invoiceData.invoiceNumber || 'invoice')
      .replace(/[^\w\-\.]/g, '_')
      .slice(0, 100)

    const headers: Record<string, string> = {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${safeFilename}.pdf"`,
    }

    // Add rate limit headers for API key auth
    if (authResult.rateLimitInfo) {
      const { limit, remaining, reset } = authResult.rateLimitInfo
      headers['X-RateLimit-Limit'] = limit.toString()
      headers['X-RateLimit-Remaining'] = remaining.toString()
      headers['X-RateLimit-Reset'] = Math.floor(reset.getTime() / 1000).toString()
    }

    return new NextResponse(pdfBuffer, { headers })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to generate PDF')
  }
}
