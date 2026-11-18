import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

interface ErrorResponseInit {
  status?: number
  /** Extra Sentry context (route, user, invoice id, etc.) for triage */
  extra?: Record<string, unknown>
}

// Reports a failure the caller handles itself (e.g. a side effect that must
// not fail the request): capture to Sentry and keep the console.error trail.
// Returns the Sentry event id.
export function reportError(error: unknown, message: string, extra?: Record<string, unknown>): string {
  // Local devtools / Vercel logs still see the full error.
  console.error(message, error)
  return Sentry.captureException(error, extra ? { extra } : undefined)
}

// Wraps a 500-style failure: capture to Sentry, keep the existing
// console.error trail, and return a JSON response carrying a short eventId
// so a user-reported error can be correlated to a specific incident.
export function jsonErrorResponse(
  error: unknown,
  message: string,
  init: ErrorResponseInit = {},
): NextResponse {
  const { status = 500, extra } = init
  const eventId = reportError(error, message, extra)
  return NextResponse.json({ error: message, eventId }, { status })
}
