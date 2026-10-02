import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { eq, and, ne } from 'drizzle-orm'
import { stripe, calculateApplicationFee } from '@/lib/stripe'
import { checkIpRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

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
      return NextResponse.json({ error: 'Amount must be a positive integer in cents' }, { status: 400 })
    }

    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(
        eq(invoices.shareToken, shareToken),
        eq(invoices.shareEnabled, true),
        eq(invoices.paymentEnabled, true),
        ne(invoices.stripePaymentStatus, 'paid'),
      ))

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found, already paid, or payments not enabled' }, { status: 404 })
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

    const expectedAmount = Math.round(Number(invoice.total) * 100)
    if (amount !== expectedAmount) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 })
    }

    const ALLOWED_CURRENCIES = new Set(['usd', 'cad', 'gbp', 'eur', 'aud', 'nzd', 'jpy', 'sgd', 'hkd', 'mxn', 'brl', 'inr', 'sek', 'nok', 'dkk', 'chf', 'pln', 'czk'])
    const invoiceCurrency = (invoice.currency || 'USD').toLowerCase()
    if (!ALLOWED_CURRENCIES.has(invoiceCurrency)) {
      return NextResponse.json({ error: 'Unsupported payment currency' }, { status: 400 })
    }

    const userTier = (userProfile.subscriptionTier as 'free' | 'premium' | 'pro') || 'free'
    const applicationFeeAmount = calculateApplicationFee(amount, userTier)

    // Reuse an in-flight payment intent rather than creating a new one. If we always
    // overwrote stripePaymentIntentId on every call, the OLD intent could still be
    // completed by the client (the clientSecret was already handed out), and our
    // webhook handler — which looks up the row by stripePaymentIntentId — would no
    // longer find a match. The payment would succeed on Stripe but our DB would
    // show 'processing' forever.
    if (
      invoice.stripePaymentIntentId &&
      invoice.stripePaymentStatus === 'processing' &&
      invoice.paymentAmountCents === amount
    ) {
      const existing = await stripe.paymentIntents.retrieve(invoice.stripePaymentIntentId)
      if (existing.status !== 'canceled' && existing.status !== 'succeeded') {
        return NextResponse.json({
          clientSecret: existing.client_secret,
          paymentIntentId: existing.id,
          applicationFeeAmount: invoice.applicationFeeCents ?? applicationFeeAmount,
          message: 'Existing payment intent reused',
        })
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: invoiceCurrency,
      application_fee_amount: applicationFeeAmount,
      transfer_data: { destination: userProfile.stripeAccountId },
      metadata: {
        invoice_id: invoiceId,
        invoice_number: invoice.invoiceNumber || '',
        client_payment: 'true',
      },
      description: `Payment for Invoice ${invoice.invoiceNumber || invoiceId}`,
    }, {
      idempotencyKey: `public-invoice-${invoiceId}-${amount}`,
    })

    await db
      .update(invoices)
      .set({
        stripePaymentIntentId: paymentIntent.id,
        paymentAmountCents: amount,
        applicationFeeCents: applicationFeeAmount,
        stripePaymentStatus: 'processing',
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, invoiceId))

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      applicationFeeAmount,
      message: 'Payment intent created successfully',
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create payment intent')
  }
}
