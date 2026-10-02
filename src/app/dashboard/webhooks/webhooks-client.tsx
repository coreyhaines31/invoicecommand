'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Navigation } from '@/components/navigation'
import {
  Webhook,
  Plus,
  Copy,
  Check,
  Trash2,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
  Pencil,
  ExternalLink,
} from 'lucide-react'
import { toast } from 'sonner'

type WebhookData = {
  id: string
  url: string
  events: unknown
  isActive: boolean | null
  description: string | null
  createdAt: Date | null
}

interface WebhooksClientProps {
  webhooks: WebhookData[]
}

const AVAILABLE_EVENTS = [
  { id: 'invoice.created', label: 'Invoice Created', description: 'When a new invoice is created' },
  { id: 'invoice.updated', label: 'Invoice Updated', description: 'When an invoice is modified' },
  { id: 'invoice.sent', label: 'Invoice Sent', description: 'When an invoice is emailed to client' },
  { id: 'invoice.paid', label: 'Invoice Paid', description: 'When an invoice is marked as paid' },
  { id: 'invoice.overdue', label: 'Invoice Overdue', description: 'When an invoice becomes overdue' },
  { id: 'estimate.signed', label: 'Estimate Signed', description: 'When an estimate is e-signed' },
]

export function WebhooksClient({ webhooks: initialWebhooks }: WebhooksClientProps) {
  const [webhooks, setWebhooks] = useState<WebhookData[]>(initialWebhooks)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newWebhookUrl, setNewWebhookUrl] = useState('')
  const [newWebhookDescription, setNewWebhookDescription] = useState('')
  const [selectedEvents, setSelectedEvents] = useState<string[]>(['invoice.created', 'invoice.paid'])
  const [createdSecret, setCreatedSecret] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showSecret, setShowSecret] = useState(false)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  const handleCreateWebhook = async () => {
    if (!newWebhookUrl.trim()) {
      toast.error('Please enter a webhook URL')
      return
    }

    try {
      new URL(newWebhookUrl)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    if (selectedEvents.length === 0) {
      toast.error('Please select at least one event')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/v1/webhooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: newWebhookUrl.trim(),
          events: selectedEvents,
          description: newWebhookDescription.trim() || undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create webhook')
      }

      const { data } = await response.json()
      setCreatedSecret(data.secret)
      setWebhooks([...webhooks, {
        id: data.id,
        url: data.url,
        events: data.events,
        isActive: true,
        description: data.description,
        createdAt: new Date(),
      }])
      toast.success('Webhook created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create webhook')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteWebhook = async (webhookId: string) => {
    setDeletingId(webhookId)
    try {
      const response = await fetch(`/api/v1/webhooks/${webhookId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete webhook')
      }

      setWebhooks(webhooks.filter(wh => wh.id !== webhookId))
      toast.success('Webhook deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete webhook')
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleActive = async (webhookId: string, isActive: boolean) => {
    setTogglingId(webhookId)
    try {
      const response = await fetch(`/api/v1/webhooks/${webhookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update webhook')
      }

      setWebhooks(webhooks.map(wh =>
        wh.id === webhookId ? { ...wh, isActive } : wh
      ))
      toast.success(isActive ? 'Webhook enabled' : 'Webhook disabled')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update webhook')
    } finally {
      setTogglingId(null)
    }
  }

  const handleCopySecret = async () => {
    if (!createdSecret) return
    await navigator.clipboard.writeText(createdSecret)
    setCopied(true)
    toast.success('Webhook secret copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setNewWebhookUrl('')
    setNewWebhookDescription('')
    setSelectedEvents(['invoice.created', 'invoice.paid'])
    setCreatedSecret(null)
    setShowSecret(false)
  }

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId)
        ? prev.filter(e => e !== eventId)
        : [...prev, eventId]
    )
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Unknown'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getEventLabel = (eventId: string) => {
    const found = AVAILABLE_EVENTS.find(e => e.id === eventId)
    return found?.label || eventId
  }

  const getEvents = (events: unknown): string[] => {
    if (Array.isArray(events)) return events as string[]
    return []
  }

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto p-6 max-w-5xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Webhooks</h1>
              <p className="text-muted-foreground">
                Receive real-time notifications when events happen
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Webhook
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                {!createdSecret ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Add Webhook Endpoint</DialogTitle>
                      <DialogDescription>
                        We&apos;ll send HTTP POST requests to this URL when events occur.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="url">Endpoint URL</Label>
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://your-server.com/webhooks/invoice-command"
                          value={newWebhookUrl}
                          onChange={(e) => setNewWebhookUrl(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Input
                          id="description"
                          placeholder="e.g., Production server, Zapier integration"
                          value={newWebhookDescription}
                          onChange={(e) => setNewWebhookDescription(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Events to receive</Label>
                        {AVAILABLE_EVENTS.map((event) => (
                          <div key={event.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={event.id}
                              checked={selectedEvents.includes(event.id)}
                              onCheckedChange={() => toggleEvent(event.id)}
                            />
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor={event.id}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {event.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {event.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={handleCloseCreateDialog}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateWebhook} disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Webhook'
                        )}
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>Webhook Created</DialogTitle>
                      <DialogDescription>
                        Copy your signing secret now. You won&apos;t be able to see it again!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-900">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Save this secret securely. Use it to verify webhook signatures.
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label>Signing Secret</Label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 relative">
                            <Input
                              readOnly
                              value={showSecret ? createdSecret : '•'.repeat(40)}
                              className="font-mono text-sm pr-10"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowSecret(!showSecret)}
                            >
                              {showSecret ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button onClick={handleCopySecret} variant="outline" size="icon">
                            {copied ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleCloseCreateDialog}>Done</Button>
                    </DialogFooter>
                  </>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Webhook className="w-5 h-5" />
                How Webhooks Work
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                When an event occurs, we&apos;ll send an HTTP POST request to your endpoint with a JSON payload.
                Each request includes an <code className="bg-muted px-1 py-0.5 rounded">X-Webhook-Signature</code> header
                for verification.
              </p>
              <p>
                Verify signatures using HMAC-SHA256 with your signing secret. See the{' '}
                <a href="/api/v1/openapi.json" className="text-primary underline" target="_blank">
                  API documentation
                </a>{' '}
                for details.
              </p>
            </CardContent>
          </Card>

          {/* Webhooks Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Webhooks</CardTitle>
              <CardDescription>
                {webhooks.length === 0
                  ? 'You haven\'t configured any webhooks yet.'
                  : `You have ${webhooks.length} webhook${webhooks.length === 1 ? '' : 's'} configured.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {webhooks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Webhook className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No webhooks configured. Add one to receive real-time notifications.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Endpoint</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.map((webhook) => (
                      <TableRow key={webhook.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <code className="text-sm" title={webhook.url}>
                                {truncateUrl(webhook.url)}
                              </code>
                              <a
                                href={webhook.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            {webhook.description && (
                              <p className="text-xs text-muted-foreground">
                                {webhook.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {getEvents(webhook.events).slice(0, 2).map((event) => (
                              <Badge key={event} variant="secondary" className="text-xs">
                                {getEventLabel(event)}
                              </Badge>
                            ))}
                            {getEvents(webhook.events).length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{getEvents(webhook.events).length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={webhook.isActive ?? false}
                              onCheckedChange={(checked) => handleToggleActive(webhook.id, checked)}
                              disabled={togglingId === webhook.id}
                            />
                            <span className="text-sm text-muted-foreground">
                              {webhook.isActive ? 'Active' : 'Disabled'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(webhook.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteWebhook(webhook.id)}
                            disabled={deletingId === webhook.id}
                          >
                            {deletingId === webhook.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
