'use client'

import { useState } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'

// Shape returned by /api/parse-voice. It comes from a model, so fields are
// only loosely guaranteed and are checked before use.
interface VoiceInvoiceUpdate {
  action?: string
  field?: string
  value?: string | number | boolean
  itemIndex?: number
  item?: {
    description?: string
    quantity?: number
    price?: number
  }
  explanation?: string
}

interface VoiceCommandResult {
  success: boolean
  message: string
  update?: VoiceInvoiceUpdate
}

const SENDER_FIELDS = ['senderName', 'senderEmail', 'senderAddress', 'senderCity', 'senderState', 'senderZip', 'senderPhone'] as const
const CLIENT_FIELDS = ['clientName', 'clientEmail', 'clientAddress', 'clientCity', 'clientState', 'clientZip'] as const
const DETAIL_FIELDS = ['invoiceNumber', 'invoiceDate', 'dueDate', 'notes', 'terms'] as const

function isOneOf<T extends string>(fields: readonly T[], field: string | undefined): field is T {
  return fields.some((f) => f === field)
}

function toText(value: VoiceInvoiceUpdate['value']): string {
  return value === undefined ? '' : String(value)
}

interface UseVoiceCommandsReturn {
  isProcessing: boolean
  error: string | null
  lastResult: VoiceCommandResult | null
  processVoiceCommand: (transcript: string) => Promise<void>
  clearError: () => void
}

export function useVoiceCommands(): UseVoiceCommandsReturn {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<VoiceCommandResult | null>(null)

  const invoice = useInvoiceStore()
  const {
    updateSender,
    updateClient,
    updateInvoiceDetails,
    updateTax,
    updateDiscount,
    addItem,
    updateItem,
    removeItem
  } = invoice

  const processVoiceCommand = async (transcript: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Prepare current invoice data for the API
      const currentInvoice = {
        senderName: invoice.senderName,
        senderEmail: invoice.senderEmail,
        senderAddress: invoice.senderAddress,
        senderCity: invoice.senderCity,
        senderState: invoice.senderState,
        senderZip: invoice.senderZip,
        senderPhone: invoice.senderPhone,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        clientCity: invoice.clientCity,
        clientState: invoice.clientState,
        clientZip: invoice.clientZip,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        items: invoice.items,
        taxRate: invoice.taxRate,
        discountRate: invoice.discountRate,
        notes: invoice.notes,
        terms: invoice.terms
      }

      // Call the API to parse the voice command
      const response = await fetch('/api/parse-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          transcript,
          currentInvoice
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process voice command')
      }

      const update: VoiceInvoiceUpdate = data.update

      // Apply the update based on the action type
      await applyInvoiceUpdate(update)

      setLastResult({
        success: true,
        message: update.explanation || 'Voice command processed successfully',
        update
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice command'
      setError(errorMessage)
      setLastResult({
        success: false,
        message: errorMessage
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const applyInvoiceUpdate = async (update: VoiceInvoiceUpdate) => {
    switch (update.action) {
      case 'update_field':
        await applyFieldUpdate(update.field, update.value)
        break

      case 'add_item':
        if (update.item) {
          addItem()
          // Update the newly added item (it will be the last one)
          const itemIndex = invoice.items.length - 1
          updateItem(itemIndex, 'description', update.item.description || '')
          updateItem(itemIndex, 'quantity', update.item.quantity || 1)
          updateItem(itemIndex, 'price', update.item.price || 0)
        }
        break

      case 'update_item':
        if (typeof update.itemIndex === 'number' && update.item) {
          if (update.item.description !== undefined) {
            updateItem(update.itemIndex, 'description', update.item.description)
          }
          if (update.item.quantity !== undefined) {
            updateItem(update.itemIndex, 'quantity', update.item.quantity)
          }
          if (update.item.price !== undefined) {
            updateItem(update.itemIndex, 'price', update.item.price)
          }
        }
        break

      case 'remove_item':
        if (typeof update.itemIndex === 'number') {
          removeItem(update.itemIndex)
        }
        break

      default:
        throw new Error(`Unknown action: ${update.action}`)
    }
  }

  const applyFieldUpdate = async (field: string | undefined, value: VoiceInvoiceUpdate['value']) => {
    if (isOneOf(SENDER_FIELDS, field)) {
      updateSender(field, toText(value))
      return
    }

    if (isOneOf(CLIENT_FIELDS, field)) {
      updateClient(field, toText(value))
      return
    }

    if (isOneOf(DETAIL_FIELDS, field)) {
      updateInvoiceDetails(field, toText(value))
      return
    }

    // Special handling for tax and discount rates
    if (field === 'taxRate') {
      updateTax(Number(value) || 0)
      return
    }

    if (field === 'discountRate') {
      updateDiscount(Number(value) || 0)
      return
    }

    throw new Error(`Unknown field: ${field}`)
  }

  const clearError = () => {
    setError(null)
    setLastResult(null)
  }

  return {
    isProcessing,
    error,
    lastResult,
    processVoiceCommand,
    clearError
  }
}