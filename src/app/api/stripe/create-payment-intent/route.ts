import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server'
import { stripe, calculateApplicationFee, getUserTier } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { invoiceId, amount, currency = 'usd' } = body

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { error: 'Invoice ID and amount are required' },
        { status: 400 }
      )
    }

    // Get invoice and user's Stripe account
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Get user's Stripe account and subscription tier
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_account_id, stripe_onboarding_completed, subscription_tier')
      .eq('user_id', user.id)
      .single()

    if (profileError || !userProfile?.stripe_account_id || !userProfile.stripe_onboarding_completed) {
      return NextResponse.json(
        { error: 'Stripe account not set up. Please complete payment setup first.' },
        { status: 400 }
      )
    }

    // Calculate application fee based on user tier
    const userTier = (userProfile.subscription_tier as 'free' | 'premium' | 'pro') || 'free'
    const applicationFeeAmount = calculateApplicationFee(amount, userTier)

    // Create payment intent with destination charge
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount in cents
      currency: currency.toLowerCase(),
      application_fee_amount: applicationFeeAmount,
      transfer_data: {
        destination: userProfile.stripe_account_id,
      },
      metadata: {
        invoice_id: invoiceId,
        user_id: user.id,
        invoice_number: invoice.invoice_number || '',
      },
      description: `Payment for Invoice ${invoice.invoice_number || invoiceId}`,
    })

    // Update invoice with payment intent details
    const { error: updateError } = await supabase
      .from('invoices')
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        payment_enabled: true,
        payment_amount_cents: amount,
        application_fee_cents: applicationFeeAmount,
        stripe_payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', invoiceId)
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Failed to update invoice:', updateError)
      // Continue anyway - payment intent was created successfully
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      applicationFeeAmount,
      userTier,
      message: 'Payment intent created successfully'
    })

  } catch (error) {
    console.error('Failed to create payment intent:', error)

    return NextResponse.json(
      {
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}