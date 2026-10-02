import type { NextRequest } from 'next/server'

// In-memory per-key token-bucket rate limiter.
//
// LIMITATION: per Vercel-function-instance only. A distributed abuser bypasses
// this by causing horizontal scale. Sufficient for single-attacker bursts and
// as defense-in-depth on top of provider-level limits (Resend, Stripe, OpenAI).
// Swap for Upstash Redis / Vercel KV when distributed enforcement is needed.
type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export type RateLimitOptions = {
  /** Identifier used to namespace separate limiters (e.g. "support", "send-invoice"). */
  bucket: string
  /** Max requests per window per key. */
  max: number
  /** Window length in milliseconds. */
  windowMs: number
}

export type RateLimitResult =
  | { allowed: true; remaining: number; reset: Date }
  | { allowed: false; retryAfter: number; reset: Date }

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-vercel-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    (request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '') ||
    'unknown'
  )
}

export function checkRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  // Opportunistic cleanup to bound memory growth.
  if (buckets.size > 4096) {
    for (const [k, v] of buckets) {
      if (v.resetAt < now) buckets.delete(k)
    }
  }

  const fullKey = `${options.bucket}:${key}`
  const existing = buckets.get(fullKey)

  if (!existing || existing.resetAt < now) {
    const resetAt = now + options.windowMs
    buckets.set(fullKey, { count: 1, resetAt })
    return { allowed: true, remaining: options.max - 1, reset: new Date(resetAt) }
  }

  if (existing.count >= options.max) {
    return {
      allowed: false,
      retryAfter: Math.ceil((existing.resetAt - now) / 1000),
      reset: new Date(existing.resetAt),
    }
  }

  existing.count++
  return {
    allowed: true,
    remaining: options.max - existing.count,
    reset: new Date(existing.resetAt),
  }
}

/** Convenience: per-IP rate limit for unauthenticated endpoints. */
export function checkIpRateLimit(request: NextRequest, options: RateLimitOptions): RateLimitResult {
  return checkRateLimit(getClientIp(request), options)
}
