import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { eq, and, isNull, ne, or } from 'drizzle-orm'
import { stripe, calculateApplicationFee } from '@/lib/stripe'
import { toStripeAmount } from '@/lib/stripe-amount'
import { checkIpRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

function notPaid(column: typeof invoices.status | typeof invoices.stripePaymentStatus) {
  return or(isNull(column), ne(column, 'paid'))
}

function alreadyPaid() {
  return NextResponse.json({ error: 'This invoice has already been paid' }, { status: 409 })
}

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
        // Estimates are not paid online; rows from before document types count as invoices
        or(isNull(invoices.documentType), eq(invoices.documentType, 'invoice')),
      ))

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found or payments not enabled' }, { status: 404 })
    }

    if (invoice.shareExpiresAt && invoice.shareExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ error: 'This share link has expired' }, { status: 410 })
    }

    if (invoice.status === 'paid' || invoice.stripePaymentStatus === 'paid') {
      return alreadyPaid()
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

    // Reuse an in-flight payment intent rather than creating a new one, and
    // cancel one we replace (e.g. the total changed): its clientSecret was
    // already handed out, so it could otherwise still be paid alongside the new
    // one. Either way, an intent that already succeeded means the invoice is
    // paid and the webhook just hasn't landed yet.
    if (invoice.stripePaymentIntentId) {
      const existing = await stripe.paymentIntents.retrieve(invoice.stripePaymentIntentId)
      if (existing.status === 'succeeded') return alreadyPaid()

      if (
        existing.status !== 'canceled' &&
        invoice.stripePaymentStatus === 'processing' &&
        invoice.paymentAmountCents === amount
      ) {
        return NextResponse.json({
          clientSecret: existing.client_secret,
          paymentIntentId: existing.id,
          applicationFeeAmount: invoice.applicationFeeCents ?? applicationFeeAmount,
          message: 'Existing payment intent reused',
        })
      }

      if (existing.status !== 'canceled') {
        try {
          await stripe.paymentIntents.cancel(existing.id)
        } catch (error) {
          // The client may have paid it between the retrieve and the cancel.
          const latest = await stripe.paymentIntents.retrieve(existing.id)
          if (latest.status === 'succeeded') return alreadyPaid()
          if (latest.status === 'processing' || latest.status === 'requires_capture') {
            return NextResponse.json(
              { error: 'A payment for this invoice is already in progress. Please wait a few minutes and refresh.' },
              { status: 409 },
            )
          }
          if (latest.status !== 'canceled') throw error
        }
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
      // Keyed on the intent being replaced too, so a retry after a cancel gets a
      // fresh intent instead of Stripe replaying the canceled one.
      idempotencyKey: `public-invoice-${invoiceId}-${amount}-${invoice.stripePaymentIntentId ?? 'first'}`,
    })

    // No updatedAt: estimate signing uses it as the document version, and
    // starting a payment is not a change to the document. The not-paid guard
    // keeps a payment that landed meanwhile from being overwritten.
    const stored = await db
      .update(invoices)
      .set({
        stripePaymentIntentId: paymentIntent.id,
        paymentAmountCents: amount,
        applicationFeeCents: applicationFeeAmount,
        stripePaymentStatus: 'processing',
      })
      .where(and(eq(invoices.id, invoiceId), notPaid(invoices.status), notPaid(invoices.stripePaymentStatus)))
      .returning({ id: invoices.id })

    if (stored.length === 0) {
      // Paid while we were creating this intent: don't hand out a second way to pay.
      try {
        await stripe.paymentIntents.cancel(paymentIntent.id)
      } catch {
        // Best effort: it is not stored anywhere, so nobody gets its secret.
      }
      return alreadyPaid()
    }

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
