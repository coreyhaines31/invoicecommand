/**
 * Tests for the dashboard InvoiceList: status cues, amounts, empty state,
 * and the confirm-before-delete flow.
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InvoiceList, type InvoiceListItem } from '@/components/dashboard/invoice-list'

const mockDeleteFromDatabase = jest.fn()
const mockLoadFromDatabase = jest.fn()
const mockRefresh = jest.fn()
const mockPush = jest.fn()

jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: Object.assign(
    () => ({
      loadFromDatabase: mockLoadFromDatabase,
      deleteFromDatabase: mockDeleteFromDatabase,
    }),
    { setState: jest.fn() }
  ),
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: mockRefresh }),
}))

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>
  }
})

jest.mock('@/components/send-email-dialog', () => ({
  SendEmailDialog: () => null,
}))

jest.mock('@/components/dashboard/share-invoice-dialog', () => ({
  ShareInvoiceDialog: () => null,
}))

const mockToastSuccess = jest.fn()
const mockToastError = jest.fn()
jest.mock('sonner', () => ({
  toast: {
    success: (...args: unknown[]) => mockToastSuccess(...args),
    error: (...args: unknown[]) => mockToastError(...args),
  },
}))

const invoices: InvoiceListItem[] = [
  {
    id: 'a',
    invoiceNumber: 'INV-1001',
    clientName: 'Aleksandra Wiśniewska-Kowalczyk',
    total: '1234.5',
    currency: 'EUR',
    status: 'paid',
    dueDate: '2020-01-01',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 'b',
    invoiceNumber: 'INV-1002',
    clientName: 'Jo',
    total: 50,
    status: 'sent',
    dueDate: '2999-12-31',
    createdAt: '2020-01-01T00:00:00.000Z',
  },
  {
    id: 'c',
    invoiceNumber: 'INV-1003',
    clientName: '',
    total: 0,
    status: 'draft',
    dueDate: '2020-01-01',
    createdAt: null,
  },
]

describe('InvoiceList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows an empty state with a clear next action', () => {
    render(<InvoiceList invoices={[]} userId="u1" />)

    expect(screen.getByText('No invoices yet')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /create your first invoice/i })).toHaveAttribute('href', '/')
  })

  it('spells out each status in text, including overdue', () => {
    render(<InvoiceList invoices={invoices} userId="u1" />)

    expect(screen.getByText('Paid')).toBeInTheDocument()
    expect(screen.getByText('Sent')).toBeInTheDocument()
    // A past-due unpaid invoice reads Overdue rather than Draft
    expect(screen.getByText('Overdue')).toBeInTheDocument()
  })

  it('formats amounts in the invoice currency and right-aligns them', () => {
    render(<InvoiceList invoices={invoices} userId="u1" />)

    const amount = screen.getByText('€1,234.50')
    expect(amount.closest('td')).toHaveClass('text-right')
  })

  it('labels the row actions trigger and the search field', () => {
    render(<InvoiceList invoices={invoices} userId="u1" />)

    expect(screen.getByRole('searchbox', { name: 'Search invoices' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Actions for INV-1001' })).toBeInTheDocument()
  })

  it('offers to clear a search that matches nothing', () => {
    render(<InvoiceList invoices={invoices} userId="u1" />)

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search invoices' }), {
      target: { value: 'zzz' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))

    expect(screen.getByRole('searchbox', { name: 'Search invoices' })).toHaveValue('')
  })

  it('opens the invoice in the builder from its number', async () => {
    mockLoadFromDatabase.mockResolvedValue(true)
    render(<InvoiceList invoices={invoices} userId="u1" />)

    fireEvent.click(screen.getByRole('button', { name: 'INV-1002' }))

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/'))
    expect(mockLoadFromDatabase).toHaveBeenCalledWith('b', 'u1')
  })

  it('confirms before deleting and reports the result', async () => {
    mockDeleteFromDatabase.mockResolvedValue(true)
    render(<InvoiceList invoices={invoices} userId="u1" />)

    const trigger = screen.getByRole('button', { name: 'Actions for INV-1001' })
    trigger.focus()
    fireEvent.keyDown(trigger, { key: 'Enter' })
    const deleteItem = await screen.findByRole('menuitem', { name: /delete/i })
    fireEvent.click(deleteItem)

    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('Delete INV-1001?')
    expect(mockDeleteFromDatabase).not.toHaveBeenCalled()

    fireEvent.click(screen.getByRole('button', { name: 'Delete invoice' }))

    await waitFor(() => expect(mockDeleteFromDatabase).toHaveBeenCalledWith('a', 'u1'))
    await waitFor(() => expect(mockToastSuccess).toHaveBeenCalledWith('Deleted INV-1001'))
    expect(mockRefresh).toHaveBeenCalled()
  })
})
