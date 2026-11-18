import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { db } from './db'
import * as schema from './db/schema'
import { sendPasswordResetEmail } from './email-service'
import { deleteUserData } from './account-deletion'

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error('BETTER_AUTH_SECRET environment variable is not set')
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005',
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      // Better Auth assembles the reset URL using the redirectTo passed from
      // the client form plus its own token query param, so we just relay it.
      await sendPasswordResetEmail({ to: user.email, resetUrl: url })
    },
  },
  // Without a password, Better Auth deletes the account for any session
  // younger than a day. Require the password so a borrowed session cannot.
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== '/delete-user') return
      const password = (ctx.body as { password?: unknown } | undefined)?.password
      if (typeof password !== 'string' || password.length === 0) {
        throw new APIError('BAD_REQUEST', { message: 'Enter your password to delete your account.', code: 'PASSWORD_REQUIRED' })
      }
    }),
  },
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await deleteUserData(user.id)
      },
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005',
    'https://invoicecommand.com',
  ],
})
