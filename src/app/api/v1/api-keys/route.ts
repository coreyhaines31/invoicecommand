import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { generateApiKey, listApiKeys } from '@/lib/api-keys'
import { checkRateLimit } from '@/lib/rate-limit'
import { jsonErrorResponse } from '@/lib/error-response'

const MAX_NAME_LENGTH = 100
const VALID_SCOPES = new Set([
  'invoices:read',
  'invoices:write',
  'webhooks:read',
  'webhooks:write',
  '*',
])

// GET /api/v1/api-keys - List all API keys (session auth only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const keys = await listApiKeys(session.user.id)

    return NextResponse.json({
      data: keys.map((key) => ({
        id: key.id,
        name: key.name,
        keyPrefix: key.keyPrefix,
        scopes: key.scopes,
        rateLimit: key.rateLimit,
        expiresAt: key.expiresAt,
        lastUsedAt: (key as any).lastUsedAt,
        createdAt: (key as any).createdAt,
      })),
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to list API keys')
  }
}

// POST /api/v1/api-keys - Create a new API key (session auth only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Cap key creation to prevent a logged-in user from exhausting the api_keys table.
    const rl = checkRateLimit(session.user.id, { bucket: 'api-key-create', max: 10, windowMs: 60 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many API key creation requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    let body: { name?: string; scopes?: string[]; rateLimit?: number; expiresAt?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { name, scopes, rateLimit, expiresAt } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    if (name.length > MAX_NAME_LENGTH) {
      return NextResponse.json({ error: `name must be ${MAX_NAME_LENGTH} characters or less` }, { status: 400 })
    }

    // Validate scopes
    if (scopes !== undefined) {
      if (!Array.isArray(scopes)) {
        return NextResponse.json({ error: 'scopes must be an array' }, { status: 400 })
      }
      for (const scope of scopes) {
        if (typeof scope !== 'string' || !VALID_SCOPES.has(scope)) {
          return NextResponse.json(
            { error: `Invalid scope: ${scope}. Valid scopes: ${[...VALID_SCOPES].join(', ')}` },
            { status: 400 }
          )
        }
      }
    }

    // Validate rate limit
    if (rateLimit !== undefined) {
      if (typeof rateLimit !== 'number' || rateLimit < 1 || rateLimit > 10000) {
        return NextResponse.json({ error: 'rateLimit must be between 1 and 10000' }, { status: 400 })
      }
    }

    // Validate expiration
    let expiresAtDate: Date | undefined
    if (expiresAt !== undefined) {
      if (typeof expiresAt !== 'string') {
        return NextResponse.json({ error: 'expiresAt must be an ISO date string' }, { status: 400 })
      }
      expiresAtDate = new Date(expiresAt)
      if (isNaN(expiresAtDate.getTime())) {
        return NextResponse.json({ error: 'expiresAt must be a valid ISO date string' }, { status: 400 })
      }
      if (expiresAtDate <= new Date()) {
        return NextResponse.json({ error: 'expiresAt must be in the future' }, { status: 400 })
      }
    }

    const apiKey = await generateApiKey(session.user.id, name.trim(), {
      scopes,
      rateLimit,
      expiresAt: expiresAtDate,
    })

    return NextResponse.json(
      {
        data: {
          id: apiKey.id,
          name: apiKey.name,
          key: apiKey.key, // Full key, only returned once
          keyPrefix: apiKey.keyPrefix,
          scopes: apiKey.scopes,
          rateLimit: apiKey.rateLimit,
          expiresAt: apiKey.expiresAt,
        },
        message: 'API key created. Save this key securely - it will not be shown again.',
      },
      { status: 201 }
    )
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create API key')
  }
}
