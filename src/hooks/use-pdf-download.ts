import { useState } from 'react'
import { downloadInvoicePDF, validateInvoiceForPDF } from '@/lib/pdf-generator'
import type { InvoiceData } from '@/stores/invoice-store'
import { useAnalytics } from '@/hooks/use-analytics'

interface UsePDFDownloadReturn {
  isGenerating: boolean
  error: string | null
  downloadPDF: (invoice: InvoiceData) => Promise<void>
  clearError: () => void
}

export function usePDFDownload(): UsePDFDownloadReturn {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { trackPdfDownload } = useAnalytics()

  const downloadPDF = async (invoice: InvoiceData) => {
    setError(null)
    setIsGenerating(true)

    try {
      // Validate the invoice data first
      const validation = validateInvoiceForPDF(invoice)

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      // Generate and download the PDF
      await downloadInvoicePDF(invoice)

      // Track successful PDF download
      trackPdfDownload({
        items_count: invoice.items.length,
        has_tax: invoice.taxRate > 0,
        has_discount: invoice.discountRate > 0,
        total_amount: invoice.total,
        currency: invoice.currency,
      })

      // Success - PDF should be downloading
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate PDF'
      setError(errorMessage)
      console.error('PDF download error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    isGenerating,
    error,
    downloadPDF,
    clearError
  }
}