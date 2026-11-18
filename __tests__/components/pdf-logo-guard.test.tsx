/**
 * Issue #91: logos are inline images only. The server renders PDFs, so a stored
 * logo that is a remote URL (older rows) must never reach the renderer.
 */
import React from 'react'
import { render } from '@testing-library/react'
import { isInlineLogo } from '@/lib/logo'

const imageSources: unknown[] = []

jest.mock('@react-pdf/renderer', () => {
  const passthrough = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>
  return {
    Document: passthrough,
    Page: passthrough,
    View: passthrough,
    Text: passthrough,
    Image: ({ source, src }: { source?: unknown; src?: unknown }) => {
      imageSources.push(source ?? src)
      return null
    },
    StyleSheet: { create: <T,>(styles: T) => styles },
  }
})

import { InvoicePDF } from '@/components/pdf/invoice-pdf'
import type { InvoiceData } from '@/stores/invoice-store'

const invoice = {
  documentType: 'invoice',
  senderName: 'Owner',
  senderEmail: '',
  senderAddress: '',
  senderCity: '',
  senderState: '',
  senderZip: '',
  senderPhone: '',
  clientName: 'Client',
  clientEmail: '',
  clientAddress: '',
  clientCity: '',
  clientState: '',
  clientZip: '',
  invoiceNumber: 'INV-1',
  invoiceDate: '2026-11-01',
  dueDate: '2026-12-01',
  items: [{ description: 'Work', quantity: 1, price: 100 }],
  subtotal: 100,
  taxRate: 0,
  taxAmount: 0,
  discountRate: 0,
  discountAmount: 0,
  total: 100,
  notes: '',
  terms: '',
  currency: 'USD',
  isDirty: false,
  lastUpdated: 0,
  style: 'modern',
} satisfies InvoiceData

describe('logo guard', () => {
  it('treats only inline PNG, JPEG, WebP and GIF data URLs as logos', () => {
    expect(isInlineLogo('data:image/png;base64,iVBORw0KGgo=')).toBe(true)
    expect(isInlineLogo('data:image/webp;base64,UklGRg==')).toBe(true)
    expect(isInlineLogo('https://example.com/logo.png')).toBe(false)
    expect(isInlineLogo('data:image/svg+xml;base64,PHN2Zz4=')).toBe(false)
    expect(isInlineLogo(undefined)).toBe(false)
  })

  it('never hands a remote logo URL to the PDF renderer', () => {
    imageSources.length = 0
    const { container } = render(
      <InvoicePDF invoice={{ ...invoice, senderLogo: 'https://example.com/logo.png' }} />
    )

    expect(container.innerHTML).not.toContain('example.com')
    expect(imageSources).not.toContain('https://example.com/logo.png')
  })
})
