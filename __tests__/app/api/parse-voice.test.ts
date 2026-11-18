/**
 * @jest-environment node
 *
 * /api/parse-voice is the only place a voice command is charged against the
 * monthly quota. The AI SDK is mocked: these tests never call a model.
 */
import { NextRequest } from 'next/server'
import { createFakeDb } from '../../helpers/fake-db'
import { auth } from '@/lib/auth'

const fake = createFakeDb()
const mockGenerateText = jest.fn()

jest.mock('drizzle-orm', () => jest.requireActual('../../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: jest.fn() } } }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: jest.fn((_error: unknown, message: string) => Response.json({ error: message }, { status: 500 })),
  reportError: jest.fn(),
}))
jest.mock('ai', () => {
  class NoObjectGeneratedError extends Error {
    static isInstance(error: unknown) { return error instanceof NoObjectGeneratedError }
  }
  return {
    generateText: (...args: unknown[]) => mockGenerateText(...args),
    Output: { object: (options: unknown) => ({ kind: 'object', options }) },
    NoObjectGeneratedError,
  }
})

import { POST } from '@/app/api/parse-voice/route'

const getSession = auth.api.getSession as unknown as jest.Mock
const { NoObjectGeneratedError } = jest.requireMock('ai') as { NoObjectGeneratedError: new (message: string) => Error }

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

const usage = { inputTokens: 1000, outputTokens: 50 }

function modelReturns(output: Record<string, unknown>) {
  mockGenerateText.mockResolvedValue({
    output: { action: 'update_field', field: null, value: null, itemIndex: null, item: null, explanation: '', ...output },
    usage,
  })
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
  return fake.tables.voiceUsage.find((r) => r.userId === 'user-1' && r.monthYear === monthYear())
}

beforeEach(() => {
  fake.tables.voiceUsage.length = 0
  delete process.env.VOICE_MODEL
  getSession.mockResolvedValue({ user: { id: 'user-1' } })
  mockGenerateText.mockReset()
  modelReturns({ field: 'taxRate', value: 8, explanation: 'Set tax' })
})

describe('POST /api/parse-voice', () => {
  it('returns 401 for anonymous users without calling the model', async () => {
    getSession.mockResolvedValue(null)

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(res.status).toBe(401)
    expect(mockGenerateText).not.toHaveBeenCalled()
  })

  it('returns 429 once the monthly limit is used up', async () => {
    fake.tables.voiceUsage.push({ id: 'u1', userId: 'user-1', monthYear: monthYear(), commandCount: 10 })

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(res.status).toBe(429)
    expect(mockGenerateText).not.toHaveBeenCalled()
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

  it('returns the update without the null keys structured output fills in', async () => {
    modelReturns({ action: 'update_item', itemIndex: 0, item: { description: null, quantity: 6, price: null }, explanation: 'Set quantity to 6' })

    const res = await POST(req({ transcript: 'Change the quantity to 6', currentInvoice: invoice }))

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      success: true,
      update: { action: 'update_item', itemIndex: 0, item: { quantity: 6 }, explanation: 'Set quantity to 6' },
      originalTranscript: 'Change the quantity to 6',
    })
  })

  it('calls the gateway model with a schema, defaulting to openai/gpt-4o-mini', async () => {
    await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    const params = mockGenerateText.mock.calls[0][0]
    expect(params.model).toBe('openai/gpt-4o-mini')
    expect(params.output.kind).toBe('object')
    expect(params.temperature).toBe(0.1)
    expect(params.maxOutputTokens).toBeGreaterThan(0)
  })

  it('uses VOICE_MODEL when it is set', async () => {
    process.env.VOICE_MODEL = 'openai/gpt-6-luna'

    await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(mockGenerateText.mock.calls[0][0].model).toBe('openai/gpt-6-luna')
  })

  it('returns 422 with the explanation when the model cannot tell what to change', async () => {
    modelReturns({ action: 'error', explanation: 'Which item should change?' })

    const res = await POST(req({ transcript: 'Update the price', currentInvoice: invoice }))

    expect(res.status).toBe(422)
    expect((await res.json()).error).toBe('Which item should change?')
    expect(usageRow()?.commandCount).toBe(1)
  })

  it('keeps the use spent when the model answers in the wrong shape', async () => {
    mockGenerateText.mockRejectedValue(new NoObjectGeneratedError('No object generated'))

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: invoice }))

    expect(res.status).toBe(500)
    expect(usageRow()?.commandCount).toBe(1)
  })

  it('returns 400 for an oversized invoice without charging a use', async () => {
    const huge = { ...invoice, notes: 'x'.repeat(70_000) }

    const res = await POST(req({ transcript: 'Set tax to 8 percent', currentInvoice: huge }))

    expect(res.status).toBe(400)
    expect(mockGenerateText).not.toHaveBeenCalled()
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

    const system = mockGenerateText.mock.calls[0][0].system as string
    expect(system).toContain('Wednesday, 2026-11-18')
    expect(system).not.toContain('2024')
  })
})
