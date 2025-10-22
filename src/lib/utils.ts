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
