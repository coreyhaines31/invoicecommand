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
            <Link href="/" className="flex items-center gap-3">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">Invoice Command</span>
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
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
