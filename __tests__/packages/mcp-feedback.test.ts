/**
 * @jest-environment node
 */
import { isPlaceholder, isUnexpectedError, scrubFeedbackText } from '../../packages/mcp/src/lib/feedback'

describe('MCP submit_feedback helpers', () => {
  it('scrubs secrets and emails before anything leaves the machine', () => {
    const scrubbed = scrubFeedbackText(
      'INVOICE_COMMAND_API_KEY=sk_live_abc123 failed for bob@example.com, link https://invoicecommand.com/i/tok123'
    )
    expect(scrubbed).not.toMatch(/sk_live_abc123|bob@example\.com|tok123/)
  })

  it('keeps invoice UUIDs', () => {
    const text = 'get_invoice 22222222-2222-4222-8222-222222222222 failed'
    expect(scrubFeedbackText(text)).toBe(text)
  })

  it('rejects placeholder text', () => {
    expect(isPlaceholder('n/a')).toBe(true)
    expect(isPlaceholder('send_invoice timed out')).toBe(false)
  })

  it('points at feedback only for unexpected errors', () => {
    const withStatus = (status: number) => Object.assign(new Error('x'), { status })
    expect(isUnexpectedError(withStatus(500))).toBe(true)
    expect(isUnexpectedError(new TypeError('fetch failed'))).toBe(true)
    for (const status of [400, 401, 403, 404, 429]) {
      expect(isUnexpectedError(withStatus(status))).toBe(false)
    }
  })
})
