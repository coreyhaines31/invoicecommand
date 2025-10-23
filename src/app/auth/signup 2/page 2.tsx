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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
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

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto mt-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Create Your Free Account
            </h1>
            <p className="text-muted-foreground">
              Unlock logo uploads, invoice history, and payment collection
            </p>
          </div>

          <SignupForm />

          {/* Benefits */}
          <div className="mt-8 p-6 bg-card border border-border rounded-lg">
            <h3 className="font-semibold mb-4">What you'll get with a free account:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Upload your logo to invoices
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Save and duplicate all your invoices
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                10 AI voice commands per month
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Collect payments with Stripe integration
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Choose from 3 professional invoice styles
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}