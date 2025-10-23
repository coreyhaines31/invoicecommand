import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server'
import { stripe } from '@/lib/stripe'

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

    // Get user's Stripe account ID
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !userProfile?.stripe_account_id) {
      return NextResponse.json(
        { error: 'No Stripe account found. Please create an account first.' },
        { status: 404 }
      )
    }

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: userProfile.stripe_account_id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard/payments/setup?refresh=true`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/dashboard/payments/setup?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({
      url: accountLink.url,
      message: 'Onboarding link created successfully'
    })

  } catch (error) {
    console.error('Failed to create onboarding link:', error)

    return NextResponse.json(
      {
        error: 'Failed to create onboarding link',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}