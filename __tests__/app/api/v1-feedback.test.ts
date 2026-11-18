/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'

const inserted: Array<Record<string, unknown>> = []
const sendMail = jest.fn(async () => ({ id: 'email-1' }))

jest.mock('@/lib/db/schema', () => ({ agentFeedback: { id: 'id' } }))
jest.mock('@/lib/db', () => ({
  db: {
    insert: () => ({
      values: (values: Record<string, unknown>) => ({
        returning: async () => {
          inserted.push(values)
          return [{ id: 'feedback-1' }]
        },
      }),
    }),
  },
}))
jest.mock('@/lib/auth', () => ({ auth: { api: { getSession: jest.fn(async () => null) } } }))
jest.mock('@/lib/api-keys', () => ({
  validateApiKey: jest.fn(async (key: string) =>
    key === 'sk_live_read_only'
      ? {
          valid: true,
          apiKey: {
            id: 'key-1',
            userId: 'user-a',
            scopes: ['invoices:read'],
            rateLimitInfo: { limit: 1000, remaining: 999, reset: new Date() },
          },
        }
      : { valid: false, error: 'Invalid API key', status: 401 }
  ),
}))
jest.mock('@/lib/mail', () => ({ sendMail: (...args: unknown[]) => sendMail(...(args as [])), appFromEmail: () => 'hello@mail.invoicecommand.com' }))
jest.mock('@/lib/error-response', () => ({
  jsonErrorResponse: (error: unknown) => {
    throw error
  },
}))

import { POST } from '@/app/api/v1/feedback/route'

const body = {
  task: 'Send an invoice',
  kind: 'broken',
  impact: 'worked_around',
  description: 'send_invoice failed with HTTP 500 for jane@example.com using sk_live_leaked',
  toolName: 'send_invoice',
  client: 'claude-code',
}

function req(key: string, payload: unknown) {
  return new NextRequest('http://localhost/api/v1/feedback', {
    method: 'POST',
    headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

const originalEnv = process.env

beforeEach(() => {
  inserted.length = 0
  sendMail.mockClear()
  process.env = { ...originalEnv, SUPPORT_EMAIL: 'owner@example.test' }
})

afterAll(() => {
  process.env = originalEnv
})

it('stores scrubbed feedback with IDs only and emails the owner', async () => {
  const res = await POST(req('sk_live_read_only', body))
  expect(res.status).toBe(201)
  expect(await res.json()).toEqual({ data: { id: 'feedback-1' } })

  expect(inserted).toHaveLength(1)
  expect(inserted[0]).toMatchObject({ userId: 'user-a', apiKeyId: 'key-1', client: 'claude-code', kind: 'broken' })
  expect(inserted[0].description).not.toMatch(/jane@example\.com|sk_live_leaked/)

  expect(sendMail).toHaveBeenCalledTimes(1)
  const mail = (sendMail.mock.calls[0] as unknown[])[0] as { to: string; text: string; html?: string }
  expect(mail.to).toBe('owner@example.test')
  expect(mail.html).toBeUndefined()
  expect(mail.text).toContain('feedback-1')
  expect(mail.text).not.toMatch(/jane@example\.com|sk_live_leaked/)
})

it('still stores the report when the email fails', async () => {
  sendMail.mockRejectedValueOnce(new Error('PostShiba 500'))
  const res = await POST(req('sk_live_read_only', body))
  expect(res.status).toBe(201)
  expect(inserted).toHaveLength(1)
})

it('rejects placeholder descriptions', async () => {
  const res = await POST(req('sk_live_read_only', { ...body, description: 'test' }))
  expect(res.status).toBe(400)
  expect(inserted).toHaveLength(0)
})

it('requires a valid key', async () => {
  const res = await POST(req('sk_live_bogus', body))
  expect(res.status).toBe(401)
  expect(inserted).toHaveLength(0)
})
