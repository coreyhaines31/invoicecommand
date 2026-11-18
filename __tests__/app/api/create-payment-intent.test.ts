/**
 * @jest-environment node
 *
 * Issue #88: estimates are not paid online, from the signed-in route either.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

const stripeMock = {
  paymentIntents: {
    create: jest.fn(),
    retrieve: jest.fn(),
    cancel: jest.fn(),
  },
}

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/auth', () => ({
  auth: { api: { getSession: jest.fn(async () => ({ user: { id: 'user-a' } })) } },
}))
jest.mock('@/lib/stripe', () => ({
  get stripe() { return stripeMock },
  calculateApplicationFee: () => 50,
}))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { POST } from '@/app/api/stripe/create-payment-intent/route'

const INVOICE_ID = '55555555-5555-4555-8555-555555555555'

function seed(overrides: Record<string, unknown> = {}) {
  fake.rows.length = 0
  fake.rows.push({
    id: INVOICE_ID,
    userId: 'user-a',
    invoiceNumber: 'INV-300',
    total: '100',
    currency: 'USD',
    paymentEnabled: true,
    status: 'sent',
    stripePaymentStatus: 'unpaid',
    stripePaymentIntentId: null,
    ...overrides,
  })
  fake.tables.userProfiles = [{
    userId: 'user-a',
    stripeAccountId: 'acct_owner',
    stripeOnboardingCompleted: true,
    subscriptionTier: 'free',
  }]
}

function request() {
  return new NextRequest('http://localhost/api/stripe/create-payment-intent', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ invoiceId: INVOICE_ID, amount: 10000 }),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  stripeMock.paymentIntents.create.mockResolvedValue({ id: 'pi_new', client_secret: 'secret_new' })
})

describe('POST /api/stripe/create-payment-intent', () => {
  it('refuses an estimate as it refuses a missing invoice', async () => {
    seed({ documentType: 'estimate' })
    const res = await POST(request())
    expect(res.status).toBe(404)
    expect((await res.json()).error).toBe('Invoice not found')
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('creates an intent for an invoice', async () => {
    seed({ documentType: 'invoice' })
    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(stripeMock.paymentIntents.create).toHaveBeenCalled()
  })
})
