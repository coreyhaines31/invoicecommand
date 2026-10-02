'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { getAuthErrorMessage, type FriendlyAuthError } from '@/lib/auth-errors'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<FriendlyAuthError | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: '/auth/reset-password',
      })

      if (error) {
        setError(getAuthErrorMessage(error))
        return
      }

      // Better Auth returns success even when the email doesn't match an
      // account, to avoid leaking which addresses are registered.
      setSubmitted(true)
    } catch {
      setError(getAuthErrorMessage(null))
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <Alert>
        <AlertDescription>
          If an account exists for <strong>{email}</strong>, we just sent a password reset link. Check your inbox.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending reset link…
          </>
        ) : (
          'Send reset link'
        )}
      </Button>
    </form>
  )
}
