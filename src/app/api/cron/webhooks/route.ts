import { NextRequest, NextResponse } from 'next/server'
import { processPendingWebhooks, cleanupWebhookEvents } from '@/lib/webhook-service'
import { timingSafeStringEqual } from '@/lib/cron-auth'
import { jsonErrorResponse } from '@/lib/error-response'

// POST /api/cron/webhooks - Process pending webhook deliveries
// This endpoint should be called by a cron job (e.g., Vercel Cron)
export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret) {
    return jsonErrorResponse(new Error('CRON_SECRET not configured'), 'Cron not configured')
  }

  if (!timingSafeStringEqual(request.headers.get('x-cron-secret'), expectedSecret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const delivered = await processPendingWebhooks(100)
    const cleanup = await cleanupWebhookEvents()

    return NextResponse.json({
      success: true,
      delivered,
      cleanup,
      message: `Processed webhooks: ${delivered} delivered, ${cleanup.deletedDelivered + cleanup.deletedFailed} cleaned up`,
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to process webhooks')
  }
}

// Also support GET for Vercel Cron (which uses GET requests)
export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret) {
    return jsonErrorResponse(new Error('CRON_SECRET not configured'), 'Cron not configured')
  }

  if (!timingSafeStringEqual(request.headers.get('authorization'), `Bearer ${expectedSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const delivered = await processPendingWebhooks(100)
    const cleanup = await cleanupWebhookEvents()

    return NextResponse.json({
      success: true,
      delivered,
      cleanup,
      message: `Processed webhooks: ${delivered} delivered, ${cleanup.deletedDelivered + cleanup.deletedFailed} cleaned up`,
    })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to process webhooks')
  }
}
