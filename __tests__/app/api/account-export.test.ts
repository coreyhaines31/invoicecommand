/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => {
  const { schemaMock } = jest.requireActual('../../helpers/fake-db')
  // Same shape as the helper's tables: columns resolve to { key }, and
  // __tableName tells the fake db which rows to use.
  const table = (name: string) =>
    new Proxy({}, { get: (_, key) => (key === '__tableName' ? name : { key: String(key) }) })
  return {
    ...schemaMock,
    account: table('account'),
    session: table('session'),
    apiKeys: table('apiKeys'),
    webhooks: table('webhooks'),
    agentFeedback: table('agentFeedback'),
  }
})
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))

const mockGetSession = jest.fn()
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: () => mockGetSession() } } }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { GET } from '@/app/api/account/export/route'

const TABLES = ['user', 'userProfiles', 'account', 'session', 'voiceUsage', 'apiKeys', 'webhooks', 'agentFeedback']

function seed() {
  fake.rows.length = 0
  for (const name of TABLES) fake.tables[name] = []
  const t = fake.tables
  t.user.push(
    { id: 'user-a', name: 'A', email: 'a@example.test', emailVerified: true, image: null, createdAt: new Date(), updatedAt: new Date() },
    { id: 'user-b', name: 'B', email: 'b@example.test', emailVerified: true, image: null, createdAt: new Date(), updatedAt: new Date() },
  )
  t.account.push({ id: 'acc-a', userId: 'user-a', providerId: 'credential', password: 'PASSWORD-HASH-A' })
  t.session.push({ id: 'ses-a', userId: 'user-a', token: 'SESSION-TOKEN-A' })
  t.userProfiles.push(
    { id: 'p-a', userId: 'user-a', stripeAccountId: 'acct_a', subscriptionTier: 'free' },
    { id: 'p-b', userId: 'user-b', stripeAccountId: 'acct_b', subscriptionTier: 'free' },
  )
  t.voiceUsage.push(
    { id: 'vu-a', userId: 'user-a', monthYear: '2026-11', commandCount: 3 },
    { id: 'vu-b', userId: 'user-b', monthYear: '2026-11', commandCount: 9 },
  )
  t.apiKeys.push(
    { id: 'key-a', userId: 'user-a', name: 'CLI', keyPrefix: 'sk_live_aaaa', keyHash: 'KEY-HASH-A', scopes: ['invoices:read'], createdAt: new Date(), lastUsedAt: null },
    { id: 'key-b', userId: 'user-b', name: 'Other', keyPrefix: 'sk_live_bbbb', keyHash: 'KEY-HASH-B' },
  )
  t.webhooks.push(
    { id: 'wh-a', userId: 'user-a', url: 'https://a.example.test/hook', secret: 'WEBHOOK-SECRET-A', events: ['invoice.paid'], createdAt: new Date() },
    { id: 'wh-b', userId: 'user-b', url: 'https://b.example.test/hook', secret: 'WEBHOOK-SECRET-B', events: [] },
  )
  t.agentFeedback.push(
    { id: 'fb-a', userId: 'user-a', task: 'send invoice', kind: 'idea', description: 'feedback a' },
    { id: 'fb-b', userId: 'user-b', task: 'other', kind: 'idea', description: 'feedback b' },
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
    expect(body.voiceUsage).toEqual([expect.objectContaining({ monthYear: '2026-11', commandCount: 3 })])
    expect(body.apiKeys).toEqual([expect.objectContaining({ name: 'CLI', keyPrefix: 'sk_live_aaaa' })])
    expect(body.webhooks).toEqual([
      expect.objectContaining({ url: 'https://a.example.test/hook', events: ['invoice.paid'] }),
    ])
    expect(body.agentFeedback).toEqual([expect.objectContaining({ description: 'feedback a' })])

    const text = JSON.stringify(body)
    for (const other of ['user-b', 'acct_b', 'INV-B', 'sk_live_bbbb', 'b.example.test', 'feedback b']) {
      expect(text).not.toContain(other)
    }
  })

  it('leaves out password hashes, session tokens, key hashes and webhook secrets', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-a' } })
    const text = await (await GET(request())).text()

    for (const secret of ['PASSWORD-HASH-A', 'SESSION-TOKEN-A', 'KEY-HASH-A', 'WEBHOOK-SECRET-A']) {
      expect(text).not.toContain(secret)
    }
    expect(text).not.toContain('"keyHash"')
    expect(text).not.toContain('"secret"')
  })

  it('rate limits repeated exports by the same user', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-rate' } })
    const statuses: number[] = []
    for (let i = 0; i < 6; i++) statuses.push((await GET(request())).status)
    expect(statuses.slice(0, 5)).toEqual([200, 200, 200, 200, 200])
    expect(statuses[5]).toBe(429)
  })
})
