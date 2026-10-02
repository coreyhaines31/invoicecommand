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

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Document Type</Label>
      <div className="flex gap-2 p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => handleToggle('invoice')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all',
            documentType === 'invoice'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <FileText className="w-4 h-4" />
          Invoice
        </button>
        <button
          type="button"
          onClick={() => handleToggle('estimate')}
          className={cn(
            'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all',
            documentType === 'estimate'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <FileCheck className="w-4 h-4" />
          Estimate
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        {documentType === 'invoice'
          ? 'Create an invoice for payment collection'
          : 'Create an estimate or quote for client approval'}
      </p>
    </div>
  )
}
