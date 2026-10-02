import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { listWebhooks } from '@/lib/webhook-service'
import { WebhooksClient } from './webhooks-client'

export const metadata: Metadata = {
  title: 'Webhooks | Invoice Command',
  description: 'Manage webhook endpoints for real-time event notifications.',
}

export default async function WebhooksPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/auth/login')
  }

  const webhooks = await listWebhooks(session.user.id)

  return <WebhooksClient webhooks={webhooks} />
}
