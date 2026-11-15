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
import { Skeleton } from '@/components/ui/skeleton'
import { ConfirmDialog } from '@/components/confirm-dialog'

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
  const [confirming, setConfirming] = useState<'rotate' | 'revoke' | null>(null)

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
    if (!invoiceId) return false
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
      return true
    } catch (err) {
      console.error(err)
      toast.error(
        label === 'revoke'
          ? 'Could not revoke the link. It is still live. Please try again.'
          : 'Could not update the share link. Please try again.'
      )
      return false
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
      toast.success('Link copied', { description: 'Paste it into an email or message to your client.' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy the link. Select it and copy it manually.')
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
          <div className="space-y-4" role="status" aria-label="Loading share link">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="size-9" />
                <Skeleton className="size-9" />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <Skeleton className="size-40" />
            </div>
          </div>
        ) : !isLive ? (
          <div className="page-enter py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Sharing is currently disabled for this invoice. Enable it to generate a public link.
            </p>
            <Button onClick={() => callShareApi('POST', 'enable')} disabled={busy !== null}>
              {busy === 'enable' && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Enable share link
            </Button>
          </div>
        ) : (
          <div className="page-enter space-y-4">
            <div className="space-y-2">
              <Label htmlFor="share-url">Public link</Label>
              <div className="flex gap-2">
                <Input
                  id="share-url"
                  value={url}
                  readOnly
                  onFocus={(e) => e.currentTarget.select()}
                  aria-describedby="share-url-help"
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  aria-label={copied ? 'Link copied' : 'Copy link'}
                  title="Copy link"
                  className="max-sm:size-11"
                >
                  {copied ? (
                    <Check key="copied" aria-hidden="true" className="motion-pop w-4 h-4 text-primary" />
                  ) : (
                    <Copy key="copy" aria-hidden="true" className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  asChild
                  aria-label="Share via SMS"
                  title="Share via SMS"
                  className="max-sm:size-11"
                >
                  {/* sms:?body= opens the OS SMS composer with the URL prefilled.
                      Works on iOS Safari/Chrome out of the box; on Android the
                      query-string is best-effort but the deep link itself still
                      opens the messaging app. */}
                  <a
                    href={`sms:?body=${encodeURIComponent(
                      `${invoiceNumber ? `Invoice ${invoiceNumber}` : 'Your invoice'}. View and pay here: ${url}`,
                    )}`}
                  >
                    <MessageSquare aria-hidden="true" className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <p id="share-url-help" className="text-xs text-muted-foreground">
                Anyone with this link can open this invoice. Revoke it here at any time.
              </p>
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
                onClick={() => setConfirming('rotate')}
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
                onClick={() => setConfirming('revoke')}
                disabled={busy !== null}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
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

      <ConfirmDialog
        open={confirming !== null}
        onOpenChange={(next) => !next && setConfirming(null)}
        title={confirming === 'revoke' ? 'Turn off this share link?' : 'Replace this share link?'}
        description={
          confirming === 'revoke'
            ? 'Your client will no longer be able to open the current link. You can turn sharing back on at any time.'
            : 'The current link stops working right away. Anyone you already sent it to will need the new one.'
        }
        confirmLabel={confirming === 'revoke' ? 'Revoke link' : 'Make a new link'}
        pendingLabel={confirming === 'revoke' ? 'Revoking...' : 'Generating...'}
        destructive={confirming === 'revoke'}
        onConfirm={() =>
          confirming === 'revoke'
            ? callShareApi('DELETE', 'revoke')
            : callShareApi('POST', 'rotate', { rotate: true })
        }
      />
    </Dialog>
  )
}
