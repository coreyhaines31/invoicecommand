// Helpers for the submit_feedback tool. The server scrubs again; this keeps
// secrets from leaving the user's machine at all.

export const FEEDBACK_TOOL_NAME = 'submit_feedback'

// Filler agents send instead of a real report, compared after lowercasing and
// dropping everything but letters and digits.
const PLACEHOLDERS = new Set([
  '',
  'na',
  'none',
  'noop',
  'null',
  'nothing',
  'placeholder',
  'tbd',
  'test',
  'testing',
  'todo',
  'undefined',
])

export function isPlaceholder(text: string): boolean {
  return PLACEHOLDERS.has(text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, ''))
}

const SCRUB_PATTERNS: Array<[RegExp, string]> = [
  [/\bsk_live_[A-Za-z0-9_-]+/g, '[REDACTED_API_KEY]'],
  [/\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]+/g, '[REDACTED_STRIPE_KEY]'],
  [/\bwhsec_[A-Za-z0-9]+/g, '[REDACTED_SECRET]'],
  [/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/g, '[REDACTED_TOKEN]'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/g, '[REDACTED_TOKEN]'],
  [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/g, '[REDACTED_TOKEN]'],
  [/\bAKIA[0-9A-Z]{16}\b/g, '[REDACTED_TOKEN]'],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/g, '[REDACTED_TOKEN]'],
  [/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]'],
  [/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '$1 [REDACTED]'],
  [/\b(password|passwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|client[_-]?secret)(["']?\s*[:=]\s*["']?)[^\s"',;&]+/gi, '$1$2[REDACTED]'],
  // Share links carry the token that guards a shared invoice.
  [/\/i\/(?!\[)[^/?#\s"'<>)]+/g, '/i/[redacted]'],
  // Card-like numbers (4-4-4-x digits). The lookarounds keep UUIDs intact.
  [/(?<![\w-])(?:\d{4}[ -]?){3}\d{1,7}(?![\w-])/g, '[REDACTED_NUMBER]'],
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]'],
]

export function scrubFeedbackText(text: string): string {
  let scrubbed = text
  for (const [pattern, replacement] of SCRUB_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, replacement)
  }
  return scrubbed
}

// Point the agent at submit_feedback only for failures that likely mean an
// Invoice Command bug: server errors and anything that isn't an API response
// (network failures, crashes). Not validation, auth, permission, not-found or
// rate-limit errors, which the user or agent can fix.
export function isUnexpectedError(error: unknown): boolean {
  const status = (error as { status?: unknown } | null)?.status
  return typeof status === 'number' ? status >= 500 : true
}

export const FEEDBACK_POINTER = `If this looks like an Invoice Command bug, report it with \`${FEEDBACK_TOOL_NAME}\`.`
