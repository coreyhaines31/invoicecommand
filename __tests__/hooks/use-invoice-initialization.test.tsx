/**
 * Tests for useInvoiceInitialization hook
 * Tests invoice number initialization and localStorage loading
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useInvoiceInitialization } from '@/hooks/use-invoice-initialization'
import { useInvoiceStore } from '@/stores/invoice-store'
import { act } from 'react'

// Mock dependencies
const mockGetSession = jest.fn()
jest.mock('@/lib/auth-client', () => ({
  authClient: {
    getSession: () => mockGetSession(),
  },
}))

jest.mock('@/lib/utils', () => ({
  generateInvoiceNumber: jest.fn(async (userId?: string, documentType: 'invoice' | 'estimate' = 'invoice') => {
    const prefix = documentType === 'estimate' ? 'EST-' : 'INV-'
    return `${prefix}${userId ? '2001' : '1001'}`
  }),
}))

describe('useInvoiceInitialization', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    mockGetSession.mockResolvedValue({ data: null, error: null })

    // Reset store
    const store = useInvoiceStore.getState()
    act(() => {
      store.resetInvoice()
    })
  })

  it('should load from localStorage on mount', async () => {
    // Pre-populate localStorage
    const draftData = {
      senderName: 'Test Company',
      clientName: 'Test Client',
      invoiceNumber: 'INV-5000',
      items: [{ description: 'Test Item', quantity: 1, price: 100 }],
    }
    localStorage.setItem('invoicecommand-draft', JSON.stringify(draftData))

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.senderName).toBe('Test Company')
      expect(state.clientName).toBe('Test Client')
      expect(state.invoiceNumber).toBe('INV-5000')
    })
  })

  it('should initialize invoice number for new invoices', async () => {
    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.invoiceNumber).toBe('INV-1001')
    })
  })

  it('should not regenerate number if draft has custom number', async () => {
    const draftData = {
      invoiceNumber: 'INV-CUSTOM-123',
      senderName: 'Test',
    }
    localStorage.setItem('invoicecommand-draft', JSON.stringify(draftData))

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.invoiceNumber).toBe('INV-CUSTOM-123')
    })
  })

  it('should regenerate number if draft has default "1001"', async () => {
    const draftData = {
      invoiceNumber: '1001',
      senderName: 'Test',
    }
    localStorage.setItem('invoicecommand-draft', JSON.stringify(draftData))

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.invoiceNumber).toBe('INV-1001')
    })
  })

  it('should handle authenticated users', async () => {
    mockGetSession.mockResolvedValue({
      data: {
        user: { id: 'user-123' },
        session: { id: 'session-1' },
      },
      error: null,
    })

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.invoiceNumber).toBe('INV-2001')
    })
  })

  it('should fallback to anonymous on error', async () => {
    mockGetSession.mockRejectedValue(new Error('Auth error'))

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.invoiceNumber).toBe('INV-1001')
    })
  })

  it('should only run once on mount', async () => {
    const { rerender } = renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      expect(mockGetSession).toHaveBeenCalledTimes(1)
    })

    // Rerender should not call again
    rerender()

    await new Promise(resolve => setTimeout(resolve, 50))
    expect(mockGetSession).toHaveBeenCalledTimes(1)
  })

  it('should cleanup on unmount', async () => {
    const { unmount } = renderHook(() => useInvoiceInitialization())

    // Should not throw on unmount
    expect(() => unmount()).not.toThrow()
  })

  it('should handle empty localStorage gracefully', async () => {
    localStorage.clear()

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      expect(state.invoiceNumber).toBe('INV-1001')
    })
  })

  it('should handle corrupted localStorage data', async () => {
    localStorage.setItem('invoicecommand-draft', 'invalid json {')

    const consoleError = jest.spyOn(console, 'error').mockImplementation()

    renderHook(() => useInvoiceInitialization())

    await waitFor(() => {
      const state = useInvoiceStore.getState()
      // Should still initialize with default number
      expect(state.invoiceNumber).toBe('INV-1001')
    })

    consoleError.mockRestore()
  })
})
