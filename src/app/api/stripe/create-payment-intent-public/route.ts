import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { calculateApplicationFee } from '@/lib/stripe'
import { toStripeAmount } from '@/lib/stripe-amount'
import { checkIpRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'
import { isPayableDocument, startInvoicePayment } from '@/lib/invoice-payment-intent'

export async function POST(request: NextRequest) {
  try {
    const rl = checkIpRateLimit(request, { bucket: 'stripe-public-intent', max: 10, windowMs: 10 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many payment-intent requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    const body = await request.json()
    const { shareToken, amount } = body

    // Public payment intents now require the share token, not the bare invoice
    // UUID. That keeps share_token as the only public access boundary and
    // prevents anyone with a guessed UUID from initiating a charge.
    if (!shareToken || typeof shareToken !== 'string' || amount == null) {
      return NextResponse.json({ error: 'shareToken and amount are required' }, { status: 400 })
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive integer in the currency\'s smallest unit' }, { status: 400 })
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.shareToken, shareToken),
        eq(invoices.shareEnabled, true),
        eq(invoices.paymentEnabled, true),
      ))

    if (!invoice || !isPayableDocument(invoice)) {
      return NextResponse.json({ error: 'Invoice not found or payments not enabled' }, { status: 404 })
    }

    if (invoice.shareExpiresAt && invoice.shareExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'This share link has expired' }, { status: 410 })
    }

    const invoiceId = invoice.id

    const [userProfile] = await db
      .select({
        stripeAccountId: userProfiles.stripeAccountId,
        stripeOnboardingCompleted: userProfiles.stripeOnboardingCompleted,
        subscriptionTier: userProfiles.subscriptionTier,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, invoice.userId))

    if (!userProfile?.stripeAccountId || !userProfile.stripeOnboardingCompleted) {
      return NextResponse.json({ error: 'Payment processing not available for this invoice' }, { status: 400 })
    }

    const ALLOWED_CURRENCIES = new Set(['usd', 'cad', 'gbp', 'eur', 'aud', 'nzd', 'jpy', 'sgd', 'hkd', 'mxn', 'brl', 'inr', 'sek', 'nok', 'dkk', 'chf', 'pln', 'czk'])
    const invoiceCurrency = (invoice.currency || 'USD').toLowerCase()
    if (!ALLOWED_CURRENCIES.has(invoiceCurrency)) {
      return NextResponse.json({ error: 'Unsupported payment currency' }, { status: 400 })
    }

    const expectedAmount = toStripeAmount(Number(invoice.total), invoiceCurrency)
    if (amount !== expectedAmount) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    const userTier = (userProfile.subscriptionTier as 'free' | 'premium' | 'pro') || 'free'
    const applicationFeeAmount = calculateApplicationFee(amount, userTier)

    return await startInvoicePayment({
      invoice,
      amount,
      applicationFeeAmount,
      createParams: {
        currency: invoiceCurrency,
        transfer_data: { destination: userProfile.stripeAccountId },
        metadata: {
          invoice_id: invoiceId,
          invoice_number: invoice.invoiceNumber || '',
          client_payment: 'true',
        },
        description: `Payment for Invoice ${invoice.invoiceNumber || invoiceId}`,
      },
      idempotencyKeyPrefix: 'public-invoice',
      scope: eq(invoices.id, invoiceId),
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create payment intent')
  }
}
