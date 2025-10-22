'use client'

import { useEffect } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export function useInvoiceInitialization() {
  const initializeInvoiceNumber = useInvoiceStore(state => state.initializeInvoiceNumber)

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
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

    initialize()

    return () => {
      mounted = false
    }
  }, [initializeInvoiceNumber])
}