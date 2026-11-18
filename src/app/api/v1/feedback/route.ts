import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest, createApiResponse } from '@/lib/api-auth'
import { db } from '@/lib/db'
import { agentFeedback } from '@/lib/db/schema'
import { jsonErrorResponse, reportError } from '@/lib/error-response'
import { checkRateLimit } from '@/lib/rate-limit'
import { appFromEmail, sendMail } from '@/lib/mail'
import {
  FeedbackValidationError,
  feedbackEmailSubject,
  feedbackEmailText,
  parseAgentFeedback,
} from '@/lib/agent-feedback'

// POST /api/v1/feedback - An agent reports a missing, broken or confusing MCP
// tool to the Invoice Command maintainers. Any valid key can file one; no
// scope is needed, since it reads and changes none of the user's data.
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const rl = checkRateLimit(authResult.userId, { bucket: 'agent-feedback', max: 10, windowMs: 60 * 60 * 1000 })
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Too many feedback reports. Try again later.' },
        { status: 429, headers: { 'Retry-After': rl.retryAfter.toString() } }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    let feedback
    try {
      feedback = parseAgentFeedback(body)
    } catch (error) {
      if (error instanceof FeedbackValidationError) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      throw error
    }

    const apiKeyId = authResult.method === 'api_key' ? authResult.apiKey.id : null
    const [row] = await db
      .insert(agentFeedback)
      .values({ ...feedback, userId: authResult.userId, apiKeyId })
      .returning({ id: agentFeedback.id })

    // The report is stored either way; a failed notification is only reported.
    const supportEmail = process.env.SUPPORT_EMAIL
    if (supportEmail) {
      try {
        await sendMail({
          from: appFromEmail(),
          to: supportEmail,
          subject: feedbackEmailSubject(feedback),
          text: feedbackEmailText({ ...feedback, id: row.id, userId: authResult.userId, apiKeyId }),
        })
      } catch (error) {
        reportError(error, 'Agent feedback email failed', { feedbackId: row.id })
      }
    } else {
      console.warn('SUPPORT_EMAIL is not configured; agent feedback stored without a notification')
    }

    return createApiResponse({ data: { id: row.id } }, authResult, { status: 201 })
  } catch (error) {
    return jsonErrorResponse(error, 'Failed to submit feedback')
  }
}
