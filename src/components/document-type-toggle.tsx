'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FileText, FileCheck } from 'lucide-react'

export function DocumentTypeToggle() {
  const documentType = useInvoiceStore((state) => state.documentType)
  const updateDocumentType = useInvoiceStore((state) => state.updateDocumentType)

  const handleToggle = async (type: 'invoice' | 'estimate') => {
    if (type !== documentType) {
      await updateDocumentType(type)
    }
  }

  const isEstimate = documentType === 'estimate'

  return (
    <div className="space-y-2">
      <Label id="document-type-label" className="text-sm font-medium">Document Type</Label>
      <div
        role="group"
        aria-labelledby="document-type-label"
        aria-describedby="document-type-help"
        className="relative grid grid-cols-2 gap-1 p-1 bg-muted rounded-lg"
      >
        {/* One indicator slides between the options instead of two backgrounds swapping. */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute inset-y-1 left-1 w-[calc(50%-0.375rem)] rounded-md bg-background shadow-sm transition-transform duration-(--motion-base) ease-move',
            isEstimate && 'translate-x-[calc(100%+0.25rem)]'
          )}
        />
        <button
          type="button"
          aria-pressed={!isEstimate}
          onClick={() => handleToggle('invoice')}
          className={cn(
            'relative flex min-h-11 sm:min-h-10 items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            !isEstimate ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <FileText aria-hidden="true" className="w-4 h-4" />
          Invoice
        </button>
        <button
          type="button"
          aria-pressed={isEstimate}
          onClick={() => handleToggle('estimate')}
          className={cn(
            'relative flex min-h-11 sm:min-h-10 items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
            isEstimate ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <FileCheck aria-hidden="true" className="w-4 h-4" />
          Estimate
        </button>
      </div>
      <p id="document-type-help" key={documentType} className="page-enter text-xs text-muted-foreground">
        {isEstimate
          ? 'Create an estimate or quote for client approval'
          : 'Create an invoice for payment collection'}
      </p>
    </div>
  )
}
