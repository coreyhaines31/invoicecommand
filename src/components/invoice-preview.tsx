'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { InvoicePreviewModern } from './invoice-preview-modern'
import { InvoicePreviewClassic } from './invoice-preview-classic'
import { InvoicePreviewMinimal } from './invoice-preview-minimal'

export function InvoicePreview() {
  const { style } = useInvoiceStore()

  let preview
  switch (style) {
    case 'classic':
      preview = <InvoicePreviewClassic />
      break
    case 'minimal':
      preview = <InvoicePreviewMinimal />
      break
    case 'modern':
    default:
      preview = <InvoicePreviewModern />
  }

  // Keyed on style so switching styles crossfades once; typing never remounts it.
  return (
    <div key={style ?? 'modern'} className="page-enter">
      {preview}
    </div>
  )
}