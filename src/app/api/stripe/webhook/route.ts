import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { invoices, user, userProfiles } from '@/lib/db/schema'
import { and, eq, isNull, ne, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { triggerWebhooks } from '@/lib/webhook-service'
import { sendPaymentReceivedEmail } from '@/lib/email-service'
import { jsonErrorResponse, reportError } from '@/lib/error-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No Stripe signature found' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return jsonErrorResponse(new Error('STRIPE_WEBHOOK_SECRET not configured'), 'Webhook secret not configured')
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Invoice payment intents are created on the platform account. One from a
    // connected account is not ours, whatever its metadata says. (account.updated
    // legitimately arrives from connected accounts, so this is limited to intents.)
    if (event.account && event.type.startsWith('payment_intent.')) {
      console.log(`Ignoring ${event.type} from connected account ${event.account}`)
      return NextResponse.json({ received: true })
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      case 'account.updated':
        await handleAccountUpdated(event.data.object)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return jsonErrorResponse(error, 'Webhook handler failed')
  }
}

// Matches rows where the column is NULL or anything other than 'paid'.
function notPaid(column: typeof invoices.status | typeof invoices.stripePaymentStatus) {
  return or(isNull(column), ne(column, 'paid'))
}

// Payment bookkeeping never touches updatedAt: estimate signing uses it as the
// document version, and a payment is not a change to the document.
//
// Stripe delivers events at least once and in any order, so the handlers are
// idempotent by state. The conditional UPDATE lets only one delivery win the
// transition to paid, even when two arrive at the same time.
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const invoiceId = paymentIntent.metadata?.invoice_id
  if (!invoiceId) return

  const paid = {
    status: 'paid' as const,
    stripePaymentStatus: 'paid' as const,
    stripePaymentIntentId: paymentIntent.id,
  }

  const transitioned = await db
    .update(invoices)
    .set(paid)
    .where(and(eq(invoices.id, invoiceId), notPaid(invoices.status)))
    .returning()

  if (transitioned.length === 0) {
    // Already paid (a redelivery, or the owner marked it paid by hand): record
    // the Stripe payment but don't repeat any side effects.
    await db
      .update(invoices)
      .set(paid)
      .where(and(eq(invoices.id, invoiceId), notPaid(invoices.stripePaymentStatus)))
    return
  }

  const [invoice] = transitioned

  // The invoice is already marked paid, so a Stripe retry would not get here
  // again: report failures instead of failing the delivery.
  try {
    await triggerWebhooks(invoice.userId, 'invoice.paid', { invoice })
  } catch (error) {
    reportError(error, 'Failed to queue invoice.paid webhook', { invoiceId: invoice.id })
  }

  // The account's auth email, not invoice.senderEmail: that one is free text
  // anyone with edit access can point anywhere.
  try {
    const [owner] = await db
      .select({ email: user.email })
      .from(user)
      .where(eq(user.id, invoice.userId))
    if (owner?.email) {
      await sendPaymentReceivedEmail({
        toEmail: owner.email,
        senderName: invoice.senderName ?? '',
        clientName: invoice.clientName,
        invoiceNumber: invoice.invoiceNumber,
        amount: paymentIntent.amount_received || paymentIntent.amount,
        currency: paymentIntent.currency,
        invoiceId: invoice.id,
      })
    }
  } catch (error) {
    reportError(error, 'Failed to send payment received email', { invoiceId: invoice.id })
  }
}

// A failure only counts for the invoice's current intent, and never moves a
// paid invoice back: a late or redelivered failure must not undo a payment.
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const invoiceId = paymentIntent.metadata?.invoice_id
  if (!invoiceId) return
  await db
    .update(invoices)
    .set({ stripePaymentStatus: 'failed' })
    .where(and(
      eq(invoices.id, invoiceId),
      eq(invoices.stripePaymentIntentId, paymentIntent.id),
      notPaid(invoices.status),
      notPaid(invoices.stripePaymentStatus),
    ))
}

async function handleAccountUpdated(account: Stripe.Account) {
  await db
    .update(userProfiles)
    .set({
      stripeChargesEnabled: account.charges_enabled,
      stripePayoutsEnabled: account.payouts_enabled,
      stripeOnboardingCompleted: account.details_submitted && account.charges_enabled,
      updatedAt: new Date(),
    })
    .where(eq(userProfiles.stripeAccountId, account.id))
}
