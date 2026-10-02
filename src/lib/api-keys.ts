import { db } from '@/lib/db'
import { apiKeys } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { createHash, randomBytes } from 'crypto'

const KEY_PREFIX = 'sk_live_'
const KEY_LENGTH = 32 // Random bytes for key

export type RateLimitInfo = {
  limit: number
  remaining: number
  reset: Date
}

// Base API key info (shared between generation and validation)
export type ApiKeyBase = {
  id: string
  userId: string
  name: string
  keyPrefix: string
  scopes: string[]
  rateLimit: number
  expiresAt: Date | null
}

// Result from validateApiKey - includes rate limit tracking
export type ApiKeyResult = ApiKeyBase & {
  rateLimitInfo: RateLimitInfo
}

// Result from generateApiKey - includes the full key (only shown once)
export type GeneratedApiKey = ApiKeyBase & {
  key: string // Full key, only returned once on creation
}

// Result from listApiKeys - includes metadata for display
export type ApiKeyListItem = ApiKeyBase & {
  lastUsedAt: Date | null
  createdAt: Date | null
}

export type ApiKeyValidationResult =
  | { valid: true; apiKey: ApiKeyResult }
  | { valid: false; error: string; status: number }

function hashKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export async function generateApiKey(
  userId: string,
  name: string,
  options: {
    scopes?: string[]
    rateLimit?: number
    expiresAt?: Date
  } = {}
): Promise<GeneratedApiKey> {
  const randomPart = randomBytes(KEY_LENGTH).toString('base64url')
  const fullKey = `${KEY_PREFIX}${randomPart}`
  const keyPrefix = fullKey.substring(0, 12) // sk_live_xxxx
  const keyHash = hashKey(fullKey)

  const [row] = await db
    .insert(apiKeys)
    .values({
      userId,
      name,
      keyPrefix,
      keyHash,
      scopes: options.scopes ?? ['invoices:read', 'invoices:write'],
      rateLimit: options.rateLimit ?? 1000,
      expiresAt: options.expiresAt ?? null,
    })
    .returning()

  return {
    id: row.id,
    userId: row.userId,
    name: row.name,
    keyPrefix: row.keyPrefix,
    scopes: row.scopes as string[],
    rateLimit: row.rateLimit ?? 1000,
    expiresAt: row.expiresAt,
    key: fullKey,
  }
}

export async function validateApiKey(key: string): Promise<ApiKeyValidationResult> {
  if (!key.startsWith(KEY_PREFIX)) {
    return { valid: false, error: 'Invalid API key format', status: 401 }
  }

  const keyHash = hashKey(key)

  const [row] = await db
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, keyHash))
    .limit(1)

  if (!row) {
    return { valid: false, error: 'Invalid API key', status: 401 }
  }

  if (!row.isActive) {
    return { valid: false, error: 'API key has been revoked', status: 401 }
  }

  if (row.expiresAt && row.expiresAt < new Date()) {
    return { valid: false, error: 'API key has expired', status: 401 }
  }

  // Check rate limit
  const now = new Date()
  const resetAt = row.requestCountResetAt ?? now
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000)

  let currentCount = row.requestCount ?? 0
  let shouldResetCount = resetAt < hourAgo

  if (shouldResetCount) {
    currentCount = 0
  }

  if (currentCount >= (row.rateLimit ?? 1000)) {
    return { valid: false, error: 'Rate limit exceeded', status: 429 }
  }

  // Calculate rate limit info before updating
  const rateLimit = row.rateLimit ?? 1000
  const newCount = shouldResetCount ? 1 : currentCount + 1
  const newResetAt = shouldResetCount ? now : resetAt
  const resetTime = new Date(newResetAt.getTime() + 60 * 60 * 1000) // 1 hour from reset

  // Update usage stats
  await db
    .update(apiKeys)
    .set({
      requestCount: newCount,
      requestCountResetAt: newResetAt,
      lastUsedAt: now,
      updatedAt: now,
    })
    .where(eq(apiKeys.id, row.id))

  return {
    valid: true,
    apiKey: {
      id: row.id,
      userId: row.userId,
      name: row.name,
      keyPrefix: row.keyPrefix,
      scopes: row.scopes as string[],
      rateLimit,
      expiresAt: row.expiresAt,
      rateLimitInfo: {
        limit: rateLimit,
        remaining: Math.max(0, rateLimit - newCount),
        reset: resetTime,
      },
    },
  }
}

export async function revokeApiKey(userId: string, keyId: string): Promise<boolean> {
  const [row] = await db
    .update(apiKeys)
    .set({ isActive: false, updatedAt: new Date() })
    .where(and(eq(apiKeys.id, keyId), eq(apiKeys.userId, userId)))
    .returning({ id: apiKeys.id })

  return !!row
}

export async function listApiKeys(userId: string): Promise<ApiKeyListItem[]> {
  const rows = await db
    .select({
      id: apiKeys.id,
      userId: apiKeys.userId,
      name: apiKeys.name,
      keyPrefix: apiKeys.keyPrefix,
      scopes: apiKeys.scopes,
      rateLimit: apiKeys.rateLimit,
      expiresAt: apiKeys.expiresAt,
      isActive: apiKeys.isActive,
      lastUsedAt: apiKeys.lastUsedAt,
      createdAt: apiKeys.createdAt,
    })
    .from(apiKeys)
    .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)))
    .orderBy(apiKeys.createdAt)

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    name: row.name,
    keyPrefix: row.keyPrefix,
    scopes: row.scopes as string[],
    rateLimit: row.rateLimit ?? 1000,
    expiresAt: row.expiresAt,
    lastUsedAt: row.lastUsedAt,
    createdAt: row.createdAt,
  }))
}
