import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db'
import * as schema from './db/schema'
import { sendPasswordResetEmail, sendVerificationEmail } from './email-service'
import { reportError } from './error-response'

const VERIFICATION_EXPIRES_IN_SECONDS = 60 * 60 * 24

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
  // Login does not need a verified email; sending invoices by email does.
  emailVerification: {
    sendOnSignUp: true,
    // Off so a verification link never signs the clicker in: whoever holds
    // the inbox is not necessarily whoever set the password.
    autoSignInAfterVerification: false,
    expiresIn: VERIFICATION_EXPIRES_IN_SECONDS,
    sendVerificationEmail: async ({ user, url }, request) => {
      try {
        await sendVerificationEmail({ to: user.email, verifyUrl: url })
      } catch (error) {
        // The account already exists by the time the signup email goes out,
        // so a mail failure must not fail signup. The user can resend later.
        if (request && new URL(request.url).pathname.endsWith('/sign-up/email')) {
          reportError(error, 'Failed to send signup verification email')
          return
        }
        throw error
      }
    },
  },
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005',
    'https://invoicecommand.com',
  ],
})
