/**
 * @jest-environment node
 */
// Runs in America/Los_Angeles on every machine: see jest.global-setup.js.

import { formatDateOnly, toDateOnlyString } from '@/lib/date-only'

const longDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }

describe('formatDateOnly', () => {
  it('runs in a zone where the old new Date(dateString) parse shifts the day', () => {
    expect(new Date('2026-12-18').toLocaleDateString('en-US', longDate)).toBe('December 17, 2026')
  })

  it('formats a YYYY-MM-DD string as that calendar day', () => {
    expect(formatDateOnly('2026-12-18', 'en-US', longDate)).toBe('December 18, 2026')
    expect(formatDateOnly('2027-01-01', 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })).toBe(
      'Jan 1, 2027'
    )
  })

  it('returns an empty string for empty input', () => {
    expect(formatDateOnly('', 'en-US', longDate)).toBe('')
    expect(formatDateOnly(null, 'en-US', longDate)).toBe('')
    expect(formatDateOnly(undefined, 'en-US', longDate)).toBe('')
  })

  it('formats a full ISO timestamp as a local instant', () => {
    expect(formatDateOnly('2026-12-18T20:00:00.000Z', 'en-US', longDate)).toBe('December 18, 2026')
    expect(formatDateOnly('2026-12-18T03:00:00.000Z', 'en-US', longDate)).toBe('December 17, 2026')
  })

  it('returns unparseable input unchanged', () => {
    expect(formatDateOnly('not a date', 'en-US', longDate)).toBe('not a date')
  })
})

describe('toDateOnlyString', () => {
  it('uses the local calendar day, not the UTC day', () => {
    // 9pm Pacific on Nov 18 is already Nov 19 in UTC.
    const evening = new Date('2026-11-19T05:00:00.000Z')
    expect(evening.toISOString().split('T')[0]).toBe('2026-11-19')
    expect(toDateOnlyString(evening)).toBe('2026-11-18')
  })

  it('pads month and day', () => {
    expect(toDateOnlyString(new Date(2027, 0, 5))).toBe('2027-01-05')
  })
})
