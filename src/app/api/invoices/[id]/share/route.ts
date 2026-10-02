import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { generateShareToken } from '@/lib/share-link'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

function parseExpiresAt(value: unknown): Date | null | undefined {
  if (value === undefined) return undefined
  if (value === null || value === '') return null
  if (typeof value !== 'string') return undefined
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return undefined
  return parsed
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
    // Cap token generation/rotation. Each call writes to the DB and the unique
    // index on share_token means a determined abuser could probe collisions.
    const rl = checkRateLimit(session.user.id, { bucket: 'invoice-share', max: 30, windowMs: 60 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many share-link changes. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }
  
    const { id } = await params
  
    let body: { rotate?: boolean; expiresAt?: string | null } = {}
    if (request.headers.get('content-length') && request.headers.get('content-length') !== '0') {
      try {
        body = await request.json()
      } catch {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
      }
    }
  
    const expiresAt = parseExpiresAt(body.expiresAt)
    // undefined means caller didn't pass the field; null means clear it explicitly.
    if (body.expiresAt !== undefined && expiresAt === undefined) {
      return NextResponse.json({ error: 'Invalid expiresAt' }, { status: 400 })
    }
  
    const [existing] = await db
      .select({ shareToken: invoices.shareToken })
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
  
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  
    const needsNewToken = body.rotate || !existing.shareToken
  
    // 192-bit token collision is astronomical, but a unique-index violation
    // would otherwise surface as a 500 and lose the user's action. Retry once
    // with a fresh token; any further collision is genuinely catastrophic and
    // the catch in jsonErrorResponse (via the route's default error path)
    // captures it for Sentry triage.
    const tryUpdate = async (token: string) => {
      const updates: Record<string, unknown> = {
        shareToken: token,
        shareEnabled: true,
        updatedAt: new Date(),
      }
      if (expiresAt !== undefined) updates.shareExpiresAt = expiresAt
  
      const [row] = await db
        .update(invoices)
        .set(updates)
        .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
        .returning({
          shareToken: invoices.shareToken,
          shareEnabled: invoices.shareEnabled,
          shareExpiresAt: invoices.shareExpiresAt,
          shareViewCount: invoices.shareViewCount,
          shareLastViewedAt: invoices.shareLastViewedAt,
        })
      return row
    }
  
    function isUniqueViolation(err: unknown): boolean {
      return !!err && typeof err === 'object' && 'code' in err && (err as { code: unknown }).code === '23505'
    }
  
    let updated
    try {
      updated = await tryUpdate(needsNewToken ? generateShareToken() : existing.shareToken!)
    } catch (err) {
      if (needsNewToken && isUniqueViolation(err)) {
        updated = await tryUpdate(generateShareToken())
      } else {
        throw err
      }
    }
  
    return NextResponse.json(updated)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to update share link')
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    // Disable the link but keep the token so revoke is reversible by re-enabling
    // without breaking any QR codes the owner has already printed/saved.
    const [updated] = await db
      .update(invoices)
      .set({ shareEnabled: false, updatedAt: new Date() })
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))
      .returning({ id: invoices.id, shareEnabled: invoices.shareEnabled })

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to revoke share link')
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const [row] = await db
      .select({
        shareToken: invoices.shareToken,
        shareEnabled: invoices.shareEnabled,
        shareExpiresAt: invoices.shareExpiresAt,
        shareViewCount: invoices.shareViewCount,
        shareLastViewedAt: invoices.shareLastViewedAt,
      })
      .from(invoices)
      .where(and(eq(invoices.id, id), eq(invoices.userId, session.user.id)))

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(row)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to load share link')
  }
}
