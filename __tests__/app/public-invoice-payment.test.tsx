/**
 * The share page must let a client retry after a declined card, and must not
 * offer to charge an invoice the owner has already marked paid.
 */
import { render, screen } from '@testing-library/react'
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
  PublicPaymentButton: () => <button>Pay now</button>,
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
})
