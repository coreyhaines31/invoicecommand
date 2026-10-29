import { calculateInvoiceTotals } from '@/lib/invoice-totals'

describe('calculateInvoiceTotals', () => {
  it('applies the discount before tax and rounds to cents', () => {
    expect(
      calculateInvoiceTotals({
        items: [
          { quantity: 2, price: 50 },
          { quantity: '1', price: '33.335' },
        ],
        discountRate: 10,
        taxRate: 8.25,
      })
    ).toEqual({ subtotal: 133.34, discountAmount: 13.33, taxAmount: 9.9, total: 129.9 })
  })

  it('returns the subtotal as the total with no tax or discount', () => {
    expect(calculateInvoiceTotals({ items: [{ quantity: 3, price: 10 }], discountRate: 0, taxRate: 0 })).toEqual({
      subtotal: 30,
      discountAmount: 0,
      taxAmount: 0,
      total: 30,
    })
  })
})
