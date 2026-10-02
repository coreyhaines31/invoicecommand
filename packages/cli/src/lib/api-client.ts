import { getApiKey, getBaseUrl } from './config.js'

export type Invoice = {
  id: string
  documentType: 'invoice' | 'estimate'
  invoiceNumber: string
  invoiceDate: string | null
  dueDate: string | null
  status: 'draft' | 'sent' | 'paid'
  clientName: string
  clientEmail: string | null
  senderName: string | null
  total: string
  currency: string
  createdAt: string
  updatedAt: string
}

export type InvoiceCreate = {
  documentType?: 'invoice' | 'estimate'
  invoiceNumber: string
  invoiceDate?: string
  dueDate?: string
  clientName: string
  clientEmail?: string
  clientAddress?: string
  clientCity?: string
  clientState?: string
  clientZip?: string
  senderName?: string
  senderEmail?: string
  senderAddress?: string
  senderCity?: string
  senderState?: string
  senderZip?: string
  senderPhone?: string
  items: Array<{ description: string; quantity: number; price: number }>
  subtotal?: number
  tax?: number
  total?: number
  taxRate?: number
  discountRate?: number
  discountAmount?: number
  notes?: string
  terms?: string
  currency?: string
  style?: 'modern' | 'classic' | 'minimal'
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new ApiError('No API key configured. Run "invoicecommand init" to set up.', 401)
  }

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/api/v1${path}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  const options: RequestInit = {
    method,
    headers,
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(url, options)

  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`
    try {
      const errorBody = await response.json()
      errorMessage = errorBody.error || errorMessage
    } catch {
      // Ignore JSON parse errors
    }
    throw new ApiError(errorMessage, response.status)
  }

  // Handle binary responses (PDF)
  const contentType = response.headers.get('content-type')
  if (contentType?.includes('application/pdf')) {
    return response.arrayBuffer() as unknown as T
  }

  return response.json()
}

export async function listInvoices(options?: {
  documentType?: 'invoice' | 'estimate'
  status?: 'draft' | 'sent' | 'paid'
  limit?: number
  offset?: number
}): Promise<{ data: Invoice[]; pagination: { limit: number; offset: number; hasMore: boolean } }> {
  const params = new URLSearchParams()
  if (options?.documentType) params.set('documentType', options.documentType)
  if (options?.status) params.set('status', options.status)
  if (options?.limit) params.set('limit', options.limit.toString())
  if (options?.offset) params.set('offset', options.offset.toString())

  const query = params.toString()
  return request('GET', `/invoices${query ? `?${query}` : ''}`)
}

export async function getInvoice(id: string): Promise<{ data: Invoice }> {
  return request('GET', `/invoices/${id}`)
}

export async function createInvoice(invoice: InvoiceCreate): Promise<{ data: Invoice }> {
  return request('POST', '/invoices', invoice)
}

export async function updateInvoice(
  id: string,
  updates: Partial<InvoiceCreate>
): Promise<{ data: Invoice }> {
  return request('PUT', `/invoices/${id}`, updates)
}

export async function deleteInvoice(id: string): Promise<{ success: boolean }> {
  return request('DELETE', `/invoices/${id}`)
}

export async function sendInvoice(
  id: string,
  pdfBuffer: string,
  senderMessage?: string
): Promise<{ success: boolean; emailId: string; message: string }> {
  return request('POST', `/invoices/${id}/send`, { pdfBuffer, senderMessage })
}

export async function downloadPdf(id: string): Promise<ArrayBuffer> {
  return request('GET', `/invoices/${id}/pdf`)
}
