'use client'

import { useEffect } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export function useInvoiceInitialization() {
  const { loadFromStorage, initializeInvoiceNumber, invoiceNumber } = useInvoiceStore()

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      // First, load any existing draft from localStorage
      loadFromStorage()

      // Wait a tick for the state to update
      await new Promise(resolve => setTimeout(resolve, 0))

      // Only generate a new invoice number if:
      // 1. No existing draft, OR
      // 2. Draft exists but has the default number "1001"
      const currentNumber = useInvoiceStore.getState().invoiceNumber
      if (!currentNumber || currentNumber === "1001") {
        try {
          const supabase = createBrowserSupabaseClient()
          const { data: { session } } = await supabase.auth.getSession()

          if (mounted) {
            await initializeInvoiceNumber(session?.user?.id)
          }
        } catch (error) {
          console.error('Failed to initialize invoice number:', error)
          if (mounted) {
            // Fallback for anonymous users
            await initializeInvoiceNumber()
          }
        }
      }
    }

    initialize()

    return () => {
      mounted = false
    }
  }, []) // Empty dependency array - only run once on mount
}