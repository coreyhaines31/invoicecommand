/**
 * @jest-environment node
 *
 * Every v1 invoice route the MCP server and CLI call must only ever touch the
 * caller's own invoices: user B's key gets a 404 on user A's invoice.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

const KEYS: Record<string, { userId: string; scopes: string[] }> = {
  sk_live_user_a: { userId: 'user-a', scopes: ['invoices:read', 'invoices:write'] },
  sk_live_user_b: { userId: 'user-b', scopes: ['invoices:read', 'invoices:write'] },
  sk_live_b_read: { userId: 'user-b', scopes: ['invoices:read'] },
}

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: jest.fn(async () => null) } } }))
jest.mock('@/lib/api-keys', () => ({
  validateApiKey: jest.fn(async (key: string) => {
    const entry = KEYS[key]
    if (!entry) return { valid: false, error: 'Invalid API key', status: 401 }
    return {
      valid: true,
      apiKey: { ...entry, rateLimitInfo: { limit: 1000, remaining: 999, reset: new Date() } },
    }
  }),
}))
jest.mock('@/lib/email-service', () => ({ sendInvoiceEmail: jest.fn(async () => ({ id: 'email-1' })) }))
jest.mock('@/lib/webhook-service', () => ({ triggerWebhooks: jest.fn() }))
jest.mock('@/lib/invoice-pdf-server', () => ({ renderInvoicePdf: jest.fn(async () => Buffer.from('%PDF')) }))
jest.mock('@react-pdf/renderer', () => ({ renderToBuffer: jest.fn(async () => Buffer.from('%PDF')) }))
jest.mock('@/components/pdf/invoice-pdf', () => ({ InvoicePDF: () => null }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { GET as listInvoices, POST as createInvoice } from '@/app/api/v1/invoices/route'
import { GET as getInvoice, PUT as updateInvoice, DELETE as deleteInvoice } from '@/app/api/v1/invoices/[id]/route'
import { GET as getPdf } from '@/app/api/v1/invoices/[id]/pdf/route'
import { POST as sendInvoice } from '@/app/api/v1/invoices/[id]/send/route'
import { sendInvoiceEmail } from '@/lib/email-service'

const A_INVOICE = '22222222-2222-4222-8222-222222222222'

function req(path: string, key: string, init: { method?: string; body?: unknown } = {}) {
  return new NextRequest(`http://localhost/api/v1${path}`, {
    method: init.method ?? 'GET',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  })
}

const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

function seed() {
  fake.rows.length = 0
  fake.rows.push({
    id: A_INVOICE,
    userId: 'user-a',
    invoiceNumber: 'INV-A',
    clientName: 'A Client',
    clientEmail: 'a-client@example.test',
    senderEmail: 'a@example.test',
    items: [],
    subtotal: '100',
    tax: '0',
    total: '100',
    status: 'draft',
    signedAt: null,
  })
}

beforeEach(() => {
  seed()
  jest.clearAllMocks()
})

describe('v1 invoice routes: cross-user isolation', () => {
  it('list returns only the caller’s invoices', async () => {
    const b = await (await listInvoices(req('/invoices', 'sk_live_user_b'))).json()
    expect(b.data).toEqual([])

    const a = await (await listInvoices(req('/invoices', 'sk_live_user_a'))).json()
    expect(a.data.map((r: { id: string }) => r.id)).toEqual([A_INVOICE])
  })

  it('GET /invoices/:id is 404 for another user', async () => {
    expect((await getInvoice(req(`/invoices/${A_INVOICE}`, 'sk_live_user_b'), ctx(A_INVOICE))).status).toBe(404)
    expect((await getInvoice(req(`/invoices/${A_INVOICE}`, 'sk_live_user_a'), ctx(A_INVOICE))).status).toBe(200)
  })

  it('PUT /invoices/:id is 404 for another user and changes nothing', async () => {
    const res = await updateInvoice(
      req(`/invoices/${A_INVOICE}`, 'sk_live_user_b', { method: 'PUT', body: { status: 'paid' } }),
      ctx(A_INVOICE)
    )
    expect(res.status).toBe(404)
    expect(fake.rows[0].status).toBe('draft')
  })

  it('DELETE /invoices/:id is 404 for another user and deletes nothing', async () => {
    const res = await deleteInvoice(req(`/invoices/${A_INVOICE}`, 'sk_live_user_b', { method: 'DELETE' }), ctx(A_INVOICE))
    expect(res.status).toBe(404)
    expect(fake.rows).toHaveLength(1)
  })

  it('GET /invoices/:id/pdf is 404 for another user', async () => {
    expect((await getPdf(req(`/invoices/${A_INVOICE}/pdf`, 'sk_live_user_b'), ctx(A_INVOICE))).status).toBe(404)
    expect((await getPdf(req(`/invoices/${A_INVOICE}/pdf`, 'sk_live_user_a'), ctx(A_INVOICE))).status).toBe(200)
  })

  it('POST /invoices/:id/send is 404 for another user and sends nothing', async () => {
    const res = await sendInvoice(req(`/invoices/${A_INVOICE}/send`, 'sk_live_user_b', { method: 'POST', body: {} }), ctx(A_INVOICE))
    expect(res.status).toBe(404)
    expect(sendInvoiceEmail).not.toHaveBeenCalled()
    expect(fake.rows[0].status).toBe('draft')
  })

  it('POST /invoices creates the invoice for the caller only', async () => {
    const res = await createInvoice(
      req('/invoices', 'sk_live_user_b', {
        method: 'POST',
        body: { invoiceNumber: 'INV-B', clientName: 'B Client', items: [{ description: 'x', quantity: 1, price: 5 }] },
      })
    )
    expect(res.status).toBe(201)
    const { data } = await res.json()
    expect(data.userId).toBe('user-b')
  })
})

describe('v1 invoice routes: scopes', () => {
  it('a read-only key cannot write, send, or delete', async () => {
    const key = 'sk_live_b_read'
    const put = await updateInvoice(req(`/invoices/${A_INVOICE}`, key, { method: 'PUT', body: { status: 'paid' } }), ctx(A_INVOICE))
    const send = await sendInvoice(req(`/invoices/${A_INVOICE}/send`, key, { method: 'POST', body: {} }), ctx(A_INVOICE))
    const del = await deleteInvoice(req(`/invoices/${A_INVOICE}`, key, { method: 'DELETE' }), ctx(A_INVOICE))
    const create = await createInvoice(
      req('/invoices', key, { method: 'POST', body: { invoiceNumber: 'X', clientName: 'X', items: [] } })
    )
    expect([put.status, send.status, del.status, create.status]).toEqual([403, 403, 403, 403])
  })
})

describe('v1 invoice routes: id validation', () => {
  it.each(['../webhooks/abc', '..', 'not-a-uuid', `${A_INVOICE}/send`])('rejects id %p with 404', async (id) => {
    expect((await getInvoice(req('/invoices/x', 'sk_live_user_a'), ctx(id))).status).toBe(404)
    expect((await getPdf(req('/invoices/x/pdf', 'sk_live_user_a'), ctx(id))).status).toBe(404)
    expect((await sendInvoice(req('/invoices/x/send', 'sk_live_user_a', { method: 'POST', body: {} }), ctx(id))).status).toBe(404)
    expect(sendInvoiceEmail).not.toHaveBeenCalled()
  })
})
