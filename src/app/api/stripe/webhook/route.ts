import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { and, eq, isNull, ne, or } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'No Stripe signature found' }, { status: 400 })
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
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
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

// Matches rows where the column is NULL or anything other than 'paid'.
function notPaid(column: typeof invoices.status | typeof invoices.stripePaymentStatus) {
  return or(isNull(column), ne(column, 'paid'))
}

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
    updatedAt: new Date(),
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
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  if (!paymentIntent.metadata?.invoice_id) return
  await db
    .update(invoices)
    .set({ stripePaymentStatus: 'failed', updatedAt: new Date() })
    .where(eq(invoices.stripePaymentIntentId, paymentIntent.id))
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
