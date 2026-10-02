import { NextRequest, NextResponse } from 'next/server'
import { processPendingWebhooks, cleanupWebhookEvents } from '@/lib/webhook-service'
import { timingSafeStringEqual } from '@/lib/cron-auth'

// POST /api/cron/webhooks - Process pending webhook deliveries
// This endpoint should be called by a cron job (e.g., Vercel Cron)
export async function POST(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret) {
    console.error('CRON_SECRET not configured')
    return NextResponse.json({ error: 'Cron not configured' }, { status: 500 })
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
    console.error('Webhook cron error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhooks' },
      { status: 500 }
    )
  }
}

// Also support GET for Vercel Cron (which uses GET requests)
export async function GET(request: NextRequest) {
  const expectedSecret = process.env.CRON_SECRET
  if (!expectedSecret) {
    console.error('CRON_SECRET not configured')
    return NextResponse.json({ error: 'Cron not configured' }, { status: 500 })
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
    console.error('Webhook cron error:', error)
    return NextResponse.json(
      { error: 'Failed to process webhooks' },
      { status: 500 }
    )
  }
}
