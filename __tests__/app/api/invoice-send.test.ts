/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/auth', () => ({
  auth: { api: { getSession: jest.fn(async () => ({ user: { id: 'user-a' } })) } },
}))
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
jest.mock('@/lib/email-service', () => ({ sendInvoiceEmail: jest.fn(async () => ({ id: 'email-1' })) }))
jest.mock('@/lib/webhook-service', () => ({ triggerWebhooks: jest.fn() }))
jest.mock('@/lib/share-link', () => ({
  generateShareToken: () => 'share-token',
  buildShareUrl: (t: string) => `https://example.test/i/${t}`,
}))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))
jest.mock('@/lib/invoice-pdf-server', () => ({
  renderInvoicePdf: jest.fn(async () => Buffer.from('%PDF-server-rendered')),
}))

import { POST as v1Send } from '@/app/api/v1/invoices/[id]/send/route'
import { POST as webSend } from '@/app/api/send-invoice/route'
import { sendInvoiceEmail } from '@/lib/email-service'
import { renderInvoicePdf } from '@/lib/invoice-pdf-server'

const INVOICE_ID = '11111111-1111-4111-8111-111111111111'
const phishingPdf = Buffer.from('%PDF-1.7 attacker content').toString('base64')

function seedInvoice() {
  fake.rows.length = 0
  fake.rows.push({
    id: INVOICE_ID,
    userId: 'user-a',
    invoiceNumber: 'INV-001',
    clientName: 'Client',
    clientEmail: 'client@example.test',
    senderEmail: 'me@example.test',
    items: [],
    subtotal: '0',
    tax: '0',
    total: '0',
    status: 'draft',
    signedAt: null,
    shareToken: null,
    shareEnabled: false,
  })
}

function request(url: string, body: unknown, headers: Record<string, string> = {}) {
  return new NextRequest(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  })
}

beforeEach(() => {
  seedInvoice()
  jest.clearAllMocks()
})

describe('invoice send attaches only the server-rendered PDF', () => {
  it('v1: ignores a caller-supplied pdfBuffer', async () => {
    const res = await v1Send(
      request(`http://localhost/api/v1/invoices/${INVOICE_ID}/send`, { pdfBuffer: phishingPdf, senderMessage: 'hi' }, {
        authorization: 'Bearer sk_live_test',
      }),
      { params: Promise.resolve({ id: INVOICE_ID }) }
    )

    expect(res.status).toBe(200)
    expect(renderInvoicePdf).toHaveBeenCalledTimes(1)
    const [[args]] = (sendInvoiceEmail as jest.Mock).mock.calls
    expect(args.pdfBuffer.toString()).toBe('%PDF-server-rendered')
    expect(args.senderMessage).toBe('hi')
  })

  it('v1: works with no body at all', async () => {
    const res = await v1Send(
      new NextRequest(`http://localhost/api/v1/invoices/${INVOICE_ID}/send`, {
        method: 'POST',
        headers: { authorization: 'Bearer sk_live_test' },
      }),
      { params: Promise.resolve({ id: INVOICE_ID }) }
    )

    expect(res.status).toBe(200)
    expect(sendInvoiceEmail).toHaveBeenCalledTimes(1)
  })

  it('web: ignores a caller-supplied pdfBuffer and keeps the recipient override', async () => {
    const res = await webSend(
      request('http://localhost/api/send-invoice', {
        invoiceId: INVOICE_ID,
        pdfBuffer: phishingPdf,
        clientEmail: 'other@example.test',
      })
    )

    expect(res.status).toBe(200)
    const [[pdfInvoice]] = (renderInvoicePdf as jest.Mock).mock.calls
    expect(pdfInvoice.clientEmail).toBe('client@example.test')
    const [[args]] = (sendInvoiceEmail as jest.Mock).mock.calls
    expect(args.pdfBuffer.toString()).toBe('%PDF-server-rendered')
    expect(args.invoice.clientEmail).toBe('other@example.test')
  })
})
