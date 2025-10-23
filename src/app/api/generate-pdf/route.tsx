import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server'
import { renderToBuffer } from '@react-pdf/renderer'
import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import type { InvoiceData } from '@/stores/invoice-store'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerSupabaseClient()

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { invoiceId } = body

    if (!invoiceId) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      )
    }

    // Fetch invoice from database
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      )
    }

    // Convert database format to InvoiceData format
    const invoiceData: InvoiceData = {
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
      isDirty: false,
      lastUpdated: Date.now(),
      status: invoice.status || 'draft',
      style: (invoice.style as 'modern' | 'classic' | 'minimal') || 'modern'
    }

    // Generate PDF buffer
    const pdfBuffer = await renderToBuffer(<InvoicePDF invoice={invoiceData} />)

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceData.invoiceNumber}.pdf"`,
      },
    })

  } catch (error) {
    console.error('Failed to generate PDF:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}