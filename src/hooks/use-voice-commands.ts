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

// unclear: the model could not turn the words into a change
// limit: the monthly allowance is used up (429)
// invalid: the server rejected the request and said why (400)
// signed-out: the session is gone (401)
// failed: network or server failure, worth retrying
// unavailable: the model provider is down or out of credit (503); the command was not counted
export type VoiceErrorKind = 'unclear' | 'limit' | 'invalid' | 'signed-out' | 'unavailable' | 'failed'

export interface VoiceCommandResult {
  success: boolean
  message: string
  update?: VoiceInvoiceUpdate
  errorKind?: VoiceErrorKind
  // Sent by /api/parse-voice with a 429 only if it chooses to
  limit?: number
  resetsAt?: string
}

// /api/parse-voice answers a command the model could not act on with a 422.
// A reply with no action at all still comes back as a 500 with this message.
const MODEL_DECLINED_MESSAGE = 'AI response missing required action field'

class VoiceCommandError extends Error {
  constructor(message: string, readonly kind: VoiceErrorKind, readonly extra: Pick<VoiceCommandResult, 'limit' | 'resetsAt'> = {}) {
    super(message)
  }
}

function errorKindForResponse(status: number, message: unknown): VoiceErrorKind {
  if (status === 429) return 'limit'
  if (status === 401) return 'signed-out'
  if (status === 400) return 'invalid'
  if (status === 422) return 'unclear'
  if (status === 503) return 'unavailable'
  if (message === MODEL_DECLINED_MESSAGE) return 'unclear'
  return 'failed'
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
  processVoiceCommand: (transcript: string) => Promise<VoiceCommandResult>
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

  const processVoiceCommand = async (transcript: string): Promise<VoiceCommandResult> => {
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

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new VoiceCommandError(
          data.error || 'Failed to process voice command',
          errorKindForResponse(response.status, data.error),
          {
            limit: typeof data.limit === 'number' ? data.limit : undefined,
            resetsAt: typeof data.resetsAt === 'string' ? data.resetsAt : undefined,
          }
        )
      }

      const update: VoiceInvoiceUpdate | undefined = data.update
      if (!update?.action) {
        throw new VoiceCommandError('Voice command was not understood', 'unclear')
      }

      // Apply the update based on the action type
      await applyInvoiceUpdate(update)

      const result: VoiceCommandResult = {
        success: true,
        message: update.explanation || 'Voice command processed successfully',
        update
      }
      setLastResult(result)
      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process voice command'
      const result: VoiceCommandResult = err instanceof VoiceCommandError
        ? { success: false, message: errorMessage, errorKind: err.kind, ...err.extra }
        : { success: false, message: errorMessage, errorKind: 'failed' }
      setError(errorMessage)
      setLastResult(result)
      return result
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
          // `invoice` is this render's snapshot and does not include the new
          // row yet, so read the live store to find it
          const itemIndex = useInvoiceStore.getState().items.length - 1
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
        throw new VoiceCommandError(`Unknown action: ${update.action}`, 'unclear')
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

    throw new VoiceCommandError(`Unknown field: ${field}`, 'unclear')
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