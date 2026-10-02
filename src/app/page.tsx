'use client'

import { useEffect } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { InvoiceBuilder } from '@/components/invoice-builder'

export default function Home() {
  const loadFromStorage = useInvoiceStore((state) => state.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  return (
    <div className="min-h-screen bg-background">
      <InvoiceBuilder />
    </div>
  )
}
