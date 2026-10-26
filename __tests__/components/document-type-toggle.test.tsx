/**
 * Tests for DocumentTypeToggle component
 * Tests UI behavior and document type switching
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DocumentTypeToggle } from '@/components/document-type-toggle'
import { useInvoiceStore } from '@/stores/invoice-store'

const mockUpdateDocumentType = jest.fn()

// Drive the real Zustand store, stubbing only the action under test.
function setStoreState(documentType: 'invoice' | 'estimate') {
  useInvoiceStore.setState({ documentType, updateDocumentType: mockUpdateDocumentType })
}

describe('DocumentTypeToggle', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render invoice and estimate options', () => {
    setStoreState('invoice')

    render(<DocumentTypeToggle />)

    expect(screen.getByText('Invoice')).toBeInTheDocument()
    expect(screen.getByText('Estimate')).toBeInTheDocument()
  })

  it('should highlight invoice when invoice is selected', () => {
    setStoreState('invoice')

    render(<DocumentTypeToggle />)

    const invoiceButton = screen.getByRole('button', { name: /invoice/i })
    expect(invoiceButton).toHaveClass('bg-background')
  })

  it('should highlight estimate when estimate is selected', () => {
    setStoreState('estimate')

    render(<DocumentTypeToggle />)

    const estimateButton = screen.getByRole('button', { name: /estimate/i })
    expect(estimateButton).toHaveClass('bg-background')
  })

  it('should call updateDocumentType when switching to estimate', async () => {
    setStoreState('invoice')

    render(<DocumentTypeToggle />)

    const estimateButton = screen.getByRole('button', { name: /estimate/i })
    fireEvent.click(estimateButton)

    await waitFor(() => {
      expect(mockUpdateDocumentType).toHaveBeenCalledWith('estimate')
    })
  })

  it('should call updateDocumentType when switching to invoice', async () => {
    setStoreState('estimate')

    render(<DocumentTypeToggle />)

    const invoiceButton = screen.getByRole('button', { name: /invoice/i })
    fireEvent.click(invoiceButton)

    await waitFor(() => {
      expect(mockUpdateDocumentType).toHaveBeenCalledWith('invoice')
    })
  })

  it('should show appropriate description for invoice mode', () => {
    setStoreState('invoice')

    render(<DocumentTypeToggle />)

    expect(screen.getByText(/create an invoice for payment collection/i)).toBeInTheDocument()
  })

  it('should show appropriate description for estimate mode', () => {
    setStoreState('estimate')

    render(<DocumentTypeToggle />)

    expect(screen.getByText(/create an estimate or quote for client approval/i)).toBeInTheDocument()
  })

  it('should not call updateDocumentType when clicking already selected type', async () => {
    setStoreState('invoice')

    render(<DocumentTypeToggle />)

    const invoiceButton = screen.getByRole('button', { name: /invoice/i })
    fireEvent.click(invoiceButton)

    await waitFor(() => {
      expect(mockUpdateDocumentType).not.toHaveBeenCalled()
    })
  })

  it('should render icons for both options', () => {
    setStoreState('invoice')

    render(<DocumentTypeToggle />)

    // Check that SVG icons are present (lucide-react renders SVGs)
    const svgs = screen.getAllByRole('button').map(btn => btn.querySelector('svg'))
    expect(svgs.filter(Boolean).length).toBeGreaterThan(0)
  })
})
