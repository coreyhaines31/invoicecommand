/**
 * The owner preview of an unsigned estimate must not offer the signature pad:
 * only the recipient signs, through the share link.
 */
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

jest.mock('@/app/invoice/[id]/estimate-signature', () => ({
  EstimateSignature: () => <div data-testid="signature-pad" />,
  EstimateSignedBanner: () => <div data-testid="signed-banner" />,
}))
jest.mock('@/components/payment/public-payment-button', () => ({ PublicPaymentButton: () => null }))
jest.mock('@/components/invoice/share-qr', () => ({ ShareQR: () => null }))
jest.mock('@/lib/download-pdf', () => ({
  downloadOwnerInvoicePdf: jest.fn(async () => {}),
  downloadSharedInvoicePdf: jest.fn(async () => {}),
}))

import { PublicInvoiceClient } from '@/app/invoice/[id]/public-invoice-client'
import { downloadOwnerInvoicePdf, downloadSharedInvoicePdf } from '@/lib/download-pdf'

const estimate = {
  id: 'est-1',
  senderName: 'Owner',
  senderEmail: '',
  senderAddress: '',
  senderCity: '',
  senderState: '',
  senderZip: '',
  senderPhone: '',
  senderLogo: '',
  clientName: 'Client',
  clientEmail: 'client@example.test',
  clientAddress: '',
  clientCity: '',
  clientState: '',
  clientZip: '',
  invoiceNumber: 'EST-1',
  invoiceDate: '2026-11-01',
  dueDate: '',
  items: [],
  subtotal: 0,
  taxRate: 0,
  taxAmount: 0,
  discountRate: 0,
  discountAmount: 0,
  total: 0,
  notes: '',
  terms: '',
  currency: 'USD',
  paymentEnabled: false,
  stripePaymentStatus: 'unpaid',
  style: 'modern' as const,
  documentType: 'estimate' as const,
  collectSignature: true,
  signedAt: null,
  signatureData: null,
  signerName: null,
  signerEmail: null,
  documentVersion: '2026-11-01T10:00:00.123Z',
}

describe('PublicInvoiceClient estimate signing', () => {
  it('shows the signature pad on the share link', () => {
    render(<PublicInvoiceClient invoice={estimate} viewMode="public" shareToken="tok_aaaaaaaaaaaaaaaa" />)
    expect(screen.getByTestId('signature-pad')).toBeInTheDocument()
  })

  it('hides the signature pad in the owner view', () => {
    render(<PublicInvoiceClient invoice={estimate} viewMode="owner" />)
    expect(screen.queryByTestId('signature-pad')).not.toBeInTheDocument()
    expect(screen.getByText(/awaiting the client/i)).toBeInTheDocument()
  })
})

// Issue #88: an estimate is not a bill
describe('PublicInvoiceClient estimate labelling', () => {
  it('labels an estimate as an estimate and shows no payment panel, even with payments enabled', () => {
    render(
      <PublicInvoiceClient
        invoice={{ ...estimate, paymentEnabled: true, total: 100 }}
        viewMode="public"
        shareToken="tok_aaaaaaaaaaaaaaaa"
      />
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Estimate EST-1')
    expect(screen.queryByText(/^Invoice/)).not.toBeInTheDocument()
    expect(screen.queryByText('Unpaid')).not.toBeInTheDocument()
    expect(screen.queryByText('Payment')).not.toBeInTheDocument()
    expect(screen.getAllByText('Awaiting signature').length).toBeGreaterThan(0)
  })

  it('shows a signed estimate as signed', () => {
    render(
      <PublicInvoiceClient
        invoice={{ ...estimate, signedAt: '2026-11-02T10:00:00.000Z', signerName: 'Client' }}
        viewMode="owner"
      />
    )
    expect(screen.getAllByText('Signed').length).toBeGreaterThan(0)
  })

  it('still labels an invoice as an invoice with its payment panel', () => {
    render(
      <PublicInvoiceClient
        invoice={{ ...estimate, documentType: 'invoice', invoiceNumber: 'INV-1' }}
        viewMode="owner"
      />
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Invoice INV-1')
    expect(screen.getByText('Payment')).toBeInTheDocument()
  })
})

describe('PublicInvoiceClient Download PDF', () => {
  beforeEach(() => jest.clearAllMocks())

  it('downloads through the share token on the share link', async () => {
    render(<PublicInvoiceClient invoice={estimate} viewMode="public" shareToken="tok_aaaaaaaaaaaaaaaa" />)
    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))
    await waitFor(() => expect(downloadSharedInvoicePdf).toHaveBeenCalledWith('tok_aaaaaaaaaaaaaaaa'))
    expect(downloadOwnerInvoicePdf).not.toHaveBeenCalled()
  })

  it('downloads by invoice id in the owner view', async () => {
    render(<PublicInvoiceClient invoice={estimate} viewMode="owner" />)
    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))
    await waitFor(() => expect(downloadOwnerInvoicePdf).toHaveBeenCalledWith('est-1'))
  })

  it('shows the error when the download fails', async () => {
    ;(downloadSharedInvoicePdf as jest.Mock).mockRejectedValueOnce(new Error('Invoice not found'))
    render(<PublicInvoiceClient invoice={estimate} viewMode="public" shareToken="tok_aaaaaaaaaaaaaaaa" />)
    fireEvent.click(screen.getByRole('button', { name: /download pdf/i }))
    expect(await screen.findByText('Invoice not found')).toBeInTheDocument()
  })
})
