/**
 * The share page must let a client retry after a declined card, and must not
 * offer to charge an invoice the owner has already marked paid.
 */
import { fireEvent, render, screen } from '@testing-library/react'
import { createFakeDb } from '../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => ({
  ...jest.requireActual('../helpers/fake-db').drizzleOrmMock,
  sql: () => null,
}))
jest.mock('@/lib/db/schema', () => jest.requireActual('../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('next/server', () => ({ after: jest.fn() }))
jest.mock('next/navigation', () => ({ notFound: jest.fn(() => { throw new Error('notFound') }) }))
jest.mock('@/components/payment/public-payment-button', () => ({
  PublicPaymentButton: ({ onInProgress, onAlreadyPaid }: { onInProgress: () => void; onAlreadyPaid: () => void }) => (
    <>
      <button>Pay now</button>
      <button onClick={onInProgress}>Server says in progress</button>
      <button onClick={onAlreadyPaid}>Server says paid</button>
    </>
  ),
}))
jest.mock('@/components/invoice/share-qr', () => ({ ShareQR: () => null }))
jest.mock('@/app/invoice/[id]/estimate-signature', () => ({
  EstimateSignature: () => null,
  EstimateSignedBanner: () => null,
}))

import SharedInvoicePage from '@/app/i/[token]/page'

const TOKEN = 'share_token_abcdefghijklmnop'

async function renderSharePage(overrides: Record<string, unknown>) {
  fake.rows.length = 0
  fake.rows.push({
    id: 'inv-1',
    userId: 'user-a',
    invoiceNumber: 'INV-1',
    senderName: 'Owner',
    clientName: 'Client',
    items: [],
    total: '100',
    currency: 'USD',
    shareToken: TOKEN,
    shareEnabled: true,
    paymentEnabled: true,
    status: 'sent',
    stripePaymentStatus: 'unpaid',
    ...overrides,
  })
  render(await SharedInvoicePage({ params: Promise.resolve({ token: TOKEN }) }))
}

describe('share page payment panel', () => {
  it('offers to pay an unpaid invoice', async () => {
    await renderSharePage({})
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeInTheDocument()
  })

  it('lets the client retry after a failed payment', async () => {
    await renderSharePage({ stripePaymentStatus: 'failed' })
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeInTheDocument()
  })

  it('shows an invoice the owner marked paid as paid, with no Pay button', async () => {
    await renderSharePage({ status: 'paid', stripePaymentStatus: 'unpaid' })
    expect(screen.queryByRole('button', { name: 'Pay now' })).not.toBeInTheDocument()
    expect(screen.getByText('This invoice has been paid. Thank you!')).toBeInTheDocument()
  })

  it('offers to pay again after the client abandoned the payment form', async () => {
    await renderSharePage({ stripePaymentStatus: 'processing' })
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeInTheDocument()
    expect(screen.queryByText(/payment for this invoice is in progress/i)).not.toBeInTheDocument()
    expect(screen.queryByText('Processing')).not.toBeInTheDocument()
  })

  it('shows a payment in progress, with no Pay button, once the server says so', async () => {
    await renderSharePage({ stripePaymentStatus: 'processing' })
    fireEvent.click(screen.getByRole('button', { name: 'Server says in progress' }))
    expect(screen.queryByRole('button', { name: 'Pay now' })).not.toBeInTheDocument()
    expect(screen.getByText('A payment for this invoice is being processed. This page will show it as paid once it completes, usually within a minute. If it does not, contact the sender.')).toBeInTheDocument()
  })

  it('shows the invoice as paid when the server says it already is', async () => {
    await renderSharePage({ stripePaymentStatus: 'processing' })
    fireEvent.click(screen.getByRole('button', { name: 'Server says paid' }))
    expect(screen.queryByRole('button', { name: 'Pay now' })).not.toBeInTheDocument()
    expect(screen.getByText('This invoice has been paid. Thank you!')).toBeInTheDocument()
  })

  it('offers scan-to-pay for an unpaid invoice', async () => {
    await renderSharePage({})
    expect(await screen.findByText('Pay on your phone')).toBeInTheDocument()
  })

  it('hides scan-to-pay while a payment form is open or a payment is processing', async () => {
    await renderSharePage({ stripePaymentStatus: 'processing' })
    expect(screen.getByRole('button', { name: 'Pay now' })).toBeInTheDocument()
    expect(screen.queryByText('Pay on your phone')).not.toBeInTheDocument()
  })
})
