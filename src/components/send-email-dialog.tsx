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
import { Mail, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string | null
  total: number | string
  currency?: string | null
  status: string | null
  dueDate?: string | null
}

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
  const [emailError, setEmailError] = useState<string | null>(null)

  // Reset form when dialog opens
  useEffect(() => {
    if (open && invoice) {
      setClientEmail(invoice.clientEmail || '')
      setSenderMessage('')
      setEmailError(null)
    }
  }, [open, invoice])

  const handleSendEmail = async (event?: React.FormEvent) => {
    event?.preventDefault()
    if (!invoice) return
    const email = clientEmail.trim()
    if (!email) {
      setEmailError('Enter the email address to send this invoice to.')
      document.getElementById('client-email')?.focus()
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('That email address looks incomplete. Check it and try again.')
      document.getElementById('client-email')?.focus()
      return
    }
    setEmailError(null)

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

  const totalValue = typeof invoice.total === 'string' ? Number(invoice.total || 0) : (invoice.total || 0)
  let formattedTotal: string
  try {
    formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency || 'USD' }).format(totalValue)
  } catch {
    formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail aria-hidden="true" className="w-5 h-5" />
            Send Invoice via Email
          </DialogTitle>
          <DialogDescription>
            Send invoice {invoice.invoiceNumber} to your client via email with the PDF attached.
          </DialogDescription>
        </DialogHeader>

        <form id="send-invoice-form" onSubmit={handleSendEmail} noValidate className="space-y-4">
          {/* Invoice Summary */}
          <dl className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="font-medium shrink-0">Invoice</dt>
              <dd className="min-w-0 truncate">{invoice.invoiceNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium shrink-0">Client</dt>
              <dd className="min-w-0 truncate" title={invoice.clientName || undefined}>
                {invoice.clientName || 'No client name'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium shrink-0">Amount</dt>
              <dd className="font-semibold tabular-nums">{formattedTotal}</dd>
            </div>
          </dl>

          {/* Client Email */}
          <div className="space-y-2">
            <Label htmlFor="client-email">
              Client Email <span aria-hidden="true" className="text-destructive">*</span>
            </Label>
            <Input
              id="client-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="client@example.com"
              value={clientEmail}
              onChange={(e) => {
                setClientEmail(e.target.value)
                if (emailError) setEmailError(null)
              }}
              required
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? 'client-email-error' : undefined}
            />
            {emailError && (
              <p id="client-email-error" role="alert" className="text-sm text-destructive">
                {emailError}
              </p>
            )}
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
              aria-describedby="sender-message-help"
            />
            <p id="sender-message-help" className="text-xs text-muted-foreground">
              Appears in the email below the invoice details. The PDF is attached for you.
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" form="send-invoice-form" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 aria-hidden="true" className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send aria-hidden="true" className="w-4 h-4 mr-2" />
                Send Invoice
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
