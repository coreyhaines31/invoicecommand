import { Metadata } from 'next'
import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { Logo } from '@/components/logo'
import Link from 'next/link'
import { AuthFormSkeleton } from '@/components/auth/auth-form-skeleton'

export const metadata: Metadata = {
  title: 'Sign In | Invoice Command',
  description: 'Sign in to your Invoice Command account to access your saved invoices and premium features.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-base font-semibold whitespace-nowrap text-foreground sm:text-lg">Invoice Command</span>
            </Link>
            <Link href="/auth/signup" className="inline-flex min-h-10 items-center rounded-md text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
              <span className="hidden sm:inline">Don&apos;t have an account?&nbsp;</span>Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to access your saved invoices and continue where you left off
            </p>
          </div>

          {/* useSearchParams inside LoginForm requires a Suspense boundary */}
          <Suspense fallback={<AuthFormSkeleton fields={2} />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}