import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { stripe } from '@/lib/stripe'
import { jsonErrorResponse } from '@/lib/error-response'

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [userProfile] = await db
      .select({ stripeAccountId: userProfiles.stripeAccountId })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))

    if (!userProfile?.stripeAccountId) {
      return NextResponse.json({ error: 'No Stripe account found. Please create an account first.' }, { status: 404 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'
    const accountLink = await stripe.accountLinks.create({
      account: userProfile.stripeAccountId,
      refresh_url: `${baseUrl}/dashboard/payments/setup?refresh=true`,
      return_url: `${baseUrl}/dashboard/payments/setup?success=true`,
      type: 'account_onboarding',
    })

    return NextResponse.json({ url: accountLink.url, message: 'Onboarding link created successfully' })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create onboarding link')
  }
}
