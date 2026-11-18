'use client'

import { useEffect } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { authClient } from '@/lib/auth-client'

export function useInvoiceInitialization() {
  const { loadFromStorage, resetInvoice, initializeInvoiceNumber, invoiceNumber } = useInvoiceStore()

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      // "Create New Invoice" links to /?new=1 so it starts clean instead of reopening the last saved invoice
      const url = new URL(window.location.href)
      if (url.searchParams.get('new') === '1') {
        resetInvoice()
        url.searchParams.delete('new')
        window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
      } else {
        loadFromStorage()
      }

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
