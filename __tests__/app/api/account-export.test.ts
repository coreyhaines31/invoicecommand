/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))

const mockGetSession = jest.fn()
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: () => mockGetSession() } } }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { GET } from '@/app/api/account/export/route'

function seed() {
  for (const name of Object.keys(fake.tables)) fake.tables[name].length = 0
  fake.tables.user.push(
    { id: 'user-a', name: 'A', email: 'a@example.test', emailVerified: true, image: null, createdAt: new Date(), updatedAt: new Date(), password: 'hash-a' },
    { id: 'user-b', name: 'B', email: 'b@example.test', emailVerified: true, image: null, createdAt: new Date(), updatedAt: new Date() },
  )
  fake.tables.userProfiles.push(
    { id: 'p-a', userId: 'user-a', stripeAccountId: 'acct_a', subscriptionTier: 'free' },
    { id: 'p-b', userId: 'user-b', stripeAccountId: 'acct_b', subscriptionTier: 'free' },
  )
  fake.rows.push(
    { id: 'inv-a', userId: 'user-a', documentType: 'invoice', invoiceNumber: 'INV-001', shareToken: 'share-a' },
    { id: 'est-a', userId: 'user-a', documentType: 'estimate', invoiceNumber: 'EST-001' },
    { id: 'inv-b', userId: 'user-b', documentType: 'invoice', invoiceNumber: 'INV-B' },
  )
}

function request() {
  return new NextRequest('http://localhost/api/account/export')
}

beforeEach(() => {
  fake.tables.user ??= []
  fake.tables.userProfiles ??= []
  seed()
  jest.clearAllMocks()
})

describe('GET /api/account/export', () => {
  it('returns 401 without a session', async () => {
    mockGetSession.mockResolvedValue(null)
    const res = await GET(request())
    expect(res.status).toBe(401)
  })

  it("returns only the caller's rows as a JSON download", async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-a' } })
    const res = await GET(request())

    expect(res.status).toBe(200)
    expect(res.headers.get('content-disposition')).toMatch(/^attachment; filename="invoicecommand-export-\d{4}-\d{2}-\d{2}\.json"$/)
    expect(res.headers.get('cache-control')).toBe('no-store')

    const body = await res.json()
    expect(body.user).toMatchObject({ id: 'user-a', email: 'a@example.test' })
    expect(body.profile).toMatchObject({ stripeAccountId: 'acct_a' })
    expect(body.invoices.map((i: { id: string }) => i.id)).toEqual(['inv-a'])
    expect(body.estimates.map((i: { id: string }) => i.id)).toEqual(['est-a'])
    expect(body.invoices[0].shareToken).toBe('share-a')

    const text = JSON.stringify(body)
    expect(text).not.toContain('user-b')
    expect(text).not.toContain('acct_b')
    expect(text).not.toContain('INV-B')
  })

  it('leaves out secrets', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-a' } })
    const body = await (await GET(request())).json()

    const text = JSON.stringify(body)
    expect(text).not.toContain('hash-a')
    expect(body.user).not.toHaveProperty('password')
    for (const key of ['keyHash', 'secret', 'token', 'apiKeys', 'webhooks', 'sessions']) {
      expect(body).not.toHaveProperty(key)
      expect(body.user).not.toHaveProperty(key)
    }
  })

  it('rate limits repeated exports by the same user', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-rate' } })
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) statuses.push((await GET(request())).status)
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200])
    expect(statuses[5]).toBe(429)
  })
})
