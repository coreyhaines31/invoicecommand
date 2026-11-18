import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { invoices } from '@/lib/db/schema'
import { and, eq, gte, isNull, lt } from 'drizzle-orm'
import { sendEstimateAcceptanceEmail } from '@/lib/email-service'
import { ESTIMATE_CONSENT_TEXT, serializeDocumentVersion } from '@/lib/estimate-signing'
import { checkIpRateLimit } from '@/lib/rate-limit'

type AcceptBody = {
  shareToken?: unknown
  documentVersion?: unknown
  signatureData?: unknown
  signerName?: unknown
  signerEmail?: unknown
  consentAccepted?: unknown
}

const MAX_SIGNATURE_BYTES = 250_000
const MAX_NAME_LENGTH = 200
const MAX_EMAIL_LENGTH = 320
const MAX_USER_AGENT_LENGTH = 500
const PNG_PREFIX = 'data:image/png;base64,'

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const real = request.headers.get('x-real-ip')
  if (real) return real
  return 'unknown'
}

function validatePngDataUrl(value: string): { ok: true; bytes: number } | { ok: false; error: string } {
  if (!value.startsWith(PNG_PREFIX)) {
    return { ok: false, error: 'Signature must be a PNG image' }
  }
  const base64 = value.slice(PNG_PREFIX.length)
  // Rough size check on the encoded length (~4/3 of decoded bytes)
  const decodedBytes = Math.floor((base64.length * 3) / 4)
  if (decodedBytes > MAX_SIGNATURE_BYTES) {
    return { ok: false, error: 'Signature image too large' }
  }
  // PNG magic bytes are 89 50 4E 47, which is base64 "iVBORw" at the start
  if (!base64.startsWith('iVBORw')) {
    return { ok: false, error: 'Signature must be a valid PNG' }
  }
  return { ok: true, bytes: decodedBytes }
}

// Postgres stores updated_at to the microsecond, but the version the page
// rendered went through a JS Date and keeps only milliseconds. Match the whole
// millisecond instead of testing equality.
function matchesDocumentVersion(version: Date | null) {
  if (!version) return isNull(invoices.updatedAt)
  return and(
    gte(invoices.updatedAt, version),
    lt(invoices.updatedAt, new Date(version.getTime() + 1)),
  )
}

const DOCUMENT_CHANGED_ERROR =
  'This estimate was updated after you opened it. Please reload the page and review the updated estimate before signing.'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rl = checkIpRateLimit(request, { bucket: 'estimate-accept', max: 10, windowMs: 10 * 60 * 1000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many signing attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
    )
  }

  const { id } = await params

  let body: AcceptBody
  try {
    body = (await request.json()) as AcceptBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const shareToken = typeof body.shareToken === 'string' ? body.shareToken : ''
  if (!shareToken) {
    return NextResponse.json({ error: 'shareToken is required' }, { status: 400 })
  }

  // The version is the estimate's updated_at as the share page rendered it
  // ('' when the row has none).
  if (typeof body.documentVersion !== 'string') {
    return NextResponse.json({ error: 'documentVersion is required' }, { status: 400 })
  }
  const documentVersion = body.documentVersion
  const renderedVersion = documentVersion ? new Date(documentVersion) : null
  if (renderedVersion && Number.isNaN(renderedVersion.getTime())) {
    return NextResponse.json({ error: 'Invalid documentVersion' }, { status: 400 })
  }

  const signatureData = typeof body.signatureData === 'string' ? body.signatureData : ''
  const signerName = typeof body.signerName === 'string' ? body.signerName.trim().slice(0, MAX_NAME_LENGTH) : ''
  const signerEmail = typeof body.signerEmail === 'string' ? body.signerEmail.trim().slice(0, MAX_EMAIL_LENGTH) : ''

  const sigCheck = validatePngDataUrl(signatureData)
  if (!sigCheck.ok) {
    return NextResponse.json({ error: sigCheck.error }, { status: 400 })
  }
  if (!signerName) {
    return NextResponse.json({ error: 'Full name is required' }, { status: 400 })
  }
  if (!signerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signerEmail)) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
  }
  if (body.consentAccepted !== true) {
    return NextResponse.json({ error: 'Consent acknowledgement is required' }, { status: 400 })
  }

  // Signing goes through the share link, like public payments: the share
  // token is the access boundary, not the estimate id. Unknown, disabled and
  // expired links all get the same response.
  const [estimate] = await db
    .select()
    .from(invoices)
    .where(and(
      eq(invoices.shareToken, shareToken),
      eq(invoices.shareEnabled, true),
    ))
  if (
    !estimate ||
    estimate.id !== id ||
    (estimate.shareExpiresAt && estimate.shareExpiresAt.getTime() < Date.now())
  ) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  if (estimate.documentType !== 'estimate') {
    return NextResponse.json({ error: 'Only estimates can be accepted' }, { status: 400 })
  }
  if (estimate.collectSignature === false) {
    return NextResponse.json({ error: 'Signature collection is disabled for this estimate' }, { status: 400 })
  }
  if (estimate.signedAt) {
    return NextResponse.json({ error: 'This estimate has already been accepted' }, { status: 409 })
  }
  if (estimate.expirationDate) {
    // Treat the expiration date as end-of-day UTC so estimates remain
    // valid throughout the date stamped on them.
    const endOfExpirationDay = new Date(`${estimate.expirationDate}T23:59:59.999Z`)
    if (!Number.isNaN(endOfExpirationDay.getTime()) && endOfExpirationDay.getTime() < Date.now()) {
      return NextResponse.json({ error: 'This estimate has expired' }, { status: 410 })
    }
  }

  const signedIp = getClientIp(request)
  const signedUserAgent = (request.headers.get('user-agent') || '').slice(0, MAX_USER_AGENT_LENGTH)
  const signedAt = new Date()

  // Atomic write-once: only update if signed_at is still NULL AND the
  // document is still an estimate with signature collection enabled AND it
  // is still the version the signer was shown. This closes the TOCTOU window
  // where the owner toggles collection off, converts to an invoice, or edits
  // the estimate between page load and the write.
  const updatedRows = await db
    .update(invoices)
    .set({
      signedAt,
      signatureData,
      signerName,
      signerEmail,
      signedIp,
      signedUserAgent,
      consentText: ESTIMATE_CONSENT_TEXT,
      updatedAt: signedAt,
    })
    .where(and(
      eq(invoices.id, id),
      eq(invoices.shareToken, shareToken),
      eq(invoices.shareEnabled, true),
      isNull(invoices.signedAt),
      eq(invoices.documentType, 'estimate'),
      eq(invoices.collectSignature, true),
      matchesDocumentVersion(renderedVersion),
    ))
    .returning()

  if (updatedRows.length === 0) {
    // Re-read to report the actual reason for the failure.
    const [current] = await db
      .select({
        documentType: invoices.documentType,
        signedAt: invoices.signedAt,
        collectSignature: invoices.collectSignature,
        shareToken: invoices.shareToken,
        shareEnabled: invoices.shareEnabled,
        updatedAt: invoices.updatedAt,
      })
      .from(invoices)
      .where(eq(invoices.id, id))

    if (!current || current.shareToken !== shareToken || !current.shareEnabled) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (current.documentType !== 'estimate') {
      return NextResponse.json({ error: 'Only estimates can be accepted' }, { status: 400 })
    }
    if (current.collectSignature === false) {
      return NextResponse.json({ error: 'Signature collection is disabled for this estimate' }, { status: 400 })
    }
    if (!current.signedAt && serializeDocumentVersion(current.updatedAt) !== documentVersion) {
      return NextResponse.json({ error: DOCUMENT_CHANGED_ERROR, code: 'document_changed' }, { status: 409 })
    }
    return NextResponse.json({ error: 'This estimate has already been accepted' }, { status: 409 })
  }

  const updated = updatedRows[0]

  if (updated.senderEmail) {
    try {
      await sendEstimateAcceptanceEmail({
        toEmail: updated.senderEmail,
        senderName: updated.senderName ?? '',
        clientName: updated.clientName ?? signerName,
        invoiceNumber: updated.invoiceNumber ?? '',
        signerName,
        signerEmail,
        signedAt,
        estimateId: updated.id,
      })
    } catch (error) {
      console.error('Failed to send acceptance email:', error)
    }
  }

  return NextResponse.json({
    success: true,
    signedAt: signedAt.toISOString(),
    signerName,
    signerEmail,
  })
}
