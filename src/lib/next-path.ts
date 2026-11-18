// The `next` query param on /auth/login and /auth/signup says where to send
// the user after they authenticate. It comes from the URL, so anyone can craft
// it: only same-origin relative paths are allowed, or it becomes an open
// redirect.

export const DEFAULT_NEXT_PATH = '/dashboard'

const PLACEHOLDER_ORIGIN = 'https://placeholder.invalid'

export function getSafeNextPath(value: unknown): string | null {
  if (typeof value !== 'string') return null
  if (value.length === 0 || value.length > 2048) return null
  if (!value.startsWith('/')) return null
  if (value.startsWith('//')) return null
  if (value.includes('\\')) return null
  // Browsers strip tabs and newlines from URLs, so "/\t/evil.com" becomes "//evil.com".
  if (/[\u0000-\u001f\u007f]/.test(value)) return null

  try {
    const url = new URL(value, PLACEHOLDER_ORIGIN)
    if (url.origin !== PLACEHOLDER_ORIGIN) return null
  } catch {
    return null
  }

  return value
}

export function resolveNextPath(value: unknown): string {
  return getSafeNextPath(value) ?? DEFAULT_NEXT_PATH
}

// Appends ?next= to an internal auth link, so the return path survives a hop
// between /auth/login and /auth/signup.
export function withNextPath(href: string, next: string | null | undefined): string {
  const safe = getSafeNextPath(next)
  if (!safe) return href
  const separator = href.includes('?') ? '&' : '?'
  return `${href}${separator}next=${encodeURIComponent(safe)}`
}
