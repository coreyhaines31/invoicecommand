/**
 * Issue #88: the dashboard list must tell estimates from invoices, and show
 * whether an estimate has been signed.
 */
import React from 'react'
import { render, screen, within } from '@testing-library/react'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }) }))
jest.mock('@/components/send-email-dialog', () => ({ SendEmailDialog: () => null }))
jest.mock('@/components/dashboard/share-invoice-dialog', () => ({ ShareInvoiceDialog: () => null }))

import { InvoiceList, type InvoiceListItem } from '@/components/dashboard/invoice-list'

const base = { clientName: 'Client', total: '100', status: 'draft', createdAt: '2026-11-01T10:00:00.000Z' }

const rows: InvoiceListItem[] = [
  { ...base, id: 'inv-1', invoiceNumber: 'INV-0001', documentType: 'invoice' },
  { ...base, id: 'est-1', invoiceNumber: 'EST-0001', documentType: 'estimate', signedAt: null },
  { ...base, id: 'est-2', invoiceNumber: 'EST-0002', documentType: 'estimate', signedAt: '2026-11-02T10:00:00.000Z' },
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
})
