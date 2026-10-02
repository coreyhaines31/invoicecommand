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
import { useUpgradeTriggers } from '@/hooks/use-upgrade-triggers'
import { useUserTier } from '@/hooks/use-user-tier'

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
  const { triggerUpgrade } = useUpgradeTriggers()
  const { isAnonymous } = useUserTier()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!isAuthenticated || !user) {
      // Trigger upgrade paywall for anonymous users
      triggerUpgrade('logo-upload')
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
      <Card className="border-dashed cursor-pointer hover:border-primary/50 transition-colors h-full" onClick={() => triggerUpgrade('logo-upload')}>
        <CardContent className="p-4 h-full flex flex-col justify-center">
          <div className="text-center px-2">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground mb-3">
              Upload logo
            </p>
            <Button variant="outline" size="sm" className="max-w-[120px]">
              <Upload className="mr-1 h-3 w-3" />
              Choose
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="border-dashed h-full">
        <CardContent className="p-4 h-full flex items-center justify-center">
          {preview ? (
            <div className="space-y-3 text-center w-full">
              {/* Logo Preview */}
              <div className="relative flex justify-center">
                <img
                  src={preview}
                  alt="Company logo"
                  className="max-h-20 max-w-full object-contain"
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
                  'Replace'
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center w-full px-2">
              <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Upload logo
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={triggerFileSelect}
                disabled={disabled || isUploading}
                className="mb-2 w-full max-w-[120px]"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-1 h-3 w-3" />
                    Choose
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 2MB
              </p>
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
    </>
  )
}