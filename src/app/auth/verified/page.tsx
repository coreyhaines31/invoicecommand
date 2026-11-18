import { Metadata } from 'next'
import { headers } from 'next/headers'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { ResendVerificationButton } from '@/components/auth/resend-verification-button'
import { auth } from '@/lib/auth'
import { resolveNextPath, withNextPath } from '@/lib/next-path'

export const metadata: Metadata = {
  title: 'Email Verification | Invoice Command',
  description: 'Confirm the email for your Invoice Command account.',
  robots: { index: false, follow: false },
}

// Better Auth's /api/auth/verify-email redirects here, adding ?error=<code>
// when the link is expired or invalid. Opening a link does not sign anyone
// in, so success is only claimed for a signed-in, verified session.
export default async function VerifiedPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string | string[] }>
}) {
  const params = await searchParams
  const next = resolveNextPath(params.next)
  const failed = Boolean(params.error)
  const session = await auth.api.getSession({ headers: await headers() })
  const signInHref = withNextPath('/auth/login', next)

  let title: string
  let body: string
  let action: ReactNode

  if (session?.user.emailVerified) {
    title = 'Your email is verified'
    body = 'You can now send invoices and estimates by email.'
    action = <LinkButton href={next}>Continue</LinkButton>
  } else if (session) {
    title = failed ? 'This link did not work' : 'Your email is not verified yet'
    body = failed
      ? 'The verification link has expired or is not valid. Request a new one below.'
      : 'Request a verification link below, then open it from your inbox.'
    action = <ResendVerificationButton email={session.user.email} />
  } else if (failed) {
    title = 'This link did not work'
    body = 'The verification link has expired or is not valid. Sign in and request a new one from Send via Email on any invoice.'
    action = <LinkButton href={signInHref}>Sign in</LinkButton>
  } else {
    title = 'Email verification'
    body = 'If you just opened a verification link, your email is verified and you can sign in.'
    action = <LinkButton href={signInHref}>Sign in</LinkButton>
  }

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
        <div className="max-w-md mx-auto mt-8 text-center flex flex-col items-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{body}</p>
          {action}
        </div>
      </div>
    </div>
  )
}

function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild>
      <Link href={href}>{children}</Link>
    </Button>
  )
}
