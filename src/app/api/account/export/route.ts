import { NextRequest, NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { agentFeedback, apiKeys, invoices, user, userProfiles, voiceUsage, webhooks } from '@/lib/db/schema'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

// A JSON copy of the caller's own account. Every table is read with an
// explicit column list: password hashes and session tokens (account, session)
// are never read, and API key hashes and webhook signing secrets are left out.
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

    const usage = await db
      .select({
        monthYear: voiceUsage.monthYear,
        commandCount: voiceUsage.commandCount,
        lastUsed: voiceUsage.lastUsed,
      })
      .from(voiceUsage)
      .where(eq(voiceUsage.userId, userId))

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        isActive: apiKeys.isActive,
        expiresAt: apiKeys.expiresAt,
        lastUsedAt: apiKeys.lastUsedAt,
        createdAt: apiKeys.createdAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.userId, userId))

    const endpoints = await db
      .select({
        id: webhooks.id,
        url: webhooks.url,
        events: webhooks.events,
        isActive: webhooks.isActive,
        description: webhooks.description,
        createdAt: webhooks.createdAt,
      })
      .from(webhooks)
      .where(eq(webhooks.userId, userId))

    const feedback = await db
      .select({
        id: agentFeedback.id,
        client: agentFeedback.client,
        task: agentFeedback.task,
        kind: agentFeedback.kind,
        impact: agentFeedback.impact,
        toolName: agentFeedback.toolName,
        description: agentFeedback.description,
        status: agentFeedback.status,
        createdAt: agentFeedback.createdAt,
      })
      .from(agentFeedback)
      .where(eq(agentFeedback.userId, userId))

    const exportedAt = new Date()
    const body = {
      exportedAt: exportedAt.toISOString(),
      user: account ?? null,
      profile: profile ?? null,
      invoices: documents.filter((d) => d.documentType !== 'estimate'),
      estimates: documents.filter((d) => d.documentType === 'estimate'),
      voiceUsage: usage,
      apiKeys: keys,
      webhooks: endpoints,
      agentFeedback: feedback,
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
