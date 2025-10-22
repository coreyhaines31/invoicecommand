import { createBrowserSupabaseClient } from './supabase-client'

export interface LogoUploadResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload a logo file to Supabase Storage
 */
export async function uploadLogo(file: File, userId: string): Promise<LogoUploadResult> {
  const supabase = createBrowserSupabaseClient()

  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'File must be an image'
      }
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 2MB'
      }
    }

    // Create unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    // Upload file
    const { data, error } = await supabase.storage
      .from('user-uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Storage upload error:', error)
      return {
        success: false,
        error: 'Failed to upload file'
      }
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(filePath)

    return {
      success: true,
      url: publicUrl
    }
  } catch (error) {
    console.error('Upload error:', error)
    return {
      success: false,
      error: 'Upload failed'
    }
  }
}

/**
 * Delete a logo file from Supabase Storage
 */
export async function deleteLogo(logoUrl: string): Promise<boolean> {
  const supabase = createBrowserSupabaseClient()

  try {
    // Extract file path from URL
    const url = new URL(logoUrl)
    const filePath = url.pathname.split('/user-uploads/')[1]

    if (!filePath) {
      return false
    }

    const { error } = await supabase.storage
      .from('user-uploads')
      .remove([filePath])

    return !error
  } catch (error) {
    console.error('Delete error:', error)
    return false
  }
}