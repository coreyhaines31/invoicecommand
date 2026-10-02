import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { voiceUsage } from '@/lib/db/schema'
import { eq, and, lt, sql } from 'drizzle-orm'

const MONTHLY_LIMIT = 10

function currentMonthYear() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const monthYear = currentMonthYear()
    const [row] = await db
      .select({ commandCount: voiceUsage.commandCount })
      .from(voiceUsage)
      .where(and(eq(voiceUsage.userId, session.user.id), eq(voiceUsage.monthYear, monthYear)))

    const used = row?.commandCount ?? 0
    return NextResponse.json({ used, limit: MONTHLY_LIMIT, canUse: used < MONTHLY_LIMIT })
  } catch (error) {
    console.error('Voice usage GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
          eq(voiceUsage.userId, session.user.id),
          eq(voiceUsage.monthYear, monthYear),
          lt(voiceUsage.commandCount, MONTHLY_LIMIT)
        )
      )
      .returning({ commandCount: voiceUsage.commandCount })

    if (updated) {
      const used = updated.commandCount ?? 0
      return NextResponse.json({
        success: true,
        used,
        limit: MONTHLY_LIMIT,
        remaining: MONTHLY_LIMIT - used,
      })
    }

    const [inserted] = await db
      .insert(voiceUsage)
      .values({ userId: session.user.id, monthYear, commandCount: 1, lastUsed: now })
      .onConflictDoNothing({ target: [voiceUsage.userId, voiceUsage.monthYear] })
      .returning({ commandCount: voiceUsage.commandCount })

    if (inserted) {
      return NextResponse.json({ success: true, used: 1, limit: MONTHLY_LIMIT, remaining: MONTHLY_LIMIT - 1 })
    }

    const [retry] = await db
      .update(voiceUsage)
      .set({
        commandCount: sql`${voiceUsage.commandCount} + 1`,
        lastUsed: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(voiceUsage.userId, session.user.id),
          eq(voiceUsage.monthYear, monthYear),
          lt(voiceUsage.commandCount, MONTHLY_LIMIT)
        )
      )
      .returning({ commandCount: voiceUsage.commandCount })

    if (retry) {
      const used = retry.commandCount ?? 0
      return NextResponse.json({
        success: true,
        used,
        limit: MONTHLY_LIMIT,
        remaining: MONTHLY_LIMIT - used,
      })
    }

    return NextResponse.json({ error: 'Voice command limit reached for this month' }, { status: 429 })
  } catch (error) {
    console.error('Voice usage POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
