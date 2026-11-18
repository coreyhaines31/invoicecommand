/**
 * The owner preview of an unsigned estimate must not offer the signature pad:
 * only the recipient signs, through the share link.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@/app/invoice/[id]/estimate-signature', () => ({
  EstimateSignature: () => <div data-testid="signature-pad" />,
  EstimateSignedBanner: () => <div data-testid="signed-banner" />,
}))
jest.mock('@/components/payment/public-payment-button', () => ({ PublicPaymentButton: () => null }))
jest.mock('@/components/invoice/share-qr', () => ({ ShareQR: () => null }))

import { PublicInvoiceClient } from '@/app/invoice/[id]/public-invoice-client'

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
