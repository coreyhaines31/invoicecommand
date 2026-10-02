import type { InvoiceData } from '@/stores/invoice-store'

/**
 * Format a monetary amount with currency symbol
 */
export function formatCurrency(amount: string | number, currency: string = 'USD'): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num)
}

/**
 * Transform a database invoice row to InvoiceData for PDF generation and email
 */
export function dbInvoiceToInvoiceData(invoice: {
  id: string
  senderName: string | null
  senderEmail: string | null
  senderAddress: string | null
  senderCity: string | null
  senderState: string | null
  senderZip: string | null
  senderPhone: string | null
  senderLogo: string | null
  clientName: string
  clientEmail: string | null
  clientAddress: string | null
  clientCity: string | null
  clientState: string | null
  clientZip: string | null
  invoiceNumber: string
  invoiceDate: string | null
  dueDate: string | null
  items: unknown
  subtotal: string
  taxRate: string | null
  tax: string
  discountRate: string | null
  discountAmount: string | null
  total: string
  notes: string | null
  terms: string | null
  currency: string | null
  status: string | null
  style: string | null
  documentType: string | null
  signedAt?: Date | null
  signatureData?: string | null
  signerName?: string | null
  signerEmail?: string | null
}): InvoiceData {
  return {
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
}

/**
 * Rate limit information returned from API key validation
 */
export type RateLimitInfo = {
  limit: number
  remaining: number
  reset: Date
}

/**
 * Add rate limit headers to a response
 */
export function addRateLimitHeaders(
  headers: Headers,
  rateLimitInfo: RateLimitInfo
): void {
  headers.set('X-RateLimit-Limit', rateLimitInfo.limit.toString())
  headers.set('X-RateLimit-Remaining', rateLimitInfo.remaining.toString())
  headers.set('X-RateLimit-Reset', Math.floor(rateLimitInfo.reset.getTime() / 1000).toString())
}
