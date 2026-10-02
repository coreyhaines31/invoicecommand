import { resend, FROM_EMAIL, REPLY_TO_EMAIL, APP_FROM_EMAIL } from './resend'
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
  shareUrl?: string
}

// Strip CR/LF and control chars from email subject inputs.
// Resend exposes `subject` as JSON, but we don't want to depend on provider-side header sanitization.
function sanitizeSubjectInput(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ').trim()
}

export async function sendInvoiceEmail(data: InvoiceEmailData) {
  const { invoice, pdfBuffer, senderMessage = '', shareUrl } = data

  const subject = `Invoice ${sanitizeSubjectInput(invoice.invoiceNumber || '')} from ${sanitizeSubjectInput(invoice.senderName || '')}`

  const htmlContent = generateInvoiceEmailHtml({
    clientName: invoice.clientName,
    senderName: invoice.senderName,
    invoiceNumber: invoice.invoiceNumber,
    total: invoice.total,
    currency: invoice.currency,
    dueDate: invoice.dueDate,
    senderMessage,
    senderEmail: invoice.senderEmail,
    shareUrl,
    documentType: invoice.documentType,
  })

  const textContent = generateInvoiceEmailText({
    clientName: invoice.clientName,
    senderName: invoice.senderName,
    invoiceNumber: invoice.invoiceNumber,
    total: invoice.total,
    currency: invoice.currency,
    dueDate: invoice.dueDate,
    senderMessage,
    shareUrl,
    documentType: invoice.documentType,
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
  shareUrl?: string
  documentType?: 'invoice' | 'estimate'
}

function generateInvoiceEmailHtml(data: InvoiceEmailTemplateData): string {
  const { clientName, senderName, invoiceNumber, total, currency, dueDate, senderMessage, senderEmail, shareUrl, documentType } = data
  const noun = documentType === 'estimate' ? 'estimate' : 'invoice'

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(total)

  const formattedDueDate = new Date(dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Escape every user-controlled field before interpolating into HTML.
  // senderMessage's newlines are converted to <br> *after* escaping.
  const safeClientName = escapeHtml(clientName || '')
  const safeSenderName = escapeHtml(senderName || '')
  const safeInvoiceNumber = escapeHtml(invoiceNumber || '')
  const safeSenderEmail = senderEmail ? escapeHtml(senderEmail) : ''
  const safeSenderMessage = senderMessage
    ? escapeHtml(senderMessage).replace(/\n/g, '<br>')
    : ''

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Invoice ${safeInvoiceNumber}</title>
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
      <h1 class="invoice-title">Invoice ${safeInvoiceNumber}</h1>
      <p>From ${safeSenderName}</p>
    </div>

    <p>Hi ${safeClientName},</p>

    <p>Please find your invoice attached. Here are the details:</p>

    <div class="invoice-details">
      <div class="detail-row">
        <span class="detail-label">Invoice Number:</span>
        <span class="detail-value">${safeInvoiceNumber}</span>
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

    ${safeSenderMessage ? `
    <div class="message">
      <strong>Message from ${safeSenderName}:</strong><br>
      ${safeSenderMessage}
    </div>
    ` : ''}

    ${shareUrl ? `
    <p style="text-align: center;">
      <a href="${escapeHtml(shareUrl)}" class="cta-button">View ${noun} online</a>
    </p>
    ` : ''}

    <p>The ${noun} PDF is attached to this email. Please review${noun === 'invoice' ? ' and process payment by the due date' : ''}.</p>

    <p>If you have any questions about this invoice, please don't hesitate to reach out.</p>

    <div class="footer">
      <p>This invoice was created with <a href="https://invoicecommand.com" style="color: #10b981;">Invoice Command</a></p>
      ${safeSenderEmail ? `<p>Questions? Reply to this email or contact ${safeSenderEmail}</p>` : ''}
    </div>
  </div>
</body>
</html>`
}

export interface EstimateAcceptanceData {
  toEmail: string
  senderName: string
  clientName: string
  invoiceNumber: string
  signerName: string
  signerEmail: string
  signedAt: Date
  estimateId: string
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function sendEstimateAcceptanceEmail(data: EstimateAcceptanceData) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://invoicecommand.com'
  const subject = `${sanitizeSubjectInput(data.clientName || '')} accepted estimate ${sanitizeSubjectInput(data.invoiceNumber || '')}`
  const safeSenderName = escapeHtml(data.senderName || 'there')
  const safeClientName = escapeHtml(data.clientName)
  const safeInvoiceNumber = escapeHtml(data.invoiceNumber)
  const safeSignerName = escapeHtml(data.signerName)
  const safeSignerEmail = escapeHtml(data.signerEmail)
  const formattedSignedAt = data.signedAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  })
  const dashboardUrl = `${appUrl}/dashboard`
  const estimateUrl = `${appUrl}/invoice/${data.estimateId}`

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #10b981; margin: 0 0 24px 0;">Estimate accepted</h1>
    <p>Hi ${safeSenderName},</p>
    <p><strong>${safeSignerName}</strong> just accepted estimate <strong>${safeInvoiceNumber}</strong>.</p>
    <div style="background: #f3f4f6; border-radius: 6px; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0;"><strong>Signed by:</strong> ${safeSignerName}</p>
      <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${safeSignerEmail}</p>
      <p style="margin: 0;"><strong>Signed at:</strong> ${escapeHtml(formattedSignedAt)}</p>
    </div>
    <p>You can now convert this estimate to an invoice and start work.</p>
    <p>
      <a href="${dashboardUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin-right: 8px;">Open dashboard</a>
      <a href="${estimateUrl}" style="display: inline-block; background: #fff; color: #10b981; border: 1px solid #10b981; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">View estimate</a>
    </p>
    <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">Sent by <a href="${appUrl}" style="color: #10b981;">Invoice Command</a></p>
  </div>
</body>
</html>`

  const text = `${data.clientName} accepted estimate ${data.invoiceNumber}

Signed by: ${data.signerName}
Email: ${data.signerEmail}
Signed at: ${formattedSignedAt}

Open dashboard: ${dashboardUrl}
View estimate: ${estimateUrl}

— Invoice Command`

  try {
    const result = await resend.emails.send({
      from: APP_FROM_EMAIL,
      to: data.toEmail,
      subject,
      html,
      text,
      replyTo: REPLY_TO_EMAIL,
    })
    if (result.error) {
      console.error('Resend API error:', result.error)
      throw new Error(result.error.message)
    }
    return result.data
  } catch (error) {
    console.error('Failed to send estimate acceptance email:', error)
    throw error
  }
}

function generateInvoiceEmailText(data: InvoiceEmailTemplateData): string {
  const { clientName, senderName, invoiceNumber, total, currency, dueDate, senderMessage, shareUrl, documentType } = data
  const noun = documentType === 'estimate' ? 'estimate' : 'invoice'

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

Please find your ${noun} attached. Here are the details:

Invoice Number: ${invoiceNumber}
Total Amount: ${formattedTotal}
Due Date: ${formattedDueDate}

${senderMessage ? `
Message from ${senderName}:
${senderMessage}

` : ''}${shareUrl ? `View ${noun} online: ${shareUrl}

` : ''}The ${noun} PDF is attached to this email. Please review${noun === 'invoice' ? ' and process payment by the due date' : ''}.

If you have any questions about this ${noun}, please don't hesitate to reach out.

---
This ${noun} was created with Invoice Command
https://invoicecommand.com`
}

export interface PasswordResetEmailData {
  to: string
  resetUrl: string
}

export async function sendPasswordResetEmail({ to, resetUrl }: PasswordResetEmailData) {
  const subject = 'Reset your Invoice Command password'
  const safeUrl = escapeHtml(resetUrl)

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #10b981; margin: 0 0 24px 0;">Reset your password</h1>
    <p>We received a request to reset the password for your Invoice Command account. Click the button below to set a new password. The link is valid for 1 hour.</p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${safeUrl}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Reset password</a>
    </p>
    <p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
    <p style="color: #6b7280; font-size: 14px;">Or paste this URL into your browser:<br><span style="word-break: break-all;">${safeUrl}</span></p>
    <p style="color: #6b7280; font-size: 14px; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">Sent by <a href="https://invoicecommand.com" style="color: #10b981;">Invoice Command</a></p>
  </div>
</body>
</html>`

  const text = `Reset your Invoice Command password

We received a request to reset the password for your Invoice Command account. The link below is valid for 1 hour:

${resetUrl}

If you didn't request this, you can safely ignore this email — your password won't change.

— Invoice Command
https://invoicecommand.com`

  try {
    const result = await resend.emails.send({
      from: APP_FROM_EMAIL,
      to,
      subject,
      html,
      text,
      replyTo: REPLY_TO_EMAIL,
    })
    if (result.error) {
      console.error('Resend API error:', result.error)
      throw new Error(result.error.message)
    }
    return result.data
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}