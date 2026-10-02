import { after } from 'next/server'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { and, eq, sql } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import { PublicInvoiceClient } from '@/app/invoice/[id]/public-invoice-client'
import { ShareLinkExpired } from './share-link-expired'

// Share URLs encode billing data — keep them out of search engines even if a
// recipient accidentally pastes one into a public place.
export const metadata = {
  robots: { index: false, follow: false },
}

interface PageProps {
  params: Promise<{ token: string }>
}

// Tokens are 24 random bytes → 32 base64url chars. Reject anything outside the
// expected shape before touching the DB so obvious garbage doesn't waste a
// round-trip or pollute the rate-limit window.
const TOKEN_RE = /^[A-Za-z0-9_-]{16,128}$/

export default async function SharedInvoicePage({ params }: PageProps) {
  const { token } = await params

  if (!TOKEN_RE.test(token)) notFound()

  const [invoice] = await db
    .select()
    .from(invoices)
    .where(eq(invoices.shareToken, token))

  // Treat "not found", "disabled", and "expired" the same on the lookup side
  // so we don't leak whether a token ever existed. Expired gets a clearer
  // message because the recipient probably has a valid-looking URL in hand.
  if (!invoice || !invoice.shareEnabled) notFound()

  if (invoice.shareExpiresAt && invoice.shareExpiresAt.getTime() < Date.now()) {
    return <ShareLinkExpired />
  }

  // Defer view tracking until after the response is flushed so a slow UPDATE
  // can't block render. after() runs the callback on Fluid Compute even after
  // the function would otherwise be torn down. WHERE matches the token + the
  // enabled flag so a concurrent rotation/revoke between the SELECT above and
  // this UPDATE doesn't pollute counts on the new/disabled link.
  after(async () => {
    try {
      await db
        .update(invoices)
        .set({
          shareViewCount: sql`${invoices.shareViewCount} + 1`,
          shareLastViewedAt: new Date(),
        })
        .where(and(
          eq(invoices.id, invoice.id),
          eq(invoices.shareToken, token),
          eq(invoices.shareEnabled, true),
        ))
    } catch (err) {
      console.error('Failed to increment share view count', err)
    }
  })

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

  return <PublicInvoiceClient invoice={invoiceData} viewMode="public" shareToken={token} />
}
