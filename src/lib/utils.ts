import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateInvoiceNumber(userId?: string): Promise<string> {
  if (!userId) {
    // Anonymous users get simple sequential numbers starting from 1001
    const lastNumber = getLastAnonymousInvoiceNumber()
    const nextNumber = lastNumber + 1
    setLastAnonymousInvoiceNumber(nextNumber)
    return nextNumber.toString()
  }

  // For authenticated users, get the next number from their saved invoices
  try {
    const { createBrowserSupabaseClient } = await import('@/lib/supabase-client')
    const supabase = createBrowserSupabaseClient()

    // Get the user's highest invoice number
    const { data: invoices } = await supabase
      .from('invoices')
      .select('invoice_number')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (invoices && invoices.length > 0) {
      const lastInvoiceNumber = invoices[0].invoice_number
      // Extract number from formats like "1001", "INV-1001", etc.
      const numberMatch = lastInvoiceNumber.match(/(\d+)$/)
      if (numberMatch) {
        const lastNumber = parseInt(numberMatch[1])
        return (lastNumber + 1).toString()
      }
    }

    // First invoice for this user, start at 1001
    return "1001"
  } catch (error) {
    console.error('Failed to generate invoice number:', error)
    // Fallback to timestamp-based number
    return `1001`
  }
}

function getLastAnonymousInvoiceNumber(): number {
  if (typeof window === 'undefined') return 1000

  const stored = localStorage.getItem('invoicecommand-last-number')
  if (stored) {
    const num = parseInt(stored)
    return isNaN(num) ? 1000 : num
  }
  return 1000
}

function setLastAnonymousInvoiceNumber(num: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('invoicecommand-last-number', num.toString())
}

// Voice usage tracking
const ANONYMOUS_VOICE_LIMIT = 3 // Anonymous users get 3 voice commands per month
const FREE_USER_VOICE_LIMIT = 10 // Free users get 10 voice commands per month

export async function getVoiceUsageThisMonth(userId?: string): Promise<{ used: number; limit: number }> {
  if (!userId) {
    // Anonymous users
    return {
      used: getAnonymousVoiceUsage(),
      limit: ANONYMOUS_VOICE_LIMIT
    }
  }

  // For authenticated users, fetch from database
  try {
    const response = await fetch('/api/voice-usage')
    if (response.ok) {
      const data = await response.json()
      return {
        used: data.used,
        limit: data.limit
      }
    }
  } catch (error) {
    console.error('Failed to fetch voice usage:', error)
  }

  // Fallback on error
  return {
    used: 0,
    limit: FREE_USER_VOICE_LIMIT
  }
}

export async function incrementVoiceUsage(userId?: string): Promise<boolean> {
  if (!userId) {
    // Anonymous users - track in localStorage
    const currentUsage = getAnonymousVoiceUsage()
    if (currentUsage >= ANONYMOUS_VOICE_LIMIT) {
      return false // Usage limit exceeded
    }
    setAnonymousVoiceUsage(currentUsage + 1)
    return true
  }

  // For authenticated users, increment via database
  try {
    const response = await fetch('/api/voice-usage', {
      method: 'POST'
    })

    if (response.ok) {
      return true
    } else if (response.status === 429) {
      // Usage limit exceeded
      return false
    }
  } catch (error) {
    console.error('Failed to increment voice usage:', error)
  }

  return false
}

export async function canUseVoiceCommand(userId?: string): Promise<boolean> {
  const usage = await getVoiceUsageThisMonth(userId)
  return usage.used < usage.limit
}

function getAnonymousVoiceUsage(): number {
  if (typeof window === 'undefined') return 0

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const storageKey = `invoicecommand-voice-usage-${currentMonth}`

  const stored = localStorage.getItem(storageKey)
  if (stored) {
    const num = parseInt(stored)
    return isNaN(num) ? 0 : num
  }
  return 0
}

function setAnonymousVoiceUsage(count: number): void {
  if (typeof window === 'undefined') return

  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const storageKey = `invoicecommand-voice-usage-${currentMonth}`

  localStorage.setItem(storageKey, count.toString())
}
