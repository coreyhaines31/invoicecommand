import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { withNextPath } from '@/lib/next-path'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DeleteAccountSection } from './delete-account-section'
import { ExportDataButton } from './export-data-button'

export const metadata: Metadata = {
  title: 'Settings | Invoice Command',
  description: 'Manage your Invoice Command account.',
}

const accountLinks = [
  { href: '/dashboard/payments/setup', label: 'Payments', description: 'Connect Stripe to accept card payments on invoices.' },
  { href: '/dashboard/api-keys', label: 'API keys', description: 'Create and revoke keys for the API, CLI and MCP server.' },
  { href: '/dashboard/webhooks', label: 'Webhooks', description: 'Send invoice events to your own endpoints.' },
]

function formatSignupDate(value: Date | string) {
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect(withNextPath('/auth/login', '/settings'))

  const { user } = session
  const createdAt = new Date(user.createdAt)

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <Navigation />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account.</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Email</dt>
                  <dd className="font-medium break-all">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Member since</dt>
                  <dd className="font-medium">
                    <time dateTime={createdAt.toISOString()}>{formatSignupDate(createdAt)}</time>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connections</CardTitle>
              <CardDescription>Payments and developer access.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {accountLinks.map((link) => (
                  <li key={link.href} className="py-3 first:pt-0 last:pb-0">
                    <Link href={link.href} className="font-medium text-primary hover:underline">
                      {link.label}
                    </Link>
                    <p className="text-sm text-muted-foreground">{link.description}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export your data</CardTitle>
              <CardDescription>
                Download a JSON file with your account details, invoices, estimates, voice usage, API key
                names, webhook endpoints and agent feedback. Key values and webhook secrets are not included.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportDataButton />
            </CardContent>
          </Card>

          <div className="pt-6 border-t">
            <DeleteAccountSection email={user.email} />
          </div>
        </div>
      </div>
    </div>
  )
}
