'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, Lock } from 'lucide-react'
import { signIn } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthErrorMessage, type FriendlyAuthError } from '@/lib/auth-errors'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<FriendlyAuthError | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const justReset = searchParams.get('reset') === '1'

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      })

      if (error) {
        setError(getAuthErrorMessage(error))
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError(getAuthErrorMessage(null))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {justReset && !error && (
        <Alert>
          <AlertDescription>Password reset. Sign in with your new password below.</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>
              {error.message}
              {error.actionHref && error.actionLabel && (
                <>
                  {' '}
                  <Link href={error.actionHref} className="underline font-medium">
                    {error.actionLabel}
                  </Link>
                </>
              )}
            </AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link
          href="/auth/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          Forgot your password?
        </Link>
      </div>
    </div>
  )
}
