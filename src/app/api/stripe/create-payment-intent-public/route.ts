import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { stripe, calculateApplicationFee } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoiceId, amount, currency = 'usd' } = body

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { error: 'Invoice ID and amount are required' },
        { status: 400 }
      )
    }

    // Get invoice and verify payment is enabled (no auth required for public endpoint)
    const { data: invoice, error: invoiceError } = await supabaseAdmin
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('payment_enabled', true)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found or payments not enabled' },
        { status: 404 }
      )
    }

    // Get user profile for Stripe account info
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_account_id, stripe_onboarding_completed, subscription_tier')
      .eq('user_id', invoice.user_id)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Payment processing not available' },
        { status: 400 }
      )
    }
    if (!userProfile.stripe_account_id || !userProfile.stripe_onboarding_completed) {
      return NextResponse.json(
        { error: 'Payment processing not available for this invoice' },
        { status: 400 }
      )
    }

    // Verify amount matches invoice total (prevent tampering)
    const expectedAmount = Math.round(invoice.total * 100) // Convert to cents
    if (amount !== expectedAmount) {
      return NextResponse.json(
        { error: 'Invalid payment amount' },
        { status: 400 }
      )
    }

    // Calculate application fee based on user tier
    const userTier = (userProfile.subscription_tier as 'free' | 'premium' | 'pro') || 'free'
    const applicationFeeAmount = calculateApplicationFee(amount, userTier)

    // Create payment intent with destination charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency.toLowerCase(),
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: userProfile.stripe_account_id,
      },
      metadata: {
        invoice_id: invoiceId,
        invoice_number: invoice.invoice_number || '',
        client_payment: 'true',
      },
      description: `Payment for Invoice ${invoice.invoice_number || invoiceId}`,
    })

    // Update invoice with payment intent details
    const { error: updateError } = await supabaseAdmin
      .from('invoices')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        payment_amount_cents: amount,
        application_fee_cents: applicationFeeAmount,
        stripe_payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)

    if (updateError) {
      console.error('Failed to update invoice:', updateError)
      // Continue anyway - payment intent was created successfully
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      applicationFeeAmount,
      message: 'Payment intent created successfully'
    })

  } catch (error) {
    console.error('Failed to create public payment intent:', error)

    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}