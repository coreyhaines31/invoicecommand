import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerSupabaseClient } from '@/lib/supabase-server'
import { sendInvoiceEmail } from '@/lib/email-service'
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
    const { invoiceId, pdfBuffer, senderMessage } = body

    if (!invoiceId || !pdfBuffer) {
      return NextResponse.json(
        { error: 'Invoice ID and PDF buffer are required' },
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

    // Validate required email fields
    if (!invoice.client_email) {
      return NextResponse.json(
        { error: 'Client email is required to send invoice' },
        { status: 400 }
      )
    }

    if (!invoice.sender_email) {
      return NextResponse.json(
        { error: 'Sender email is required to send invoice' },
        { status: 400 }
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

    // Convert base64 PDF buffer to Buffer
    const pdfBufferData = Buffer.from(pdfBuffer, 'base64')

    // Send the email
    const result = await sendInvoiceEmail({
      invoice: invoiceData,
      pdfBuffer: pdfBufferData,
      senderMessage
    })

    // Update invoice status to 'sent'
    await supabase
      .from('invoices')
      .update({
        status: 'sent',
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      emailId: result?.id,
      message: 'Invoice sent successfully'
    })

  } catch (error) {
    console.error('Failed to send invoice email:', error)

    return NextResponse.json(
      {
        error: 'Failed to send invoice email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}