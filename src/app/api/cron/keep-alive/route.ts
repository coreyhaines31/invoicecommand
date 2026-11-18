import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { sql } from 'drizzle-orm'
import { timingSafeStringEqual } from '@/lib/cron-auth'
import { jsonErrorResponse } from '@/lib/error-response'

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return jsonErrorResponse(new Error('CRON_SECRET is not configured'), 'CRON_SECRET is not configured')
  }

  if (!timingSafeStringEqual(request.headers.get('authorization'), `Bearer ${cronSecret}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const result = await db.select({ count: sql<number>`count(*)` }).from(user)
  const count = result[0]?.count ?? 0

  console.log(`Keep-alive: Neon pinged successfully, ${count} users`)
  return NextResponse.json({ ok: true, userCount: count })
}
