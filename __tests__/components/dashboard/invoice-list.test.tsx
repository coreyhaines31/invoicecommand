/**
 * Issue #88: the dashboard list must tell estimates from invoices, and show
 * whether an estimate has been signed or converted.
 */
import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }))
jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: () => ({ loadFromDatabase: jest.fn(), deleteFromDatabase: jest.fn() }),
}))
jest.mock('@/components/send-email-dialog', () => ({ SendEmailDialog: () => null }))
jest.mock('@/components/dashboard/share-invoice-dialog', () => ({ ShareInvoiceDialog: () => null }))
jest.mock('@/lib/download-pdf', () => ({ downloadOwnerInvoicePdf: jest.fn(async () => {}) }))
jest.mock('sonner', () => ({ toast: { loading: jest.fn(), dismiss: jest.fn(), error: jest.fn() } }))

import { InvoiceList, type InvoiceListItem } from '@/components/dashboard/invoice-list'
import { downloadOwnerInvoicePdf } from '@/lib/download-pdf'
import { toast } from 'sonner'

const invoices = [{
  id: 'inv-1',
  invoiceNumber: 'INV-1',
  clientName: 'Acme',
  total: '100',
  status: 'sent',
  dueDate: null,
  createdAt: '2026-11-01T00:00:00Z',
}]

function openMenuAndDownload() {
  render(<InvoiceList invoices={invoices} userId="user-a" />)
  const trigger = screen.getAllByRole('button').find((b) => b.getAttribute('aria-haspopup') === 'menu')!
  fireEvent.keyDown(trigger, { key: 'Enter' })
  fireEvent.click(screen.getByRole('menuitem', { name: /download pdf/i }))
}

describe('InvoiceList Download PDF', () => {
  beforeEach(() => jest.clearAllMocks())

  it('downloads the stored PDF for that invoice', async () => {
    openMenuAndDownload()

    await waitFor(() => expect(downloadOwnerInvoicePdf).toHaveBeenCalledWith('inv-1'))
    expect(toast.loading).toHaveBeenCalledWith('Generating PDF...', { id: 'pdf-inv-1' })
    await waitFor(() => expect(toast.dismiss).toHaveBeenCalledWith('pdf-inv-1'))
  })

  it('shows the error in a toast when the download fails', async () => {
    ;(downloadOwnerInvoicePdf as jest.Mock).mockRejectedValueOnce(new Error('Invoice not found'))

    openMenuAndDownload()

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Invoice not found', { id: 'pdf-inv-1' }))
  })
})

const base = { clientName: 'Client', total: '100', status: 'draft', createdAt: '2026-11-01T10:00:00.000Z' }

const rows: InvoiceListItem[] = [
  { ...base, id: 'inv-1', invoiceNumber: 'INV-0001', documentType: 'invoice' },
  { ...base, id: 'est-1', invoiceNumber: 'EST-0001', documentType: 'estimate', signedAt: null },
  { ...base, id: 'est-2', invoiceNumber: 'EST-0002', documentType: 'estimate', signedAt: '2026-11-02T10:00:00.000Z' },
  { ...base, id: 'est-3', invoiceNumber: 'EST-0003', documentType: 'estimate', signedAt: '2026-11-02T10:00:00.000Z', convertedToInvoiceId: 'inv-9' },
]

function rowFor(number: string) {
  return screen.getByText(number).closest('tr') as HTMLElement
}

describe('InvoiceList type indicator', () => {
  it('marks each row as an invoice or an estimate, and signed estimates as signed', () => {
    render(<InvoiceList invoices={rows} userId="user-1" />)

    expect(within(rowFor('INV-0001')).getByText('Invoice')).toBeInTheDocument()
    expect(within(rowFor('INV-0001')).queryByText('Signed')).not.toBeInTheDocument()

    expect(within(rowFor('EST-0001')).getByText('Estimate')).toBeInTheDocument()
    expect(within(rowFor('EST-0001')).getByText('Not signed')).toBeInTheDocument()

    expect(within(rowFor('EST-0002')).getByText('Estimate')).toBeInTheDocument()
    expect(within(rowFor('EST-0002')).getByText('Signed')).toBeInTheDocument()
  })

  it('marks an estimate that was converted to an invoice', () => {
    render(<InvoiceList invoices={rows} userId="user-1" />)

    expect(within(rowFor('EST-0003')).getByText('Converted')).toBeInTheDocument()
    expect(within(rowFor('EST-0002')).queryByText('Converted')).not.toBeInTheDocument()
  })
})
