import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices, user, userProfiles } from '@/lib/db/schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

// A JSON copy of the caller's own account: user, profile, invoices and
// estimates. Password hashes, sessions, API keys and webhook secrets live in
// other tables and are never read here.
export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const rl = checkRateLimit(userId, { bucket: 'account-export', max: 5, windowMs: 60 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many export requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
    )
  }

  try {
    const [account] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, userId))

    const [profile] = await db
      .select({
        stripeAccountId: userProfiles.stripeAccountId,
        stripeOnboardingCompleted: userProfiles.stripeOnboardingCompleted,
        stripeChargesEnabled: userProfiles.stripeChargesEnabled,
        stripePayoutsEnabled: userProfiles.stripePayoutsEnabled,
        subscriptionTier: userProfiles.subscriptionTier,
        subscriptionStatus: userProfiles.subscriptionStatus,
        stripeCustomerId: userProfiles.stripeCustomerId,
        stripeSubscriptionId: userProfiles.stripeSubscriptionId,
        createdAt: userProfiles.createdAt,
        updatedAt: userProfiles.updatedAt,
      })
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))

    const documents = await db.select().from(invoices).where(eq(invoices.userId, userId))

    const exportedAt = new Date()
    const body = {
      exportedAt: exportedAt.toISOString(),
      user: account ?? null,
      profile: profile ?? null,
      invoices: documents.filter((d) => d.documentType !== 'estimate'),
      estimates: documents.filter((d) => d.documentType === 'estimate'),
    }

    const filename = `invoicecommand-export-${exportedAt.toISOString().slice(0, 10)}.json`
    return new NextResponse(JSON.stringify(body, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to export account data', { extra: { route: 'account/export', userId } })
  }
}
