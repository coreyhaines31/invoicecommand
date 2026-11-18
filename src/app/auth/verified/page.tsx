import { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { resolveNextPath } from '@/lib/next-path'

export const metadata: Metadata = {
  title: 'Email Verification | Invoice Command',
  description: 'Confirm the email for your Invoice Command account.',
  robots: { index: false, follow: false },
}

// Better Auth's /api/auth/verify-email redirects here, adding ?error=<code>
// when the link is expired or invalid.
export default async function VerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[] }>
}) {
  const params = await searchParams
  const next = resolveNextPath(params.next)
  const failed = Boolean(params.error)

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto p-4">
          <Link href="/" className="flex items-center gap-3">
            <Logo width={24} height={24} className="text-primary" />
            <span className="text-lg font-semibold text-foreground">Invoice Command</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto mt-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {failed ? 'This link did not work' : 'Your email is verified'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {failed
              ? 'The verification link has expired or is not valid. Choose Send via Email on any invoice in your dashboard to request a new one.'
              : 'You can now send invoices and estimates by email.'}
          </p>
          <Button asChild>
            <Link href={next}>Continue</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
