import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { voiceUsage } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

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
