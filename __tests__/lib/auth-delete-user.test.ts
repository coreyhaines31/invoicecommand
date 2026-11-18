/**
 * @jest-environment node
 */
type Options = {
  user: { deleteUser: { enabled: boolean; beforeDelete: (user: { id: string }) => Promise<void> } }
  hooks: { before: (ctx: { path: string; body?: unknown }) => Promise<void> }
}

jest.mock('better-auth', () => ({ betterAuth: (options: unknown) => options }))
jest.mock('better-auth/adapters/drizzle', () => ({ drizzleAdapter: () => ({}) }))
jest.mock('better-auth/api', () => ({
  createAuthMiddleware: (fn: unknown) => fn,
  APIError: class APIError extends Error {
    constructor(public status: string, public body: { message: string; code: string }) {
      super(body.message)
    }
  },
}))
jest.mock('@/lib/db', () => ({ db: {} }))
jest.mock('@/lib/email-service', () => ({ sendPasswordResetEmail: jest.fn() }))
const mockDeleteUserData = jest.fn<Promise<void>, [string]>(async () => {})
jest.mock('@/lib/account-deletion', () => ({ deleteUserData: (id: string) => mockDeleteUserData(id) }))

process.env.BETTER_AUTH_SECRET = 'test-secret'

// eslint-disable-next-line @typescript-eslint/no-require-imports
const options = require('@/lib/auth').auth as Options

describe('Better Auth delete-user config', () => {
  it('enables deletion and cleans up user data first', async () => {
    expect(options.user.deleteUser.enabled).toBe(true)
    await options.user.deleteUser.beforeDelete({ id: 'user-a' })
    expect(mockDeleteUserData).toHaveBeenCalledWith('user-a')
  })

  it('rejects a delete request without a password', async () => {
    await expect(options.hooks.before({ path: '/delete-user', body: {} })).rejects.toThrow(/password/i)
    await expect(options.hooks.before({ path: '/delete-user', body: { password: '' } })).rejects.toThrow(/password/i)
  })

  it('lets a delete request with a password and other routes through', async () => {
    await expect(options.hooks.before({ path: '/delete-user', body: { password: 'hunter22' } })).resolves.toBeUndefined()
    await expect(options.hooks.before({ path: '/sign-in/email', body: {} })).resolves.toBeUndefined()
  })
})
