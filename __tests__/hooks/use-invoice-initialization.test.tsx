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

  describe('starting a new invoice from the dashboard (issue #77)', () => {
    beforeEach(() => {
      act(() => {
        useInvoiceStore.setState({ id: 'inv-a', clientName: 'Saved A', invoiceNumber: 'INV-0007' })
        useInvoiceStore.getState().saveToStorage()
      })
    })

    afterEach(() => {
      window.history.replaceState(null, '', '/')
    })

    it('a plain mount reopens the last saved invoice with its id', async () => {
      renderHook(() => useInvoiceInitialization())

      await waitFor(() => {
        expect(useInvoiceStore.getState().clientName).toBe('Saved A')
      })
      expect(useInvoiceStore.getState().id).toBe('inv-a')
    })

    it('?new=1 starts a clean draft without the saved id and removes the param', async () => {
      window.history.replaceState(null, '', '/?new=1')

      renderHook(() => useInvoiceInitialization())

      await waitFor(() => {
        expect(useInvoiceStore.getState().invoiceNumber).toBe('INV-1001')
      })
      const state = useInvoiceStore.getState()
      expect(state.id).toBeUndefined()
      expect(state.clientName).toBe('')
      expect(window.location.search).toBe('')

      // The page's own loadFromStorage call after mount must not bring the saved invoice back
      act(() => {
        useInvoiceStore.getState().loadFromStorage()
      })
      expect(useInvoiceStore.getState().id).toBeUndefined()
    })

    it('?new=1 keeps a never-saved draft and removes the param', async () => {
      act(() => {
        useInvoiceStore.getState().resetInvoice()
        useInvoiceStore.setState({ clientName: 'Unsaved work', invoiceNumber: 'INV-0009' })
        useInvoiceStore.getState().saveToStorage()
      })
      window.history.replaceState(null, '', '/?new=1')

      renderHook(() => useInvoiceInitialization())

      await waitFor(() => {
        expect(window.location.search).toBe('')
      })
      const state = useInvoiceStore.getState()
      expect(state.clientName).toBe('Unsaved work')
      expect(state.invoiceNumber).toBe('INV-0009')
      expect(state.id).toBeUndefined()
    })

    it('?new=1 starts clean when the store holds a saved id the stored draft lacks', async () => {
      // saveToDatabase sets the id in memory without rewriting the stored draft
      act(() => {
        useInvoiceStore.getState().resetInvoice()
        useInvoiceStore.setState({ clientName: 'Just saved', invoiceNumber: 'INV-0010' })
        useInvoiceStore.getState().saveToStorage()
        useInvoiceStore.setState({ id: 'inv-new' })
      })
      window.history.replaceState(null, '', '/?new=1')

      renderHook(() => useInvoiceInitialization())

      await waitFor(() => {
        expect(useInvoiceStore.getState().invoiceNumber).toBe('INV-1001')
      })
      expect(useInvoiceStore.getState().id).toBeUndefined()
      expect(useInvoiceStore.getState().clientName).toBe('')
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
