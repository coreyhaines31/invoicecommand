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
  invoice_number: string
  client_name: string
  client_email?: string
  total: number
  status: string
  due_date: string
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

  // Reset form when dialog opens
  useEffect(() => {
    if (open && invoice) {
      setClientEmail(invoice.client_email || '')
      setSenderMessage('')
    }
  }, [open, invoice])

  const handleSendEmail = async () => {
    if (!invoice || !clientEmail.trim()) {
      toast.error('Client email is required')
      return
    }

    setIsLoading(true)

    try {
      // First, generate the PDF
      // We'll need to load the invoice and generate PDF
      // For now, we'll simulate the PDF generation
      const pdfResponse = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ invoiceId: invoice.id }),
      })

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF')
      }

      const pdfBlob = await pdfResponse.blob()
      const pdfBuffer = await pdfBlob.arrayBuffer()
      const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(pdfBuffer)))

      // Send the email
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId: invoice.id,
          pdfBuffer: base64Pdf,
          senderMessage: senderMessage.trim() || undefined,
          clientEmail: clientEmail.trim(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Failed to send email')
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
  }).format(invoice.total || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Send Invoice via Email
          </DialogTitle>
          <DialogDescription>
            Send invoice {invoice.invoice_number} to your client via email with the PDF attached.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Invoice Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Invoice:</span>
              <span className="text-sm">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Client:</span>
              <span className="text-sm">{invoice.client_name}</span>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={isLoading || !clientEmail.trim()}>
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