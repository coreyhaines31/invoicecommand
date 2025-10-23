import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
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

    // Get user's Stripe account ID
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_account_id, stripe_onboarding_completed')
      .eq('user_id', user.id)
      .single()

    if (profileError || !userProfile?.stripe_account_id) {
      return NextResponse.json({
        hasAccount: false,
        onboardingCompleted: false,
        chargesEnabled: false,
        payoutsEnabled: false,
      })
    }

    // Get account details from Stripe
    const account = await stripe.accounts.retrieve(userProfile.stripe_account_id)

    // Update onboarding status in database if changed
    const onboardingCompleted = account.details_submitted && account.charges_enabled

    if (onboardingCompleted !== userProfile.stripe_onboarding_completed) {
      await supabase
        .from('user_profiles')
        .update({
          stripe_onboarding_completed: onboardingCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
    }

    return NextResponse.json({
      hasAccount: true,
      accountId: account.id,
      onboardingCompleted,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requiresAction: !account.details_submitted,
      country: account.country,
      currency: account.default_currency,
      businessType: account.business_type,
      email: account.email,
    })

  } catch (error) {
    console.error('Failed to get account status:', error)

    return NextResponse.json(
      {
        error: 'Failed to get account status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}