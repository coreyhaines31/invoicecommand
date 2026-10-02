import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireScope, createApiResponse } from '@/lib/api-auth'
import { createWebhook, listWebhooks, assertWebhookUrlIsExternal } from '@/lib/webhook-service'
import { jsonErrorResponse } from '@/lib/error-response'

const VALID_EVENTS = new Set([
  'invoice.created',
  'invoice.updated',
  'invoice.sent',
  'invoice.paid',
  'invoice.overdue',
  'estimate.signed',
  '*',
])

const MAX_URL_LENGTH = 2000
const MAX_DESCRIPTION_LENGTH = 500

// GET /api/v1/webhooks - List all webhooks
export async function GET(request: NextRequest) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'webhooks:read')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const webhooks = await listWebhooks(authResult.userId)

    return createApiResponse({ data: webhooks }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to list webhooks')
  }
}

// POST /api/v1/webhooks - Create a new webhook
export async function POST(request: NextRequest) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'webhooks:write')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    let body: { url?: string; events?: string[]; description?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const { url, events, description } = body

    // Validate URL
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url is required' }, { status: 400 })
    }

    if (url.length > MAX_URL_LENGTH) {
      return NextResponse.json({ error: `url must be ${MAX_URL_LENGTH} characters or less` }, { status: 400 })
    }

    try {
      await assertWebhookUrlIsExternal(url)
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : 'url must be a valid public URL' },
        { status: 400 }
      )
    }

    // Validate events
    if (!events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json({ error: 'events is required and must be a non-empty array' }, { status: 400 })
    }

    for (const event of events) {
      if (typeof event !== 'string' || !VALID_EVENTS.has(event)) {
        return NextResponse.json(
          { error: `Invalid event: ${event}. Valid events: ${[...VALID_EVENTS].join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Validate description
    if (description !== undefined) {
      if (typeof description !== 'string' || description.length > MAX_DESCRIPTION_LENGTH) {
        return NextResponse.json(
          { error: `description must be a string of ${MAX_DESCRIPTION_LENGTH} characters or less` },
          { status: 400 }
        )
      }
    }

    const webhook = await createWebhook(authResult.userId, url, events, description)

    return createApiResponse(
      {
        data: {
          id: webhook.id,
          secret: webhook.secret, // Only returned once on creation
          url,
          events,
          description,
          isActive: true,
        },
        message: 'Webhook created. Save the secret securely - it will not be shown again.',
      },
      authResult,
      { status: 201 }
    )
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to create webhook')
  }
}
