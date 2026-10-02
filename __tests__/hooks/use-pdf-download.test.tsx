/**
 * Tests for usePDFDownload hook
 * Tests PDF generation, validation, and error handling
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { usePDFDownload } from '@/hooks/use-pdf-download'
import type { InvoiceData } from '@/stores/invoice-store'

// Mock dependencies
jest.mock('@/lib/pdf-generator', () => ({
  validateInvoiceForPDF: jest.fn(),
  downloadInvoicePDF: jest.fn(),
}))

const mockTrackPdfDownload = jest.fn()

jest.mock('@/hooks/use-analytics', () => ({
  useAnalytics: jest.fn(() => ({
    trackPdfDownload: mockTrackPdfDownload,
  })),
}))

describe('usePDFDownload', () => {
  const mockInvoice: InvoiceData = {
    documentType: 'invoice',
    senderName: 'Test Sender',
    senderEmail: 'sender@test.com',
    senderAddress: '123 Main St',
    senderCity: 'City',
    senderState: 'ST',
    senderZip: '12345',
    senderPhone: '123-456-7890',
    clientName: 'Test Client',
    clientEmail: 'client@test.com',
    clientAddress: '456 Oak Ave',
    clientCity: 'Town',
    clientState: 'ST',
    clientZip: '67890',
    invoiceNumber: 'INV-1001',
    invoiceDate: '2024-01-01',
    dueDate: '2024-02-01',
    items: [
      { description: 'Service 1', quantity: 1, price: 100 },
    ],
    subtotal: 100,
    taxRate: 10,
    taxAmount: 10,
    discountRate: 0,
    discountAmount: 0,
    total: 110,
    notes: 'Test notes',
    terms: 'Net 30',
    currency: 'USD',
    isDirty: false,
    lastUpdated: Date.now(),
    style: 'modern',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should have correct initial values', () => {
      const { result } = renderHook(() => usePDFDownload())

      expect(result.current.isGenerating).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.downloadPDF).toBeInstanceOf(Function)
      expect(result.current.clearError).toBeInstanceOf(Function)
    })
  })

  describe('downloadPDF', () => {
    it('should successfully generate PDF with valid invoice', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(validateInvoiceForPDF).toHaveBeenCalledWith(mockInvoice)
      expect(downloadInvoicePDF).toHaveBeenCalledWith(mockInvoice)
      expect(result.current.isGenerating).toBe(false)
      expect(result.current.error).toBeNull()
    })

    it('should set isGenerating to true during download', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })

      let resolveDownload: () => void
      downloadInvoicePDF.mockImplementation(() => new Promise(resolve => {
        resolveDownload = resolve
      }))

      const { result } = renderHook(() => usePDFDownload())

      act(() => {
        result.current.downloadPDF(mockInvoice)
      })

      // Should be generating immediately
      await waitFor(() => {
        expect(result.current.isGenerating).toBe(true)
      })

      // Complete the download
      act(() => {
        resolveDownload!()
      })

      await waitFor(() => {
        expect(result.current.isGenerating).toBe(false)
      })
    })

    it('should handle validation errors', async () => {
      const { validateInvoiceForPDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: false,
        errors: ['Missing sender name', 'Missing client name'],
      })

      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(result.current.error).toBe('Missing sender name, Missing client name')
      expect(result.current.isGenerating).toBe(false)

      consoleError.mockRestore()
    })

    it('should handle PDF generation errors', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockRejectedValue(new Error('PDF generation failed'))

      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(result.current.error).toBe('PDF generation failed')
      expect(result.current.isGenerating).toBe(false)
      expect(consoleError).toHaveBeenCalled()

      consoleError.mockRestore()
    })

    it('should handle non-Error exceptions', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockRejectedValue('String error')

      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(result.current.error).toBe('Failed to generate PDF')
      expect(result.current.isGenerating).toBe(false)

      consoleError.mockRestore()
    })

    it('should clear previous errors before new download', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      // First call fails
      validateInvoiceForPDF.mockReturnValueOnce({
        isValid: false,
        errors: ['Error 1'],
      })

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(result.current.error).toBe('Error 1')

      // Second call succeeds
      validateInvoiceForPDF.mockReturnValueOnce({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockResolvedValue(undefined)

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(result.current.error).toBeNull()
    })

    it('should track successful PDF download with analytics', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(mockTrackPdfDownload).toHaveBeenCalledWith({
        items_count: 1,
        has_tax: true,
        has_discount: false,
        total_amount: 110,
        currency: 'USD',
      })
    })

    it('should track analytics with tax and discount', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockResolvedValue(undefined)

      const invoiceWithDiscount = {
        ...mockInvoice,
        discountRate: 10,
        items: [
          { description: 'Item 1', quantity: 1, price: 100 },
          { description: 'Item 2', quantity: 2, price: 50 },
        ],
      }

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(invoiceWithDiscount)
      })

      expect(mockTrackPdfDownload).toHaveBeenCalledWith({
        items_count: 2,
        has_tax: true,
        has_discount: true,
        total_amount: 110,
        currency: 'USD',
      })
    })
  })

  describe('clearError', () => {
    it('should clear error message', async () => {
      const { validateInvoiceForPDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: false,
        errors: ['Test error'],
      })

      const { result } = renderHook(() => usePDFDownload())

      // Generate an error
      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(result.current.error).toBe('Test error')

      // Clear the error
      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should be safe to call when no error exists', () => {
      const { result } = renderHook(() => usePDFDownload())

      expect(() => {
        act(() => {
          result.current.clearError()
        })
      }).not.toThrow()

      expect(result.current.error).toBeNull()
    })
  })

  describe('Multiple Downloads', () => {
    it('should handle multiple sequential downloads', async () => {
      const { validateInvoiceForPDF, downloadInvoicePDF } = require('@/lib/pdf-generator')

      validateInvoiceForPDF.mockReturnValue({
        isValid: true,
        errors: [],
      })
      downloadInvoicePDF.mockResolvedValue(undefined)

      const { result } = renderHook(() => usePDFDownload())

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(downloadInvoicePDF).toHaveBeenCalledTimes(1)

      await act(async () => {
        await result.current.downloadPDF(mockInvoice)
      })

      expect(downloadInvoicePDF).toHaveBeenCalledTimes(2)
      expect(result.current.error).toBeNull()
    })
  })
})
