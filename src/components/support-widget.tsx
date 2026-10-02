'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { HelpCircle, Paperclip, X, CheckCircle2, Loader2 } from 'lucide-react'
import { useUser } from '@/hooks/use-user'

type SupportType = 'question' | 'bug' | 'feature'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

interface SupportWidgetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function getInitialState() {
  return {
    type: 'question' as SupportType,
    subject: '',
    body: '',
    email: '',
    image: null as File | null,
    status: 'idle' as 'idle' | 'submitting' | 'success' | 'error',
    fileError: '',
  }
}

export function SupportWidget({ open, onOpenChange }: SupportWidgetProps) {
  const { user } = useUser()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [state, setState] = useState(getInitialState)

  // Reset state immediately when dialog closes
  useEffect(() => {
    if (!open) {
      setState(getInitialState())
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [open])

  const userEmail = user?.email || state.email

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setState(s => ({ ...s, fileError: 'Must be a JPEG, PNG, GIF, or WebP image', image: null }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setState(s => ({ ...s, fileError: 'Image must be under 5MB', image: null }))
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setState(s => ({ ...s, image: file, fileError: '' }))
  }

  const removeImage = () => {
    setState(s => ({ ...s, image: null, fileError: '' }))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (state.status === 'submitting') return

    setState(s => ({ ...s, status: 'submitting' }))

    try {
      const formData = new FormData()
      formData.append('type', state.type)
      formData.append('subject', state.subject.trim())
      formData.append('body', state.body.trim())
      if (userEmail) formData.append('email', userEmail)
      if (state.image) formData.append('image', state.image)

      const res = await fetch('/api/support', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Request failed')

      setState(s => ({ ...s, status: 'success' }))
    } catch {
      setState(s => ({ ...s, status: 'error' }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            Contact Support
          </DialogTitle>
          <DialogDescription>
            We typically respond within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {state.status === 'success' ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-primary" />
            <h3 className="font-semibold text-lg">Message sent!</h3>
            <p className="text-muted-foreground text-sm">
              {userEmail
                ? `We'll reply to ${userEmail}`
                : "We'll get back to you as soon as possible."}
            </p>
            <Button className="mt-2" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="support-type">Type</Label>
              <Select
                value={state.type}
                onValueChange={(v) => setState(s => ({ ...s, type: v as SupportType }))}
              >
                <SelectTrigger id="support-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="support-subject">Subject</Label>
              <Input
                id="support-subject"
                placeholder="Brief description of your issue"
                value={state.subject}
                onChange={(e) => setState(s => ({ ...s, subject: e.target.value }))}
                maxLength={200}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="support-body">Message</Label>
              <Textarea
                id="support-body"
                placeholder="Describe your issue in detail..."
                value={state.body}
                onChange={(e) => setState(s => ({ ...s, body: e.target.value }))}
                rows={4}
                maxLength={5000}
                required
              />
            </div>

            {!user && (
              <div className="space-y-1.5">
                <Label htmlFor="support-email">Your email</Label>
                <Input
                  id="support-email"
                  type="email"
                  placeholder="so we can reply to you"
                  value={state.email}
                  onChange={(e) => setState(s => ({ ...s, email: e.target.value }))}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Screenshot (optional)</Label>
              {state.image ? (
                <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1 text-muted-foreground">{state.image.name}</span>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4 mr-2" />
                  Attach screenshot
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleImageChange}
              />
              {state.fileError && (
                <p role="alert" className="text-sm text-destructive">{state.fileError}</p>
              )}
            </div>

            {state.status === 'error' && (
              <p role="alert" className="text-sm text-destructive">
                Something went wrong. Please try again.
              </p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={state.status === 'submitting' || !state.subject.trim() || !state.body.trim()}
              >
                {state.status === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send message'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
