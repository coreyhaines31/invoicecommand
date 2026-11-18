/**
 * @jest-environment node
 */
import { FeedbackValidationError, isPlaceholder, parseAgentFeedback, scrubFeedbackText } from '@/lib/agent-feedback'

const valid = {
  task: 'Create an invoice for Acme',
  kind: 'broken',
  impact: 'blocked',
  description: 'create_invoice returned HTTP 500 for a 3-item invoice.',
}

describe('scrubFeedbackText', () => {
  it('redacts API keys, tokens, emails and card numbers', () => {
    const text = [
      'key sk_live_abcDEF123_xyz',
      'stripe sk_test_51Habc123',
      'Authorization: Bearer abcdefghijklmnop',
      'password=hunter22',
      'jwt eyJhbGciOi.eyJzdWIiOi.c2lnbmF0dXJl',
      'mail jane@example.com',
      'card 4242 4242 4242 4242',
      'share https://invoicecommand.com/i/secret-token',
    ].join('\n')
    const scrubbed = scrubFeedbackText(text)
    expect(scrubbed).not.toMatch(/sk_live_abc|sk_test_51|abcdefghijklmnop|hunter22|eyJhbGciOi|jane@example\.com|4242 4242|secret-token/)
    expect(scrubbed).toContain('[REDACTED_API_KEY]')
    expect(scrubbed).toContain('[REDACTED_EMAIL]')
  })

  it('keeps invoice UUIDs and ordinary text', () => {
    const text = 'get_invoice 22222222-2222-4222-8222-222222222222 returned 404'
    expect(scrubFeedbackText(text)).toBe(text)
  })
})

describe('isPlaceholder', () => {
  it.each(['test', 'N/A', ' TODO ', 'none.', ''])('rejects %p', (value) => {
    expect(isPlaceholder(value)).toBe(true)
  })

  it('accepts a real report', () => {
    expect(isPlaceholder('list_invoices ignored the status filter')).toBe(false)
  })
})

describe('parseAgentFeedback', () => {
  it('trims, scrubs and keeps optional fields', () => {
    const parsed = parseAgentFeedback({
      ...valid,
      task: '  Create an invoice  ',
      description: 'Failed with key sk_live_secret123',
      toolName: ' create_invoice ',
      client: 'claude-code',
    })
    expect(parsed).toEqual({
      task: 'Create an invoice',
      kind: 'broken',
      impact: 'blocked',
      description: 'Failed with key [REDACTED_API_KEY]',
      toolName: 'create_invoice',
      client: 'claude-code',
    })
  })

  it.each([
    [{ ...valid, description: 'test' }, /placeholder/],
    [{ ...valid, task: 'n/a' }, /placeholder/],
    [{ ...valid, kind: 'bug' }, /kind/],
    [{ ...valid, impact: 'annoying' }, /impact/],
    [{ ...valid, task: 'x'.repeat(201) }, /200/],
    [{ ...valid, description: 'x'.repeat(4097) }, /4096/],
    [{ ...valid, toolName: 42 }, /toolName/],
    [{ kind: 'idea' }, /required/],
  ])('rejects %p', (body, message) => {
    expect(() => parseAgentFeedback(body)).toThrow(FeedbackValidationError)
    expect(() => parseAgentFeedback(body)).toThrow(message)
  })
})
