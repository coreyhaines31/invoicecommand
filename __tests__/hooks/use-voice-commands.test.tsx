/**
 * Tests for useVoiceCommands hook
 * Tests voice command processing and invoice updates
 */

import { renderHook, act, waitFor } from '@testing-library/react'
import { useVoiceCommands } from '@/hooks/use-voice-commands'

// Mock invoice store
const mockUpdateSender = jest.fn()
const mockUpdateClient = jest.fn()
const mockUpdateInvoiceDetails = jest.fn()
const mockUpdateTax = jest.fn()
const mockUpdateDiscount = jest.fn()
const mockAddItem = jest.fn()
const mockUpdateItem = jest.fn()
const mockRemoveItem = jest.fn()

const mockInvoiceStore = {
  senderName: 'John Doe',
  senderEmail: 'john@example.com',
  senderAddress: '123 Main St',
  senderCity: 'New York',
  senderState: 'NY',
  senderZip: '10001',
  senderPhone: '555-0100',
  clientName: 'Jane Smith',
  clientEmail: 'jane@example.com',
  clientAddress: '456 Oak Ave',
  clientCity: 'Boston',
  clientState: 'MA',
  clientZip: '02101',
  invoiceNumber: 'INV-001',
  invoiceDate: '2024-01-01',
  dueDate: '2024-01-31',
  items: [
    { description: 'Service 1', quantity: 1, price: 100 },
    { description: 'Service 2', quantity: 2, price: 50 },
  ],
  taxRate: 0,
  discountRate: 0,
  notes: 'Thank you',
  terms: 'Net 30',
  updateSender: mockUpdateSender,
  updateClient: mockUpdateClient,
  updateInvoiceDetails: mockUpdateInvoiceDetails,
  updateTax: mockUpdateTax,
  updateDiscount: mockUpdateDiscount,
  addItem: mockAddItem,
  updateItem: mockUpdateItem,
  removeItem: mockRemoveItem,
}

jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: () => mockInvoiceStore,
}))

describe('useVoiceCommands', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initial State', () => {
    it('should start with correct initial state', () => {
      const { result } = renderHook(() => useVoiceCommands())

      expect(result.current.isProcessing).toBe(false)
      expect(result.current.error).toBe(null)
      expect(result.current.lastResult).toBe(null)
    })
  })

  describe('Field Updates', () => {
    it('should update sender field', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'senderName',
            value: 'Bob Johnson',
            explanation: 'Updated sender name',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Change sender name to Bob Johnson')
      })

      expect(mockUpdateSender).toHaveBeenCalledWith('senderName', 'Bob Johnson')
      expect(result.current.lastResult?.success).toBe(true)
      expect(result.current.error).toBe(null)
    })

    it('should update client field', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'clientEmail',
            value: 'newemail@example.com',
            explanation: 'Updated client email',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Set client email to newemail@example.com')
      })

      expect(mockUpdateClient).toHaveBeenCalledWith('clientEmail', 'newemail@example.com')
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should update invoice details', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'invoiceNumber',
            value: 'INV-002',
            explanation: 'Updated invoice number',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Change invoice number to INV-002')
      })

      expect(mockUpdateInvoiceDetails).toHaveBeenCalledWith('invoiceNumber', 'INV-002')
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should update tax rate', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'taxRate',
            value: 8.5,
            explanation: 'Updated tax rate',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Set tax to 8.5 percent')
      })

      expect(mockUpdateTax).toHaveBeenCalledWith(8.5)
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should update discount rate', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'discountRate',
            value: 10,
            explanation: 'Updated discount rate',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Add 10 percent discount')
      })

      expect(mockUpdateDiscount).toHaveBeenCalledWith(10)
      expect(result.current.lastResult?.success).toBe(true)
    })
  })

  describe('Item Operations', () => {
    it('should add new item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'add_item',
            item: {
              description: 'New Service',
              quantity: 3,
              price: 75,
            },
            explanation: 'Added new item',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Add item: New Service, quantity 3, price 75')
      })

      expect(mockAddItem).toHaveBeenCalled()
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'description', 'New Service')
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'quantity', 3)
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'price', 75)
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should update existing item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_item',
            itemIndex: 0,
            item: {
              quantity: 5,
            },
            explanation: 'Updated item quantity',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Change first item quantity to 5')
      })

      expect(mockUpdateItem).toHaveBeenCalledWith(0, 'quantity', 5)
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should update multiple item fields', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_item',
            itemIndex: 1,
            item: {
              description: 'Updated Service',
              quantity: 4,
              price: 60,
            },
            explanation: 'Updated all item fields',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Update second item')
      })

      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'description', 'Updated Service')
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'quantity', 4)
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'price', 60)
      expect(result.current.lastResult?.success).toBe(true)
    })

    it('should remove item', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'remove_item',
            itemIndex: 0,
            explanation: 'Removed item',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Remove first item')
      })

      expect(mockRemoveItem).toHaveBeenCalledWith(0)
      expect(result.current.lastResult?.success).toBe(true)
    })
  })

  describe('Processing State', () => {
    it('should set processing state during API call', async () => {
      let resolvePromise: any
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      ;(global.fetch as jest.Mock).mockReturnValueOnce(promise)

      const { result } = renderHook(() => useVoiceCommands())

      act(() => {
        result.current.processVoiceCommand('test command')
      })

      expect(result.current.isProcessing).toBe(true)

      await act(async () => {
        resolvePromise({
          ok: true,
          json: async () => ({
            update: {
              action: 'update_field',
              field: 'notes',
              value: 'test',
            },
          }),
        })
        await promise
      })

      expect(result.current.isProcessing).toBe(false)
    })
  })

  describe('Error Handling', () => {
    it('should handle API error response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Invalid command',
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('invalid command')
      })

      expect(result.current.error).toBe('Invalid command')
      expect(result.current.lastResult?.success).toBe(false)
      expect(result.current.isProcessing).toBe(false)
    })

    it('should handle network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('test command')
      })

      expect(result.current.error).toBe('Network error')
      expect(result.current.lastResult?.success).toBe(false)
    })

    it('should handle unknown action type', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'unknown_action',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('test command')
      })

      expect(result.current.error).toContain('Unknown action')
      expect(result.current.lastResult?.success).toBe(false)
    })

    it('should handle unknown field name', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'invalidField',
            value: 'test',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('test command')
      })

      expect(result.current.error).toContain('Unknown field')
      expect(result.current.lastResult?.success).toBe(false)
    })

    it('should clear error state', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Test error' }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('test')
      })

      expect(result.current.error).toBe('Test error')

      act(() => {
        result.current.clearError()
      })

      expect(result.current.error).toBe(null)
      expect(result.current.lastResult).toBe(null)
    })
  })

  describe('API Integration', () => {
    it('should send correct request to API', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'notes',
            value: 'test',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Add note: test')
      })

      expect(global.fetch).toHaveBeenCalledWith('/api/parse-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: 'Add note: test',
          currentInvoice: {
            senderName: 'John Doe',
            senderEmail: 'john@example.com',
            senderAddress: '123 Main St',
            senderCity: 'New York',
            senderState: 'NY',
            senderZip: '10001',
            senderPhone: '555-0100',
            clientName: 'Jane Smith',
            clientEmail: 'jane@example.com',
            clientAddress: '456 Oak Ave',
            clientCity: 'Boston',
            clientState: 'MA',
            clientZip: '02101',
            invoiceNumber: 'INV-001',
            invoiceDate: '2024-01-01',
            dueDate: '2024-01-31',
            items: [
              { description: 'Service 1', quantity: 1, price: 100 },
              { description: 'Service 2', quantity: 2, price: 50 },
            ],
            taxRate: 0,
            discountRate: 0,
            notes: 'Thank you',
            terms: 'Net 30',
          },
        }),
      })
    })

    it('should include explanation in result', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'notes',
            value: 'Important note',
            explanation: 'Added important note to invoice',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Add important note')
      })

      expect(result.current.lastResult?.message).toBe('Added important note to invoice')
    })

    it('should use default message when no explanation provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'notes',
            value: 'test',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('test')
      })

      expect(result.current.lastResult?.message).toBe('Voice command processed successfully')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty transcript', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_field',
            field: 'notes',
            value: '',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('')
      })

      expect(global.fetch).toHaveBeenCalled()
    })

    it('should handle adding item with partial data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'add_item',
            item: {
              description: 'Partial Service',
            },
            explanation: 'Added partial item',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Add partial service')
      })

      expect(mockAddItem).toHaveBeenCalled()
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'description', 'Partial Service')
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'quantity', 1)
      expect(mockUpdateItem).toHaveBeenCalledWith(1, 'price', 0)
    })

    it('should handle updating item with partial data', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          update: {
            action: 'update_item',
            itemIndex: 0,
            item: {
              description: 'Updated description only',
            },
            explanation: 'Updated description',
          },
        }),
      })

      const { result } = renderHook(() => useVoiceCommands())

      await act(async () => {
        await result.current.processVoiceCommand('Update description')
      })

      expect(mockUpdateItem).toHaveBeenCalledWith(0, 'description', 'Updated description only')
      expect(mockUpdateItem).toHaveBeenCalledTimes(1)
    })
  })
})
