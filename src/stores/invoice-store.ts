import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { InvoiceItem } from '@/types/database'
import { generateInvoiceNumber } from '@/lib/utils'

// localStorage versioning for schema migrations
const STORAGE_VERSION = 1
const STORAGE_KEY = `invoicecommand-draft-v${STORAGE_VERSION}`

// Debounce utility
function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Helper function to calculate totals from state
function calculateTotalsFromState(state: InvoiceData): Pick<InvoiceData, 'subtotal' | 'discountAmount' | 'taxAmount' | 'total'> {
  // Calculate subtotal
  const subtotal = state.items.reduce((sum, item) =>
    sum + (Number(item.quantity) * Number(item.price)), 0
  )

  // Calculate discount
  const discountAmount = subtotal * (state.discountRate / 100)
  const afterDiscount = subtotal - discountAmount

  // Calculate tax
  const taxAmount = afterDiscount * (state.taxRate / 100)

  // Calculate total
  const total = afterDiscount + taxAmount

  // Round to 2 decimal places
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discountAmount: Math.round(discountAmount * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

export interface InvoiceData {
  // Document Type
  documentType: 'invoice' | 'estimate'

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
  expirationDate?: string // For estimates: valid until date

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

  // Payment
  paymentEnabled?: boolean
  stripePaymentIntentId?: string
  stripePaymentStatus?: 'unpaid' | 'paid' | 'failed' | 'processing' | 'canceled'

  // Meta
  currency: string
  isDirty: boolean
  lastUpdated: number
  id?: string // Database ID for saved invoices
  status?: 'draft' | 'sent' | 'paid'
  style: 'modern' | 'classic' | 'minimal' // Invoice style template
  convertedToInvoiceId?: string // For estimates: ID of invoice created from this estimate

  // E-signature (estimates)
  collectSignature?: boolean
  signatureRequired?: boolean
  signedAt?: string | null
  signatureData?: string | null
  signerName?: string | null
  signerEmail?: string | null
}

interface InvoiceStore extends InvoiceData {
  // Actions
  updateSender: (field: keyof Pick<InvoiceData, 'senderName' | 'senderEmail' | 'senderAddress' | 'senderCity' | 'senderState' | 'senderZip' | 'senderPhone' | 'senderLogo'>, value: string) => void
  updateClient: (field: keyof Pick<InvoiceData, 'clientName' | 'clientEmail' | 'clientAddress' | 'clientCity' | 'clientState' | 'clientZip'>, value: string) => void
  updateInvoiceDetails: (field: keyof Pick<InvoiceData, 'invoiceNumber' | 'invoiceDate' | 'dueDate' | 'expirationDate' | 'notes' | 'terms'>, value: string) => void
  updateStyle: (style: 'modern' | 'classic' | 'minimal') => void
  updateTax: (rate: number) => void
  updateDiscount: (rate: number) => void
  updatePaymentSettings: (settings: Partial<Pick<InvoiceData, 'paymentEnabled' | 'stripePaymentIntentId' | 'stripePaymentStatus'>>) => void
  updateEsignatureSettings: (settings: Partial<Pick<InvoiceData, 'collectSignature' | 'signatureRequired'>>) => void

  // Document Type Management
  updateDocumentType: (type: 'invoice' | 'estimate') => Promise<void>
  convertEstimateToInvoice: () => Promise<string | null>

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
  initializeDates: () => void

  // Database operations
  saveToDatabase: (userId: string) => Promise<string | null>
  loadFromDatabase: (invoiceId: string, userId: string) => Promise<boolean>
  deleteFromDatabase: (invoiceId: string, userId: string) => Promise<boolean>
}

// Default invoice data
const defaultInvoice: InvoiceData = {
  // Document Type
  documentType: 'invoice',

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
  // Note: Dates are empty strings initially to avoid hydration mismatches.
  // They get set client-side in loadFromStorage or initializeDates.
  invoiceNumber: '1001',
  invoiceDate: '',
  dueDate: '',
  expirationDate: '',

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

  // Payment
  paymentEnabled: false,
  stripePaymentIntentId: undefined,
  stripePaymentStatus: 'unpaid',

  // E-signature
  collectSignature: true,
  signatureRequired: false,

  // Meta
  currency: 'USD',
  isDirty: false,
  lastUpdated: 0, // Set client-side to avoid hydration mismatch
  style: 'modern',
  convertedToInvoiceId: undefined
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

      updateStyle: (style) => set((state) => {
        state.style = style
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateTax: (rate) => {
        set((state) => {
          state.taxRate = rate
          state.isDirty = true
          state.lastUpdated = Date.now()
          // Calculate totals synchronously within the same update
          const totals = calculateTotalsFromState(state)
          Object.assign(state, totals)
        })
      },

      updateDiscount: (rate) => {
        set((state) => {
          state.discountRate = rate
          state.isDirty = true
          state.lastUpdated = Date.now()
          // Calculate totals synchronously within the same update
          const totals = calculateTotalsFromState(state)
          Object.assign(state, totals)
        })
      },

      updatePaymentSettings: (settings) => set((state) => {
        Object.assign(state, settings)
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateEsignatureSettings: (settings) => set((state) => {
        Object.assign(state, settings)
        state.isDirty = true
        state.lastUpdated = Date.now()
      }),

      updateDocumentType: async (type) => {
        set((state) => {
          state.documentType = type
          if (type === 'estimate') {
            state.terms = 'This estimate is valid for 30 days from the date above.'
          } else {
            state.terms = 'Payment is due within 30 days of invoice date.'
          }
          state.isDirty = true
          state.lastUpdated = Date.now()
        })

        // Regenerate document number with new type
        const { authClient } = await import('@/lib/auth-client')
        const session = await authClient.getSession()
        await get().initializeInvoiceNumber(session?.data?.user?.id)
      },

      convertEstimateToInvoice: async () => {
        const state = get()
        const originalState = { ...state }

        try {
          if (state.documentType !== 'estimate') {
            throw new Error('Cannot convert: document is not an estimate')
          }

          const { authClient } = await import('@/lib/auth-client')
          const session = await authClient.getSession()
          const user = session?.data?.user

          if (!user) {
            throw new Error('User must be logged in to convert estimate to invoice')
          }

          let estimateId = state.id
          if (!estimateId) {
            estimateId = await get().saveToDatabase(user.id)
            if (!estimateId) throw new Error('Failed to save estimate to database before conversion')
          }

          const newInvoiceNumber = await generateInvoiceNumber(user.id, 'invoice')
          if (!newInvoiceNumber) throw new Error('Failed to generate invoice number')

          const invoiceData = {
            ...state,
            documentType: 'invoice' as const,
            id: undefined,
            invoiceNumber: newInvoiceNumber,
            status: 'draft' as const,
            convertedToInvoiceId: undefined,
            expirationDate: undefined,
            terms: 'Payment is due within 30 days of invoice date.',
            isDirty: true,
          }

          set(() => invoiceData)

          const newInvoiceId = await get().saveToDatabase(user.id)
          if (!newInvoiceId) {
            set(() => originalState)
            throw new Error('Failed to save new invoice to database')
          }

          // Update the original estimate to reference the new invoice
          await fetch(`/api/invoices/${estimateId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ convertedToInvoiceId: newInvoiceId }),
          })

          return newInvoiceId
        } catch (error) {
          set(() => originalState)
          console.error('Estimate to invoice conversion failed:', error instanceof Error ? error.message : error)
          return null
        }
      },

      addItem: () => set((state) => {
        state.items.push({ description: '', quantity: 1, price: 0 })
        state.isDirty = true
        state.lastUpdated = Date.now()
        // No need to recalculate - new item has 0 price
      }),

      updateItem: (index, field, value) => {
        set((state) => {
          if (state.items[index]) {
            state.items[index][field] = value as never
            state.isDirty = true
            state.lastUpdated = Date.now()
            // Calculate totals synchronously within the same update
            const totals = calculateTotalsFromState(state)
            Object.assign(state, totals)
          }
        })
      },

      removeItem: (index) => {
        set((state) => {
          if (state.items.length > 1) {
            state.items.splice(index, 1)
            state.isDirty = true
            state.lastUpdated = Date.now()
            // Calculate totals synchronously within the same update
            const totals = calculateTotalsFromState(state)
            Object.assign(state, totals)
          }
        })
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
        const state = get()
        const invoiceNumber = await generateInvoiceNumber(userId, state.documentType)
        set((state) => {
          state.invoiceNumber = invoiceNumber
          state.isDirty = true
          state.lastUpdated = Date.now()
        })
      },

      loadFromStorage: () => {
        if (typeof window !== 'undefined') {
          try {
            // Try to load from versioned storage first
            let stored = localStorage.getItem(STORAGE_KEY)

            // Migrate from old storage key if new one doesn't exist
            if (!stored) {
              const oldStored = localStorage.getItem('invoicecommand-draft')
              if (oldStored) {
                stored = oldStored
                // Migrate to new key
                localStorage.setItem(STORAGE_KEY, oldStored)
                // Clean up old key
                localStorage.removeItem('invoicecommand-draft')
              }
            }

            if (stored) {
              const data = JSON.parse(stored)
              set(data)
              get().calculateTotals()
            }

            // Always initialize dates if they're empty (client-side only)
            get().initializeDates()
          } catch (error) {
            console.error('Failed to load invoice from storage:', error)
          }
        }
      },

      saveToStorage: () => {
        if (typeof window !== 'undefined') {
          try {
            const state = get()
            const dataToStore = {
              // Only store data fields, not functions or methods
              documentType: state.documentType,
              senderName: state.senderName,
              senderEmail: state.senderEmail,
              senderAddress: state.senderAddress,
              senderCity: state.senderCity,
              senderState: state.senderState,
              senderZip: state.senderZip,
              senderPhone: state.senderPhone,
              senderLogo: state.senderLogo,
              clientName: state.clientName,
              clientEmail: state.clientEmail,
              clientAddress: state.clientAddress,
              clientCity: state.clientCity,
              clientState: state.clientState,
              clientZip: state.clientZip,
              invoiceNumber: state.invoiceNumber,
              invoiceDate: state.invoiceDate,
              dueDate: state.dueDate,
              expirationDate: state.expirationDate,
              items: state.items,
              subtotal: state.subtotal,
              taxRate: state.taxRate,
              taxAmount: state.taxAmount,
              discountRate: state.discountRate,
              discountAmount: state.discountAmount,
              total: state.total,
              notes: state.notes,
              terms: state.terms,
              paymentEnabled: state.paymentEnabled,
              stripePaymentIntentId: state.stripePaymentIntentId,
              stripePaymentStatus: state.stripePaymentStatus,
              currency: state.currency,
              lastUpdated: state.lastUpdated,
              id: state.id,
              status: state.status,
              style: state.style,
              convertedToInvoiceId: state.convertedToInvoiceId,
              collectSignature: state.collectSignature ?? true,
              signatureRequired: state.signatureRequired ?? false,
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore))
          } catch (error) {
            console.error('Failed to save invoice to storage:', error)
          }
        }
      },

      resetInvoice: () => {
        set(() => ({ ...defaultInvoice }))
        get().initializeDates()
      },

      initializeDates: () => {
        const today = new Date().toISOString().split('T')[0]
        const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

        set((s) => {
          // Only set dates if they're empty (avoids overwriting user data)
          if (!s.invoiceDate) s.invoiceDate = today
          if (!s.dueDate) s.dueDate = thirtyDaysLater
          if (!s.expirationDate) s.expirationDate = thirtyDaysLater
          if (!s.lastUpdated) s.lastUpdated = Date.now()
        })
      },

      // Database operations
      saveToDatabase: async (userId: string) => {
        const state = get()

        try {
          const invoiceData = {
            documentType: state.documentType,
            invoiceNumber: state.invoiceNumber,
            clientName: state.clientName,
            items: state.items,
            subtotal: String(state.subtotal),
            tax: String(state.taxAmount),
            total: String(state.total),
            dueDate: state.dueDate || null,
            expirationDate: state.expirationDate || null,
            notes: state.notes,
            status: state.status || 'draft',
            invoiceDate: state.invoiceDate || null,
            senderName: state.senderName,
            senderEmail: state.senderEmail,
            senderAddress: state.senderAddress,
            senderCity: state.senderCity,
            senderState: state.senderState,
            senderZip: state.senderZip,
            senderPhone: state.senderPhone,
            senderLogo: state.senderLogo,
            clientEmail: state.clientEmail,
            clientAddress: state.clientAddress,
            clientCity: state.clientCity,
            clientState: state.clientState,
            clientZip: state.clientZip,
            currency: state.currency,
            terms: state.terms,
            taxRate: String(state.taxRate),
            discountRate: String(state.discountRate),
            discountAmount: String(state.discountAmount),
            paymentEnabled: state.paymentEnabled || false,
            convertedToInvoiceId: state.convertedToInvoiceId,
            collectSignature: state.collectSignature ?? true,
            signatureRequired: state.signatureRequired ?? false,
          }

          let data
          if (state.id) {
            const res = await fetch(`/api/invoices/${state.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(invoiceData),
            })
            if (!res.ok) return null
            data = await res.json()
          } else {
            const res = await fetch('/api/invoices', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(invoiceData),
            })
            if (!res.ok) return null
            data = await res.json()
          }

          set((state) => {
            state.id = data.id
            state.isDirty = false
          })

          return data.id
        } catch (error) {
          console.error('Failed to save invoice to database:', error)
          return null
        }
      },

      loadFromDatabase: async (invoiceId: string, _userId: string) => {
        try {
          const res = await fetch(`/api/invoices/${invoiceId}`)
          if (!res.ok) return false
          const data = await res.json()

          set(() => ({
            id: data.id,
            documentType: data.documentType || 'invoice',
            invoiceNumber: data.invoiceNumber || '',
            clientName: data.clientName || '',
            items: data.items || [{ description: '', quantity: 1, price: 0 }],
            subtotal: Number(data.subtotal) || 0,
            taxAmount: Number(data.tax) || 0,
            total: Number(data.total) || 0,
            dueDate: data.dueDate || '',
            expirationDate: data.expirationDate || undefined,
            notes: data.notes || '',
            status: data.status || 'draft',
            invoiceDate: data.invoiceDate || new Date().toISOString().split('T')[0],
            senderName: data.senderName || '',
            senderEmail: data.senderEmail || '',
            senderAddress: data.senderAddress || '',
            senderCity: data.senderCity || '',
            senderState: data.senderState || '',
            senderZip: data.senderZip || '',
            senderPhone: data.senderPhone || '',
            senderLogo: data.senderLogo || '',
            clientEmail: data.clientEmail || '',
            clientAddress: data.clientAddress || '',
            clientCity: data.clientCity || '',
            clientState: data.clientState || '',
            clientZip: data.clientZip || '',
            currency: data.currency || 'USD',
            terms: data.terms || 'Payment is due within 30 days of invoice date.',
            taxRate: Number(data.taxRate) || 0,
            discountRate: Number(data.discountRate) || 0,
            discountAmount: Number(data.discountAmount) || 0,
            paymentEnabled: data.paymentEnabled || false,
            stripePaymentIntentId: data.stripePaymentIntentId,
            stripePaymentStatus: data.stripePaymentStatus || 'unpaid',
            convertedToInvoiceId: data.convertedToInvoiceId || undefined,
            collectSignature: data.collectSignature ?? true,
            signatureRequired: data.signatureRequired ?? false,
            signedAt: data.signedAt || null,
            signatureData: data.signatureData || null,
            signerName: data.signerName || null,
            signerEmail: data.signerEmail || null,
            isDirty: false,
            lastUpdated: Date.now(),
          }))

          return true
        } catch (error) {
          console.error('Failed to load invoice from database:', error)
          return false
        }
      },

      deleteFromDatabase: async (invoiceId: string, _userId: string) => {
        try {
          const res = await fetch(`/api/invoices/${invoiceId}`, { method: 'DELETE' })
          return res.ok
        } catch (error) {
          console.error('Failed to delete invoice from database:', error)
          return false
        }
      }
    }))
  )
)

// Debounced save function - waits 300ms after last change before saving
function saveIfDirty() {
  const state = useInvoiceStore.getState()
  if (state.isDirty) {
    state.saveToStorage()
    useInvoiceStore.setState({ isDirty: false })
  }
}

const debouncedSave = debounce(saveIfDirty, 300)

// Save immediately when the page is hidden so edits inside the debounce window aren't lost
if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', saveIfDirty)
}

// Auto-save to localStorage on changes (debounced to prevent excessive writes)
useInvoiceStore.subscribe(
  (state) => state.lastUpdated,
  () => {
    const state = useInvoiceStore.getState()
    if (state.isDirty) {
      debouncedSave()
    }
  }
)

// Note: Totals are now calculated synchronously within each action (updateItem, updateTax, etc.)
// This eliminates race conditions from setTimeout-based calculations
