import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import type { InvoiceData } from '@/stores/invoice-store'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // PDF rendering is CPU/memory-heavy. Per-user cap: 30 renders per minute.
    const rl = checkRateLimit(session.user.id, { bucket: 'generate-pdf', max: 30, windowMs: 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many PDF generation requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    const body = await request.json()
    const { invoiceId } = body

    if (!invoiceId) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 })
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.userId, session.user.id)))

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

    const invoiceData: InvoiceData = {
      id: invoice.id,
      senderName: invoice.senderName || '',
      senderEmail: invoice.senderEmail || '',
      senderAddress: invoice.senderAddress || '',
      senderCity: invoice.senderCity || '',
      senderState: invoice.senderState || '',
      senderZip: invoice.senderZip || '',
      senderPhone: invoice.senderPhone || '',
      senderLogo: invoice.senderLogo || '',
      clientName: invoice.clientName || '',
      clientEmail: invoice.clientEmail || '',
      clientAddress: invoice.clientAddress || '',
      clientCity: invoice.clientCity || '',
      clientState: invoice.clientState || '',
      clientZip: invoice.clientZip || '',
      invoiceNumber: invoice.invoiceNumber || '',
      invoiceDate: invoice.invoiceDate || '',
      dueDate: invoice.dueDate || '',
      items: (invoice.items as any[]) || [],
      subtotal: Number(invoice.subtotal) || 0,
      taxRate: Number(invoice.taxRate) || 0,
      taxAmount: Number(invoice.tax) || 0,
      discountRate: Number(invoice.discountRate) || 0,
      discountAmount: Number(invoice.discountAmount) || 0,
      total: Number(invoice.total) || 0,
      notes: invoice.notes || '',
      terms: invoice.terms || '',
      currency: invoice.currency || 'USD',
      isDirty: false,
      lastUpdated: Date.now(),
      status: (invoice.status as 'draft' | 'sent' | 'paid') || 'draft',
      style: (invoice.style as 'modern' | 'classic' | 'minimal') || 'modern',
      documentType: (invoice.documentType as 'invoice' | 'estimate') || 'invoice',
      signedAt: invoice.signedAt ? invoice.signedAt.toISOString() : null,
      signatureData: invoice.signatureData || null,
      signerName: invoice.signerName || null,
      signerEmail: invoice.signerEmail || null,
    }

    const pdfBuffer = await renderToBuffer(<InvoicePDF invoice={invoiceData} />)

    const safeFilename = (invoiceData.invoiceNumber || 'invoice')
      .replace(/[^\w\-\.]/g, '_')
      .slice(0, 100)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${safeFilename}.pdf"`,
      },
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to generate PDF')
  }
}
