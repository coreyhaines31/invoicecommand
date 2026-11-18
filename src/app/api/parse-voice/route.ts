import { NextRequest, NextResponse } from 'next/server'
import { NoObjectGeneratedError } from 'ai'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { voiceUsage } from '@/lib/db/schema'
import { and, eq, lt, sql } from 'drizzle-orm'
import { jsonErrorResponse } from '@/lib/error-response'
import { requestVoiceUpdate, voiceModel, type VoiceUpdate } from '@/lib/voice-parser'

const MONTHLY_LIMIT = 10
// A 200-line invoice with long descriptions, notes and terms is about 43 KB
// of JSON; this leaves headroom while bounding what is sent to the model.
const MAX_INVOICE_CHARS = 64_000

function currentMonthYear() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

async function consumeVoiceUsage(userId: string, monthYear: string): Promise<boolean> {
  const now = new Date()

  const [updated] = await db
    .update(voiceUsage)
    .set({
      commandCount: sql`${voiceUsage.commandCount} + 1`,
      lastUsed: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(voiceUsage.userId, userId),
        eq(voiceUsage.monthYear, monthYear),
        lt(voiceUsage.commandCount, MONTHLY_LIMIT)
      )
    )
    .returning({ commandCount: voiceUsage.commandCount })

  if (updated) return true

  const [inserted] = await db
    .insert(voiceUsage)
    .values({ userId, monthYear, commandCount: 1, lastUsed: now })
    .onConflictDoNothing({ target: [voiceUsage.userId, voiceUsage.monthYear] })
    .returning({ commandCount: voiceUsage.commandCount })

  if (inserted) return true

  const [retry] = await db
    .update(voiceUsage)
    .set({
      commandCount: sql`${voiceUsage.commandCount} + 1`,
      lastUsed: now,
      updatedAt: now,
    })
    .where(
      and(
        eq(voiceUsage.userId, userId),
        eq(voiceUsage.monthYear, monthYear),
        lt(voiceUsage.commandCount, MONTHLY_LIMIT)
      )
    )
    .returning({ commandCount: voiceUsage.commandCount })

  return !!retry
}


interface VoiceParseRequest {
  transcript: string
  currentInvoice: {
    senderName: string
    senderEmail: string
    senderAddress: string
    senderCity: string
    senderState: string
    senderZip: string
    senderPhone: string
    clientName: string
    clientEmail: string
    clientAddress: string
    clientCity: string
    clientState: string
    clientZip: string
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    items: Array<{
      description: string
      quantity: number
      price: number
    }>
    taxRate: number
    discountRate: number
    notes: string
    terms: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body: VoiceParseRequest = await request.json()
    const { transcript, currentInvoice } = body

    // Input validation and sanitization
    if (!transcript?.trim()) {
      return NextResponse.json(
        { error: 'Transcript is required' },
        { status: 400 }
      )
    }

    // Basic input sanitization
    const sanitizedTranscript = transcript
      .trim()
      .slice(0, 1000) // Limit length
      .replace(/[<>]/g, '') // Remove potential HTML/XML tags

    if (sanitizedTranscript.length < 2) {
      return NextResponse.json(
        { error: 'Transcript too short' },
        { status: 400 }
      )
    }

    if (JSON.stringify(currentInvoice ?? {}).length > MAX_INVOICE_CHARS) {
      return NextResponse.json(
        { error: 'Invoice is too large for voice commands' },
        { status: 400 }
      )
    }

    // Atomic-increment-first: reserve a slot BEFORE calling the model. Two
    // concurrent requests cannot both pass the check-then-increment race that a
    // SELECT-then-UPDATE allows, and reserving after the call would let parallel
    // requests run the model past the cap.
    const monthYear = currentMonthYear()
    const reserved = await consumeVoiceUsage(session.user.id, monthYear)
    if (!reserved) {
      return NextResponse.json({ error: 'Voice command limit reached for this month' }, { status: 429 })
    }

    let update: VoiceUpdate
    try {
      ;({ update } = await requestVoiceUpdate({
        transcript: sanitizedTranscript,
        currentInvoice,
        now: new Date(),
      }))
    } catch (error) {
      // The model answered, but not in the update shape: the use stays spent.
      if (NoObjectGeneratedError.isInstance(error)) {
        return jsonErrorResponse(error, 'Invalid response format from AI', { extra: { model: voiceModel() } })
      }

      throw error
    }

    // The model could not tell what to change. The client shows `error`.
    if (update.action === 'error') {
      return NextResponse.json(
        { error: update.explanation || 'Could not understand that command' },
        { status: 422 }
      )
    }

    // Return the structured update (usage already reserved above)
    return NextResponse.json({
      success: true,
      update,
      originalTranscript: sanitizedTranscript
    })

  } catch (error) {
    return jsonErrorResponse(error, 'Failed to process voice command')
  }
}
