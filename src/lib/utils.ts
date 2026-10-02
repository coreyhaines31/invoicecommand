import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateInvoiceNumber(userId?: string, documentType: 'invoice' | 'estimate' = 'invoice'): Promise<string> {
  const prefix = documentType === 'estimate' ? 'EST-' : 'INV-'

  if (!userId) {
    // Anonymous users get simple sequential numbers starting from 1001
    const lastNumber = getLastAnonymousDocumentNumber(documentType)
    const nextNumber = lastNumber + 1
    setLastAnonymousDocumentNumber(documentType, nextNumber)
    return `${prefix}${String(nextNumber).padStart(4, '0')}`
  }

  // For authenticated users, get the next number via API
  try {
    const res = await fetch(`/api/invoices?documentType=${documentType}&latestNumber=true`)
    if (res.ok) {
      const data = await res.json()
      if (data.latestNumber) {
        const numberMatch = data.latestNumber.match(/(\d+)$/)
        if (numberMatch) {
          const lastNumber = parseInt(numberMatch[1])
          return `${prefix}${String(lastNumber + 1).padStart(4, '0')}`
        }
      }
    }
    return `${prefix}1001`
  } catch {
    return `${prefix}1001`
  }
}

function getLastAnonymousDocumentNumber(documentType: 'invoice' | 'estimate'): number {
  if (typeof window === 'undefined') return 1000

  const storageKey = documentType === 'estimate' ? 'invoicecommand-last-estimate-number' : 'invoicecommand-last-invoice-number'
  const stored = localStorage.getItem(storageKey)
  if (stored) {
    const num = parseInt(stored)
    return isNaN(num) ? 1000 : num
  }
  return 1000
}

function setLastAnonymousDocumentNumber(documentType: 'invoice' | 'estimate', num: number): void {
  if (typeof window === 'undefined') return
  const storageKey = documentType === 'estimate' ? 'invoicecommand-last-estimate-number' : 'invoicecommand-last-invoice-number'
  localStorage.setItem(storageKey, num.toString())
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

// Date validation utilities
export function isValidExpirationDate(dateString: string): boolean {
  if (!dateString) return false

  // Parse the date string in local timezone to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number)
  const expirationDate = new Date(year, month - 1, day)
  const today = new Date()

  // Reset time to midnight for accurate date comparison
  today.setHours(0, 0, 0, 0)
  expirationDate.setHours(0, 0, 0, 0)

  // Check if date is valid
  if (isNaN(expirationDate.getTime())) {
    return false
  }

  // Expiration date must be today or in the future
  return expirationDate >= today
}

export function validateExpirationDate(dateString: string): { valid: boolean; error?: string } {
  if (!dateString) {
    return { valid: false, error: 'Expiration date is required for estimates' }
  }

  // Parse the date string in local timezone to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number)
  if (!year || !month || !day) {
    return { valid: false, error: 'Invalid date format' }
  }

  const expirationDate = new Date(year, month - 1, day)

  // Check if date is valid
  if (isNaN(expirationDate.getTime())) {
    return { valid: false, error: 'Invalid date format' }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  expirationDate.setHours(0, 0, 0, 0)

  // Expiration date must be today or in the future
  if (expirationDate < today) {
    return { valid: false, error: 'Expiration date must be today or in the future' }
  }

  // Optional: Check if date is too far in the future (e.g., more than 1 year)
  const oneYearFromNow = new Date(today)
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  if (expirationDate > oneYearFromNow) {
    return { valid: false, error: 'Expiration date should be within one year' }
  }

  return { valid: true }
}

export function getDefaultExpirationDate(daysFromNow: number = 30): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}
