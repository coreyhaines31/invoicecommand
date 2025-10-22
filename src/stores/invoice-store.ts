import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { InvoiceItem } from '@/types/database'
import { generateInvoiceNumber } from '@/lib/utils'

export interface InvoiceData {
  // Sender Info
  senderName: string
  senderEmail: string
  senderAddress: string
  senderCity: string
  senderState: string
  senderZip: string
  senderPhone: string

  // Recipient Info
  clientName: string
  clientEmail: string
  clientAddress: string
  clientCity: string
  clientState: string
  clientZip: string

  // Invoice Details
  invoiceNumber: string
  invoiceDate: string
  dueDate: string

  // Line Items
  items: InvoiceItem[]

  // Calculations
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number

  // Additional
  notes: string
  terms: string

  // Meta
  currency: string
  isDirty: boolean
  lastUpdated: number
}

interface InvoiceStore extends InvoiceData {
  // Actions
  updateSender: (field: keyof Pick<InvoiceData, 'senderName' | 'senderEmail' | 'senderAddress' | 'senderCity' | 'senderState' | 'senderZip' | 'senderPhone'>, value: string) => void
  updateClient: (field: keyof Pick<InvoiceData, 'clientName' | 'clientEmail' | 'clientAddress' | 'clientCity' | 'clientState' | 'clientZip'>, value: string) => void
  updateInvoiceDetails: (field: keyof Pick<InvoiceData, 'invoiceNumber' | 'invoiceDate' | 'dueDate' | 'notes' | 'terms'>, value: string) => void
  updateTax: (rate: number) => void
  updateDiscount: (rate: number) => void

  // Line Items
  addItem: () => void
  updateItem: (index: number, field: keyof InvoiceItem, value: string | number) => void
  removeItem: (index: number) => void

  // Calculations
  calculateTotals: () => void

  // Invoice numbering
  initializeInvoiceNumber: (userId?: string) => Promise<void>

  // Persistence
  loadFromStorage: () => void
  saveToStorage: () => void
  resetInvoice: () => void
}

// Default invoice data
const defaultInvoice: InvoiceData = {
  // Sender
  senderName: '',
  senderEmail: '',
  senderAddress: '',
  senderCity: '',
  senderState: '',
  senderZip: '',
  senderPhone: '',

  // Client
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  clientCity: '',
  clientState: '',
  clientZip: '',

  // Invoice
  invoiceNumber: '1001',
  invoiceDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days

  // Items
  items: [
    { description: '', quantity: 1, price: 0 }
  ],

  // Calculations
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discountRate: 0,
  discountAmount: 0,
  total: 0,

  // Additional
  notes: '',
  terms: 'Payment is due within 30 days of invoice date.',

  // Meta
  currency: 'USD',
  isDirty: false,
  lastUpdated: Date.now()
}

export const useInvoiceStore = create<InvoiceStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...defaultInvoice,

      updateSender: (field, value) => set((state) => {
        state[field] = value
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateClient: (field, value) => set((state) => {
        state[field] = value
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateInvoiceDetails: (field, value) => set((state) => {
        state[field] = value
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateTax: (rate) => {
        set((state) => {
          state.taxRate = rate
          state.isDirty = true
          state.lastUpdated = Date.now()
        })
        // Trigger recalculation after state update
        setTimeout(() => get().calculateTotals(), 0)
      },

      updateDiscount: (rate) => {
        set((state) => {
          state.discountRate = rate
          state.isDirty = true
          state.lastUpdated = Date.now()
        })
        // Trigger recalculation after state update
        setTimeout(() => get().calculateTotals(), 0)
      },

      addItem: () => set((state) => {
        state.items.push({ description: '', quantity: 1, price: 0 })
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateItem: (index, field, value) => {
        set((state) => {
          if (state.items[index]) {
            state.items[index][field] = value as never
            state.isDirty = true
            state.lastUpdated = Date.now()
          }
        })
        // Trigger recalculation after state update
        setTimeout(() => get().calculateTotals(), 0)
      },

      removeItem: (index) => {
        set((state) => {
          if (state.items.length > 1) {
            state.items.splice(index, 1)
            state.isDirty = true
            state.lastUpdated = Date.now()
          }
        })
        // Trigger recalculation after state update
        setTimeout(() => get().calculateTotals(), 0)
      },

      calculateTotals: () => set((state) => {
        // Calculate subtotal
        state.subtotal = state.items.reduce((sum, item) =>
          sum + (Number(item.quantity) * Number(item.price)), 0
        )

        // Calculate discount
        state.discountAmount = state.subtotal * (state.discountRate / 100)
        const afterDiscount = state.subtotal - state.discountAmount

        // Calculate tax
        state.taxAmount = afterDiscount * (state.taxRate / 100)

        // Calculate total
        state.total = afterDiscount + state.taxAmount

        // Round to 2 decimal places
        state.subtotal = Math.round(state.subtotal * 100) / 100
        state.discountAmount = Math.round(state.discountAmount * 100) / 100
        state.taxAmount = Math.round(state.taxAmount * 100) / 100
        state.total = Math.round(state.total * 100) / 100
      }),

      initializeInvoiceNumber: async (userId?: string) => {
        const invoiceNumber = await generateInvoiceNumber(userId)
        set((state) => {
          state.invoiceNumber = invoiceNumber
          state.isDirty = true
          state.lastUpdated = Date.now()
        })
      },

      loadFromStorage: () => {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('invoicecommand-draft')
          if (stored) {
            try {
              const data = JSON.parse(stored)
              set(data)
              get().calculateTotals()
            } catch (error) {
              console.error('Failed to load invoice from storage:', error)
            }
          }
        }
      },

      saveToStorage: () => {
        if (typeof window !== 'undefined') {
          const state = get()
          localStorage.setItem('invoicecommand-draft', JSON.stringify({
            ...state,
            // Don't store functions
            updateSender: undefined,
            updateClient: undefined,
            updateInvoiceDetails: undefined,
            updateTax: undefined,
            updateDiscount: undefined,
            addItem: undefined,
            updateItem: undefined,
            removeItem: undefined,
            calculateTotals: undefined,
            loadFromStorage: undefined,
            saveToStorage: undefined,
            resetInvoice: undefined,
          }))
        }
      },

      resetInvoice: () => set(() => ({
        ...defaultInvoice,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      }))
    }))
  )
)

// Auto-save to localStorage on changes
useInvoiceStore.subscribe(
  (state) => state.isDirty,
  (isDirty) => {
    if (isDirty) {
      useInvoiceStore.getState().saveToStorage()
      // Reset dirty flag after saving
      useInvoiceStore.setState({ isDirty: false })
    }
  }
)

// Auto-calculate totals when items, tax, or discount change
useInvoiceStore.subscribe(
  (state) => ({ items: state.items, taxRate: state.taxRate, discountRate: state.discountRate }),
  () => {
    // Small delay to ensure state has been updated
    setTimeout(() => {
      useInvoiceStore.getState().calculateTotals()
    }, 10)
  },
  {
    fireImmediately: false,
    equalityFn: (a, b) =>
      JSON.stringify(a.items) === JSON.stringify(b.items) &&
      a.taxRate === b.taxRate &&
      a.discountRate === b.discountRate
  }
)