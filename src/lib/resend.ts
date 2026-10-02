import { Resend } from 'resend'

export const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : (null as unknown as Resend)

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'invoices@m.invoicecommand.com'
export const REPLY_TO_EMAIL = process.env.RESEND_REPLY_TO || 'support@m.invoicecommand.com'

// For app communications (welcome emails, notifications, etc.)
export const APP_FROM_EMAIL = process.env.RESEND_APP_FROM_EMAIL || 'hello@m.invoicecommand.com'