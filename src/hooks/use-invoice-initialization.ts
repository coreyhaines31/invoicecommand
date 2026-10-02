'use client'

import { useEffect } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { authClient } from '@/lib/auth-client'

export function useInvoiceInitialization() {
  const { loadFromStorage, initializeInvoiceNumber, invoiceNumber } = useInvoiceStore()

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      loadFromStorage()

      await new Promise(resolve => setTimeout(resolve, 0))

      const currentNumber = useInvoiceStore.getState().invoiceNumber
      if (!currentNumber || currentNumber === '1001') {
        try {
          const session = await authClient.getSession()
          if (mounted) {
            await initializeInvoiceNumber(session?.data?.user?.id)
          }
        } catch {
          if (mounted) {
            await initializeInvoiceNumber()
          }
        }
      }
    }

    initialize()

    return () => { mounted = false }
  }, [])
}
