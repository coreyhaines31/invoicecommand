import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server'
import { stripe, STRIPE_CONNECT_CONFIG } from '@/lib/stripe'

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
    const { email, country = 'US', businessType = 'individual' } = body

    // Check if user already has a Stripe account
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .single()

    if (existingProfile?.stripe_account_id) {
      return NextResponse.json(
        { error: 'User already has a Stripe account' },
        { status: 400 }
      )
    }

    // Create Stripe Express account
    const account = await stripe.accounts.create({
      type: STRIPE_CONNECT_CONFIG.EXPRESS_ACCOUNT_SETTINGS.type,
      country,
      email: email || user.email,
      capabilities: STRIPE_CONNECT_CONFIG.EXPRESS_ACCOUNT_SETTINGS.capabilities,
      business_type: businessType,
      settings: STRIPE_CONNECT_CONFIG.EXPRESS_ACCOUNT_SETTINGS.settings,
    })

    // Store Stripe account ID in database
    const { error: updateError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        stripe_account_id: account.id,
        stripe_onboarding_completed: false,
        updated_at: new Date().toISOString(),
      })

    if (updateError) {
      console.error('Failed to update user profile:', updateError)
      return NextResponse.json(
        { error: 'Failed to save account information' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      accountId: account.id,
      message: 'Stripe Express account created successfully'
    })

  } catch (error) {
    console.error('Failed to create Stripe account:', error)

    return NextResponse.json(
      {
        error: 'Failed to create Stripe account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}