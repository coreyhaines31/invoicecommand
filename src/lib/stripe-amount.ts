// Stripe charges these currencies in whole units, with no minor unit.
// https://docs.stripe.com/currencies#zero-decimal
const ZERO_DECIMAL_CURRENCIES = new Set([
  'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
  'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
])

export function isZeroDecimalCurrency(currency: string): boolean {
  return ZERO_DECIMAL_CURRENCIES.has(currency.toLowerCase())
}

// Converts a major-unit total (e.g. 12.34 USD, 10000 JPY) into the integer
// amount Stripe expects in the currency's smallest unit.
export function toStripeAmount(total: number, currency: string): number {
  return isZeroDecimalCurrency(currency) ? Math.round(total) : Math.round(total * 100)
}

export function fromStripeAmount(amount: number, currency: string): number {
  return isZeroDecimalCurrency(currency) ? amount : amount / 100
}
