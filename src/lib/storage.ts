export interface LogoUploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a logo file via the server-side upload API (uses Vercel Blob or local storage)
 */
export async function uploadLogo(file: File, _userId: string): Promise<LogoUploadResult> {
  try {
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' }
    }

    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 2MB' }
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload/logo', { method: 'POST', body: formData })
    if (!res.ok) return { success: false, error: 'Failed to upload file' }

    const data = await res.json()
    return { success: true, url: data.url }
  } catch (error) {
    console.error('Upload error:', error)
    return { success: false, error: 'Upload failed' }
  }
}

export async function deleteLogo(_logoUrl: string): Promise<boolean> {
  // Deletion handled server-side when needed
  return true
}
