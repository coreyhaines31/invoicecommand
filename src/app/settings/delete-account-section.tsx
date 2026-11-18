'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { authClient, signOut } from '@/lib/auth-client'
import { useInvoiceStore } from '@/stores/invoice-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function deleteErrorMessage(error: { code?: string; status?: number }) {
  if (error.status === 429) return 'Too many attempts. Wait a few minutes, then try again.'
  switch (error.code) {
    case 'INVALID_PASSWORD':
      return 'That password is not correct.'
    case 'PASSWORD_REQUIRED':
      return 'Enter your password to delete your account.'
    default:
      return 'We could not delete your account. Please try again.'
  }
}

export function DeleteAccountSection({ email }: { email: string }) {
  const router = useRouter()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const emailMatches = confirmEmail.trim().toLowerCase() === email.toLowerCase()
  const reason = !emailMatches
    ? 'Type your email address exactly as shown to continue.'
    : password.length === 0
      ? 'Enter your current password to continue.'
      : 'This cannot be undone.'
  const canSubmit = emailMatches && password.length > 0 && !pending

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return
    setPending(true)
    setError(null)

    try {
      const { error: deleteError } = await authClient.deleteUser({ password })
      if (deleteError) {
        setError(deleteErrorMessage(deleteError))
        setPending(false)
        return
      }
    } catch {
      setError(deleteErrorMessage({}))
      setPending(false)
      return
    }

    // resetInvoice also removes the draft from localStorage.
    useInvoiceStore.getState().resetInvoice()
    await signOut().catch(() => {})
    router.replace('/')
    router.refresh()
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>Permanently delete your Invoice Command account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <div>
            <p className="font-medium mb-1">What is deleted</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Your account and sign-in</li>
              <li>Your saved invoices and estimates</li>
              <li>Share links, which stop working</li>
              <li>Your API keys</li>
              <li>Your webhooks</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-1">What is not deleted</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Your Stripe account, which you manage at Stripe</li>
              <li>Emails already sent to your clients</li>
              <li>PDFs already downloaded</li>
            </ul>
          </div>
        </div>

        <p className="text-sm">
          Share links and payment links on unpaid invoices stop working. A payment a client completes
          after you delete your account would still reach your Stripe account with no record here, so
          let your clients know first.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="delete-confirm-email">
              Type <span className="font-semibold break-all">{email}</span> to confirm
            </Label>
            <Input
              id="delete-confirm-email"
              type="email"
              autoComplete="off"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              disabled={pending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delete-password">Current password</Label>
            <Input
              id="delete-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={pending}
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Button
              type="submit"
              variant="destructive"
              disabled={!canSubmit}
              aria-describedby="delete-account-reason"
            >
              {pending ? 'Deleting account...' : 'Delete my account'}
            </Button>
            <p id="delete-account-reason" className="text-sm text-muted-foreground">
              {reason}
            </p>
          </div>

          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
