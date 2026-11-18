import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }))
jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: () => ({ loadFromDatabase: jest.fn(), deleteFromDatabase: jest.fn() }),
}))
jest.mock('@/components/send-email-dialog', () => ({ SendEmailDialog: () => null }))
jest.mock('@/components/dashboard/share-invoice-dialog', () => ({ ShareInvoiceDialog: () => null }))
jest.mock('@/lib/download-pdf', () => ({ downloadOwnerInvoicePdf: jest.fn(async () => {}) }))
jest.mock('sonner', () => ({ toast: { loading: jest.fn(), dismiss: jest.fn(), error: jest.fn() } }))

import { InvoiceList } from '@/components/dashboard/invoice-list'
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
