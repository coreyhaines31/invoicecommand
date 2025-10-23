import { supabaseAdmin } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { PublicInvoiceClient } from './public-invoice-client'

interface PageProps {
  params: { id: string }
}

export default async function PublicInvoicePage({ params }: PageProps) {
  const { id } = params

  // Fetch invoice data (public access)
  const { data: invoice, error } = await supabaseAdmin
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !invoice) {
    notFound()
  }

  // Convert database format to invoice data
  const invoiceData = {
    id: invoice.id,
    senderName: invoice.sender_name || '',
    senderEmail: invoice.sender_email || '',
    senderAddress: invoice.sender_address || '',
    senderCity: invoice.sender_city || '',
    senderState: invoice.sender_state || '',
    senderZip: invoice.sender_zip || '',
    senderPhone: invoice.sender_phone || '',
    senderLogo: invoice.sender_logo || '',
    clientName: invoice.client_name || '',
    clientEmail: invoice.client_email || '',
    clientAddress: invoice.client_address || '',
    clientCity: invoice.client_city || '',
    clientState: invoice.client_state || '',
    clientZip: invoice.client_zip || '',
    invoiceNumber: invoice.invoice_number || '',
    invoiceDate: invoice.invoice_date || '',
    dueDate: invoice.due_date || '',
    items: invoice.items || [],
    subtotal: Number(invoice.subtotal) || 0,
    taxRate: Number(invoice.tax_rate) || 0,
    taxAmount: Number(invoice.tax) || 0,
    discountRate: Number(invoice.discount_rate) || 0,
    discountAmount: Number(invoice.discount_amount) || 0,
    total: Number(invoice.total) || 0,
    notes: invoice.notes || '',
    terms: invoice.terms || '',
    currency: invoice.currency || 'USD',
    paymentEnabled: invoice.payment_enabled || false,
    stripePaymentStatus: invoice.stripe_payment_status || 'unpaid',
    style: (invoice.style as 'modern' | 'classic' | 'minimal') || 'modern'
  }

  return <PublicInvoiceClient invoice={invoiceData} />
}