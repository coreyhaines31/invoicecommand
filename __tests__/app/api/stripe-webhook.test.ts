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
jest.mock('@/lib/email-service', () => ({ sendPaymentReceivedEmail: jest.fn(async () => ({ id: 'email-1' })) }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: jest.fn((_error: unknown, message: string) => Response.json({ error: message }, { status: 500 })),
  reportError: jest.fn(),
}))

import { POST } from '@/app/api/stripe/webhook/route'
import { triggerWebhooks } from '@/lib/webhook-service'
import { sendPaymentReceivedEmail } from '@/lib/email-service'
import { jsonErrorResponse, reportError } from '@/lib/error-response'

const INVOICE_ID = '33333333-3333-4333-8333-333333333333'
// updatedAt is the document version estimate signing checks, so payment
// bookkeeping must not bump it.
const DOCUMENT_VERSION = new Date('2026-01-01T00:00:00Z')

function seed(overrides: Record<string, unknown> = {}) {
  fake.rows.length = 0
  fake.rows.push({
    id: INVOICE_ID,
    userId: 'user-a',
    invoiceNumber: 'INV-100',
    clientName: 'Client & Co',
    // Free text on the invoice; the paid email must not go here.
    senderEmail: 'typed-in@example.test',
    senderName: 'Owner',
    total: '120.50',
    currency: 'USD',
    status: 'sent',
    stripePaymentIntentId: 'pi_current',
    stripePaymentStatus: 'processing',
    updatedAt: DOCUMENT_VERSION,
    ...overrides,
  })
  fake.tables.user = [{ id: 'user-a', email: 'account@example.test' }]
}

function event(type: string, intent: Record<string, unknown>, envelope: Record<string, unknown> = {}) {
  return new NextRequest('http://localhost/api/stripe/webhook', {
    method: 'POST',
    body: JSON.stringify({
      ...envelope,
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
    expect(invoice().updatedAt).toBe(DOCUMENT_VERSION)
  })

  it('ignores an event from a connected account', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    const res = await POST(event('payment_intent.succeeded', {}, { account: 'acct_connected' }))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('sent')
    expect(invoice().stripePaymentStatus).toBe('processing')
    expect(triggerWebhooks).not.toHaveBeenCalled()
  })

  it.each([
    ['amount', { amount: 100, amount_received: 100 }],
    ['currency', { currency: 'eur' }],
  ])('does not mark paid when the intent %s does not match the invoice', async (_, intent) => {
    const res = await POST(event('payment_intent.succeeded', { id: 'pi_odd', ...intent }))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('sent')
    expect(invoice().stripePaymentStatus).toBe('processing')
    expect(triggerWebhooks).not.toHaveBeenCalled()
    expect(sendPaymentReceivedEmail).not.toHaveBeenCalled()
    expect(reportError).toHaveBeenCalledWith(expect.any(Error), expect.any(String), {
      invoiceId: INVOICE_ID,
      paymentIntentId: 'pi_odd',
    })
  })

  it('checks the current intent against the amount stored when it was created', async () => {
    seed({ total: '150.00', paymentAmountCents: 12050 })
    await POST(event('payment_intent.succeeded', {}))
    expect(invoice().status).toBe('paid')
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

  it('emails the owner once when the same event is delivered twice', async () => {
    await POST(event('payment_intent.succeeded', {}))
    await POST(event('payment_intent.succeeded', {}))
    expect(sendPaymentReceivedEmail).toHaveBeenCalledTimes(1)
    expect(sendPaymentReceivedEmail).toHaveBeenCalledWith({
      toEmail: 'account@example.test',
      senderName: 'Owner',
      clientName: 'Client & Co',
      invoiceNumber: 'INV-100',
      amount: 12050,
      currency: 'usd',
      invoiceId: INVOICE_ID,
    })
  })

  it('sends the paid email to the account email, never to the free-text sender email', async () => {
    await POST(event('payment_intent.succeeded', {}))
    expect(sendPaymentReceivedEmail).toHaveBeenCalledTimes(1)
    expect(jest.mocked(sendPaymentReceivedEmail).mock.calls[0][0].toEmail).toBe('account@example.test')
  })

  it('does not fire invoice.paid or email for an invoice that was already paid', async () => {
    seed({ status: 'paid' })
    await POST(event('payment_intent.succeeded', {}))
    expect(triggerWebhooks).not.toHaveBeenCalled()
    expect(sendPaymentReceivedEmail).not.toHaveBeenCalled()
  })

  it('reports a failed owner email to Sentry and still acknowledges the event', async () => {
    const error = new Error('mail down')
    jest.mocked(sendPaymentReceivedEmail).mockRejectedValueOnce(error)
    const res = await POST(event('payment_intent.succeeded', {}))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('paid')
    expect(triggerWebhooks).toHaveBeenCalledTimes(1)
    expect(reportError).toHaveBeenCalledWith(error, expect.any(String), { invoiceId: INVOICE_ID })
  })

  it('reports a failed user webhook enqueue to Sentry and still acknowledges the event', async () => {
    const error = new Error('db down')
    jest.mocked(triggerWebhooks).mockRejectedValueOnce(error)
    const res = await POST(event('payment_intent.succeeded', {}))
    expect(res.status).toBe(200)
    expect(invoice().status).toBe('paid')
    expect(reportError).toHaveBeenCalledWith(error, expect.any(String), { invoiceId: INVOICE_ID })
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

describe('errors', () => {
  it('reports a handler failure through jsonErrorResponse so Stripe retries', async () => {
    const error = new Error('db down')
    jest.spyOn(fake.db, 'update').mockImplementationOnce(() => { throw error })
    const res = await POST(event('payment_intent.succeeded', {}))
    expect(res.status).toBe(500)
    expect(jsonErrorResponse).toHaveBeenCalledWith(error, 'Webhook handler failed')
  })
})

describe('payment_intent.payment_failed', () => {
  it('marks the current intent failed', async () => {
    await POST(event('payment_intent.payment_failed', {}))
    expect(invoice().stripePaymentStatus).toBe('failed')
    expect(invoice().status).toBe('sent')
    expect(invoice().updatedAt).toBe(DOCUMENT_VERSION)
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

  it('ignores a failure from a connected account', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    await POST(event('payment_intent.payment_failed', {}, { account: 'acct_connected' }))
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
