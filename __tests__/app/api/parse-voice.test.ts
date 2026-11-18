/**
 * @jest-environment node
 *
 * /api/parse-voice is the only place a voice command is charged against the
 * monthly quota. The OpenAI client is mocked: these tests never call a model.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'
import { auth } from '@/lib/auth'

const fake = createFakeDb()
const mockCreate = jest.fn()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: jest.fn() } } }))
jest.mock('openai', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({ chat: { completions: { create: mockCreate } } })),
}))

import { POST } from '@/app/api/parse-voice/route'

const getSession = auth.api.getSession as unknown as jest.Mock

const invoice = {
  senderName: 'Sender',
  clientName: 'Client',
  invoiceNumber: 'INV-0001',
  invoiceDate: '2026-11-18',
  dueDate: '2026-12-18',
  items: [{ description: 'Consulting', quantity: 1, price: 100 }],
  taxRate: 0,
  discountRate: 0,
  notes: '',
  terms: '',
}

function req(body: unknown) {
  return new NextRequest('http://localhost/api/parse-voice', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function monthYear() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function usageRow() {
  return fake.rows.find((r) => r.userId === 'user-1' && r.monthYear === monthYear())
}

beforeEach(() => {
  fake.rows.length = 0
  process.env.OPENAI_API_KEY = 'test-key'
  getSession.mockResolvedValue({ user: { id: 'user-1' } })
  mockCreate.mockReset()
  mockCreate.mockResolvedValue({
    choices: [{ message: { content: JSON.stringify({ action: 'update_field', field: 'taxRate', value: 8, explanation: 'Set tax' }) } }],
  })
})

describe('POST /api/parse-voice', () => {
  it('returns 401 for anonymous users without calling the model', async () => {
    getSession.mockResolvedValue(null)

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(res.status).toBe(401)
    expect(mockCreate).not.toHaveBeenCalled()
  })

  it('returns 429 once the monthly limit is used up', async () => {
    fake.rows.push({ id: 'u1', userId: 'user-1', monthYear: monthYear(), commandCount: 10 })

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(res.status).toBe(429)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(usageRow()?.commandCount).toBe(10)
  })

  it('reserves exactly one use for a successful command', async () => {
    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(res.status).toBe(200)
    expect((await res.json()).update.field).toBe('taxRate')
    expect(usageRow()?.commandCount).toBe(1)

    await POST(req({ transcript: 'Set tax to 9 percent', currentInvoice: invoice }))
    expect(usageRow()?.commandCount).toBe(2)
  })

  it('returns 400 for an oversized invoice without charging a use', async () => {
    const huge = { ...invoice, notes: 'x'.repeat(70_000) }

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: huge }))

    expect(res.status).toBe(400)
    expect(mockCreate).not.toHaveBeenCalled()
    expect(usageRow()).toBeUndefined()
  })

  it('accepts a large but realistic invoice', async () => {
    const items = Array.from({ length: 200 }, (_, i) => ({
      description: `Line item ${i}: ${'detailed description of the work performed '.repeat(3)}`,
      quantity: 12.5,
      price: 1234.56,
    }))
    const large = { ...invoice, items, notes: 'n'.repeat(2_000), terms: 't'.repeat(2_000) }

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: large }))

    expect(res.status).toBe(200)
  })

  it("puts today's date in the system prompt so relative dates resolve", async () => {
    jest.useFakeTimers({ now: new Date('2026-11-18T15:00:00Z'), doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask', 'setTimeout', 'clearTimeout'] })
    try {
      await POST(req({ transcript: 'Set due date to next Friday', currentInvoice: invoice }))
    } finally {
      jest.useRealTimers()
    }

    const system = mockCreate.mock.calls[0][0].messages[0].content as string
    expect(system).toContain('Wednesday, 2026-11-18')
    expect(system).not.toContain('2024')
  })
})
