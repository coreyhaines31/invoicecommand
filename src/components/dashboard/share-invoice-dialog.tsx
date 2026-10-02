'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Copy, Loader2, RefreshCcw, Trash2, Check, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { ShareQR } from '@/components/invoice/share-qr'

interface ShareInfo {
  shareToken: string | null
  shareEnabled: boolean
  shareExpiresAt: string | null
  shareViewCount: number
  shareLastViewedAt: string | null
}

interface ShareInvoiceDialogProps {
  invoiceId: string | null
  invoiceNumber?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function buildClientShareUrl(token: string): string {
  if (typeof window === 'undefined') return `/i/${token}`
  return `${window.location.origin}/i/${token}`
}

export function ShareInvoiceDialog({ invoiceId, invoiceNumber, open, onOpenChange }: ShareInvoiceDialogProps) {
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState<'enable' | 'rotate' | 'revoke' | null>(null)
  const [share, setShare] = useState<ShareInfo | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open || !invoiceId) return
    setShare(null)
    setLoading(true)
    fetch(`/api/invoices/${invoiceId}/share`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load share state')
        return res.json()
      })
      .then((data: ShareInfo) => setShare(data))
      .catch((err) => {
        console.error(err)
        toast.error('Could not load share link')
      })
      .finally(() => setLoading(false))
  }, [open, invoiceId])

  const callShareApi = async (
    method: 'POST' | 'DELETE',
    label: 'enable' | 'rotate' | 'revoke',
    body?: Record<string, unknown>,
  ) => {
    if (!invoiceId) return
    setBusy(label)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/share`, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      })
      if (!res.ok) throw new Error(`${method} failed`)
      if (method === 'DELETE') {
        setShare((prev) => (prev ? { ...prev, shareEnabled: false } : prev))
        toast.success('Share link revoked')
      } else {
        const data: ShareInfo = await res.json()
        setShare(data)
        toast.success(label === 'rotate' ? 'New share link generated' : 'Share link enabled')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong')
    } finally {
      setBusy(null)
    }
  }

  const handleCopy = async () => {
    if (!share?.shareToken) return
    const url = buildClientShareUrl(share.shareToken)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('Could not copy to clipboard')
    }
  }

  const url = share?.shareToken ? buildClientShareUrl(share.shareToken) : ''
  const isLive = !!share?.shareEnabled && !!share.shareToken

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share invoice{invoiceNumber ? ` ${invoiceNumber}` : ''}</DialogTitle>
          <DialogDescription>
            Send your client a link to view and pay this invoice online, or print the QR for in-person payment.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Loading…
          </div>
        ) : !isLive ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Sharing is currently disabled for this invoice. Enable it to generate a public link.
            </p>
            <Button onClick={() => callShareApi('POST', 'enable')} disabled={busy !== null}>
              {busy === 'enable' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enable share link
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-url">Public link</Label>
              <div className="flex gap-2">
                <Input id="share-url" value={url} readOnly className="font-mono text-xs" />
                <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy link">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  aria-label="Share via SMS"
                  title="Share via SMS"
                >
                  {/* sms:?body= opens the OS SMS composer with the URL prefilled.
                      Works on iOS Safari/Chrome out of the box; on Android the
                      query-string is best-effort but the deep link itself still
                      opens the messaging app. */}
                  <a
                    href={`sms:?body=${encodeURIComponent(
                      `Invoice from ${invoiceNumber ? `${invoiceNumber} ` : ''}— view and pay here: ${url}`,
                    )}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <ShareQR url={url} filename={`invoice-${invoiceNumber || share?.shareToken}-qr.png`} />
            </div>

            <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
              <p>
                Views: <span className="font-medium text-foreground">{share?.shareViewCount ?? 0}</span>
                {share?.shareLastViewedAt && (
                  <> · last viewed {new Date(share.shareLastViewedAt).toLocaleString()}</>
                )}
              </p>
              {share?.shareExpiresAt && (
                <p>Expires {new Date(share.shareExpiresAt).toLocaleString()}</p>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between gap-2">
          {isLive && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => callShareApi('POST', 'rotate', { rotate: true })}
                disabled={busy !== null}
              >
                {busy === 'rotate' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCcw className="w-4 h-4 mr-2" />
                )}
                New link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => callShareApi('DELETE', 'revoke')}
                disabled={busy !== null}
                className="text-red-600 hover:text-red-700"
              >
                {busy === 'revoke' ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Revoke
              </Button>
            </div>
          )}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
