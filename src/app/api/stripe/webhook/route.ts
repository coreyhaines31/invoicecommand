import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { invoices, userProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  if (!paymentIntent.metadata?.invoice_id) return
  await db
    .update(invoices)
    .set({ stripePaymentStatus: 'paid', updatedAt: new Date() })
    .where(eq(invoices.stripePaymentIntentId, paymentIntent.id))
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  if (!paymentIntent.metadata?.invoice_id) return
  await db
    .update(invoices)
    .set({ stripePaymentStatus: 'failed', updatedAt: new Date() })
    .where(eq(invoices.stripePaymentIntentId, paymentIntent.id))
}

async function handleAccountUpdated(account: any) {
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
