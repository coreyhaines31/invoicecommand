export interface User {
  id: string
  email: string
  stripe_account_id?: string
  plan: 'free' | 'premium'
  created_at: string
  last_login: string
}

export interface Invoice {
  id: string
  user_id?: string
  client_name: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  due_date?: string
  notes?: string
  stripe_payment_link?: string
  recurring: boolean
  status: 'draft' | 'sent' | 'paid'
  created_at: string
  updated_at: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  price: number
  total?: number
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: Omit<User, 'id' | 'created_at' | 'last_login'>
        Update: Partial<Omit<User, 'id'>>
      }
      invoices: {
        Row: Invoice
        Insert: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Invoice, 'id' | 'created_at'>>
      }
    }
  }
}