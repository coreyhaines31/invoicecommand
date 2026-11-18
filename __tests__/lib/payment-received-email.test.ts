/**
 * @jest-environment node
 */
jest.mock('@/lib/mail', () => ({
  sendMail: jest.fn(async () => ({ id: 'email-1' })),
  invoiceFromEmail: () => 'invoices@mail.example.test',
  appFromEmail: () => 'hello@mail.example.test',
  replyToEmail: () => 'support@example.test',
}))

import { sendPaymentReceivedEmail } from '@/lib/email-service'
import { sendMail } from '@/lib/mail'

const base = {
  toEmail: 'owner@example.test',
  senderName: 'Owner',
  clientName: 'Client',
  invoiceNumber: 'INV-1',
  amount: 12050,
  currency: 'usd',
  invoiceId: 'inv-1',
}

const sent = () => jest.mocked(sendMail).mock.calls[0][0]

beforeEach(() => jest.clearAllMocks())

describe('sendPaymentReceivedEmail', () => {
  it('sends the owner the amount in the invoice currency', async () => {
    await sendPaymentReceivedEmail(base)
    expect(sent().to).toBe('owner@example.test')
    expect(sent().subject).toBe('Client paid invoice INV-1')
    expect(sent().text).toContain('Amount: $120.50')
    expect(sent().html).toContain('$120.50')
  })

  it('does not divide zero-decimal currencies by 100', async () => {
    await sendPaymentReceivedEmail({ ...base, amount: 10000, currency: 'jpy' })
    expect(sent().text).toContain('Amount: ¥10,000')
  })

  it('escapes user-controlled values in the HTML', async () => {
    await sendPaymentReceivedEmail({
      ...base,
      clientName: '<script>alert(1)</script>',
      invoiceNumber: 'INV-"1"',
      senderName: 'O\'Brien & Co',
    })
    const html = sent().html as string
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
    expect(html).toContain('INV-&quot;1&quot;')
    expect(html).toContain('O&#39;Brien &amp; Co')
  })
})
