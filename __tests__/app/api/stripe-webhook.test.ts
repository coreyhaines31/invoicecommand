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
jest.mock('@/lib/webhook-service', () => ({ triggerWebhooks: jest.fn() }))

import { POST } from '@/app/api/stripe/webhook/route'
import { triggerWebhooks } from '@/lib/webhook-service'

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

  it('fires invoice.paid once when the same event is delivered twice', async () => {
    await POST(event('payment_intent.succeeded', {}))
    await POST(event('payment_intent.succeeded', {}))
    expect(triggerWebhooks).toHaveBeenCalledTimes(1)
    expect(triggerWebhooks).toHaveBeenCalledWith('user-a', 'invoice.paid', {
      invoice: expect.objectContaining({ id: INVOICE_ID, status: 'paid' }),
    })
  })

  it('does not fire invoice.paid for an invoice that was already paid', async () => {
    seed({ status: 'paid' })
    await POST(event('payment_intent.succeeded', {}))
    expect(triggerWebhooks).not.toHaveBeenCalled()
  })

  it('still acknowledges the event when queueing the user webhook fails', async () => {
    jest.mocked(triggerWebhooks).mockRejectedValueOnce(new Error('db down'))
    jest.spyOn(console, 'error').mockImplementation(() => {})
    const res = await POST(event('payment_intent.succeeded', {}))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('paid')
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

describe('payment_intent.payment_failed', () => {
  it('marks the current intent failed', async () => {
    await POST(event('payment_intent.payment_failed', {}))
    expect(invoice().stripePaymentStatus).toBe('failed')
    expect(invoice().status).toBe('sent')
  })

  it('never undoes a payment that already succeeded', async () => {
    await POST(event('payment_intent.succeeded', {}))
    const res = await POST(event('payment_intent.payment_failed', {}))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('paid')
    expect(invoice().stripePaymentStatus).toBe('paid')
  })

  it('leaves an invoice the owner marked paid alone', async () => {
    seed({ status: 'paid' })
    await POST(event('payment_intent.payment_failed', {}))
    expect(invoice().stripePaymentStatus).toBe('processing')
  })

  it('ignores a failure for an intent that has been superseded', async () => {
    seed({ stripePaymentIntentId: 'pi_newer' })
    await POST(event('payment_intent.payment_failed', { id: 'pi_older' }))
    expect(invoice().stripePaymentStatus).toBe('processing')
  })

  it('ignores an intent without invoice metadata', async () => {
    await POST(event('payment_intent.payment_failed', { metadata: {} }))
    expect(invoice().stripePaymentStatus).toBe('processing')
  })
})
