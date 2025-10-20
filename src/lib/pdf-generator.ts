import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import type { InvoiceData } from '@/stores/invoice-store'

/**
 * Generate a filename for the PDF based on invoice data
 */
export function generatePDFFilename(invoice: InvoiceData): string {
  // Clean the invoice number for filename (remove special chars)
  const cleanInvoiceNumber = invoice.invoiceNumber
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '')

  // Clean the client name for filename
  const cleanClientName = invoice.clientName
    ? invoice.clientName
        .replace(/[^a-zA-Z0-9-_\s]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_{2,}/g, '_')
        .replace(/^_|_$/g, '')
        .substring(0, 20) // Limit length
    : 'Invoice'

  // Create filename: Invoice_INV-001_ClientName_2024-01-15.pdf
  const date = new Date().toISOString().split('T')[0]

  if (cleanClientName && cleanClientName !== 'Invoice') {
    return `Invoice_${cleanInvoiceNumber}_${cleanClientName}_${date}.pdf`
  } else {
    return `Invoice_${cleanInvoiceNumber}_${date}.pdf`
  }
}

/**
 * Generate and download a PDF invoice
 */
export async function downloadInvoicePDF(invoice: InvoiceData): Promise<void> {
  try {
    // Generate the PDF blob
    const blob = await pdf(InvoicePDF({ invoice })).toBlob()

    // Generate filename
    const filename = generatePDFFilename(invoice)

    // Download the file
    saveAs(blob, filename)

    return Promise.resolve()
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

/**
 * Generate PDF blob without downloading (useful for preview or sending)
 */
export async function generateInvoicePDFBlob(invoice: InvoiceData): Promise<Blob> {
  try {
    const blob = await pdf(InvoicePDF({ invoice })).toBlob()
    return blob
  } catch (error) {
    console.error('Error generating PDF blob:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

/**
 * Generate PDF as base64 string (useful for API calls)
 */
export async function generateInvoicePDFBase64(invoice: InvoiceData): Promise<string> {
  try {
    const blob = await generateInvoicePDFBlob(invoice)

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const base64 = reader.result as string
        // Remove the "data:application/pdf;base64," prefix
        const base64Data = base64.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = () => reject(new Error('Failed to convert PDF to base64'))
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error generating PDF base64:', error)
    throw new Error('Failed to generate PDF. Please try again.')
  }
}

/**
 * Validate invoice data before PDF generation
 */
export function validateInvoiceForPDF(invoice: InvoiceData): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  // Check required fields
  if (!invoice.senderName?.trim()) {
    errors.push('Business name is required')
  }

  if (!invoice.clientName?.trim()) {
    errors.push('Client name is required')
  }

  if (!invoice.invoiceNumber?.trim()) {
    errors.push('Invoice number is required')
  }

  if (!invoice.invoiceDate) {
    errors.push('Invoice date is required')
  }

  if (!invoice.dueDate) {
    errors.push('Due date is required')
  }

  // Check if there are any line items with content
  const validItems = invoice.items.filter(
    item => item.description?.trim() && (item.quantity > 0) && (item.price > 0)
  )

  if (validItems.length === 0) {
    errors.push('At least one line item with description, quantity, and price is required')
  }

  // Check if total is greater than 0
  if (invoice.total <= 0) {
    errors.push('Invoice total must be greater than $0.00')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}