import { eq } from 'drizzle-orm'
import { db } from './db'
import { verification } from './db/schema'

// How each table that holds a user's data is cleaned up when Better Auth
// deletes the user row. A test checks this against the schema's foreign keys,
// so a new table without ON DELETE CASCADE fails until it is handled here.
export const USER_DATA_CLEANUP = {
  session: 'cascade',
  account: 'cascade',
  user_profiles: 'cascade',
  invoices: 'cascade',
  voice_usage: 'cascade',
  api_keys: 'cascade',
  webhooks: 'cascade',
  webhook_events: 'cascade',
  agent_feedback: 'cascade',
  verification: 'explicit',
} as const

// Runs as Better Auth's deleteUser.beforeDelete hook. Tables with a cascading
// foreign key to the user are removed by the database; this deletes the rows
// that have no foreign key. Pending password reset tokens store the user id as
// their value.
//
// A connected Stripe account is not touched: it belongs to the user at
// Stripe. Our link to it is the user_profiles row, which cascades.
export async function deleteUserData(userId: string): Promise<void> {
  await db.delete(verification).where(eq(verification.value, userId))
}
