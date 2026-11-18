import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { voiceUsage } from '@/lib/db/schema'
import { and, eq, lt, sql } from 'drizzle-orm'
import { requestVoiceUpdate } from '@/lib/voice-parser'

// Initialize OpenAI client conditionally
let openai: OpenAI | null = null
const MONTHLY_LIMIT = 10
// A 200-line invoice with long descriptions, notes and terms is about 43 KB
// of JSON; this leaves headroom while bounding what is sent to the model.
const MAX_INVOICE_CHARS = 64_000

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }
  return openai
}

function currentMonthYear() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

async function consumeVoiceUsage(userId: string): Promise<boolean> {
  const monthYear = currentMonthYear()
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

interface InvoiceUpdate {
  field?: string
  value?: string | number | boolean
  action?: 'add_item' | 'update_item' | 'remove_item' | 'update_field'
  itemIndex?: number
  item?: {
    description: string
    quantity: number
    price: number
  }
  explanation?: string
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

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Atomic-increment-first: reserve a slot BEFORE calling OpenAI. Two concurrent
    // requests cannot both pass the check-then-increment race that the previous
    // SELECT-then-UPDATE allowed. Failed OpenAI calls still count against the cap,
    // which is the lesser-bad tradeoff vs letting a parallel attacker exceed it.
    const reserved = await consumeVoiceUsage(session.user.id)
    if (!reserved) {
      return NextResponse.json({ error: 'Voice command limit reached for this month' }, { status: 429 })
    }

    // Get OpenAI client
    const client = getOpenAIClient()
    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI client not available' },
        { status: 500 }
      )
    }

    const { content: response } = await requestVoiceUpdate(client, {
      transcript: sanitizedTranscript,
      currentInvoice,
      now: new Date(),
    })

    if (!response) {
      return NextResponse.json(
        { error: 'No response from AI' },
        { status: 500 }
      )
    }

    // Try to parse the JSON response
    let parsedUpdate: InvoiceUpdate
    try {
      parsedUpdate = JSON.parse(response)
    } catch {
      console.error('Failed to parse AI response:', response)
      return NextResponse.json(
        { error: 'Invalid response format from AI' },
        { status: 500 }
      )
    }

    // Validate the response structure
    if (!parsedUpdate.action) {
      return NextResponse.json(
        { error: 'AI response missing required action field' },
        { status: 500 }
      )
    }

    // Return the structured update (usage already reserved above)
    return NextResponse.json({
      success: true,
      update: parsedUpdate,
      originalTranscript: sanitizedTranscript
    })

  } catch (error) {
    console.error('Voice parsing error:', error)

    if (error instanceof Error && error.message.includes('API key')) {
      return NextResponse.json(
        { error: 'OpenAI API configuration error' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process voice command' },
      { status: 500 }
    )
  }
}
