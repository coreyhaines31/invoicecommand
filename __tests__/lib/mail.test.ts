/**
 * @jest-environment node
 */
const resendSend = jest.fn()
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({ emails: { send: resendSend } })),
}))

import { appFromEmail, invoiceFromEmail, replyToEmail, sendMail } from '@/lib/mail'
import { Resend } from 'resend'

const originalEnv = process.env
const realFetch = globalThis.fetch

const message = {
  from: 'invoices@mail.invoicecommand.com',
  to: 'client@example.com',
  subject: 'Invoice 1',
  html: '<p>Hi</p>',
  text: 'Hi',
  replyTo: 'owner@example.com',
}

function mockFetch(status: number, body: unknown) {
  const fetchMock = jest.fn(async () => new Response(JSON.stringify(body), { status }))
  globalThis.fetch = fetchMock as unknown as typeof fetch
  return fetchMock
}

beforeEach(() => {
  process.env = { ...originalEnv }
  delete process.env.POSTSHIBA_API_KEY
  delete process.env.RESEND_API_KEY
  for (const name of ['MAIL_FROM_EMAIL', 'MAIL_APP_FROM_EMAIL', 'MAIL_REPLY_TO', 'RESEND_FROM_EMAIL', 'RESEND_APP_FROM_EMAIL', 'RESEND_REPLY_TO']) {
    delete process.env[name]
  }
  resendSend.mockReset()
  ;(Resend as unknown as jest.Mock).mockClear()
})

afterEach(() => {
  process.env = originalEnv
  globalThis.fetch = realFetch
  jest.restoreAllMocks()
})

describe('sendMail via PostShiba', () => {
  beforeEach(() => {
    process.env.POSTSHIBA_API_KEY = 'ps-test-key'
  })

  it('posts the expected request with base64 attachments', async () => {
    const fetchMock = mockFetch(201, { queued: true, message_id: 'msg-1' })

    const result = await sendMail({
      ...message,
      attachments: [{ filename: 'invoice-1.pdf', content: Buffer.from('%PDF-1.4'), contentType: 'application/pdf' }],
    })

    expect(result).toEqual({ id: 'msg-1' })
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toBe('https://app.postshiba.com/api/v1/emails')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ authorization: 'Bearer ps-test-key', 'content-type': 'application/json' })
    expect(JSON.parse(init.body as string)).toEqual({
      from: message.from,
      to: ['client@example.com'],
      subject: 'Invoice 1',
      html: '<p>Hi</p>',
      text: 'Hi',
      reply_to: 'owner@example.com',
      attachments: [
        { filename: 'invoice-1.pdf', content: Buffer.from('%PDF-1.4').toString('base64'), content_type: 'application/pdf' },
      ],
    })
    expect(Resend).not.toHaveBeenCalled()
  })

  it('throws with the status and error code on a non-2xx response', async () => {
    mockFetch(403, { error: 'domain_unverified', field: 'from', message: 'secret detail' })
    await expect(sendMail(message)).rejects.toThrow('PostShiba 403 domain_unverified')
  })

  it('throws when the recipient is suppressed', async () => {
    mockFetch(200, { queued: false })
    await expect(sendMail(message)).rejects.toThrow(/suppressed/)
  })
})

describe('sendMail via Resend', () => {
  it('uses Resend when POSTSHIBA_API_KEY is unset', async () => {
    process.env.RESEND_API_KEY = 're-test-key'
    const fetchMock = mockFetch(500, {})
    resendSend.mockResolvedValue({ data: { id: 'resend-1' }, error: null })
    const attachments = [{ filename: 'a.pdf', content: Buffer.from('x'), contentType: 'application/pdf' }]

    const result = await sendMail({ ...message, attachments })

    expect(result).toEqual({ id: 'resend-1' })
    expect(Resend).toHaveBeenCalledWith('re-test-key')
    expect(resendSend).toHaveBeenCalledWith({ ...message, attachments })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('throws the Resend error message', async () => {
    process.env.RESEND_API_KEY = 're-test-key'
    resendSend.mockResolvedValue({ data: null, error: { message: 'quota exceeded' } })
    jest.spyOn(console, 'error').mockImplementation(() => {})
    await expect(sendMail(message)).rejects.toThrow('quota exceeded')
  })

  it('throws when no provider is configured', async () => {
    await expect(sendMail(message)).rejects.toThrow('Email is not configured')
  })
})

describe('from addresses', () => {
  it('defaults to the verified mail.invoicecommand.com domain', () => {
    expect(invoiceFromEmail()).toBe('invoices@mail.invoicecommand.com')
    expect(appFromEmail()).toBe('hello@mail.invoicecommand.com')
    expect(replyToEmail()).toBe('support@mail.invoicecommand.com')
  })

  it('prefers MAIL_* over the legacy RESEND_* names', () => {
    process.env.MAIL_FROM_EMAIL = 'Invoice Command <billing@mail.invoicecommand.com>'
    process.env.RESEND_FROM_EMAIL = 'invoices@m.invoicecommand.com'
    process.env.MAIL_REPLY_TO = 'help@invoicecommand.com'
    process.env.RESEND_REPLY_TO = 'support@m.invoicecommand.com'
    expect(invoiceFromEmail()).toBe('Invoice Command <billing@mail.invoicecommand.com>')
    expect(replyToEmail()).toBe('help@invoicecommand.com')
  })

  it('still reads the legacy RESEND_* names on the Resend path', () => {
    process.env.RESEND_FROM_EMAIL = 'invoices@m.invoicecommand.com'
    process.env.RESEND_APP_FROM_EMAIL = 'hello@m.invoicecommand.com'
    expect(invoiceFromEmail()).toBe('invoices@m.invoicecommand.com')
    expect(appFromEmail()).toBe('hello@m.invoicecommand.com')
  })

  it('never uses an unverified from domain when PostShiba is on', () => {
    process.env.POSTSHIBA_API_KEY = 'ps-test-key'
    process.env.RESEND_FROM_EMAIL = 'invoices@m.invoicecommand.com'
    process.env.MAIL_APP_FROM_EMAIL = 'Invoice Command <hello@invoicecommand.com>'
    jest.spyOn(console, 'warn').mockImplementation(() => {})
    expect(invoiceFromEmail()).toBe('invoices@mail.invoicecommand.com')
    expect(appFromEmail()).toBe('hello@mail.invoicecommand.com')
  })
})
