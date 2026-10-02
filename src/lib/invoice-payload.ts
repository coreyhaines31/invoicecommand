import type { invoices } from '@/lib/db/schema'

const ALLOWED_FIELDS = new Set([
  'documentType',
  'invoiceNumber',
  'invoiceDate',
  'dueDate',
  'expirationDate',
  'status',
  'clientName',
  'clientEmail',
  'clientAddress',
  'clientCity',
  'clientState',
  'clientZip',
  'senderName',
  'senderEmail',
  'senderAddress',
  'senderCity',
  'senderState',
  'senderZip',
  'senderPhone',
  'senderLogo',
  'items',
  'subtotal',
  'tax',
  'total',
  'taxRate',
  'discountRate',
  'discountAmount',
  'notes',
  'terms',
  'currency',
  'style',
  'paymentEnabled',
  'convertedToInvoiceId',
  'recurring',
  'collectSignature',
  'signatureRequired',
])

const DOCUMENT_TYPES = new Set(['invoice', 'estimate'])
const STATUSES = new Set(['draft', 'sent', 'paid'])
const STYLES = new Set(['modern', 'classic', 'minimal'])

type InvoiceInsert = typeof invoices.$inferInsert

type ParseMode = 'create' | 'update'

export class InvoiceValidationError extends Error {}

export function parseInvoicePayload(input: unknown, mode: ParseMode): Partial<InvoiceInsert> {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new InvoiceValidationError('Request body must be an object')
  }

  const source = input as Record<string, unknown>

  for (const key of Object.keys(source)) {
    if (!ALLOWED_FIELDS.has(key)) {
      throw new InvoiceValidationError(`Field "${key}" is not allowed`)
    }
  }

  const payload: Partial<InvoiceInsert> = {}

  copyEnum(source, payload, 'documentType', DOCUMENT_TYPES)
  copyRequiredString(source, payload, 'invoiceNumber', mode === 'create', 64)
  copyDateString(source, payload, 'invoiceDate')
  copyDateString(source, payload, 'dueDate')
  copyDateString(source, payload, 'expirationDate')
  copyEnum(source, payload, 'status', STATUSES)

  copyRequiredString(source, payload, 'clientName', mode === 'create', 255)
  copyOptionalString(source, payload, 'clientEmail', 255)
  copyOptionalString(source, payload, 'clientAddress', 500)
  copyOptionalString(source, payload, 'clientCity', 255)
  copyOptionalString(source, payload, 'clientState', 255)
  copyOptionalString(source, payload, 'clientZip', 64)

  copyOptionalString(source, payload, 'senderName', 255)
  copyOptionalString(source, payload, 'senderEmail', 255)
  copyOptionalString(source, payload, 'senderAddress', 500)
  copyOptionalString(source, payload, 'senderCity', 255)
  copyOptionalString(source, payload, 'senderState', 255)
  copyOptionalString(source, payload, 'senderZip', 64)
  copyOptionalString(source, payload, 'senderPhone', 64)
  copyOptionalString(source, payload, 'senderLogo', 4000)

  if (has(source, 'items')) {
    const items = source.items
    if (!Array.isArray(items)) {
      throw new InvoiceValidationError('items must be an array')
    }

    payload.items = items.map((item, index) => sanitizeItem(item, index))
  } else if (mode === 'create') {
    throw new InvoiceValidationError('items is required')
  }

  copyDecimal(source, payload, 'subtotal', { min: 0, max: 1_000_000_000 })
  copyDecimal(source, payload, 'tax', { min: 0, max: 1_000_000_000 })
  copyDecimal(source, payload, 'total', { min: 0, max: 1_000_000_000 })
  copyDecimal(source, payload, 'taxRate', { min: 0, max: 100 })
  copyDecimal(source, payload, 'discountRate', { min: 0, max: 100 })
  copyDecimal(source, payload, 'discountAmount', { min: 0, max: 1_000_000_000 })

  copyOptionalString(source, payload, 'notes', 10_000)
  copyOptionalString(source, payload, 'terms', 10_000)
  copyCurrency(source, payload)
  copyEnum(source, payload, 'style', STYLES)
  copyBoolean(source, payload, 'paymentEnabled')
  copyNullableString(source, payload, 'convertedToInvoiceId', 128)
  copyBoolean(source, payload, 'recurring')
  copyBoolean(source, payload, 'collectSignature')
  copyBoolean(source, payload, 'signatureRequired')

  if (mode === 'update' && Object.keys(payload).length === 0) {
    throw new InvoiceValidationError('No valid fields to update')
  }

  return payload
}

function has(source: Record<string, unknown>, key: string) {
  return Object.prototype.hasOwnProperty.call(source, key)
}

function setField(target: Partial<InvoiceInsert>, key: string, value: unknown) {
  ;(target as Record<string, unknown>)[key] = value
}

function copyRequiredString(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string,
  required: boolean,
  maxLength: number
) {
  if (!has(source, key)) {
    if (required) {
      throw new InvoiceValidationError(`${key} is required`)
    }
    return
  }

  const value = source[key]
  if (typeof value !== 'string') {
    throw new InvoiceValidationError(`${key} must be a string`)
  }

  const trimmed = value.trim()
  if (!trimmed) {
    throw new InvoiceValidationError(`${key} cannot be empty`)
  }

  if (trimmed.length > maxLength) {
    throw new InvoiceValidationError(`${key} is too long`)
  }

  setField(target, key, trimmed)
}

function copyOptionalString(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string,
  maxLength: number
) {
  if (!has(source, key)) return

  const value = source[key]
  if (value == null || value === '') {
    setField(target, key, null)
    return
  }

  if (typeof value !== 'string') {
    throw new InvoiceValidationError(`${key} must be a string`)
  }

  const trimmed = value.trim()
  if (trimmed.length > maxLength) {
    throw new InvoiceValidationError(`${key} is too long`)
  }

  setField(target, key, trimmed)
}

function copyNullableString(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string,
  maxLength: number
) {
  if (!has(source, key)) return

  const value = source[key]
  if (value == null || value === '') {
    setField(target, key, null)
    return
  }

  if (typeof value !== 'string') {
    throw new InvoiceValidationError(`${key} must be a string or null`)
  }

  const trimmed = value.trim()
  if (trimmed.length > maxLength) {
    throw new InvoiceValidationError(`${key} is too long`)
  }

  setField(target, key, trimmed)
}

function copyDateString(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string
) {
  if (!has(source, key)) return

  const value = source[key]
  if (value == null || value === '') {
    setField(target, key, null)
    return
  }

  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new InvoiceValidationError(`${key} must be in YYYY-MM-DD format`)
  }

  setField(target, key, value)
}

function copyEnum(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string,
  allowed: Set<string>
) {
  if (!has(source, key)) return

  const value = source[key]
  if (typeof value !== 'string' || !allowed.has(value)) {
    throw new InvoiceValidationError(`${key} is invalid`)
  }

  setField(target, key, value)
}

function copyDecimal(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string,
  options: { min: number; max: number }
) {
  if (!has(source, key)) return

  const value = source[key]
  const normalized = normalizeNumber(value)
  if (normalized == null) {
    throw new InvoiceValidationError(`${key} must be a number`)
  }

  if (normalized < options.min || normalized > options.max) {
    throw new InvoiceValidationError(`${key} is out of range`)
  }

  setField(target, key, normalized.toString())
}

function copyBoolean(
  source: Record<string, unknown>,
  target: Partial<InvoiceInsert>,
  key: string
) {
  if (!has(source, key)) return

  const value = source[key]
  if (typeof value !== 'boolean') {
    throw new InvoiceValidationError(`${key} must be a boolean`)
  }

  setField(target, key, value)
}

function copyCurrency(source: Record<string, unknown>, target: Partial<InvoiceInsert>) {
  if (!has(source, 'currency')) return

  const value = source.currency
  if (typeof value !== 'string') {
    throw new InvoiceValidationError('currency must be a string')
  }

  const normalized = value.trim().toUpperCase()
  if (!/^[A-Z]{3}$/.test(normalized)) {
    throw new InvoiceValidationError('currency must be a 3-letter ISO code')
  }

  setField(target, 'currency', normalized)
}

function sanitizeItem(item: unknown, index: number) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) {
    throw new InvoiceValidationError(`items[${index}] must be an object`)
  }

  const source = item as Record<string, unknown>
  const descriptionValue = source.description
  const quantityValue = normalizeNumber(source.quantity)
  const priceValue = normalizeNumber(source.price)

  if (typeof descriptionValue !== 'string' || !descriptionValue.trim()) {
    throw new InvoiceValidationError(`items[${index}].description is required`)
  }

  if (descriptionValue.trim().length > 500) {
    throw new InvoiceValidationError(`items[${index}].description is too long`)
  }

  if (quantityValue == null || quantityValue < 0 || quantityValue > 1_000_000) {
    throw new InvoiceValidationError(`items[${index}].quantity is invalid`)
  }

  if (priceValue == null || priceValue < 0 || priceValue > 1_000_000_000) {
    throw new InvoiceValidationError(`items[${index}].price is invalid`)
  }

  return {
    description: descriptionValue.trim(),
    quantity: Number(quantityValue.toFixed(4)),
    price: Number(priceValue.toFixed(4)),
  }
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return null
}
