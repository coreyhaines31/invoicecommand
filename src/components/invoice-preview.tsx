'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { InvoicePreviewModern } from './invoice-preview-modern'
import { InvoicePreviewClassic } from './invoice-preview-classic'
import { InvoicePreviewMinimal } from './invoice-preview-minimal'

export function InvoicePreview() {
  const { style } = useInvoiceStore()

  switch (style) {
    case 'classic':
      return <InvoicePreviewClassic />
    case 'minimal':
      return <InvoicePreviewMinimal />
    case 'modern':
    default:
      return <InvoicePreviewModern />
  }
}