'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useSession, sendVerificationEmail } from '@/lib/auth-client'
import { withNextPath } from '@/lib/next-path'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string | null
  total: number | string
  status: string | null
  dueDate?: string | null
}

type VerifyState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent'; email: string }
  | { status: 'error'; message: string }

const RESEND_COOLDOWN_MS = 30_000

interface SendEmailDialogProps {
  invoice: Invoice | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEmailSent: () => void
}

export function SendEmailDialog({ invoice, open, onOpenChange, onEmailSent }: SendEmailDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [clientEmail, setClientEmail] = useState('')
  const [senderMessage, setSenderMessage] = useState('')
  const { data: session, refetch: refetchSession } = useSession()
  // A 403 EMAIL_NOT_VERIFIED from the server counts until the session says
  // the account is verified (for example after verifying in another tab).
  const [serverSaysUnverified, setServerSaysUnverified] = useState(false)
  const [verifyState, setVerifyState] = useState<VerifyState>({ status: 'idle' })
  const [canResend, setCanResend] = useState(false)
  const accountEmail = session?.user?.email ?? ''
  const sessionVerified = session?.user?.emailVerified
  const needsVerification = sessionVerified === false || (serverSaysUnverified && sessionVerified !== true)

  // Reset form when dialog opens
  useEffect(() => {
    if (open && invoice) {
      setClientEmail(invoice.clientEmail || '')
      setSenderMessage('')
      setVerifyState({ status: 'idle' })
      setServerSaysUnverified(false)
    }
  }, [open, invoice])

  // Pick up a verification that happened since the session was loaded.
  useEffect(() => {
    if (open) refetchSession()
    // Only on open: refetchSession is not guaranteed to be stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (verifyState.status !== 'sent') return
    setCanResend(false)
    const timer = setTimeout(() => setCanResend(true), RESEND_COOLDOWN_MS)
    return () => clearTimeout(timer)
  }, [verifyState])

  const handleSendVerification = async () => {
    if (!accountEmail) return
    setVerifyState({ status: 'sending' })
    try {
      const { error } = await sendVerificationEmail({
        email: accountEmail,
        callbackURL: withNextPath('/auth/verified', '/dashboard'),
      })
      if (error?.code === 'EMAIL_ALREADY_VERIFIED') {
        setServerSaysUnverified(false)
        setVerifyState({ status: 'idle' })
        refetchSession()
        return
      }
      if (error) {
        setVerifyState({
          status: 'error',
          message: error.status === 429
            ? 'Too many requests. Try again in a few minutes.'
            : 'We could not send the verification email. Try again in a few minutes.',
        })
        return
      }
      setVerifyState({ status: 'sent', email: accountEmail })
    } catch {
      setVerifyState({ status: 'error', message: 'We could not send the verification email. Try again in a few minutes.' })
    }
  }

  const handleSendEmail = async () => {
    if (!invoice || !clientEmail.trim()) {
      toast.error('Client email is required')
      return
    }

    setIsLoading(true)

    try {
      // The server renders and attaches the PDF from the stored invoice.
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          senderMessage: senderMessage.trim() || undefined,
          clientEmail: clientEmail.trim(),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => ({}))
        if (response.status === 403 && body?.code === 'EMAIL_NOT_VERIFIED') {
          setServerSaysUnverified(true)
          refetchSession()
          return
        }
        const msg = body?.error || body?.details || 'Failed to send email'
        const ref = body?.eventId ? ` (ref ${body.eventId.slice(0, 8)})` : ''
        throw new Error(`${msg}${ref}`)
      }

      toast.success(`Invoice sent to ${clientEmail}`)
      onEmailSent()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to send email:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to send email')
    } finally {
      setIsLoading(false)
    }
  }

  if (!invoice) return null

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(typeof invoice.total === 'string' ? Number(invoice.total || 0) : (invoice.total || 0))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Invoice via Email
          </DialogTitle>
          <DialogDescription>
            Send invoice {invoice.invoiceNumber} to your client via email with the PDF attached.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {needsVerification && (
            <Alert>
              <AlertDescription className="space-y-3">
                <p>
                  Sending invoices by email needs a verified account email.
                  {accountEmail && <> We will send a verification link to {accountEmail}.</>}
                </p>
                {verifyState.status === 'sent' ? (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <p className="text-foreground font-medium">Check your inbox at {verifyState.email}.</p>
                    {canResend && (
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="h-auto p-0 text-muted-foreground"
                        onClick={handleSendVerification}
                      >
                        Send again
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendVerification}
                    disabled={verifyState.status === 'sending' || !accountEmail}
                  >
                    {verifyState.status === 'sending' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send verification email'
                    )}
                  </Button>
                )}
                {verifyState.status === 'error' && (
                  <p className="text-destructive" role="alert">{verifyState.message}</p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Invoice Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Invoice:</span>
              <span className="text-sm">{invoice.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Client:</span>
              <span className="text-sm">{invoice.clientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Amount:</span>
              <span className="text-sm font-semibold">{formattedTotal}</span>
            </div>
          </div>

          {/* Client Email */}
          <div className="space-y-2">
            <Label htmlFor="client-email">Client Email *</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              required
            />
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label htmlFor="sender-message">Custom Message (Optional)</Label>
            <Textarea
              id="sender-message"
              placeholder="Add a personal message to include with the invoice email..."
              value={senderMessage}
              onChange={(e) => setSenderMessage(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              This message will be included in the email along with the invoice details.
            </p>
          </div>
        </div>

        <DialogFooter>
          {needsVerification && (
            <p className="text-xs text-muted-foreground sm:mr-auto self-center">
              Verify your email to send.
            </p>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isLoading || !clientEmail.trim() || needsVerification}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
