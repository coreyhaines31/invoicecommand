'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { uploadLogo, deleteLogo } from '@/lib/storage'
import { useUser } from '@/hooks/use-user'
import { useInvoiceStore } from '@/stores/invoice-store'

interface LogoUploadProps {
  currentLogo?: string
  onLogoChange?: (logoUrl: string | null) => void
  disabled?: boolean
}

export function LogoUpload({ currentLogo, onLogoChange, disabled = false }: LogoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(currentLogo || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { user, isAuthenticated } = useUser()
  const { updateSender } = useInvoiceStore()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAuthenticated || !user) {
      setError('Please sign in to upload a logo')
      return
    }

    setIsUploading(true)
    setError('')

    try {
      // Create preview
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      // Upload to storage
      const result = await uploadLogo(file, user.id)

      if (result.success && result.url) {
        // Update invoice store
        updateSender('senderLogo', result.url)

        // Call parent callback
        onLogoChange?.(result.url)

        // Clean up preview URL
        URL.revokeObjectURL(objectUrl)
        setPreview(result.url)
      } else {
        setError(result.error || 'Upload failed')
        setPreview(currentLogo || '')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError('Upload failed')
      setPreview(currentLogo || '')
    } finally {
      setIsUploading(false)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = async () => {
    if (!currentLogo) return

    try {
      // Delete from storage
      await deleteLogo(currentLogo)

      // Update invoice store
      updateSender('senderLogo', '')

      // Call parent callback
      onLogoChange?.(null)

      setPreview('')
    } catch (error) {
      console.error('Delete error:', error)
      setError('Failed to remove logo')
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  if (!isAuthenticated) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              Sign in to upload your company logo
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Label>Company Logo</Label>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-dashed">
        <CardContent className="p-6">
          {preview ? (
            <div className="space-y-4">
              {/* Logo Preview */}
              <div className="relative">
                <img
                  src={preview}
                  alt="Company logo"
                  className="mx-auto max-h-24 max-w-full object-contain"
                />
                {!isUploading && (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Replace Button */}
              <div className="text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={triggerFileSelect}
                  disabled={disabled || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Replace Logo'
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Add your company logo to invoices
                </p>
                <Button
                  variant="outline"
                  onClick={triggerFileSelect}
                  disabled={disabled || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG up to 2MB
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
    </div>
  )
}