type TotalsInput = {
  items: Array<{ quantity: number | string; price: number | string }>
  taxRate: number
  discountRate: number
}

export type InvoiceTotals = {
  subtotal: number
  discountAmount: number
  taxAmount: number
  total: number
}

// Discount applies to the subtotal; tax applies after the discount. Every
// figure is rounded to cents. Shared by the builder and the v1 API so a total
// can't drift between them.
export function calculateInvoiceTotals({ items, taxRate, discountRate }: TotalsInput): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.price), 0)
  const discountAmount = subtotal * (discountRate / 100)
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * (taxRate / 100)
  const total = afterDiscount + taxAmount

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  }
}
