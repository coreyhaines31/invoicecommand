'use client'

import { useEffect } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { authClient } from '@/lib/auth-client'

export function useInvoiceInitialization() {
  const { loadFromStorage, resetInvoice, initializeInvoiceNumber, invoiceNumber } = useInvoiceStore()

  useEffect(() => {
    let mounted = true

    const initialize = async () => {
      loadFromStorage()

      // "Create New Invoice" links to /?new=1. Start clean only when the draft belongs to a
      // saved invoice; a never-saved draft is unsaved work and is kept.
      const url = new URL(window.location.href)
      if (url.searchParams.get('new') === '1') {
        if (useInvoiceStore.getState().id) {
          resetInvoice()
        }
        url.searchParams.delete('new')
        window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
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
