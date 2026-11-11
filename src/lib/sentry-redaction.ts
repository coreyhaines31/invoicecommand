import { hasTokenInPath, REDACTED_TOKEN_PATH } from '@/lib/analytics-redaction'

// Sentry puts URLs in many places: request.url, the Referer header, transaction
// names, span descriptions, navigation/fetch breadcrumbs and replay recordings.
// Rather than chase each field, redact share tokens in every string of the
// event before it leaves the browser or server.

// /i/<token> at the start of a string, after whitespace/quotes, or right after
// a URL's host. Skips the route pattern /i/[token] and already-redacted paths.
const TOKEN_PATH_IN_TEXT_RE = /(^|[\s"'(=]|:\/\/[^/\s"']+)\/i\/(?!\[)[^/?#\s"'<>)]+/g

const SENSITIVE_QUERY_PARAMS = ['token', 't', 'reset_token', 'verification_token', 'access_token', 'apiKey', 'api_key', 'key']
const TOKEN_QUERY_IN_TEXT_RE = new RegExp(`([?&](?:${SENSITIVE_QUERY_PARAMS.join('|')})=)[^&#\\s"']+`, 'g')

const MAX_DEPTH = 12

export function redactSecretsInText(text: string): string {
  if (!text.includes('/i/') && !text.includes('=')) return text
  return text
    .replace(TOKEN_PATH_IN_TEXT_RE, `$1${REDACTED_TOKEN_PATH}`)
    .replace(TOKEN_QUERY_IN_TEXT_RE, '$1REDACTED')
}

// Redacts in place; objects are walked once, so shared references and cycles
// are safe.
export function redactDeep<T>(value: T): T {
  const seen = new WeakSet<object>()

  const walk = (node: unknown, depth: number): unknown => {
    if (typeof node === 'string') return redactSecretsInText(node)
    if (!node || typeof node !== 'object' || depth > MAX_DEPTH) return node
    if (seen.has(node)) return node
    seen.add(node)

    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) node[i] = walk(node[i], depth + 1)
      return node
    }
    const record = node as Record<string, unknown>
    for (const key of Object.keys(record)) {
      record[key] = walk(record[key], depth + 1)
    }
    return node
  }

  return walk(value, 0) as T
}

// For beforeSend, beforeSendTransaction, beforeBreadcrumb and Replay's
// beforeAddRecordingEvent: same object back, with tokens redacted.
export function scrubSentryPayload<T>(payload: T): T {
  if (!payload) return payload
  return redactDeep(payload)
}

// Replay must not run on share-link pages: it records the URL and the network
// requests made from it.
export function isReplayBlockedPath(pathnameOrHref: string): boolean {
  let pathname = pathnameOrHref
  try {
    pathname = new URL(pathnameOrHref, 'https://placeholder.invalid').pathname
  } catch {
    // keep the raw value
  }
  return hasTokenInPath(pathname)
}
