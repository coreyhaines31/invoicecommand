'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
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
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react'
import { toast } from 'sonner'

type ApiKey = {
  id: string
  name: string
  keyPrefix: string
  scopes: string[]
  rateLimit: number
  expiresAt: Date | null
  lastUsedAt?: Date | null
  createdAt?: Date | null
}

interface ApiKeysClientProps {
  apiKeys: ApiKey[]
}

const AVAILABLE_SCOPES = [
  { id: 'invoices:read', label: 'Read Invoices', description: 'View invoices and estimates' },
  { id: 'invoices:write', label: 'Write Invoices', description: 'Create, update, delete invoices' },
  { id: 'webhooks:read', label: 'Read Webhooks', description: 'View webhook endpoints' },
  { id: 'webhooks:write', label: 'Write Webhooks', description: 'Manage webhook endpoints' },
]

export function ApiKeysClient({ apiKeys: initialApiKeys }: ApiKeysClientProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['invoices:read', 'invoices:write'])
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key')
      return
    }

    if (selectedScopes.length === 0) {
      toast.error('Please select at least one scope')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/v1/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newKeyName.trim(),
          scopes: selectedScopes,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create API key')
      }

      const { data } = await response.json()
      setCreatedKey(data.key)
      setApiKeys([...apiKeys, {
        id: data.id,
        name: data.name,
        keyPrefix: data.keyPrefix,
        scopes: data.scopes,
        rateLimit: data.rateLimit,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
      }])
      toast.success('API key created successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create API key')
    } finally {
      setIsCreating(false)
    }
  }

  const handleRevokeKey = async (keyId: string) => {
    setRevokingId(keyId)
    try {
      const response = await fetch(`/api/v1/api-keys/${keyId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to revoke API key')
      }

      setApiKeys(apiKeys.filter(key => key.id !== keyId))
      toast.success('API key revoked successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke API key')
    } finally {
      setRevokingId(null)
    }
  }

  const handleCopyKey = async () => {
    if (!createdKey) return
    await navigator.clipboard.writeText(createdKey)
    setCopied(true)
    toast.success('API key copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCloseCreateDialog = () => {
    setIsCreateDialogOpen(false)
    setNewKeyName('')
    setSelectedScopes(['invoices:read', 'invoices:write'])
    setCreatedKey(null)
    setShowKey(false)
  }

  const toggleScope = (scopeId: string) => {
    setSelectedScopes(prev =>
      prev.includes(scopeId)
        ? prev.filter(s => s !== scopeId)
        : [...prev, scopeId]
    )
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'Never'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const getScopeLabel = (scope: string) => {
    const found = AVAILABLE_SCOPES.find(s => s.id === scope)
    return found?.label || scope
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto p-6 max-w-5xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">API Keys</h1>
              <p className="text-muted-foreground">
                Manage your API keys for programmatic access
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create API Key
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                {!createdKey ? (
                  <>
                    <DialogHeader>
                      <DialogTitle>Create API Key</DialogTitle>
                      <DialogDescription>
                        Create a new API key to access the Invoice Command API.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="e.g., Production, Development, My App"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Permissions</Label>
                        {AVAILABLE_SCOPES.map((scope) => (
                          <div key={scope.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={scope.id}
                              checked={selectedScopes.includes(scope.id)}
                              onCheckedChange={() => toggleScope(scope.id)}
                            />
                            <div className="grid gap-1 leading-none">
                              <label
                                htmlFor={scope.id}
                                className="text-sm font-medium cursor-pointer"
                              >
                                {scope.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {scope.description}
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
                      <Button onClick={handleCreateKey} disabled={isCreating}>
                        {isCreating ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          'Create Key'
                        )}
                      </Button>
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <DialogHeader>
                      <DialogTitle>API Key Created</DialogTitle>
                      <DialogDescription>
                        Copy your API key now. You won&apos;t be able to see it again!
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-900">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Make sure to copy your API key now. You won&apos;t be able to see it again!
                        </AlertDescription>
                      </Alert>
                      <div className="space-y-2">
                        <Label>Your API Key</Label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 relative">
                            <Input
                              readOnly
                              value={showKey ? createdKey : '•'.repeat(40)}
                              className="font-mono text-sm pr-10"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowKey(!showKey)}
                            >
                              {showKey ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                          <Button onClick={handleCopyKey} variant="outline" size="icon">
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
                <Key className="w-5 h-5" />
                Using Your API Keys
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                API keys allow you to access the Invoice Command API programmatically.
                Include your key in the <code className="bg-muted px-1 py-0.5 rounded">Authorization</code> header:
              </p>
              <pre className="bg-muted p-3 rounded-lg overflow-x-auto">
                <code>Authorization: Bearer sk_live_xxxxx...</code>
              </pre>
              <p>
                View the{' '}
                <a href="/api/v1/openapi.json" className="text-primary underline" target="_blank">
                  API documentation
                </a>{' '}
                for available endpoints.
              </p>
            </CardContent>
          </Card>

          {/* API Keys Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                {apiKeys.length === 0
                  ? 'You haven\'t created any API keys yet.'
                  : `You have ${apiKeys.length} API key${apiKeys.length === 1 ? '' : 's'}.`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No API keys yet. Create one to get started.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Key</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Last Used</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell className="font-medium">{key.name}</TableCell>
                        <TableCell>
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {key.keyPrefix}...
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {key.scopes.slice(0, 2).map((scope) => (
                              <Badge key={scope} variant="secondary" className="text-xs">
                                {getScopeLabel(scope)}
                              </Badge>
                            ))}
                            {key.scopes.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{key.scopes.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(key.createdAt)}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {formatDate(key.lastUsedAt)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleRevokeKey(key.id)}
                            disabled={revokingId === key.id}
                          >
                            {revokingId === key.id ? (
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
