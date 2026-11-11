// Share links put the access token in the path (/i/<token>), and the token is
// the only thing guarding a shared invoice. Anything that sends URLs to an
// analytics vendor has to run them through here first.

const TOKEN_PATH_RE = /^\/i\/[^/?#]+/
export const REDACTED_TOKEN_PATH = '/i/[redacted]'

// Query params that carry auth/share secrets.
const SENSITIVE_QUERY_PARAMS = new Set([
  'token',
  't',
  'reset_token',
  'verification_token',
  'access_token',
  'apiKey',
  'api_key',
  'key',
])

// Pages that render a token in their URL or show invoice content. Session
// replay and autocapture stay off here.
const SENSITIVE_PATH_RES = [/^\/i(\/|$)/, /^\/invoice(\/|$)/]

// Element-level events record clicked text and hrefs, i.e. invoice content.
const ELEMENT_EVENTS = new Set(['$autocapture', '$rageclick', '$dead_click', '$copy_autocapture'])

export function redactPath(pathname: string): string {
  return pathname.replace(TOKEN_PATH_RE, REDACTED_TOKEN_PATH)
}

export function hasTokenInPath(pathname: string): boolean {
  return TOKEN_PATH_RE.test(pathname)
}

export function isSensitivePath(pathname: string): boolean {
  return SENSITIVE_PATH_RES.some((re) => re.test(pathname))
}

const ABSOLUTE_URL_RE = /^https?:\/\//i

export function scrubUrl(value: string): string {
  try {
    const looksAbsolute = ABSOLUTE_URL_RE.test(value)
    const u = new URL(value, looksAbsolute ? undefined : 'https://placeholder.invalid')
    let mutated = false
    for (const param of SENSITIVE_QUERY_PARAMS) {
      if (u.searchParams.has(param)) {
        u.searchParams.set(param, 'REDACTED')
        mutated = true
      }
    }
    const path = redactPath(u.pathname)
    if (path !== u.pathname) mutated = true
    if (!mutated) return value
    const rest = `${path}${u.search}${u.hash}`
    return looksAbsolute ? `${u.origin}${rest}` : rest
  } catch {
    return value
  }
}

function looksLikeUrl(value: string): boolean {
  return value.startsWith('/') || value.includes('?') || ABSOLUTE_URL_RE.test(value)
}

export function scrubProperties<T extends Record<string, unknown>>(properties: T): T {
  for (const key of Object.keys(properties)) {
    const value = properties[key]
    if (typeof value === 'string' && looksLikeUrl(value)) {
      (properties as Record<string, unknown>)[key] = scrubUrl(value)
    }
  }
  return properties
}

type AnalyticsEvent = {
  event: string
  properties?: Record<string, unknown>
  $set?: Record<string, unknown>
  $set_once?: Record<string, unknown>
}

// before_send hook: drops element events on sensitive pages and redacts every
// URL-shaped property, including the person properties PostHog persists
// ($initial_current_url, $initial_referrer, ...).
export function scrubEvent<T extends AnalyticsEvent>(event: T | null, currentPathname?: string): T | null {
  if (!event) return event
  const pathname =
    currentPathname ??
    (typeof event.properties?.$pathname === 'string' ? event.properties.$pathname : '')

  if (isSensitivePath(pathname)) {
    if (ELEMENT_EVENTS.has(event.event)) return null
    if (event.properties) delete event.properties.title
  }

  if (event.properties) scrubProperties(event.properties)
  if (event.$set) scrubProperties(event.$set)
  if (event.$set_once) scrubProperties(event.$set_once)
  return event
}
