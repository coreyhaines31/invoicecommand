import { resend, FROM_EMAIL, REPLY_TO_EMAIL } from './resend'
import type { InvoiceData } from '@/stores/invoice-store'

export interface EmailOptions {
  to: string
  subject: string
  html?: string
  text?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

export async function sendEmail(options: EmailOptions) {
  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: REPLY_TO_EMAIL,
      attachments: options.attachments
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      throw new Error(result.error.message)
    }

    return result.data
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export interface InvoiceEmailData {
  invoice: InvoiceData
  pdfBuffer: Buffer
  senderMessage?: string
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const { invoice, pdfBuffer, senderMessage = '' } = data

  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.senderName}`

  const htmlContent = generateInvoiceEmailHtml({
    clientName: invoice.clientName,
    senderName: invoice.senderName,
    invoiceNumber: invoice.invoiceNumber,
    total: invoice.total,
    currency: invoice.currency,
    dueDate: invoice.dueDate,
    senderMessage,
    senderEmail: invoice.senderEmail
  })

  const textContent = generateInvoiceEmailText({
    clientName: invoice.clientName,
    senderName: invoice.senderName,
    invoiceNumber: invoice.invoiceNumber,
    total: invoice.total,
    currency: invoice.currency,
    dueDate: invoice.dueDate,
    senderMessage
  })

  // Use sender's email as reply-to so clients can respond directly to them
  const replyToEmail = invoice.senderEmail || REPLY_TO_EMAIL

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: invoice.clientEmail,
      subject,
      html: htmlContent,
      text: textContent,
      replyTo: replyToEmail,
      attachments: [
        {
          filename: `invoice-${invoice.invoiceNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    })

    if (result.error) {
      console.error('Resend API error:', result.error)
      throw new Error(result.error.message)
    }

    return result.data
  } catch (error) {
    console.error('Failed to send invoice email:', error)
    throw error
  }
}

interface InvoiceEmailTemplateData {
  clientName: string
  senderName: string
  invoiceNumber: string
  total: number
  currency: string
  dueDate: string
  senderMessage?: string
  senderEmail?: string
}

function generateInvoiceEmailHtml(data: InvoiceEmailTemplateData): string {
  const { clientName, senderName, invoiceNumber, total, currency, dueDate, senderMessage, senderEmail } = data

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(total)

  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f9fafb;
    }
    .email-container {
      background: white;
      border-radius: 8px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 24px;
      border-bottom: 2px solid #e5e7eb;
    }
    .invoice-title {
      font-size: 24px;
      font-weight: 600;
      color: #10b981;
      margin: 0;
    }
    .invoice-details {
      background: #f3f4f6;
      border-radius: 6px;
      padding: 20px;
      margin: 24px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .detail-label {
      font-weight: 500;
      color: #6b7280;
    }
    .detail-value {
      font-weight: 600;
      color: #111827;
    }
    .total-amount {
      font-size: 20px;
      color: #10b981;
    }
    .message {
      background: #f0f9ff;
      border-left: 4px solid #0ea5e9;
      padding: 16px;
      margin: 24px 0;
      border-radius: 0 6px 6px 0;
    }
    .cta-button {
      display: inline-block;
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
      margin: 24px 0;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1 class="invoice-title">Invoice ${invoiceNumber}</h1>
      <p>From ${senderName}</p>
    </div>

    <p>Hi ${clientName},</p>

    <p>Please find your invoice attached. Here are the details:</p>

    <div class="invoice-details">
      <div class="detail-row">
        <span class="detail-label">Invoice Number:</span>
        <span class="detail-value">${invoiceNumber}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Total Amount:</span>
        <span class="detail-value total-amount">${formattedTotal}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Due Date:</span>
        <span class="detail-value">${formattedDueDate}</span>
      </div>
    </div>

    ${senderMessage ? `
    <div class="message">
      <strong>Message from ${senderName}:</strong><br>
      ${senderMessage.replace(/\n/g, '<br>')}
    </div>
    ` : ''}

    <p>The invoice PDF is attached to this email. Please review and process payment by the due date.</p>

    <p>If you have any questions about this invoice, please don't hesitate to reach out.</p>

    <div class="footer">
      <p>This invoice was created with <a href="https://invoicecommand.com" style="color: #10b981;">Invoice Command</a></p>
      ${senderEmail ? `<p>Questions? Reply to this email or contact ${senderEmail}</p>` : ''}
    </div>
  </div>
</body>
</html>`
}

function generateInvoiceEmailText(data: InvoiceEmailTemplateData): string {
  const { clientName, senderName, invoiceNumber, total, currency, dueDate, senderMessage } = data

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(total)

  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return `Invoice ${invoiceNumber} from ${senderName}

Hi ${clientName},

Please find your invoice attached. Here are the details:

Invoice Number: ${invoiceNumber}
Total Amount: ${formattedTotal}
Due Date: ${formattedDueDate}

${senderMessage ? `
Message from ${senderName}:
${senderMessage}

` : ''}The invoice PDF is attached to this email. Please review and process payment by the due date.

If you have any questions about this invoice, please don't hesitate to reach out.

---
This invoice was created with Invoice Command
https://invoicecommand.com`
}