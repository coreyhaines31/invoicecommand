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
  senderEmail: string | null
  subtotal: string
  tax: string
  total: string
  taxRate: string | null
  discountRate: string | null
  discountAmount: string | null
  currency: string
  items: Array<{ description: string; quantity: number; price: number }>
  notes: string | null
  terms: string | null
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
  // Percentages. The API derives subtotal, tax, and total from these and the items.
  taxRate?: number
  discountRate?: number
  notes?: string
  terms?: string
  currency?: string
  style?: 'modern' | 'classic' | 'minimal'
}

// The v1 PATCH endpoint also accepts status, which isn't set on create.
export type InvoiceUpdate = Partial<InvoiceCreate> & { status?: Invoice['status'] }

export const INVOICE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// Tool input lands in the URL path, so an id like "../webhooks/x" would reach
// another API route with the user's key. Only UUIDs get through, encoded.
export function invoicePath(id: string, suffix = ''): string {
  if (!INVOICE_ID_PATTERN.test(id)) {
    throw new Error('Invalid invoice ID: expected a UUID')
  }
  return `/invoices/${encodeURIComponent(id)}${suffix}`
}

export class ApiClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string = 'https://invoicecommand.com') {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}/api/v1${path}`

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`
      try {
        const errorBody = await response.json()
        errorMessage = errorBody.error || errorMessage
      } catch {
        // Ignore JSON parse errors
      }
      throw new Error(errorMessage)
    }

    // Handle binary responses (PDF)
    const contentType = response.headers.get('content-type')
    if (contentType?.includes('application/pdf')) {
      return response.arrayBuffer() as unknown as T
    }

    return response.json()
  }

  async listInvoices(options?: {
    documentType?: 'invoice' | 'estimate'
    status?: 'draft' | 'sent' | 'paid'
    limit?: number
  }): Promise<Invoice[]> {
    const params = new URLSearchParams()
    if (options?.documentType) params.set('documentType', options.documentType)
    if (options?.status) params.set('status', options.status)
    if (options?.limit) params.set('limit', options.limit.toString())

    const query = params.toString()
    const result = await this.request<{ data: Invoice[] }>('GET', `/invoices${query ? `?${query}` : ''}`)
    return result.data
  }

  async getInvoice(id: string): Promise<Invoice> {
    const result = await this.request<{ data: Invoice }>('GET', invoicePath(id))
    return result.data
  }

  async createInvoice(invoice: InvoiceCreate): Promise<Invoice> {
    const result = await this.request<{ data: Invoice }>('POST', '/invoices', invoice)
    return result.data
  }

  async updateInvoice(id: string, updates: InvoiceUpdate): Promise<Invoice> {
    const result = await this.request<{ data: Invoice }>('PUT', invoicePath(id), updates)
    return result.data
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.request<{ success: boolean }>('DELETE', invoicePath(id))
  }

  // The server renders the PDF attachment from the stored invoice.
  async sendInvoice(id: string, senderMessage?: string): Promise<{ emailId: string }> {
    const result = await this.request<{ success: boolean; emailId: string }>('POST', invoicePath(id, '/send'), {
      senderMessage,
    })
    return { emailId: result.emailId }
  }
}
