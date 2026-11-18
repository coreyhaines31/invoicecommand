/**
 * @jest-environment node
 */
// Pin a zone west of UTC before any Date use, so the result doesn't depend on
// the machine's TZ. Node re-reads process.env.TZ when it is assigned.
process.env.TZ = 'America/Los_Angeles'

import { useInvoiceStore } from '@/stores/invoice-store'

describe('default invoice dates', () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it('uses the local calendar day in the evening west of UTC', () => {
    // 9pm Pacific on Nov 18 is already Nov 19 in UTC.
    jest.useFakeTimers().setSystemTime(new Date('2026-11-19T05:00:00.000Z'))

    useInvoiceStore.getState().resetInvoice()

    const { invoiceDate, dueDate, expirationDate } = useInvoiceStore.getState()
    expect(invoiceDate).toBe('2026-11-18')
    expect(dueDate).toBe('2026-12-18')
    expect(expirationDate).toBe('2026-12-18')
  })
})
