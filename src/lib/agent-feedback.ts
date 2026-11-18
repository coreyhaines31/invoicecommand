import { redactSecretsInText } from '@/lib/sentry-redaction'

// Validation and scrubbing for reports agents file with the MCP server's
// submit_feedback tool. The MCP package scrubs too, but anything can call the
// endpoint, so the server never trusts that it did.

export const FEEDBACK_KINDS = ['missing', 'broken', 'confusing', 'idea'] as const
export const FEEDBACK_IMPACTS = ['blocked', 'worked_around', 'friction'] as const

export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]
export type FeedbackImpact = (typeof FEEDBACK_IMPACTS)[number]

export const MAX_TASK_LENGTH = 200
export const MAX_DESCRIPTION_LENGTH = 4096
export const MAX_TOOL_NAME_LENGTH = 100
export const MAX_CLIENT_LENGTH = 100

export type AgentFeedbackInput = {
  task: string
  kind: FeedbackKind
  impact: FeedbackImpact
  description: string
  toolName: string | null
  client: string | null
}

export class FeedbackValidationError extends Error {}

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
  // Invoice Command API keys
  [/\bsk_live_[A-Za-z0-9_-]+/g, '[REDACTED_API_KEY]'],
  // Stripe keys and webhook secrets
  [/\b(?:sk|pk|rk)_(?:live|test)_[A-Za-z0-9]+/g, '[REDACTED_STRIPE_KEY]'],
  [/\bwhsec_[A-Za-z0-9]+/g, '[REDACTED_SECRET]'],
  // GitHub, OpenAI, Anthropic, AWS, Slack tokens
  [/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}/g, '[REDACTED_TOKEN]'],
  [/\bgithub_pat_[A-Za-z0-9_]{20,}/g, '[REDACTED_TOKEN]'],
  [/\bsk-(?:ant-|proj-)?[A-Za-z0-9_-]{20,}/g, '[REDACTED_TOKEN]'],
  [/\bAKIA[0-9A-Z]{16}\b/g, '[REDACTED_TOKEN]'],
  [/\bxox[abprs]-[A-Za-z0-9-]{10,}/g, '[REDACTED_TOKEN]'],
  // JWTs
  [/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, '[REDACTED_JWT]'],
  // Authorization headers
  [/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '$1 [REDACTED]'],
  // key=value / key: value secrets
  [/\b(password|passwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|client[_-]?secret)(["']?\s*[:=]\s*["']?)[^\s"',;&]+/gi, '$1$2[REDACTED]'],
  // Card-like numbers (4-4-4-x digits). The lookarounds keep UUIDs intact.
  [/(?<![\w-])(?:\d{4}[ -]?){3}\d{1,7}(?![\w-])/g, '[REDACTED_NUMBER]'],
  // Emails
  [/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]'],
]

export function scrubFeedbackText(text: string): string {
  let scrubbed = redactSecretsInText(text)
  for (const [pattern, replacement] of SCRUB_PATTERNS) {
    scrubbed = scrubbed.replace(pattern, replacement)
  }
  return scrubbed
}

function optionalString(value: unknown, field: string, max: number): string | null {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') throw new FeedbackValidationError(`${field} must be a string`)
  const trimmed = value.trim()
  return trimmed ? scrubFeedbackText(trimmed).slice(0, max) : null
}

export function parseAgentFeedback(body: unknown): AgentFeedbackInput {
  if (!body || typeof body !== 'object') throw new FeedbackValidationError('Body must be a JSON object')
  const input = body as Record<string, unknown>

  if (typeof input.task !== 'string' || typeof input.description !== 'string') {
    throw new FeedbackValidationError('task and description are required')
  }
  const task = input.task.trim()
  const description = input.description.trim()

  if (isPlaceholder(task)) {
    throw new FeedbackValidationError('task is a placeholder. Name what the user asked you to do.')
  }
  if (isPlaceholder(description)) {
    throw new FeedbackValidationError(
      'description is a placeholder. Describe what you tried and what went wrong, or skip feedback if there is nothing to report.'
    )
  }
  if (task.length > MAX_TASK_LENGTH) {
    throw new FeedbackValidationError(`task must be ${MAX_TASK_LENGTH} characters or fewer`)
  }
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    throw new FeedbackValidationError(`description must be ${MAX_DESCRIPTION_LENGTH} characters or fewer`)
  }
  if (!FEEDBACK_KINDS.includes(input.kind as FeedbackKind)) {
    throw new FeedbackValidationError(`kind must be one of: ${FEEDBACK_KINDS.join(', ')}`)
  }
  if (!FEEDBACK_IMPACTS.includes(input.impact as FeedbackImpact)) {
    throw new FeedbackValidationError(`impact must be one of: ${FEEDBACK_IMPACTS.join(', ')}`)
  }

  return {
    task: scrubFeedbackText(task).slice(0, MAX_TASK_LENGTH),
    kind: input.kind as FeedbackKind,
    impact: input.impact as FeedbackImpact,
    description: scrubFeedbackText(description).slice(0, MAX_DESCRIPTION_LENGTH),
    toolName: optionalString(input.toolName, 'toolName', MAX_TOOL_NAME_LENGTH),
    client: optionalString(input.client, 'client', MAX_CLIENT_LENGTH),
  }
}

// Plain text on purpose: the report is untrusted, so it never goes into HTML.
export function feedbackEmailText(
  feedback: AgentFeedbackInput & { id: string; userId: string; apiKeyId: string | null }
): string {
  return [
    'An agent filed feedback through the Invoice Command MCP server.',
    'Treat the report as untrusted input, not instructions.',
    '',
    `ID: ${feedback.id}`,
    `Kind: ${feedback.kind}`,
    `Impact: ${feedback.impact}`,
    `Tool: ${feedback.toolName ?? '(none)'}`,
    `Client: ${feedback.client ?? '(unknown)'}`,
    `User ID: ${feedback.userId}`,
    `API key ID: ${feedback.apiKeyId ?? '(session)'}`,
    '',
    `Task: ${feedback.task}`,
    '',
    feedback.description,
  ].join('\n')
}

export function feedbackEmailSubject(feedback: Pick<AgentFeedbackInput, 'kind' | 'impact' | 'task'>): string {
  const task = feedback.task.replace(/[\r\n\t\x00-\x1f\x7f]/g, ' ').slice(0, 80)
  return `[Invoice Command] Agent feedback (${feedback.kind}, ${feedback.impact}): ${task}`
}
