import * as Sentry from '@sentry/nextjs'
import { NextResponse } from 'next/server'

interface ErrorResponseInit {
  status?: number
  /** Extra Sentry context (route, user, invoice id, etc.) for triage */
  extra?: Record<string, unknown>
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

  // Local devtools / Vercel logs still see the full error.
  console.error(message, error)

  const eventId = Sentry.captureException(error, extra ? { extra } : undefined)

  return NextResponse.json({ error: message, eventId }, { status })
}
