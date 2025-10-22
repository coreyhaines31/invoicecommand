'use server'

import { createClient } from '@supabase/supabase-js'

// Admin client with service role key for server operations
function createServiceRoleClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * Auto-confirms a user for development purposes
 * In production, this should not be used - users should confirm via email
 */
export async function autoConfirmUser(userId: string) {
  // Only auto-confirm in development
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Auto-confirm only available in development')
  }

  const supabase = createServiceRoleClient()

  try {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true
    })

    if (error) {
      console.error('Error auto-confirming user:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Failed to auto-confirm user:', error)
    return false
  }
}