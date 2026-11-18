/**
 * @jest-environment node
 */
jest.mock('better-auth', () => ({ betterAuth: (options: unknown) => ({ options }) }))
jest.mock('better-auth/adapters/drizzle', () => ({ drizzleAdapter: () => ({}) }))
jest.mock('@/lib/db', () => ({ db: {} }))
jest.mock('@/lib/email-service', () => ({
  sendPasswordResetEmail: jest.fn(),
  sendVerificationEmail: jest.fn(),
}))
jest.mock('@/lib/error-response', () => ({ reportError: jest.fn() }))

import { sendVerificationEmail } from '@/lib/email-service'
import { reportError } from '@/lib/error-response'

type VerificationOptions = {
  sendOnSignUp: boolean
  autoSignInAfterVerification: boolean
  expiresIn: number
  sendVerificationEmail: (data: { user: { email: string }; url: string }, request?: Request) => Promise<void>
}
type AuthOptions = {
  emailAndPassword: { requireEmailVerification: boolean }
  emailVerification: VerificationOptions
}

process.env.BETTER_AUTH_SECRET ??= 'test-secret'
// Required after the env var is set: auth.ts throws at import without it.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { auth } = require('@/lib/auth')
const options = (auth as { options: AuthOptions }).options
const verification = options.emailVerification
const user = { email: 'me@example.test' }
const url = 'https://example.test/api/auth/verify-email?token=t'

beforeEach(() => jest.clearAllMocks())

describe('email verification config', () => {
  it('sends on signup without making login require verification', () => {
    expect(options.emailAndPassword.requireEmailVerification).toBe(false)
    expect(verification.sendOnSignUp).toBe(true)
    expect(verification.autoSignInAfterVerification).toBe(true)
    expect(verification.expiresIn).toBe(60 * 60 * 24)
  })

  it('relays the verification URL to the email template', async () => {
    await verification.sendVerificationEmail({ user, url })
    expect(sendVerificationEmail).toHaveBeenCalledWith({ to: 'me@example.test', verifyUrl: url })
  })

  it('does not fail signup when the email cannot be sent', async () => {
    jest.mocked(sendVerificationEmail).mockRejectedValueOnce(new Error('mail down'))
    const request = new Request('http://localhost/api/auth/sign-up/email', { method: 'POST' })
    await expect(verification.sendVerificationEmail({ user, url }, request)).resolves.toBeUndefined()
    expect(reportError).toHaveBeenCalled()
  })

  it('surfaces a failed resend to the caller', async () => {
    jest.mocked(sendVerificationEmail).mockRejectedValueOnce(new Error('mail down'))
    const request = new Request('http://localhost/api/auth/send-verification-email', { method: 'POST' })
    await expect(verification.sendVerificationEmail({ user, url }, request)).rejects.toThrow('mail down')
  })
})
