/**
 * @jest-environment node
 *
 * The public share link must not start a second charge for an invoice that is
 * already paid, and must not leave a superseded intent payable.
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
jest.mock('@/lib/stripe', () => ({
  get stripe() { return stripeMock },
  calculateApplicationFee: () => 50,
}))
jest.mock('@/lib/rate-limit', () => ({ checkIpRateLimit: () => ({ allowed: true }) }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { POST } from '@/app/api/stripe/create-payment-intent-public/route'

const INVOICE_ID = '44444444-4444-4444-8444-444444444444'
const TOKEN = 'share_token_abcdefghijklmnop'
// updatedAt is the document version estimate signing checks.
const DOCUMENT_VERSION = new Date('2026-01-01T00:00:00Z')

function seed(overrides: Record<string, unknown> = {}) {
  fake.rows.length = 0
  fake.rows.push({
    id: INVOICE_ID,
    userId: 'user-a',
    invoiceNumber: 'INV-200',
    total: '100',
    currency: 'USD',
    shareToken: TOKEN,
    shareEnabled: true,
    paymentEnabled: true,
    status: 'sent',
    stripePaymentStatus: 'unpaid',
    stripePaymentIntentId: null,
    updatedAt: DOCUMENT_VERSION,
    ...overrides,
  })
  fake.tables.userProfiles = [{
    userId: 'user-a',
    stripeAccountId: 'acct_owner',
    stripeOnboardingCompleted: true,
    subscriptionTier: 'free',
  }]
}

function request(amount = 10000) {
  return new NextRequest('http://localhost/api/stripe/create-payment-intent-public', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ shareToken: TOKEN, amount }),
  })
}

const invoice = () => fake.rows[0]

beforeEach(() => {
  seed()
  jest.resetAllMocks()
  stripeMock.paymentIntents.create.mockResolvedValue({ id: 'pi_new', client_secret: 'secret_new' })
  stripeMock.paymentIntents.cancel.mockResolvedValue({})
})

describe('POST /api/stripe/create-payment-intent-public', () => {
  it('creates an intent for an unpaid invoice', async () => {
    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(invoice().stripePaymentIntentId).toBe('pi_new')
    expect(invoice().stripePaymentStatus).toBe('processing')
    expect(invoice().updatedAt).toBe(DOCUMENT_VERSION)
  })

  it('does not overwrite an invoice that was paid while the intent was being created', async () => {
    stripeMock.paymentIntents.create.mockImplementation(async () => {
      Object.assign(invoice(), { status: 'paid', stripePaymentStatus: 'paid', stripePaymentIntentId: 'pi_winner' })
      return { id: 'pi_new', client_secret: 'secret_new' }
    })
    const res = await POST(request())
    expect(res.status).toBe(409)
    expect(stripeMock.paymentIntents.cancel).toHaveBeenCalledWith('pi_new')
    expect(invoice().stripePaymentIntentId).toBe('pi_winner')
    expect(invoice().stripePaymentStatus).toBe('paid')
  })

  it.each([
    ['the owner marked it paid', { status: 'paid' }],
    ['Stripe reported it paid', { stripePaymentStatus: 'paid' }],
  ])('refuses with 409 when %s', async (_, overrides) => {
    seed(overrides)
    const res = await POST(request())
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toBe('This invoice has already been paid')
    expect(body.code).toBe('already_paid')
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('reuses the in-flight intent when the total is unchanged', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 10000 })
    stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status: 'requires_payment_method', client_secret: 'secret_old' })
    const res = await POST(request())
    expect((await res.json()).paymentIntentId).toBe('pi_old')
    expect(stripeMock.paymentIntents.cancel).not.toHaveBeenCalled()
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it.each(['requires_payment_method', 'requires_confirmation', 'requires_action'])(
    'resumes an abandoned checkout whose intent is still %s at Stripe',
    async (status) => {
      seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 10000 })
      stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status, client_secret: 'secret_old' })
      const res = await POST(request())
      expect(res.status).toBe(200)
      expect((await res.json()).clientSecret).toBe('secret_old')
      expect(stripeMock.paymentIntents.cancel).not.toHaveBeenCalled()
      expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
    },
  )

  it('reuses a usable intent after a declined card', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'failed', paymentAmountCents: 10000 })
    stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status: 'requires_payment_method', client_secret: 'secret_old' })
    const res = await POST(request())
    expect((await res.json()).clientSecret).toBe('secret_old')
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it.each(['processing', 'requires_capture'])(
    'reports a payment in progress, without a client secret, when Stripe says the intent is %s',
    async (status) => {
      seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 10000 })
      stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status, client_secret: 'secret_old' })
      const res = await POST(request())
      expect(res.status).toBe(409)
      const body = await res.json()
      expect(body.code).toBe('payment_in_progress')
      expect(body.clientSecret).toBeUndefined()
      expect(stripeMock.paymentIntents.cancel).not.toHaveBeenCalled()
      expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
    },
  )

  it('replaces a canceled intent', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 10000 })
    stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status: 'canceled' })
    const res = await POST(request())
    expect((await res.json()).clientSecret).toBe('secret_new')
    expect(stripeMock.paymentIntents.cancel).not.toHaveBeenCalled()
    expect(invoice().stripePaymentIntentId).toBe('pi_new')
  })

  it('cancels the superseded intent before creating one for a new total', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 8000 })
    stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status: 'requires_payment_method' })
    const res = await POST(request())
    expect(res.status).toBe(200)
    expect(stripeMock.paymentIntents.cancel).toHaveBeenCalledWith('pi_old')
    expect(stripeMock.paymentIntents.cancel.mock.invocationCallOrder[0])
      .toBeLessThan(stripeMock.paymentIntents.create.mock.invocationCallOrder[0])
    expect(invoice().stripePaymentIntentId).toBe('pi_new')
  })

  it('does not create a new intent when the superseded one already succeeded', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 8000 })
    stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status: 'succeeded' })
    const res = await POST(request())
    expect(res.status).toBe(409)
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
  })

  it('does not create a new intent when the cancel loses a race with the payment', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 8000 })
    stripeMock.paymentIntents.retrieve
      .mockResolvedValueOnce({ id: 'pi_old', status: 'requires_payment_method' })
      .mockResolvedValueOnce({ id: 'pi_old', status: 'succeeded' })
    stripeMock.paymentIntents.cancel.mockRejectedValue(new Error('payment_intent_unexpected_state'))
    const res = await POST(request())
    expect(res.status).toBe(409)
    expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
    expect(invoice().stripePaymentIntentId).toBe('pi_old')
  })

  it.each(['processing', 'requires_capture'])(
    'returns 409 when the superseded intent is %s and cannot be cancelled',
    async (status) => {
      seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 8000 })
      stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status })
      stripeMock.paymentIntents.cancel.mockRejectedValue(new Error('payment_intent_unexpected_state'))
      const res = await POST(request())
      expect(res.status).toBe(409)
      expect((await res.json()).error).toBe('A payment for this invoice is already in progress. Please wait a few minutes and refresh.')
      expect(stripeMock.paymentIntents.create).not.toHaveBeenCalled()
    },
  )

  it('rethrows a cancel failure in an unexpected state', async () => {
    seed({ stripePaymentIntentId: 'pi_old', stripePaymentStatus: 'processing', paymentAmountCents: 8000 })
    stripeMock.paymentIntents.retrieve.mockResolvedValue({ id: 'pi_old', status: 'requires_payment_method' })
    stripeMock.paymentIntents.cancel.mockRejectedValue(new Error('stripe down'))
    await expect(POST(request())).rejects.toThrow('stripe down')
  })
})
