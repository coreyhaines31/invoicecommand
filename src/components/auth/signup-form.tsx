'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import { signUp } from '@/lib/auth-client'
import { getAuthErrorMessage, type FriendlyAuthError } from '@/lib/auth-errors'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<FriendlyAuthError | null>(null)
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage('')

    try {
      const { error } = await signUp.email({
        email,
        password,
        name: email.split('@')[0],
        callbackURL: '/dashboard',
      })

      if (error) {
        setError(getAuthErrorMessage(error))
        return
      }

      setMessage('Account created! Redirecting to dashboard...')
      setTimeout(() => { window.location.href = '/dashboard' }, 1000)
    } catch {
      setError(getAuthErrorMessage(null))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
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

        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create account'
          )}
        </Button>
      </form>
    </div>
  )
}
