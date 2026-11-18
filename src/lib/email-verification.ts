import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'

export const EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED'

export const EMAIL_NOT_VERIFIED_MESSAGE = 'Verify your account email before sending invoices or estimates by email.'

// API callers cannot see the dialog, so tell them where to verify.
export const EMAIL_NOT_VERIFIED_API_MESSAGE =
  'Verify your account email: sign in at invoicecommand.com, open Send via Email on any invoice and request a verification link.'

// Routes that email a third party on the user's behalf call this first. It
// reads the user row rather than the session so API key callers are covered
// too. Returns a 403 response to send back, or null when the user may send.
export async function requireVerifiedEmail(
  userId: string,
  message: string = EMAIL_NOT_VERIFIED_MESSAGE
): Promise<NextResponse | null> {
  const [row] = await db
    .select({ emailVerified: user.emailVerified })
    .from(user)
    .where(eq(user.id, userId))

  if (row?.emailVerified) return null

  return NextResponse.json(
    { error: message, code: EMAIL_NOT_VERIFIED },
    { status: 403 }
  )
}
