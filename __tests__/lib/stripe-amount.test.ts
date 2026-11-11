import { fromStripeAmount, isZeroDecimalCurrency, toStripeAmount } from '@/lib/stripe-amount'

describe('toStripeAmount', () => {
  it('keeps JPY in whole yen', () => {
    expect(toStripeAmount(10000, 'jpy')).toBe(10000)
    expect(toStripeAmount(10000, 'JPY')).toBe(10000)
  })

  it('converts USD to cents', () => {
    expect(toStripeAmount(12.34, 'usd')).toBe(1234)
    expect(toStripeAmount(12.34, 'USD')).toBe(1234)
  })

  it('avoids float drift on two-decimal currencies', () => {
    expect(toStripeAmount(19.99, 'eur')).toBe(1999)
    expect(toStripeAmount(0.1 + 0.2, 'gbp')).toBe(30)
  })

  it('rounds fractional zero-decimal totals to whole units', () => {
    expect(toStripeAmount(10000.4, 'jpy')).toBe(10000)
  })

  it.each(['bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga', 'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf'])(
    'treats %s as zero-decimal',
    (currency) => {
      expect(isZeroDecimalCurrency(currency)).toBe(true)
      expect(toStripeAmount(5000, currency)).toBe(5000)
    }
  )

  it.each(['usd', 'cad', 'gbp', 'eur', 'aud', 'nzd', 'sgd', 'hkd', 'mxn', 'brl', 'inr', 'sek', 'nok', 'dkk', 'chf', 'pln', 'czk'])(
    'treats %s as two-decimal',
    (currency) => {
      expect(isZeroDecimalCurrency(currency)).toBe(false)
      expect(toStripeAmount(50, currency)).toBe(5000)
    }
  )
})

describe('fromStripeAmount', () => {
  it('round-trips JPY and USD', () => {
    expect(fromStripeAmount(10000, 'jpy')).toBe(10000)
    expect(fromStripeAmount(1234, 'usd')).toBe(12.34)
  })
})
