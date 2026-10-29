/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: jest.fn(async () => null) } } }))
jest.mock('@/lib/api-keys', () => ({
  validateApiKey: jest.fn(async () => ({
    valid: true,
    apiKey: {
      userId: 'user-a',
      scopes: ['invoices:read', 'invoices:write'],
      rateLimitInfo: { limit: 1000, remaining: 999, reset: new Date() },
    },
  })),
}))
jest.mock('@/lib/webhook-service', () => ({ triggerWebhooks: jest.fn() }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { POST as createInvoice } from '@/app/api/v1/invoices/route'
import { PUT as updateInvoice } from '@/app/api/v1/invoices/[id]/route'

function req(path: string, method: string, body: unknown) {
  return new NextRequest(`http://localhost/api/v1${path}`, {
    method,
    headers: { authorization: 'Bearer sk_live_a', 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  fake.rows.length = 0
})

describe('v1 invoice totals', () => {
  it('create derives totals from items, discount, and tax, ignoring caller totals', async () => {
    const res = await createInvoice(
      req('/invoices', 'POST', {
        invoiceNumber: 'INV-1',
        clientName: 'Client',
        items: [{ description: 'Work', quantity: 2, price: 100 }],
        discountRate: 10,
        taxRate: 5,
        subtotal: 200,
        total: 200,
      })
    )

    expect(res.status).toBe(201)
    const { data } = await res.json()
    expect(data).toMatchObject({ subtotal: '200.00', discountAmount: '20.00', tax: '9.00', total: '189.00' })
  })

  it('update recomputes totals using the stored items when only a rate changes', async () => {
    const created = await (
      await createInvoice(
        req('/invoices', 'POST', {
          invoiceNumber: 'INV-2',
          clientName: 'Client',
          items: [{ description: 'Work', quantity: 1, price: 100 }],
        })
      )
    ).json()
    expect(created.data.total).toBe('100.00')

    const res = await updateInvoice(req(`/invoices/${created.data.id}`, 'PUT', { taxRate: 10 }), {
      params: Promise.resolve({ id: created.data.id }),
    })

    const { data } = await res.json()
    expect(data).toMatchObject({ subtotal: '100.00', tax: '10.00', total: '110.00' })
  })

  it('update leaves totals alone when nothing they depend on changes', async () => {
    const created = await (
      await createInvoice(
        req('/invoices', 'POST', {
          invoiceNumber: 'INV-3',
          clientName: 'Client',
          items: [{ description: 'Work', quantity: 1, price: 50 }],
        })
      )
    ).json()

    const res = await updateInvoice(req(`/invoices/${created.data.id}`, 'PUT', { status: 'paid' }), {
      params: Promise.resolve({ id: created.data.id }),
    })

    const { data } = await res.json()
    expect(data).toMatchObject({ status: 'paid', total: '50.00' })
  })
})
