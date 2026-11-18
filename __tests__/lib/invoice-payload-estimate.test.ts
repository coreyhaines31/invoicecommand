/**
 * Issue #88: estimates are not paid online, so a saved estimate never carries the payment flag.
 */
import { parseInvoicePayload } from '@/lib/invoice-payload'

describe('parseInvoicePayload paymentEnabled', () => {
  it('saves an estimate with online payments off, even when the payload asks for them', () => {
    expect(parseInvoicePayload({ documentType: 'estimate', paymentEnabled: true }, 'update').paymentEnabled).toBe(false)
  })

  it('keeps the flag on an invoice', () => {
    expect(parseInvoicePayload({ documentType: 'invoice', paymentEnabled: true }, 'update').paymentEnabled).toBe(true)
  })
})
