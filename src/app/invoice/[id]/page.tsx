import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { PublicInvoiceClient } from './public-invoice-client'

interface PageProps {
  params: Promise<{ id: string }>
}

// /invoice/[id] is now the OWNER-view route. Recipients (anonymous viewers
// and payers) use /i/[token] instead. Anonymous hits on this URL 404 so an
// invoice UUID alone is no longer a public access boundary — share-link
// tokens are.
export default async function PublicInvoicePage({ params }: PageProps) {
  const { id } = await params

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) notFound()

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))

  if (!invoice) notFound()

  const invoiceData = {
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
    items: (invoice.items as Array<{ description: string; quantity: number; price: number }>) || [],
    subtotal: Number(invoice.subtotal) || 0,
    taxRate: Number(invoice.taxRate) || 0,
    taxAmount: Number(invoice.tax) || 0,
    discountRate: Number(invoice.discountRate) || 0,
    discountAmount: Number(invoice.discountAmount) || 0,
    total: Number(invoice.total) || 0,
    notes: invoice.notes || '',
    terms: invoice.terms || '',
    currency: invoice.currency || 'USD',
    paymentEnabled: invoice.paymentEnabled || false,
    stripePaymentStatus: invoice.stripePaymentStatus || 'unpaid',
    style: (invoice.style as 'modern' | 'classic' | 'minimal') || 'modern',
    documentType: (invoice.documentType as 'invoice' | 'estimate') || 'invoice',
    expirationDate: invoice.expirationDate || '',
    collectSignature: invoice.collectSignature ?? true,
    signatureRequired: invoice.signatureRequired ?? false,
    signedAt: invoice.signedAt ? invoice.signedAt.toISOString() : null,
    signatureData: invoice.signatureData ?? null,
    signerName: invoice.signerName ?? null,
    signerEmail: invoice.signerEmail ?? null,
  }

  // Owner mode: don't render the public payment button or scan-to-pay QR.
  // Owners pay through their dashboard / Stripe; this is a preview surface.
  return <PublicInvoiceClient invoice={invoiceData} viewMode="owner" />
}
