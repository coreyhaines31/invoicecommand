import { createHash } from 'node:crypto'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { and, isNull, ne, or, type SQL } from 'drizzle-orm'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { stripe } from '@/lib/stripe'

type PayableInvoice = Pick<
  typeof invoices.$inferSelect,
  'id' | 'status' | 'stripePaymentStatus' | 'stripePaymentIntentId'
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

// Estimates are not paid online. Rows from before document types count as invoices.
export function isPayableDocument(invoice: Pick<typeof invoices.$inferSelect, 'documentType'>) {
  return invoice.documentType !== 'estimate'
}

function notPaid(column: typeof invoices.status | typeof invoices.stripePaymentStatus) {
  return or(isNull(column), ne(column, 'paid'))
}

// Intents the client can still complete with the client secret it is given.
const RESUMABLE_STATUSES = new Set<Stripe.PaymentIntent.Status>([
  'requires_payment_method',
  'requires_confirmation',
  'requires_action',
])

// Money is moving: the intent can neither be completed again nor cancelled.
const IN_FLIGHT_STATUSES = new Set<Stripe.PaymentIntent.Status>(['processing', 'requires_capture'])

function alreadyPaid() {
  return NextResponse.json(
    { error: 'This invoice has already been paid', code: 'already_paid' },
    { status: 409 },
  )
}

function paymentInProgress() {
  return NextResponse.json(
    {
      error: 'A payment for this invoice is already in progress. Please wait a few minutes and refresh.',
      code: 'payment_in_progress',
    },
    { status: 409 },
  )
}

// The stored intent id can point at an intent Stripe no longer has (e.g. a
// test-mode id, or a deleted account). Only that case counts as "no intent":
// any other failure must fail the request, or an outage could mint a second
// payable intent.
async function retrieveStoredIntent(id: string): Promise<Stripe.PaymentIntent | null> {
  try {
    return await stripe.paymentIntents.retrieve(id)
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError && error.code === 'resource_missing') {
      return null
    }
    throw error
  }
}

function destinationOf(intent: Stripe.PaymentIntent): string | undefined {
  const destination = intent.transfer_data?.destination
  return typeof destination === 'string' ? destination : destination?.id
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

  // Stripe, not the stored status, says what the last intent is doing. The
  // stored 'processing' only means a payment form was opened, so a client who
  // abandoned checkout resumes the same intent. One we replace (e.g. the total
  // changed) is cancelled first: its clientSecret was already handed out, so
  // it could otherwise still be paid alongside the new one. An intent that
  // already succeeded means the invoice is paid and the webhook just hasn't
  // landed yet.
  const existing = invoice.stripePaymentIntentId
    ? await retrieveStoredIntent(invoice.stripePaymentIntentId)
    : null
  if (existing) {
    if (existing.status === 'succeeded') return alreadyPaid()
    if (IN_FLIGHT_STATUSES.has(existing.status)) return paymentInProgress()

    // Resume only an intent identical in every term that moves money;
    // otherwise it is superseded like any other.
    const sameTerms =
      existing.amount === amount &&
      existing.currency === createParams.currency &&
      destinationOf(existing) === createParams.transfer_data?.destination &&
      existing.application_fee_amount === applicationFeeAmount
    if (RESUMABLE_STATUSES.has(existing.status) && sameTerms) {
      return NextResponse.json({
        clientSecret: existing.client_secret,
        paymentIntentId: existing.id,
        applicationFeeAmount,
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
        if (IN_FLIGHT_STATUSES.has(latest.status)) return paymentInProgress()
        if (latest.status !== 'canceled') throw error
      }
    }
  }

  const params: Stripe.PaymentIntentCreateParams = {
    ...createParams,
    amount,
    application_fee_amount: applicationFeeAmount,
  }
  // Keyed on the intent being replaced, so a retry after a cancel gets a fresh
  // intent instead of Stripe replaying the canceled one. Stripe rejects a
  // reused key whose request body differs in any field, metadata and
  // description included, so the hash covers the whole body: a changed invoice
  // number then gets a new key rather than an idempotency error. An identical
  // retry still gets the same key and the same intent.
  const bodyHash = createHash('sha256').update(JSON.stringify(params)).digest('hex').slice(0, 16)
  const paymentIntent = await stripe.paymentIntents.create(params, {
    idempotencyKey: `${idempotencyKeyPrefix}-${invoice.id}-${amount}-${invoice.stripePaymentIntentId ?? 'first'}-${bodyHash}`,
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
