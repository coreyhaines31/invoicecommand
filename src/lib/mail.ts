import { Resend } from 'resend'

// Transactional mail. Sends through PostShiba when POSTSHIBA_API_KEY is set,
// otherwise through Resend as before. Unsetting POSTSHIBA_API_KEY is the
// rollback.

const POSTSHIBA_URL = 'https://app.postshiba.com/api/v1/emails'

// The only domain verified in PostShiba for this app.
const VERIFIED_DOMAIN = 'mail.invoicecommand.com'

const DEFAULT_FROM_EMAIL = `invoices@${VERIFIED_DOMAIN}`
const DEFAULT_APP_FROM_EMAIL = `hello@${VERIFIED_DOMAIN}`
// mail.invoicecommand.com has no MX, so replies go to the root domain inbox.
const DEFAULT_REPLY_TO = 'support@invoicecommand.com'

export type MailAttachment = {
  filename: string
  // A Buffer, or a string that is already base64 (same contract as Resend).
  content: Buffer | string
  contentType?: string
}

export type MailInput = {
  from: string
  to: string
  subject: string
  html?: string
  text?: string
  replyTo?: string
  attachments?: MailAttachment[]
}

export function isPostShibaEnabled(): boolean {
  return Boolean(process.env.POSTSHIBA_API_KEY)
}

function addressDomain(address: string): string {
  const match = address.match(/<([^>]+)>/)
  const email = (match ? match[1] : address).trim()
  return email.slice(email.lastIndexOf('@') + 1).toLowerCase()
}

// MAIL_* is the current name; RESEND_* is still read so nothing breaks before
// the env vars are renamed. With PostShiba on, a from address outside the
// verified domain (e.g. the old m.invoicecommand.com) falls back to the default.
function fromAddress(name: string, legacyName: string, fallback: string): string {
  const configured = process.env[name] || process.env[legacyName]
  if (!configured) return fallback
  if (isPostShibaEnabled() && addressDomain(configured) !== VERIFIED_DOMAIN) {
    console.warn(`[mail] ${name} is not on ${VERIFIED_DOMAIN}; using the default from address`)
    return fallback
  }
  return configured
}

export function invoiceFromEmail(): string {
  return fromAddress('MAIL_FROM_EMAIL', 'RESEND_FROM_EMAIL', DEFAULT_FROM_EMAIL)
}

export function appFromEmail(): string {
  return fromAddress('MAIL_APP_FROM_EMAIL', 'RESEND_APP_FROM_EMAIL', DEFAULT_APP_FROM_EMAIL)
}

export function replyToEmail(): string {
  return process.env.MAIL_REPLY_TO || process.env.RESEND_REPLY_TO || DEFAULT_REPLY_TO
}

export async function sendMail(input: MailInput): Promise<{ id?: string }> {
  const key = process.env.POSTSHIBA_API_KEY
  return key ? sendViaPostShiba(key, input) : sendViaResend(input)
}

async function sendViaPostShiba(key: string, input: MailInput): Promise<{ id?: string }> {
  const response = await fetch(POSTSHIBA_URL, {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: input.from,
      to: [input.to],
      subject: input.subject,
      ...(input.html ? { html: input.html } : {}),
      ...(input.text ? { text: input.text } : {}),
      ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      ...(input.attachments?.length
        ? {
            attachments: input.attachments.map((a) => ({
              filename: a.filename,
              content: Buffer.isBuffer(a.content) ? a.content.toString('base64') : a.content,
              ...(a.contentType ? { content_type: a.contentType } : {}),
            })),
          }
        : {}),
    }),
    signal: AbortSignal.timeout(10_000),
  })

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    // Only the error code is kept so nothing sensitive ends up in logs.
    const code = typeof body?.error === 'string' ? body.error : 'unknown'
    throw new Error(`PostShiba ${response.status} ${code}`)
  }
  // 200 with queued: false means every recipient is suppressed.
  if (body?.queued === false) {
    throw new Error('PostShiba did not queue the email (recipient suppressed)')
  }
  return { id: typeof body?.message_id === 'string' ? body.message_id : undefined }
}

async function sendViaResend(input: MailInput): Promise<{ id?: string }> {
  if (!process.env.RESEND_API_KEY) throw new Error('Email is not configured')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const { html, text, ...rest } = input
  // Resend's types require html or text; callers always pass at least one.
  const body = html ? { html, text } : { text: text ?? '' }
  const result = await resend.emails.send({ ...rest, ...body })
  if (result.error) {
    console.error('Resend API error:', result.error)
    throw new Error(result.error.message)
  }
  return { id: result.data?.id }
}
