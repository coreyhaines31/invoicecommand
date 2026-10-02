import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, requireScope, createApiResponse } from '@/lib/api-auth'
import { deleteWebhook, updateWebhook, assertWebhookUrlIsExternal } from '@/lib/webhook-service'
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

// PUT /api/v1/webhooks/:id - Update a webhook
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'webhooks:write')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = await params

    let body: { url?: string; events?: string[]; isActive?: boolean; description?: string | null }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const updates: { url?: string; events?: string[]; isActive?: boolean; description?: string | null } = {}

    // Validate URL
    if (body.url !== undefined) {
      if (typeof body.url !== 'string') {
        return NextResponse.json({ error: 'url must be a string' }, { status: 400 })
      }
      if (body.url.length > MAX_URL_LENGTH) {
        return NextResponse.json({ error: `url must be ${MAX_URL_LENGTH} characters or less` }, { status: 400 })
      }
      try {
        await assertWebhookUrlIsExternal(body.url)
      } catch (err) {
        return NextResponse.json(
          { error: err instanceof Error ? err.message : 'url must be a valid public URL' },
          { status: 400 }
        )
      }
      updates.url = body.url
    }

    // Validate events
    if (body.events !== undefined) {
      if (!Array.isArray(body.events) || body.events.length === 0) {
        return NextResponse.json({ error: 'events must be a non-empty array' }, { status: 400 })
      }
      for (const event of body.events) {
        if (typeof event !== 'string' || !VALID_EVENTS.has(event)) {
          return NextResponse.json(
            { error: `Invalid event: ${event}. Valid events: ${[...VALID_EVENTS].join(', ')}` },
            { status: 400 }
          )
        }
      }
      updates.events = body.events
    }

    // Validate isActive
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== 'boolean') {
        return NextResponse.json({ error: 'isActive must be a boolean' }, { status: 400 })
      }
      updates.isActive = body.isActive
    }

    // Validate description. Explicit `null` is a valid clear-the-field intent.
    if (body.description !== undefined) {
      if (body.description !== null && (typeof body.description !== 'string' || body.description.length > MAX_DESCRIPTION_LENGTH)) {
        return NextResponse.json(
          { error: `description must be a string of ${MAX_DESCRIPTION_LENGTH} characters or less` },
          { status: 400 }
        )
      }
      // Preserve null so Drizzle writes NULL to the column instead of dropping
      // the field from the SET clause (which `?? undefined` would cause).
      updates.description = body.description
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }

    const updated = await updateWebhook(authResult.userId, id, updates)

    if (!updated) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    return createApiResponse({ success: true, message: 'Webhook updated' }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to update webhook')
  }
}

// DELETE /api/v1/webhooks/:id - Delete a webhook
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = requireScope(await authenticateRequest(request), 'webhooks:write')
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { id } = await params

    const deleted = await deleteWebhook(authResult.userId, id)

    if (!deleted) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 })
    }

    return createApiResponse({ success: true, message: 'Webhook deleted' }, authResult)
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to delete webhook')
  }
}
