import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import type { InvoiceData } from '@/stores/invoice-store'

// Server-side rendering of the stored invoice. Emails attach this, never a
// caller-supplied file, so a leaked key or session can't mail arbitrary PDFs
// from our sending domain.
export async function renderInvoicePdf(invoice: InvoiceData): Promise<Buffer> {
  return renderToBuffer(<InvoicePDF invoice={invoice} />)
}
