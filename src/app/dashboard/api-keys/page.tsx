import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { listApiKeys } from '@/lib/api-keys'
import { ApiKeysClient } from './api-keys-client'

export const metadata: Metadata = {
  title: 'API Keys | Invoice Command',
  description: 'Manage your API keys for programmatic access to Invoice Command.',
}

export default async function ApiKeysPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect('/auth/login')
  }

  const apiKeys = await listApiKeys(session.user.id)

  return <ApiKeysClient apiKeys={apiKeys} />
}
