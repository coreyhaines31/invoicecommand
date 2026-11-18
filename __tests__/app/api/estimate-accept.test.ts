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
import { ESTIMATE_CONSENT_TEXT, serializeDocumentVersion } from '@/lib/estimate-signing'
import { sendEstimateAcceptanceEmail } from '@/lib/email-service'

const ESTIMATE_ID = '33333333-3333-4333-8333-333333333333'
const TOKEN = 'tok_aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const RENDERED_AT = new Date('2026-11-01T10:00:00.123Z')
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
    consentAccepted: true,
    documentVersion: serializeDocumentVersion(RENDERED_AT),
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
    updatedAt: new Date(RENDERED_AT),
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

  it('does not sign when the link expires between the read and the write', async () => {
    seed({ shareExpiresAt: new Date(Date.now() + 60_000) })
    const realSelect = fake.db.select
    const spy = jest.spyOn(fake.db, 'select').mockImplementationOnce((...args) => {
      const query = realSelect(...args)
      const then = query.then.bind(query)
      query.then = ((onFulfilled, onRejected) =>
        then((rows) => {
          fake.rows[0].shareExpiresAt = new Date(Date.now() - 1)
          return rows
        }).then(onFulfilled, onRejected)) as typeof query.then
      return query
    })
    try {
      await expectNotFound(validBody())
    } finally {
      spy.mockRestore()
    }
  })

  it('is not found when the token belongs to a different document than the path', async () => {
    await expectNotFound(validBody(), '44444444-4444-4444-8444-444444444444')
  })

  it('accepts the rendered version after a real round trip through JSON', async () => {
    const rendered = JSON.parse(JSON.stringify({ documentVersion: serializeDocumentVersion(RENDERED_AT) }))
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody(rendered)), ctx(ESTIMATE_ID))
    expect(res.status).toBe(200)
  })

  it('signs with the stored updatedAt sent back after a JSON round trip', async () => {
    seed({ updatedAt: new Date('2026-11-17T23:59:59.987Z') })
    const page = JSON.stringify({ documentVersion: serializeDocumentVersion(fake.rows[0].updatedAt as Date) })
    const { documentVersion } = JSON.parse(page)
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody({ documentVersion })), ctx(ESTIMATE_ID))
    expect(res.status).toBe(200)
  })

  it('lets exactly one of two concurrent accept requests sign', async () => {
    const [a, b] = await Promise.all([
      acceptEstimate(req(ESTIMATE_ID, validBody({ signerName: 'First' })), ctx(ESTIMATE_ID)),
      acceptEstimate(req(ESTIMATE_ID, validBody({ signerName: 'Second' })), ctx(ESTIMATE_ID)),
    ])
    expect([a.status, b.status].sort()).toEqual([200, 409])
    const winner = a.status === 200 ? 'First' : 'Second'
    expect(fake.rows[0].signerName).toBe(winner)
  })

  it('rejects a signature for a document changed after it was rendered', async () => {
    // The owner edited the estimate after the signer loaded the page.
    seed({ updatedAt: new Date(RENDERED_AT.getTime() + 1) })
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody()), ctx(ESTIMATE_ID))
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.code).toBe('document_changed')
    expect(body.error).toMatch(/reload/i)
    expect(fake.rows[0].signedAt).toBeNull()
  })

  it('stores the server consent text even if the request sends another', async () => {
    const res = await acceptEstimate(
      req(ESTIMATE_ID, validBody({ consentText: 'I agree to nothing in particular' })),
      ctx(ESTIMATE_ID)
    )
    expect(res.status).toBe(200)
    expect(fake.rows[0].consentText).toBe(ESTIMATE_CONSENT_TEXT)
  })

  it('requires the signer to accept the consent text', async () => {
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody({ consentAccepted: undefined })), ctx(ESTIMATE_ID))
    expect(res.status).toBe(400)
    expect(fake.rows[0].signedAt).toBeNull()
  })

  it('rate limits repeated attempts from one client', async () => {
    const ip = '192.0.2.50'
    const wrong = validBody({ shareToken: 'tok_cccccccccccccccccccccccccccccc' })
    for (let i = 0; i < 10; i++) {
      expect((await acceptEstimate(req(ESTIMATE_ID, wrong, ip), ctx(ESTIMATE_ID))).status).toBe(404)
    }
    const limited = await acceptEstimate(req(ESTIMATE_ID, validBody(), ip), ctx(ESTIMATE_ID))
    expect(limited.status).toBe(429)
    expect(limited.headers.get('Retry-After')).toBeTruthy()
    expect(fake.rows[0].signedAt).toBeNull()
  })

  it('notifies the account email, not a different sender address on the estimate', async () => {
    seed({ senderEmail: 'someone-else@example.test' })
    fake.tables.user = [{ id: 'user-a', email: 'owner@example.test', emailVerified: false }]
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody()), ctx(ESTIMATE_ID))
    expect(res.status).toBe(200)
    expect(sendEstimateAcceptanceEmail).toHaveBeenCalledTimes(1)
    const [[args]] = jest.mocked(sendEstimateAcceptanceEmail).mock.calls
    expect(args.toEmail).toBe('owner@example.test')
  })

  it('requires the document version', async () => {
    const res = await acceptEstimate(req(ESTIMATE_ID, validBody({ documentVersion: undefined })), ctx(ESTIMATE_ID))
    expect(res.status).toBe(400)
    expect(fake.rows[0].signedAt).toBeNull()
  })
})
