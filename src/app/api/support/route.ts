import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { checkIpRateLimit } from '@/lib/rate-limit'

const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp'])

// Strip CR/LF and control characters out of email subject inputs.
function sanitizeSubjectInput(value: string): string {
  return value.replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ').trim()
}

const TYPE_LABELS: Record<string, string> = {
  question: 'Question',
  bug: 'Bug Report',
  feature: 'Feature Request',
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const rl = checkIpRateLimit(request, { bucket: 'support', max: 5, windowMs: 10 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many support requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    // formData() throws on missing/non-multipart Content-Type or malformed body.
    // Convert those parse failures to 400 so the caller sees a client-error response.
    let formData: FormData
    try {
      formData = await request.formData()
    } catch {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const typeRaw = formData.get('type')
    const subjectRaw = formData.get('subject')
    const bodyRaw = formData.get('body')
    const emailRaw = formData.get('email')
    const imageRaw = formData.get('image')

    // Type-safe extraction
    if (typeof typeRaw !== 'string' || typeof subjectRaw !== 'string' || typeof bodyRaw !== 'string') {
      return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
    }

    const type = typeRaw.trim()
    const subject = subjectRaw.trim()
    const body = bodyRaw.trim()

    if (!TYPE_LABELS[type]) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }
    if (!subject || subject.length > 200) {
      return NextResponse.json({ error: 'Subject is required and must be under 200 characters' }, { status: 400 })
    }
    if (!body || body.length > 5000) {
      return NextResponse.json({ error: 'Message is required and must be under 5000 characters' }, { status: 400 })
    }

    const userEmail = typeof emailRaw === 'string' && emailRaw.trim() ? emailRaw.trim() : null
    if (userEmail && !isValidEmail(userEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Image validation (before buffering)
    let image: File | null = null
    if (imageRaw instanceof File && imageRaw.size > 0) {
      if (!ALLOWED_TYPES.has(imageRaw.type)) {
        return NextResponse.json({ error: 'Image must be JPEG, PNG, GIF, or WebP' }, { status: 400 })
      }
      if (imageRaw.size > MAX_IMAGE_SIZE) {
        return NextResponse.json({ error: 'Image must be under 5MB' }, { status: 400 })
      }
      image = imageRaw
    }

    const supportEmail = process.env.SUPPORT_EMAIL
    if (!supportEmail) {
      throw new Error('SUPPORT_EMAIL is not configured')
    }
    const resend = new Resend(process.env.RESEND_API_KEY)
    const APP_FROM_EMAIL = process.env.RESEND_APP_FROM_EMAIL || 'hello@m.invoicecommand.com'

    const typeLabel = TYPE_LABELS[type]
    const safeSubject = escapeHtml(subject)
    const safeBody = escapeHtml(body).replace(/\n/g, '<br>')
    const safeEmail = userEmail ? escapeHtml(userEmail) : null
    const safeType = escapeHtml(typeLabel)

    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = []
    if (image) {
      const imageBuffer = Buffer.from(await image.arrayBuffer())
      attachments.push({
        filename: image.name,
        content: imageBuffer,
        contentType: image.type,
      })
    }

    const supportHtml = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
  <div style="background: white; border-radius: 8px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h2 style="margin: 0 0 24px; color: #10b981;">New Support Request</h2>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #6b7280; width: 100px; background: #f9fafb; border-radius: 4px 0 0 4px;">Type</td>
        <td style="padding: 8px 12px; color: #111827; background: #f9fafb; border-radius: 0 4px 4px 0;">${safeType}</td>
      </tr>
      <tr><td colspan="2" style="height: 4px;"></td></tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #6b7280; background: #f9fafb; border-radius: 4px 0 0 4px;">From</td>
        <td style="padding: 8px 12px; color: #111827; background: #f9fafb; border-radius: 0 4px 4px 0;">${safeEmail ?? 'Anonymous'}</td>
      </tr>
      <tr><td colspan="2" style="height: 4px;"></td></tr>
      <tr>
        <td style="padding: 8px 12px; font-weight: 600; color: #6b7280; background: #f9fafb; border-radius: 4px 0 0 4px;">Subject</td>
        <td style="padding: 8px 12px; color: #111827; background: #f9fafb; border-radius: 0 4px 4px 0;">${safeSubject}</td>
      </tr>
    </table>
    <div style="background: #f9fafb; border-radius: 6px; padding: 16px;">
      <p style="margin: 0 0 8px; font-weight: 600; color: #374151;">Message</p>
      <p style="margin: 0; color: #374151; line-height: 1.6;">${safeBody}</p>
    </div>
    ${image ? '<p style="margin-top: 16px; color: #6b7280; font-size: 14px;">📎 Screenshot attached</p>' : ''}
  </div>
</body>
</html>`

    const supportResult = await resend.emails.send({
      from: APP_FROM_EMAIL,
      to: supportEmail,
      replyTo: userEmail ?? undefined,
      subject: sanitizeSubjectInput(`[Invoice Command] [${typeLabel}] ${subject}`),
      html: supportHtml,
      attachments,
    })
    if (supportResult.error) {
      throw new Error(supportResult.error.message)
    }

    // We deliberately do not auto-send a confirmation email to userEmail.
    // The endpoint is unauthenticated and userEmail is not verified, so any
    // caller could direct a "from: hello@m.invoicecommand.com" "Re: <subject>"
    // email to an arbitrary recipient with attacker-controlled subject — a
    // ready-made phishing vector against our own domain. Replies will come
    // from a human when support responds to the original request.

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Support request failed:', error)
    return NextResponse.json(
      { error: 'Failed to send support request' },
      { status: 500 }
    )
  }
}
