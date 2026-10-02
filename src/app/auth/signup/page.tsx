import { Metadata } from 'next'
import { SignupForm } from '@/components/auth/signup-form'
import { Logo } from '@/components/logo'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Free Account | Invoice Command',
  description: 'Sign up for your free Invoice Command account and unlock logo uploads, invoice history, and payment collection.',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Navigation - Fixed at top */}
      <nav className="fixed top-0 left-0 right-0 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">Invoice Command</span>
            </Link>
            <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content - Centered Card */}
      <div className="w-full max-w-md mx-auto mt-16">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          <SignupForm />
        </div>
      </div>
    </div>
  )
}