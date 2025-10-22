import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { InvoiceItem } from '@/types/database'
import { generateInvoiceNumber } from '@/lib/utils'
import { createBrowserSupabaseClient } from '@/lib/supabase-client'

export interface InvoiceData {
  // Sender Info
  senderName: string
  senderEmail: string
  senderAddress: string
  senderCity: string
  senderState: string
  senderZip: string
  senderPhone: string
  senderLogo?: string // Logo URL

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
  id?: string // Database ID for saved invoices
  status?: 'draft' | 'sent' | 'paid'
}

interface InvoiceStore extends InvoiceData {
  // Actions
  updateSender: (field: keyof Pick<InvoiceData, 'senderName' | 'senderEmail' | 'senderAddress' | 'senderCity' | 'senderState' | 'senderZip' | 'senderPhone' | 'senderLogo'>, value: string) => void
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

  // Database operations
  saveToDatabase: (userId: string) => Promise<string | null>
  loadFromDatabase: (invoiceId: string, userId: string) => Promise<boolean>
  deleteFromDatabase: (invoiceId: string, userId: string) => Promise<boolean>
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
  senderLogo: '',

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
      })),

      // Database operations
      saveToDatabase: async (userId: string) => {
        const supabase = createBrowserSupabaseClient()
        const state = get()

        try {
          const invoiceData = {
            user_id: userId,
            invoice_number: state.invoiceNumber,
            client_name: state.clientName,
            items: state.items,
            subtotal: state.subtotal,
            tax: state.taxAmount,
            total: state.total,
            due_date: state.dueDate,
            notes: state.notes,
            status: state.status || 'draft',
            invoice_date: state.invoiceDate,
            sender_name: state.senderName,
            sender_email: state.senderEmail,
            sender_address: state.senderAddress,
            sender_city: state.senderCity,
            sender_state: state.senderState,
            sender_zip: state.senderZip,
            sender_phone: state.senderPhone,
            sender_logo: state.senderLogo,
            client_email: state.clientEmail,
            client_address: state.clientAddress,
            client_city: state.clientCity,
            client_state: state.clientState,
            client_zip: state.clientZip,
            currency: state.currency,
            terms: state.terms,
            tax_rate: state.taxRate,
            discount_rate: state.discountRate,
            discount_amount: state.discountAmount
          }

          let result

          if (state.id) {
            // Update existing invoice
            result = await supabase
              .from('invoices')
              .update(invoiceData)
              .eq('id', state.id)
              .eq('user_id', userId)
              .select()
              .single()
          } else {
            // Create new invoice
            result = await supabase
              .from('invoices')
              .insert(invoiceData)
              .select()
              .single()
          }

          if (result.error) {
            console.error('Error saving invoice:', result.error)
            return null
          }

          // Update the store with the database ID
          set((state) => {
            state.id = result.data.id
            state.isDirty = false
          })

          return result.data.id
        } catch (error) {
          console.error('Failed to save invoice to database:', error)
          return null
        }
      },

      loadFromDatabase: async (invoiceId: string, userId: string) => {
        const supabase = createBrowserSupabaseClient()

        try {
          const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .eq('id', invoiceId)
            .eq('user_id', userId)
            .single()

          if (error || !data) {
            console.error('Error loading invoice:', error)
            return false
          }

          // Load the invoice data into the store
          set(() => ({
            id: data.id,
            invoiceNumber: data.invoice_number || '',
            clientName: data.client_name || '',
            items: data.items || [{ description: '', quantity: 1, price: 0 }],
            subtotal: Number(data.subtotal) || 0,
            taxAmount: Number(data.tax) || 0,
            total: Number(data.total) || 0,
            dueDate: data.due_date || '',
            notes: data.notes || '',
            status: data.status || 'draft',
            invoiceDate: data.invoice_date || new Date().toISOString().split('T')[0],
            senderName: data.sender_name || '',
            senderEmail: data.sender_email || '',
            senderAddress: data.sender_address || '',
            senderCity: data.sender_city || '',
            senderState: data.sender_state || '',
            senderZip: data.sender_zip || '',
            senderPhone: data.sender_phone || '',
            senderLogo: data.sender_logo || '',
            clientEmail: data.client_email || '',
            clientAddress: data.client_address || '',
            clientCity: data.client_city || '',
            clientState: data.client_state || '',
            clientZip: data.client_zip || '',
            currency: data.currency || 'USD',
            terms: data.terms || 'Payment is due within 30 days of invoice date.',
            taxRate: Number(data.tax_rate) || 0,
            discountRate: Number(data.discount_rate) || 0,
            discountAmount: Number(data.discount_amount) || 0,
            isDirty: false,
            lastUpdated: Date.now()
          }))

          return true
        } catch (error) {
          console.error('Failed to load invoice from database:', error)
          return false
        }
      },

      deleteFromDatabase: async (invoiceId: string, userId: string) => {
        const supabase = createBrowserSupabaseClient()

        try {
          const { error } = await supabase
            .from('invoices')
            .delete()
            .eq('id', invoiceId)
            .eq('user_id', userId)

          if (error) {
            console.error('Error deleting invoice:', error)
            return false
          }

          return true
        } catch (error) {
          console.error('Failed to delete invoice from database:', error)
          return false
        }
      }
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