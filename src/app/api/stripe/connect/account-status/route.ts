import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { stripe } from '@/lib/stripe'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Each call hits stripe.accounts.retrieve. Cap per-user to bound Stripe API quota.
    const rl = checkRateLimit(session.user.id, { bucket: 'stripe-account-status', max: 60, windowMs: 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many account status requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    const [userProfile] = await db
      .select({
        stripeAccountId: userProfiles.stripeAccountId,
        stripeOnboardingCompleted: userProfiles.stripeOnboardingCompleted,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))

    if (!userProfile?.stripeAccountId) {
      return NextResponse.json({ hasAccount: false, onboardingCompleted: false, chargesEnabled: false, payoutsEnabled: false })
    }

    const account = await stripe.accounts.retrieve(userProfile.stripeAccountId)
    const onboardingCompleted = !!(account.details_submitted && account.charges_enabled)

    if (onboardingCompleted !== userProfile.stripeOnboardingCompleted) {
      await db
        .update(userProfiles)
        .set({ stripeOnboardingCompleted: onboardingCompleted, updatedAt: new Date() })
        .where(eq(userProfiles.userId, session.user.id))
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
      { error: 'Failed to get account status' },
      { status: 500 }
    )
  }
}
