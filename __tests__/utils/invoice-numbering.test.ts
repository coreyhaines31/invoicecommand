/**
 * Tests for invoice numbering utilities
 * Tests generateInvoiceNumber function for both invoices and estimates
 */

import { generateInvoiceNumber } from '@/lib/utils'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    clear: () => {
      store = {}
    },
    removeItem: (key: string) => {
      delete store[key]
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

describe('generateInvoiceNumber', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  describe('Anonymous users', () => {
    it('should generate INV-1001 for first invoice', async () => {
      const number = await generateInvoiceNumber(undefined, 'invoice')
      expect(number).toBe('INV-1001')
    })

    it('should generate EST-1001 for first estimate', async () => {
      const number = await generateInvoiceNumber(undefined, 'estimate')
      expect(number).toBe('EST-1001')
    })

    it('should increment invoice numbers sequentially', async () => {
      const num1 = await generateInvoiceNumber(undefined, 'invoice')
      expect(num1).toBe('INV-1001')

      const num2 = await generateInvoiceNumber(undefined, 'invoice')
      expect(num2).toBe('INV-1002')

      const num3 = await generateInvoiceNumber(undefined, 'invoice')
      expect(num3).toBe('INV-1003')
    })

    it('should increment estimate numbers sequentially', async () => {
      const num1 = await generateInvoiceNumber(undefined, 'estimate')
      expect(num1).toBe('EST-1001')

      const num2 = await generateInvoiceNumber(undefined, 'estimate')
      expect(num2).toBe('EST-1002')
    })

    it('should maintain separate sequences for invoices and estimates', async () => {
      const inv1 = await generateInvoiceNumber(undefined, 'invoice')
      const est1 = await generateInvoiceNumber(undefined, 'estimate')
      const inv2 = await generateInvoiceNumber(undefined, 'invoice')
      const est2 = await generateInvoiceNumber(undefined, 'estimate')

      expect(inv1).toBe('INV-1001')
      expect(est1).toBe('EST-1001')
      expect(inv2).toBe('INV-1002')
      expect(est2).toBe('EST-1002')
    })

    it('should pad numbers with leading zeros', async () => {
      // Manually set counter to test padding
      localStorageMock.setItem('invoicecommand-last-invoice-number', '99')

      const number = await generateInvoiceNumber(undefined, 'invoice')
      expect(number).toBe('INV-0100')
    })
  })

  describe('Prefix format', () => {
    it('should use INV- prefix for invoices', async () => {
      const number = await generateInvoiceNumber(undefined, 'invoice')
      expect(number).toMatch(/^INV-\d{4}$/)
    })

    it('should use EST- prefix for estimates', async () => {
      const number = await generateInvoiceNumber(undefined, 'estimate')
      expect(number).toMatch(/^EST-\d{4}$/)
    })
  })

  describe('Default behavior', () => {
    it('should default to invoice type when not specified', async () => {
      const number = await generateInvoiceNumber(undefined)
      expect(number).toMatch(/^INV-/)
    })
  })
})
