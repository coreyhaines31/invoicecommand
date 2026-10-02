/**
 * Comprehensive tests for invoice store (Zustand)
 * Tests all store actions, state management, and business logic
 */

import { useInvoiceStore } from '@/stores/invoice-store'
import { act, renderHook } from '@testing-library/react'

// Mock dependencies
jest.mock('@/lib/utils', () => ({
  generateInvoiceNumber: jest.fn(async (userId?: string, documentType: 'invoice' | 'estimate' = 'invoice') => {
    const prefix = documentType === 'estimate' ? 'EST-' : 'INV-'
    return `${prefix}1001`
  }),
}))

jest.mock('@/lib/auth-client', () => ({
  authClient: {
    getSession: jest.fn(() => Promise.resolve({ data: null, error: null })),
  },
}))

describe('InvoiceStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    const { result } = renderHook(() => useInvoiceStore())
    act(() => {
      result.current.resetInvoice()
    })
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('Initial State', () => {
    it('should have correct default values', () => {
      const { result } = renderHook(() => useInvoiceStore())

      expect(result.current.documentType).toBe('invoice')
      expect(result.current.senderName).toBe('')
      expect(result.current.clientName).toBe('')
      expect(result.current.items).toHaveLength(1)
      expect(result.current.subtotal).toBe(0)
      expect(result.current.total).toBe(0)
      expect(result.current.taxRate).toBe(0)
      expect(result.current.discountRate).toBe(0)
      expect(result.current.currency).toBe('USD')
      expect(result.current.style).toBe('modern')
      expect(result.current.isDirty).toBe(false)
    })

    it('should have one empty line item by default', () => {
      const { result } = renderHook(() => useInvoiceStore())

      expect(result.current.items).toEqual([
        { description: '', quantity: 1, price: 0 }
      ])
    })

    it('should have default terms for invoice', () => {
      const { result } = renderHook(() => useInvoiceStore())

      expect(result.current.terms).toContain('Payment is due within 30 days')
    })
  })

  describe('updateSender', () => {
    it('should update sender name', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateSender('senderName', 'John Doe')
      })

      expect(result.current.senderName).toBe('John Doe')
    })

    it('should update sender email', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateSender('senderEmail', 'john@example.com')
      })

      expect(result.current.senderEmail).toBe('john@example.com')
    })

    it('should update sender address fields', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateSender('senderAddress', '123 Main St')
        result.current.updateSender('senderCity', 'New York')
        result.current.updateSender('senderState', 'NY')
        result.current.updateSender('senderZip', '10001')
      })

      expect(result.current.senderAddress).toBe('123 Main St')
      expect(result.current.senderCity).toBe('New York')
      expect(result.current.senderState).toBe('NY')
      expect(result.current.senderZip).toBe('10001')
    })

    it('should update lastUpdated timestamp', () => {
      const { result } = renderHook(() => useInvoiceStore())
      const before = result.current.lastUpdated
      const nowSpy = jest.spyOn(Date, 'now').mockReturnValue(before + 1000)

      act(() => {
        result.current.updateSender('senderName', 'Jane Doe')
      })

      expect(result.current.lastUpdated).toBe(before + 1000)
      nowSpy.mockRestore()
    })
  })

  describe('updateClient', () => {
    it('should update client name', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateClient('clientName', 'Acme Corp')
      })

      expect(result.current.clientName).toBe('Acme Corp')
    })

    it('should update all client fields', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateClient('clientName', 'Client Company')
        result.current.updateClient('clientEmail', 'client@example.com')
        result.current.updateClient('clientAddress', '456 Oak Ave')
        result.current.updateClient('clientCity', 'Los Angeles')
        result.current.updateClient('clientState', 'CA')
        result.current.updateClient('clientZip', '90001')
      })

      expect(result.current.clientName).toBe('Client Company')
      expect(result.current.clientEmail).toBe('client@example.com')
      expect(result.current.clientAddress).toBe('456 Oak Ave')
      expect(result.current.clientCity).toBe('Los Angeles')
      expect(result.current.clientState).toBe('CA')
      expect(result.current.clientZip).toBe('90001')
    })
  })

  describe('updateInvoiceDetails', () => {
    it('should update invoice number', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateInvoiceDetails('invoiceNumber', 'INV-2024-001')
      })

      expect(result.current.invoiceNumber).toBe('INV-2024-001')
    })

    it('should update dates', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateInvoiceDetails('invoiceDate', '2024-01-01')
        result.current.updateInvoiceDetails('dueDate', '2024-02-01')
      })

      expect(result.current.invoiceDate).toBe('2024-01-01')
      expect(result.current.dueDate).toBe('2024-02-01')
    })

    it('should update expiration date for estimates', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateInvoiceDetails('expirationDate', '2024-03-01')
      })

      expect(result.current.expirationDate).toBe('2024-03-01')
    })

    it('should update notes and terms', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateInvoiceDetails('notes', 'Thank you for your business!')
        result.current.updateInvoiceDetails('terms', 'Net 30 days')
      })

      expect(result.current.notes).toBe('Thank you for your business!')
      expect(result.current.terms).toBe('Net 30 days')
    })
  })

  describe('updateStyle', () => {
    it('should update invoice style to modern', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateStyle('modern')
      })

      expect(result.current.style).toBe('modern')
    })

    it('should update invoice style to classic', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateStyle('classic')
      })

      expect(result.current.style).toBe('classic')
    })

    it('should update invoice style to minimal', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateStyle('minimal')
      })

      expect(result.current.style).toBe('minimal')
    })

    it('should update style successfully', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateStyle('classic')
      })

      expect(result.current.style).toBe('classic')
    })
  })

  describe('Line Items', () => {
    describe('addItem', () => {
      it('should add a new empty line item', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.addItem()
        })

        expect(result.current.items).toHaveLength(2)
        expect(result.current.items[1]).toEqual({
          description: '',
          quantity: 1,
          price: 0
        })
      })

      it('should add multiple items', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.addItem()
          result.current.addItem()
          result.current.addItem()
        })

        expect(result.current.items).toHaveLength(4)
      })
    })

    describe('updateItem', () => {
      it('should update item description', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.updateItem(0, 'description', 'Web Development Services')
        })

        expect(result.current.items[0].description).toBe('Web Development Services')
      })

      it('should update item quantity', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.updateItem(0, 'quantity', 5)
        })

        expect(result.current.items[0].quantity).toBe(5)
      })

      it('should update item price', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.updateItem(0, 'price', 150.50)
        })

        expect(result.current.items[0].price).toBe(150.50)
      })

      it('should trigger recalculation after updating item', async () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.updateItem(0, 'quantity', 10)
          result.current.updateItem(0, 'price', 100)
        })

        // Wait for async recalculation
        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })

        expect(result.current.subtotal).toBe(1000)
        expect(result.current.total).toBe(1000)
      })
    })

    describe('removeItem', () => {
      it('should remove an item by index', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.addItem()
          result.current.addItem()
          result.current.removeItem(1)
        })

        expect(result.current.items).toHaveLength(2)
      })

      it('should not remove the last item', () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.removeItem(0)
        })

        // Should still have one item
        expect(result.current.items).toHaveLength(1)
      })

      it('should trigger recalculation after removing item', async () => {
        const { result } = renderHook(() => useInvoiceStore())

        act(() => {
          result.current.updateItem(0, 'quantity', 2)
          result.current.updateItem(0, 'price', 100)
          result.current.addItem()
          result.current.updateItem(1, 'quantity', 3)
          result.current.updateItem(1, 'price', 50)
        })

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })

        const subtotalBefore = result.current.subtotal
        expect(subtotalBefore).toBe(350) // (2*100) + (3*50)

        act(() => {
          result.current.removeItem(1)
        })

        await act(async () => {
          await new Promise(resolve => setTimeout(resolve, 10))
        })

        expect(result.current.subtotal).toBe(200) // 2*100
      })
    })
  })

  describe('calculateTotals', () => {
    it('should calculate subtotal correctly', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 5)
        result.current.updateItem(0, 'price', 100)
        result.current.calculateTotals()
      })

      expect(result.current.subtotal).toBe(500)
    })

    it('should calculate tax amount correctly', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 1)
        result.current.updateItem(0, 'price', 100)
      })

      await act(async () => {
        result.current.updateTax(10) // 10% tax
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      expect(result.current.subtotal).toBe(100)
      expect(result.current.taxAmount).toBe(10)
      expect(result.current.total).toBe(110)
    })

    it('should calculate discount amount correctly', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 1)
        result.current.updateItem(0, 'price', 100)
      })

      await act(async () => {
        result.current.updateDiscount(20) // 20% discount
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      expect(result.current.subtotal).toBe(100)
      expect(result.current.discountAmount).toBe(20)
      expect(result.current.total).toBe(80)
    })

    it('should calculate total with both tax and discount', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 2)
        result.current.updateItem(0, 'price', 50)
      })

      await act(async () => {
        result.current.updateTax(10)
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      await act(async () => {
        result.current.updateDiscount(10)
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      // Subtotal: 100
      // After discount (10%): 90
      // After tax (10% of 90): 99
      expect(result.current.subtotal).toBe(100)
      expect(result.current.discountAmount).toBe(10)
      expect(result.current.taxAmount).toBe(9)
      expect(result.current.total).toBe(99)
    })

    it('should handle multiple line items', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 2)
        result.current.updateItem(0, 'price', 100)
        result.current.addItem()
        result.current.updateItem(1, 'quantity', 3)
        result.current.updateItem(1, 'price', 50)
        result.current.addItem()
        result.current.updateItem(2, 'quantity', 1)
        result.current.updateItem(2, 'price', 75)
        result.current.calculateTotals()
      })

      // (2*100) + (3*50) + (1*75) = 425
      expect(result.current.subtotal).toBe(425)
      expect(result.current.total).toBe(425)
    })
  })

  describe('updateTax', () => {
    it('should update tax rate and recalculate', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 1)
        result.current.updateItem(0, 'price', 100)
      })

      await act(async () => {
        result.current.updateTax(8.5)
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      expect(result.current.taxRate).toBe(8.5)
      expect(result.current.taxAmount).toBe(8.5)
      expect(result.current.total).toBe(108.5)
    })
  })

  describe('updateDiscount', () => {
    it('should update discount rate and recalculate', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateItem(0, 'quantity', 1)
        result.current.updateItem(0, 'price', 100)
      })

      await act(async () => {
        result.current.updateDiscount(15)
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      expect(result.current.discountRate).toBe(15)
      expect(result.current.discountAmount).toBe(15)
      expect(result.current.total).toBe(85)
    })
  })

  describe('updatePaymentSettings', () => {
    it('should enable payment', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updatePaymentSettings({ paymentEnabled: true })
      })

      expect(result.current.paymentEnabled).toBe(true)
    })

    it('should update Stripe payment intent ID', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updatePaymentSettings({
          stripePaymentIntentId: 'pi_test_123',
          stripePaymentStatus: 'processing'
        })
      })

      expect(result.current.stripePaymentIntentId).toBe('pi_test_123')
      expect(result.current.stripePaymentStatus).toBe('processing')
    })
  })

  describe('updateDocumentType', () => {
    it('should change from invoice to estimate', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      await act(async () => {
        await result.current.updateDocumentType('estimate')
      })

      expect(result.current.documentType).toBe('estimate')
      expect(result.current.terms).toContain('estimate is valid for 30 days')
    })

    it('should change from estimate to invoice', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      await act(async () => {
        await result.current.updateDocumentType('estimate')
      })

      await act(async () => {
        await result.current.updateDocumentType('invoice')
      })

      expect(result.current.documentType).toBe('invoice')
      expect(result.current.terms).toContain('Payment is due within 30 days')
    })

    it('should regenerate document number when type changes', async () => {
      const { result } = renderHook(() => useInvoiceStore())
      const generateInvoiceNumber = require('@/lib/utils').generateInvoiceNumber

      await act(async () => {
        await result.current.updateDocumentType('estimate')
      })

      expect(generateInvoiceNumber).toHaveBeenCalledWith(undefined, 'estimate')
    })
  })

  describe('resetInvoice', () => {
    it('should reset all fields to default values', () => {
      const { result } = renderHook(() => useInvoiceStore())

      // Modify some fields
      act(() => {
        result.current.updateSender('senderName', 'John Doe')
        result.current.updateClient('clientName', 'Acme Corp')
        result.current.updateItem(0, 'price', 100)
        result.current.addItem()
      })

      // Reset
      act(() => {
        result.current.resetInvoice()
      })

      expect(result.current.senderName).toBe('')
      expect(result.current.clientName).toBe('')
      expect(result.current.items).toHaveLength(1)
      expect(result.current.items[0].price).toBe(0)
      expect(result.current.isDirty).toBe(false)
    })
  })

  describe('localStorage persistence', () => {
    it('should save to localStorage', () => {
      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.updateSender('senderName', 'Test Sender')
        result.current.saveToStorage()
      })

      const stored = localStorage.getItem('invoicecommand-draft-v1')
      expect(stored).toBeTruthy()
      const data = JSON.parse(stored!)
      expect(data.senderName).toBe('Test Sender')
    })

    it('should load from localStorage', () => {
      const testData = {
        senderName: 'Loaded Sender',
        clientName: 'Loaded Client',
        documentType: 'invoice',
        items: [{ description: 'Test Item', quantity: 1, price: 100 }],
      }

      localStorage.setItem('invoicecommand-draft-v1', JSON.stringify(testData))

      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.loadFromStorage()
      })

      expect(result.current.senderName).toBe('Loaded Sender')
      expect(result.current.clientName).toBe('Loaded Client')
      expect(result.current.items[0].description).toBe('Test Item')
    })

    it('should migrate a legacy unversioned draft', () => {
      const testData = {
        senderName: 'Loaded Sender',
        clientName: 'Loaded Client',
        documentType: 'invoice',
        items: [{ description: 'Test Item', quantity: 1, price: 100 }],
      }

      localStorage.setItem('invoicecommand-draft', JSON.stringify(testData))

      const { result } = renderHook(() => useInvoiceStore())

      act(() => {
        result.current.loadFromStorage()
      })

      expect(result.current.senderName).toBe('Loaded Sender')
      expect(result.current.clientName).toBe('Loaded Client')
      expect(result.current.items[0].description).toBe('Test Item')
      expect(localStorage.getItem('invoicecommand-draft')).toBeNull()
      expect(localStorage.getItem('invoicecommand-draft-v1')).toBe(JSON.stringify(testData))
    })
  })

  describe('initializeInvoiceNumber', () => {
    it('should initialize invoice number for anonymous users', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      await act(async () => {
        await result.current.initializeInvoiceNumber()
      })

      expect(result.current.invoiceNumber).toBe('INV-1001')
    })

    it('should initialize estimate number for estimates', async () => {
      const { result } = renderHook(() => useInvoiceStore())

      await act(async () => {
        await result.current.updateDocumentType('estimate')
      })

      expect(result.current.invoiceNumber).toBe('EST-1001')
    })
  })
})
