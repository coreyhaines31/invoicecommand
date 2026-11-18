import { Metadata } from 'next'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { Logo } from '@/components/logo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Forgot Password | Invoice Command',
  description: 'Request a password reset link for your Invoice Command account.',
  robots: { index: false, follow: false },
}

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-base font-semibold whitespace-nowrap text-foreground sm:text-lg">Invoice Command</span>
            </Link>
            <Link href="/auth/login" className="inline-flex min-h-10 items-center rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              Back to sign in
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Forgot your password?</h1>
            <p className="text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset it.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
