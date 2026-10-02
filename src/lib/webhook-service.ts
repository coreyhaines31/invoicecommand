import { db } from '@/lib/db'
import { webhooks, webhookEvents } from '@/lib/db/schema'
import { eq, and, or, lt, isNull, inArray } from 'drizzle-orm'
import { createHmac, timingSafeEqual } from 'crypto'
import { lookup } from 'dns/promises'
import net from 'net'

// Block requests to internal/loopback/link-local ranges to prevent SSRF.
// Called both at webhook-registration time (cheap check on the literal host)
// and just before each fetch (after DNS resolution, to catch DNS rebinding).
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((n) => Number.isNaN(n) || n < 0 || n > 255)) return false
  const [a, b] = parts
  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a === 0 ||
    a >= 224 // multicast + reserved
  )
}

// Convert an IPv6 string into its 16-byte representation. Returns null if invalid.
function ipv6ToBytes(ip: string): Uint8Array | null {
  const stripped = ip.replace(/%.*$/, '') // strip zone id (e.g. fe80::1%eth0)
  if (!stripped.includes(':')) return null
  // Handle "::" double-colon expansion
  let parts: string[]
  if (stripped.includes('::')) {
    const [head, tail] = stripped.split('::')
    const headParts = head ? head.split(':') : []
    const tailParts = tail ? tail.split(':') : []
    const fill = 8 - headParts.length - tailParts.length
    if (fill < 0) return null
    parts = [...headParts, ...new Array(fill).fill('0'), ...tailParts]
  } else {
    parts = stripped.split(':')
  }
  if (parts.length !== 8) return null
  const bytes = new Uint8Array(16)
  for (let i = 0; i < 8; i++) {
    const seg = parts[i]
    if (!/^[0-9a-f]{1,4}$/i.test(seg)) return null
    const n = parseInt(seg, 16)
    bytes[i * 2] = (n >> 8) & 0xff
    bytes[i * 2 + 1] = n & 0xff
  }
  return bytes
}

function isPrivateIPv6(ip: string): boolean {
  // Accept ::ffff:127.0.0.1 form (dotted v4 tail) by converting to two hex words.
  const dottedMatch = ip.match(/(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  let canonical = ip
  if (dottedMatch) {
    const a = Number(dottedMatch[2]), b = Number(dottedMatch[3]), c = Number(dottedMatch[4]), d = Number(dottedMatch[5])
    canonical = dottedMatch[1] + ((a << 8) | b).toString(16) + ':' + ((c << 8) | d).toString(16)
  }
  const bytes = ipv6ToBytes(canonical)
  if (!bytes) return false
  // ::1/128 loopback
  if (bytes.every((b, i) => (i === 15 ? b === 1 : b === 0))) return true
  // ::/128 unspecified
  if (bytes.every((b) => b === 0)) return true
  // fc00::/7 ULA
  if ((bytes[0] & 0xfe) === 0xfc) return true
  // fe80::/10 link-local
  if (bytes[0] === 0xfe && (bytes[1] & 0xc0) === 0x80) return true
  // ff00::/8 multicast
  if (bytes[0] === 0xff) return true
  // ::ffff:0:0/96 IPv4-mapped — extract trailing v4
  if (bytes.slice(0, 10).every((b) => b === 0) && bytes[10] === 0xff && bytes[11] === 0xff) {
    return isPrivateIPv4(`${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`)
  }
  // ::/96 IPv4-compatible (deprecated but still routable in some stacks)
  if (bytes.slice(0, 12).every((b) => b === 0)) {
    return isPrivateIPv4(`${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`)
  }
  // 2002::/16 6to4 — embedded IPv4 in bytes[2..5]
  if (bytes[0] === 0x20 && bytes[1] === 0x02) {
    return isPrivateIPv4(`${bytes[2]}.${bytes[3]}.${bytes[4]}.${bytes[5]}`)
  }
  // 2001::/32 Teredo — conservatively block, encodes IPv4 endpoints
  if (bytes[0] === 0x20 && bytes[1] === 0x01 && bytes[2] === 0x00 && bytes[3] === 0x00) return true
  // 64:ff9b::/96 NAT64 well-known prefix
  if (bytes[0] === 0x00 && bytes[1] === 0x64 && bytes[2] === 0xff && bytes[3] === 0x9b &&
      bytes.slice(4, 12).every((b) => b === 0)) {
    return isPrivateIPv4(`${bytes[12]}.${bytes[13]}.${bytes[14]}.${bytes[15]}`)
  }
  return false
}

// URL.hostname keeps brackets for IPv6 literals. Strip them so net.isIP works.
function unbracket(host: string): string {
  return host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host
}

export async function assertWebhookUrlIsExternal(url: string): Promise<void> {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Webhook URL is invalid')
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('Webhook URL must use http or https')
  }
  if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
    throw new Error('Webhook URL must use https in production')
  }

  const host = unbracket(parsed.hostname)
  // Literal IP check (covers Node-normalized hex/octal/short-form IPv4 as well as
  // bracketed IPv6 literals after unbracketing).
  if (net.isIP(host)) {
    const blocked = net.isIPv4(host) ? isPrivateIPv4(host) : isPrivateIPv6(host)
    if (blocked) throw new Error('Webhook URL resolves to a private network address')
    return
  }
  // Block obvious loopback hostnames, including a trailing-dot form like "localhost."
  const lowerHost = host.toLowerCase().replace(/\.$/, '')
  if (lowerHost === 'localhost' || lowerHost.endsWith('.localhost') || lowerHost.endsWith('.internal')) {
    throw new Error('Webhook URL points at a local hostname')
  }
  // DNS resolve and check every returned address (mitigates DNS rebinding).
  const addrs = await lookup(host, { all: true })
  for (const { address, family } of addrs) {
    const blocked = family === 4 ? isPrivateIPv4(address) : isPrivateIPv6(address)
    if (blocked) throw new Error('Webhook URL resolves to a private network address')
  }
}

export type WebhookEventType =
  | 'invoice.created'
  | 'invoice.updated'
  | 'invoice.sent'
  | 'invoice.paid'
  | 'invoice.overdue'
  | 'estimate.signed'

const RETRY_DELAYS = [0, 60, 300, 900, 3600] // seconds: immediate, 1min, 5min, 15min, 1hour

export function signPayload(payload: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const signatureInput = `${timestamp}.${payload}`
  const signature = createHmac('sha256', secret).update(signatureInput).digest('hex')
  return `t=${timestamp},v1=${signature}`
}

export function verifySignature(
  payload: string,
  signature: string,
  secret: string,
  tolerance: number = 300
): boolean {
  const parts = signature.split(',')
  const timestampPart = parts.find((p) => p.startsWith('t='))
  const signaturePart = parts.find((p) => p.startsWith('v1='))

  if (!timestampPart || !signaturePart) return false

  const timestamp = parseInt(timestampPart.substring(2), 10)
  const receivedSignature = signaturePart.substring(3)

  // Reject non-numeric timestamps explicitly. parseInt("abc") → NaN, and
  // Math.abs(now - NaN) > tolerance evaluates to NaN > 300 which is false,
  // so without this guard the freshness check silently passes for garbage.
  if (!Number.isFinite(timestamp)) return false

  // Check timestamp is within tolerance
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - timestamp) > tolerance) return false

  // Verify signature using constant-time comparison to prevent timing attacks
  const signatureInput = `${timestamp}.${payload}`
  const expectedSignature = createHmac('sha256', secret).update(signatureInput).digest('hex')

  // Use timingSafeEqual for constant-time comparison
  const receivedBuffer = Buffer.from(receivedSignature, 'hex')
  const expectedBuffer = Buffer.from(expectedSignature, 'hex')

  if (receivedBuffer.length !== expectedBuffer.length) return false

  return timingSafeEqual(receivedBuffer, expectedBuffer)
}

export async function triggerWebhooks(
  userId: string,
  eventType: WebhookEventType,
  data: Record<string, unknown>
): Promise<void> {
  // Find active webhooks subscribed to this event
  const userWebhooks = await db
    .select()
    .from(webhooks)
    .where(and(eq(webhooks.userId, userId), eq(webhooks.isActive, true)))

  const subscribedWebhooks = userWebhooks.filter((wh) => {
    const events = wh.events as string[]
    return events.includes(eventType) || events.includes('*')
  })

  if (subscribedWebhooks.length === 0) return

  const payload = {
    id: crypto.randomUUID(),
    type: eventType,
    created: new Date().toISOString(),
    data,
  }

  // Create webhook events for each subscribed webhook
  for (const webhook of subscribedWebhooks) {
    await db.insert(webhookEvents).values({
      webhookId: webhook.id,
      eventType,
      payload,
      status: 'pending',
      attempts: 0,
      nextRetryAt: new Date(),
    })
  }
}

export async function deliverWebhook(eventId: string): Promise<boolean> {
  const [event] = await db
    .select({
      id: webhookEvents.id,
      webhookId: webhookEvents.webhookId,
      payload: webhookEvents.payload,
      attempts: webhookEvents.attempts,
      maxAttempts: webhookEvents.maxAttempts,
    })
    .from(webhookEvents)
    .where(eq(webhookEvents.id, eventId))

  if (!event) return false

  const [webhook] = await db
    .select()
    .from(webhooks)
    .where(eq(webhooks.id, event.webhookId))

  if (!webhook || !webhook.isActive) {
    await db
      .update(webhookEvents)
      .set({ status: 'failed', responseBody: 'Webhook not found or inactive' })
      .where(eq(webhookEvents.id, eventId))
    return false
  }

  const payloadStr = JSON.stringify(event.payload)
  const signature = signPayload(payloadStr, webhook.secret)

  const newAttempts = (event.attempts ?? 0) + 1

  try {
    await assertWebhookUrlIsExternal(webhook.url)

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
        'X-Webhook-ID': eventId,
      },
      body: payloadStr,
      signal: AbortSignal.timeout(30000), // 30 second timeout
      redirect: 'manual', // do not follow redirects — prevents redirect-based SSRF
    })

    if (response.ok) {
      await db
        .update(webhookEvents)
        .set({
          status: 'delivered',
          attempts: newAttempts,
          responseStatus: response.status,
          deliveredAt: new Date(),
        })
        .where(eq(webhookEvents.id, eventId))
      return true
    }

    // Non-2xx response
    const responseBody = await response.text().catch(() => '')

    if (newAttempts >= (event.maxAttempts ?? 5)) {
      await db
        .update(webhookEvents)
        .set({
          status: 'failed',
          attempts: newAttempts,
          responseStatus: response.status,
          responseBody: responseBody.substring(0, 1000),
        })
        .where(eq(webhookEvents.id, eventId))
      return false
    }

    // Schedule retry
    const delayIndex = Math.min(newAttempts, RETRY_DELAYS.length - 1)
    const nextRetry = new Date(Date.now() + RETRY_DELAYS[delayIndex] * 1000)

    await db
      .update(webhookEvents)
      .set({
        attempts: newAttempts,
        responseStatus: response.status,
        responseBody: responseBody.substring(0, 1000),
        nextRetryAt: nextRetry,
      })
      .where(eq(webhookEvents.id, eventId))

    return false
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (newAttempts >= (event.maxAttempts ?? 5)) {
      await db
        .update(webhookEvents)
        .set({
          status: 'failed',
          attempts: newAttempts,
          responseBody: errorMessage.substring(0, 1000),
        })
        .where(eq(webhookEvents.id, eventId))
      return false
    }

    // Schedule retry
    const delayIndex = Math.min(newAttempts, RETRY_DELAYS.length - 1)
    const nextRetry = new Date(Date.now() + RETRY_DELAYS[delayIndex] * 1000)

    await db
      .update(webhookEvents)
      .set({
        attempts: newAttempts,
        responseBody: errorMessage.substring(0, 1000),
        nextRetryAt: nextRetry,
      })
      .where(eq(webhookEvents.id, eventId))

    return false
  }
}

export async function processPendingWebhooks(limit: number = 100): Promise<number> {
  const now = new Date()

  const pendingEvents = await db
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.status, 'pending'),
        or(lt(webhookEvents.nextRetryAt, now), isNull(webhookEvents.nextRetryAt))
      )
    )
    .limit(limit)

  let delivered = 0
  for (const event of pendingEvents) {
    const success = await deliverWebhook(event.id)
    if (success) delivered++
  }

  return delivered
}

export async function createWebhook(
  userId: string,
  url: string,
  events: string[],
  description?: string
): Promise<{ id: string; secret: string }> {
  const secret = `whsec_${crypto.randomUUID().replace(/-/g, '')}`

  const [row] = await db
    .insert(webhooks)
    .values({
      userId,
      url,
      secret,
      events,
      description,
      isActive: true,
    })
    .returning({ id: webhooks.id })

  return { id: row.id, secret }
}

export async function listWebhooks(userId: string) {
  return db
    .select({
      id: webhooks.id,
      url: webhooks.url,
      events: webhooks.events,
      isActive: webhooks.isActive,
      description: webhooks.description,
      createdAt: webhooks.createdAt,
    })
    .from(webhooks)
    .where(eq(webhooks.userId, userId))
    .orderBy(webhooks.createdAt)
}

export async function deleteWebhook(userId: string, webhookId: string): Promise<boolean> {
  const [deleted] = await db
    .delete(webhooks)
    .where(and(eq(webhooks.id, webhookId), eq(webhooks.userId, userId)))
    .returning({ id: webhooks.id })

  return !!deleted
}

export async function updateWebhook(
  userId: string,
  webhookId: string,
  updates: { url?: string; events?: string[]; isActive?: boolean; description?: string | null }
): Promise<boolean> {
  const [updated] = await db
    .update(webhooks)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(webhooks.id, webhookId), eq(webhooks.userId, userId)))
    .returning({ id: webhooks.id })

  return !!updated
}

/**
 * Clean up old webhook events to prevent unbounded table growth.
 * Deletes delivered events older than retentionDays and failed events older than failedRetentionDays.
 */
export async function cleanupWebhookEvents(
  retentionDays: number = 7,
  failedRetentionDays: number = 30
): Promise<{ deletedDelivered: number; deletedFailed: number }> {
  const deliveredCutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000)
  const failedCutoff = new Date(Date.now() - failedRetentionDays * 24 * 60 * 60 * 1000)

  // Delete old delivered events
  const deliveredToDelete = await db
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(and(eq(webhookEvents.status, 'delivered'), lt(webhookEvents.deliveredAt, deliveredCutoff)))
    .limit(1000)

  let deletedDelivered = 0
  if (deliveredToDelete.length > 0) {
    await db
      .delete(webhookEvents)
      .where(inArray(webhookEvents.id, deliveredToDelete.map((e) => e.id)))
    deletedDelivered = deliveredToDelete.length
  }

  // Delete old failed events
  const failedToDelete = await db
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(and(eq(webhookEvents.status, 'failed'), lt(webhookEvents.createdAt, failedCutoff)))
    .limit(1000)

  let deletedFailed = 0
  if (failedToDelete.length > 0) {
    await db
      .delete(webhookEvents)
      .where(inArray(webhookEvents.id, failedToDelete.map((e) => e.id)))
    deletedFailed = failedToDelete.length
  }

  return { deletedDelivered, deletedFailed }
}
