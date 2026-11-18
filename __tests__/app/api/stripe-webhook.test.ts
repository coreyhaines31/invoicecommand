/**
 * @jest-environment node
 *
 * The Stripe webhook is the only thing that marks an online payment as paid,
 * and Stripe delivers events at least once and in any order.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
// Signature verification is Stripe's job; the test hands the event straight through.
jest.mock('@/lib/stripe', () => ({
  stripe: { webhooks: { constructEvent: jest.fn((body: string) => JSON.parse(body)) } },
}))
jest.mock('next/headers', () => ({
  headers: async () => new Headers({ 'stripe-signature': 't=1,v1=test' }),
}))

import { POST } from '@/app/api/stripe/webhook/route'

const INVOICE_ID = '33333333-3333-4333-8333-333333333333'

function seed(overrides: Record<string, unknown> = {}) {
  fake.rows.length = 0
  fake.rows.push({
    id: INVOICE_ID,
    userId: 'user-a',
    invoiceNumber: 'INV-100',
    clientName: 'Client & Co',
    senderEmail: 'owner@example.test',
    senderName: 'Owner',
    total: '120.50',
    currency: 'USD',
    status: 'sent',
    stripePaymentIntentId: 'pi_current',
    stripePaymentStatus: 'processing',
    ...overrides,
  })
}

function event(type: string, intent: Record<string, unknown>) {
  return new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body: JSON.stringify({
      type,
      data: {
        object: {
          id: 'pi_current',
          amount: 12050,
          amount_received: 12050,
          currency: 'usd',
          metadata: { invoice_id: INVOICE_ID },
          ...intent,
        },
      },
    }),
  })
}

const invoice = () => fake.rows[0]

beforeAll(() => {
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
})

beforeEach(() => {
  seed()
  jest.clearAllMocks()
})

describe('payment_intent.succeeded', () => {
  it('marks the invoice paid on both fields', async () => {
    const res = await POST(event('payment_intent.succeeded', {}))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('paid')
    expect(invoice().stripePaymentStatus).toBe('paid')
  })

  it('leaves the invoice untouched when the same event is delivered again', async () => {
    await POST(event('payment_intent.succeeded', {}))
    const afterFirst = { ...invoice() }
    const res = await POST(event('payment_intent.succeeded', {}))
    expect(res.status).toBe(200)
    expect(invoice()).toEqual(afterFirst)
  })

  it('finds the invoice by metadata even when the stored intent id has moved on', async () => {
    seed({ stripePaymentIntentId: 'pi_newer' })
    await POST(event('payment_intent.succeeded', { id: 'pi_older' }))
    expect(invoice().status).toBe('paid')
    expect(invoice().stripePaymentStatus).toBe('paid')
    expect(invoice().stripePaymentIntentId).toBe('pi_older')
  })

  it('records the Stripe payment on an invoice the owner already marked paid', async () => {
    seed({ status: 'paid' })
    await POST(event('payment_intent.succeeded', {}))
    expect(invoice().status).toBe('paid')
    expect(invoice().stripePaymentStatus).toBe('paid')
  })

  it('ignores an intent without invoice metadata', async () => {
    const res = await POST(event('payment_intent.succeeded', { metadata: {} }))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('sent')
    expect(invoice().stripePaymentStatus).toBe('processing')
  })
})
