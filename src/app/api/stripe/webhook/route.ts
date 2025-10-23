import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'No Stripe signature found' },
        { status: 400 }
      )
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Handle the event
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
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  const invoiceId = paymentIntent.metadata?.invoice_id

  if (!invoiceId) {
    console.error('No invoice_id in payment intent metadata')
    return
  }

  try {
    // Update invoice status to paid
    const { error } = await supabaseAdmin
      .from('invoices')
      .update({
        stripe_payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Failed to update invoice status:', error)
    } else {
      console.log(`Invoice ${invoiceId} marked as paid`)
    }
  } catch (error) {
    console.error('Error updating invoice:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  const invoiceId = paymentIntent.metadata?.invoice_id

  if (!invoiceId) {
    console.error('No invoice_id in payment intent metadata')
    return
  }

  try {
    // Update invoice status to failed
    const { error } = await supabaseAdmin
      .from('invoices')
      .update({
        stripe_payment_status: 'failed',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_payment_intent_id', paymentIntent.id)

    if (error) {
      console.error('Failed to update invoice status:', error)
    } else {
      console.log(`Invoice ${invoiceId} marked as failed`)
    }
  } catch (error) {
    console.error('Error updating invoice:', error)
  }
}

async function handleAccountUpdated(account: any) {
  try {
    // Update user profile with latest account status
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        stripe_charges_enabled: account.charges_enabled,
        stripe_payouts_enabled: account.payouts_enabled,
        stripe_onboarding_completed: account.details_submitted && account.charges_enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_account_id', account.id)

    if (error) {
      console.error('Failed to update user profile:', error)
    } else {
      console.log(`Updated profile for Stripe account ${account.id}`)
    }
  } catch (error) {
    console.error('Error updating user profile:', error)
  }
}