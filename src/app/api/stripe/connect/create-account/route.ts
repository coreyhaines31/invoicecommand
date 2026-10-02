import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { userProfiles } from '@/lib/db/schema'
import { and, eq, isNull } from 'drizzle-orm'
import { stripe, STRIPE_CONNECT_CONFIG } from '@/lib/stripe'
import { jsonErrorResponse } from '@/lib/error-response'

const ALLOWED_COUNTRIES = new Set(['US', 'CA', 'GB', 'AU', 'NZ', 'IE', 'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'PT', 'PL', 'CZ', 'HU', 'RO', 'BG', 'HR', 'SI', 'SK', 'EE', 'LV', 'LT', 'LU', 'MT', 'CY', 'GR', 'JP', 'SG', 'HK', 'MX', 'BR', 'IN'])
const ALLOWED_BUSINESS_TYPES = new Set(['individual', 'company', 'non_profit', 'government_entity'])

function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { email, country = 'US', businessType = 'individual' } = body

    if (!ALLOWED_COUNTRIES.has(country)) {
      return NextResponse.json({ error: 'Invalid country' }, { status: 400 })
    }
    if (!ALLOWED_BUSINESS_TYPES.has(businessType)) {
      return NextResponse.json({ error: 'Invalid business type' }, { status: 400 })
    }

    // Reject malformed email outright instead of silently forwarding garbage to Stripe.
    // Fall back to the session email only when the caller didn't provide one.
    if (email != null && email !== '' && !isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    const accountEmail = isValidEmail(email) ? email : session.user.email

    // Atomic claim to prevent two concurrent requests both calling stripe.accounts.create
    // (which would leave a paid-for orphan account on Stripe).
    //   1. Insert a placeholder row with stripeAccountId=null. ON CONFLICT DO NOTHING
    //      means the second concurrent request sees no inserted row.
    //   2. If we didn't claim, check whether the existing row already has a real
    //      stripeAccountId — if so, 400. Otherwise the row is a retry-stub from a
    //      previous partial failure; recover by proceeding.
    //   3. After stripe.accounts.create succeeds, UPDATE the row guarded by
    //      isNull(stripeAccountId). If the guard fails, a concurrent request
    //      already wrote a different account ID — delete ours to avoid orphans.
    const [claimed] = await db
      .insert(userProfiles)
      .values({ userId: session.user.id, stripeOnboardingCompleted: false })
      .onConflictDoNothing({ target: userProfiles.userId })
      .returning({ id: userProfiles.id })

    if (!claimed) {
      const [existing] = await db
        .select({ stripeAccountId: userProfiles.stripeAccountId })
        .from(userProfiles)
        .where(eq(userProfiles.userId, session.user.id))
      if (existing?.stripeAccountId) {
        return NextResponse.json({ error: 'User already has a Stripe account' }, { status: 400 })
      }
      // Existing row, no stripeAccountId — this is either a concurrent in-flight
      // setup or a stub from a previous failed attempt. Continue and let the
      // optimistic UPDATE below settle which request wins.
    }

    const account = await stripe.accounts.create({
      type: STRIPE_CONNECT_CONFIG.EXPRESS_ACCOUNT_SETTINGS.type,
      country,
      email: accountEmail,
      capabilities: STRIPE_CONNECT_CONFIG.EXPRESS_ACCOUNT_SETTINGS.capabilities,
      business_type: businessType,
      settings: STRIPE_CONNECT_CONFIG.EXPRESS_ACCOUNT_SETTINGS.settings,
    })

    const [updated] = await db
      .update(userProfiles)
      .set({ stripeAccountId: account.id, stripeOnboardingCompleted: false, updatedAt: new Date() })
      .where(and(
        eq(userProfiles.userId, session.user.id),
        isNull(userProfiles.stripeAccountId),
      ))
      .returning({ id: userProfiles.id })

    if (!updated) {
      // Lost the race — another request wrote a stripeAccountId first.
      // Best-effort cleanup of the orphan Stripe account we just created.
      try {
        await stripe.accounts.del(account.id)
      } catch (cleanupErr) {
        console.error('Failed to clean up orphan Stripe account', account.id, cleanupErr)
      }
      return NextResponse.json(
        { error: 'A Stripe account was created concurrently. Please refresh.' },
        { status: 409 }
      )
    }

    return NextResponse.json({ accountId: account.id, message: 'Stripe Express account created successfully' })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create Stripe account')
  }
}
