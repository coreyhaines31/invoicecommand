/**
 * @jest-environment node
 */
jest.mock('@/lib/mail', () => ({
  sendMail: jest.fn(async () => ({ id: 'email-1' })),
  invoiceFromEmail: () => 'invoices@mail.example.test',
  appFromEmail: () => 'hello@mail.example.test',
  replyToEmail: () => 'support@example.test',
}))

import { sendVerificationEmail } from '@/lib/email-service'
import { sendMail } from '@/lib/mail'

const sent = () => jest.mocked(sendMail).mock.calls[0][0]

beforeEach(() => jest.clearAllMocks())

describe('sendVerificationEmail', () => {
  it('sends the verification link to the account email', async () => {
    const verifyUrl = 'https://invoicecommand.com/api/auth/verify-email?token=abc&callbackURL=%2Fauth%2Fverified'
    await sendVerificationEmail({ to: 'me@example.test', verifyUrl })
    expect(sent().to).toBe('me@example.test')
    expect(sent().from).toBe('hello@mail.example.test')
    expect(sent().subject).toBe('Verify your Invoice Command email')
    expect(sent().text).toContain(verifyUrl)
    expect(sent().html).toContain(verifyUrl.replace(/&/g, '&amp;'))
  })

  it('escapes interpolated values in the HTML', async () => {
    await sendVerificationEmail({
      to: '"<b>x</b>"@example.test',
      verifyUrl: 'https://example.test/v?a="><script>alert(1)</script>',
    })
    const html = sent().html as string
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<b>x</b>')
    expect(html).toContain('&lt;script&gt;')
  })
})
