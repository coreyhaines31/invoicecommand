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
  total: string
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
    const result = await this.request<{ data: Invoice }>('GET', `/invoices/${id}`)
    return result.data
  }

  async createInvoice(invoice: InvoiceCreate): Promise<Invoice> {
    const result = await this.request<{ data: Invoice }>('POST', '/invoices', invoice)
    return result.data
  }

  async updateInvoice(id: string, updates: Partial<InvoiceCreate>): Promise<Invoice> {
    const result = await this.request<{ data: Invoice }>('PUT', `/invoices/${id}`, updates)
    return result.data
  }

  async deleteInvoice(id: string): Promise<void> {
    await this.request<{ success: boolean }>('DELETE', `/invoices/${id}`)
  }

  async sendInvoice(id: string, pdfBuffer: string, senderMessage?: string): Promise<{ emailId: string }> {
    const result = await this.request<{ success: boolean; emailId: string }>('POST', `/invoices/${id}/send`, {
      pdfBuffer,
      senderMessage,
    })
    return { emailId: result.emailId }
  }

  async downloadPdf(id: string): Promise<ArrayBuffer> {
    return this.request('GET', `/invoices/${id}/pdf`)
  }
}
