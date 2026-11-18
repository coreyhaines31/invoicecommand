/**
 * @jest-environment node
 */
import { checkInvoiceSendRateLimit, INVOICE_SEND_LIMITS } from '@/lib/rate-limit'

const HOUR = 60 * 60 * 1000

function sendMany(userId: string, count: number) {
  let last = checkInvoiceSendRateLimit(userId)
  for (let i = 1; i < count; i++) last = checkInvoiceSendRateLimit(userId)
  return last
}

beforeEach(() => {
  jest.useFakeTimers()
  jest.setSystemTime(new Date('2026-11-18T09:00:00Z'))
})

afterEach(() => jest.useRealTimers())

describe('checkInvoiceSendRateLimit', () => {
  it('allows 20 sends an hour and refuses the 21st', () => {
    expect(sendMany('hourly-user', INVOICE_SEND_LIMITS.perHour.max).allowed).toBe(true)
    const refused = checkInvoiceSendRateLimit('hourly-user')
    expect(refused.allowed).toBe(false)
    if (!refused.allowed) expect(refused.retryAfter).toBeLessThanOrEqual(3600)
  })

  it('caps sends per day even when each hour is under its limit', () => {
    for (let hour = 0; hour < 2; hour++) {
      expect(sendMany('daily-user', 20).allowed).toBe(true)
      jest.advanceTimersByTime(HOUR + 1)
    }
    expect(sendMany('daily-user', 10).allowed).toBe(true)
    const refused = checkInvoiceSendRateLimit('daily-user')
    expect(refused.allowed).toBe(false)
    if (!refused.allowed) expect(refused.retryAfter).toBeGreaterThan(3600)

    jest.advanceTimersByTime(24 * HOUR)
    expect(checkInvoiceSendRateLimit('daily-user').allowed).toBe(true)
  })

  it('counts each account separately', () => {
    sendMany('busy-user', 21)
    expect(checkInvoiceSendRateLimit('other-user').allowed).toBe(true)
  })
})
