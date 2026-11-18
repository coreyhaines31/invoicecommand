/**
 * @jest-environment node
 *
 * The share link PDF is public, so the token is the whole access boundary: it
 * must honor the same enabled and expiry checks as the /i/[token] page.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/rate-limit', () => ({ checkIpRateLimit: () => ({ allowed: true }) }))
jest.mock('@/lib/invoice-pdf-server', () => ({ renderInvoicePdf: jest.fn(async () => Buffer.from('%PDF-share')) }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { GET } from '@/app/api/share/[token]/pdf/route'
import { renderInvoicePdf } from '@/lib/invoice-pdf-server'

const TOKEN = 'share_token_abcdefghijklmnop'

function seed(overrides: Record<string, unknown> = {}) {
  fake.rows.length = 0
  fake.rows.push({
    id: '55555555-5555-4555-8555-555555555555',
    userId: 'user-a',
    invoiceNumber: 'INV-300',
    clientName: 'Acme',
    items: [],
    subtotal: '100',
    tax: '0',
    total: '100',
    documentType: 'invoice',
    shareToken: TOKEN,
    shareEnabled: true,
    shareExpiresAt: null,
    ...overrides,
  })
}

function get(token: string) {
  return GET(new NextRequest(`http://localhost/api/share/${token}/pdf`), {
    params: Promise.resolve({ token }),
  })
}

beforeEach(() => {
  seed()
  jest.clearAllMocks()
})

describe('GET /api/share/[token]/pdf', () => {
  it('returns the stored invoice as a PDF attachment', async () => {
    const res = await get(TOKEN)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('application/pdf')
    expect(res.headers.get('content-disposition')).toBe('attachment; filename="invoice-INV-300.pdf"')
    expect(Buffer.from(await res.arrayBuffer()).toString()).toBe('%PDF-share')
    const [[rendered]] = (renderInvoicePdf as jest.Mock).mock.calls
    expect(rendered).toMatchObject({ invoiceNumber: 'INV-300', total: 100, documentType: 'invoice' })
  })

  it('names an estimate as an estimate', async () => {
    seed({ documentType: 'estimate', invoiceNumber: 'EST-7' })

    const res = await get(TOKEN)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-disposition')).toBe('attachment; filename="estimate-EST-7.pdf"')
    const [[rendered]] = (renderInvoicePdf as jest.Mock).mock.calls
    expect(rendered.documentType).toBe('estimate')
  })

  it.each([
    ['a wrong token', () => seed(), 'wrong_token_abcdefghijklmnop'],
    ['a malformed token', () => seed(), 'bad token!'],
    ['a disabled link', () => seed({ shareEnabled: false }), TOKEN],
    ['an expired link', () => seed({ shareExpiresAt: new Date(Date.now() - 1000) }), TOKEN],
  ])('returns 404 for %s', async (_label, arrange, token) => {
    arrange()

    const res = await get(token)

    expect(res.status).toBe(404)
    expect(renderInvoicePdf).not.toHaveBeenCalled()
  })

  it('serves a link whose expiry is still in the future', async () => {
    seed({ shareExpiresAt: new Date(Date.now() + 60_000) })

    const res = await get(TOKEN)

    expect(res.status).toBe(200)
  })
})
