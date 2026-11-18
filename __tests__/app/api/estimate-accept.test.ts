/**
 * @jest-environment node
 *
 * Estimate signing goes through the share link: the request must carry a
 * share token that is enabled and unexpired for this estimate.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/email-service', () => ({ sendEstimateAcceptanceEmail: jest.fn(async () => undefined) }))

import { POST as acceptEstimate } from '@/app/api/estimates/[id]/accept/route'

const ESTIMATE_ID = '33333333-3333-4333-8333-333333333333'
const TOKEN = 'tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const SIGNATURE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk'

let ipCounter = 0

function req(id: string, body: Record<string, unknown>, ip?: string) {
  ipCounter += 1
  return new NextRequest(`http://localhost/api/estimates/${id}/accept`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-vercel-forwarded-for': ip ?? `10.0.0.${ipCounter}`,
    },
    body: JSON.stringify(body),
  })
}

const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    shareToken: TOKEN,
    signatureData: SIGNATURE,
    signerName: 'Jane Client',
    signerEmail: 'jane@example.test',
    consentText: 'I agree',
    ...overrides,
  }
}

function seed(overrides: Record<string, unknown> = {}) {
  fake.rows.length = 0
  fake.rows.push({
    id: ESTIMATE_ID,
    userId: 'user-a',
    documentType: 'estimate',
    collectSignature: true,
    signedAt: null,
    expirationDate: null,
    shareToken: TOKEN,
    shareEnabled: true,
    shareExpiresAt: null,
    senderEmail: null,
    updatedAt: new Date('2026-11-01T10:00:00.123Z'),
    ...overrides,
  })
}

beforeEach(() => {
  seed()
  jest.clearAllMocks()
})

describe('POST /api/estimates/:id/accept', () => {
  it('signs once with a valid share token, then rejects a second attempt', async () => {
    const first = await acceptEstimate(req(ESTIMATE_ID, validBody()), ctx(ESTIMATE_ID))
    expect(first.status).toBe(200)
    expect(fake.rows[0].signedAt).toBeInstanceOf(Date)
    expect(fake.rows[0].signerName).toBe('Jane Client')

    const second = await acceptEstimate(
      req(ESTIMATE_ID, validBody({ signerName: 'Someone Else' })),
      ctx(ESTIMATE_ID)
    )
    expect(second.status).toBe(409)
    expect(fake.rows[0].signerName).toBe('Jane Client')
  })

  it('requires the share token', async () => {
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody({ shareToken: undefined })), ctx(ESTIMATE_ID))
    expect(res.status).toBe(400)
    expect(fake.rows[0].signedAt).toBeNull()
  })

  async function expectNotFound(body: Record<string, unknown>, id = ESTIMATE_ID) {
    const res = await acceptEstimate(req(id, body), ctx(id))
    expect(res.status).toBe(404)
    expect(await res.json()).toEqual({ error: 'Not found' })
    expect(fake.rows[0].signedAt).toBeNull()
  }

  it('is not found for a wrong token', async () => {
    await expectNotFound(validBody({ shareToken: 'tok_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' }))
  })

  it('is not found when sharing is disabled', async () => {
    seed({ shareEnabled: false })
    await expectNotFound(validBody())
  })

  it('is not found when the share link has expired', async () => {
    seed({ shareExpiresAt: new Date(Date.now() - 60_000) })
    await expectNotFound(validBody())
  })

  it('is not found when the token belongs to a different document than the path', async () => {
    await expectNotFound(validBody(), '44444444-4444-4444-8444-444444444444')
  })
})
