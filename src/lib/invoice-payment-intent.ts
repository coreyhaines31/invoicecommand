import type Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { and, isNull, ne, or, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { stripe } from '@/lib/stripe'

type PayableInvoice = Pick<
  typeof invoices.$inferSelect,
  'id' | 'status' | 'stripePaymentStatus' | 'stripePaymentIntentId' | 'paymentAmountCents' | 'applicationFeeCents'
>

type StartInvoicePaymentInput = {
  invoice: PayableInvoice
  amount: number
  applicationFeeAmount: number
  /** Everything for paymentIntents.create except amount and fee. */
  createParams: Omit<Stripe.PaymentIntentCreateParams, 'amount' | 'application_fee_amount'>
  idempotencyKeyPrefix: string
  /** Which invoice row the new intent is stored on (e.g. id, plus owner). */
  scope: SQL | undefined
  /** Extra columns stored alongside the intent. */
  extraSet?: Partial<typeof invoices.$inferInsert>
  /** Extra fields for the success response. */
  responseExtras?: Record<string, unknown>
}

function notPaid(column: typeof invoices.status | typeof invoices.stripePaymentStatus) {
  return or(isNull(column), ne(column, 'paid'))
}

function alreadyPaid() {
  return NextResponse.json({ error: 'This invoice has already been paid' }, { status: 409 })
}

function paymentInProgress() {
  return NextResponse.json(
    { error: 'A payment for this invoice is already in progress. Please wait a few minutes and refresh.' },
    { status: 409 },
  )
}

// Hands out a client secret for paying an invoice without ever leaving two
// payable intents behind: an already-paid invoice is refused, an in-flight
// intent is reused, and a superseded one is cancelled before a new one is made.
export async function startInvoicePayment({
  invoice,
  amount,
  applicationFeeAmount,
  createParams,
  idempotencyKeyPrefix,
  scope,
  extraSet,
  responseExtras,
}: StartInvoicePaymentInput): Promise<NextResponse> {
  if (invoice.status === 'paid' || invoice.stripePaymentStatus === 'paid') {
    return alreadyPaid()
  }

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
        ...responseExtras,
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
          return paymentInProgress()
        }
        if (latest.status !== 'canceled') throw error
      }
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    ...createParams,
    amount,
    application_fee_amount: applicationFeeAmount,
  }, {
    // Keyed on the intent being replaced too, so a retry after a cancel gets a
    // fresh intent instead of Stripe replaying the canceled one.
    idempotencyKey: `${idempotencyKeyPrefix}-${invoice.id}-${amount}-${invoice.stripePaymentIntentId ?? 'first'}`,
  })

  // No updatedAt: estimate signing uses it as the document version, and
  // starting a payment is not a change to the document. The not-paid guard
  // keeps a payment that landed meanwhile from being overwritten.
  const stored = await db
    .update(invoices)
    .set({
      ...extraSet,
      stripePaymentIntentId: paymentIntent.id,
      paymentAmountCents: amount,
      applicationFeeCents: applicationFeeAmount,
      stripePaymentStatus: 'processing',
    })
    .where(and(scope, notPaid(invoices.status), notPaid(invoices.stripePaymentStatus)))
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
    ...responseExtras,
    message: 'Payment intent created successfully',
  })
}
