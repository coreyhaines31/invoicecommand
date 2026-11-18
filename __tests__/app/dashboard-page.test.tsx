/**
 * Issue #91: logos are stored inline as data URLs of up to about 270 KB, so the
 * dashboard list must not send every row's logo (or signature image) to the browser.
 */
import { createFakeDb } from '../helpers/fake-db'

const fake = createFakeDb()

jest.mock('drizzle-orm', () => jest.requireActual('../helpers/fake-db').drizzleOrmMock)
jest.mock('@/lib/db/schema', () => jest.requireActual('../helpers/fake-db').schemaMock)
jest.mock('@/lib/db', () => ({ get db() { return fake.db } }))
jest.mock('next/headers', () => ({ headers: jest.fn(async () => new Headers()) }))
jest.mock('next/navigation', () => ({ redirect: jest.fn() }))
jest.mock('@/lib/auth', () => ({
  auth: { api: { getSession: jest.fn(async () => ({ user: { id: 'user-a' } })) } },
}))
jest.mock('@/components/dashboard/dashboard-content', () => ({ DashboardContent: () => null }))

import DashboardPage from '@/app/dashboard/page'

describe('dashboard page', () => {
  it('lists the user invoices without their logo or signature image', async () => {
    fake.rows.length = 0
    fake.rows.push({
      id: 'inv-1',
      userId: 'user-a',
      invoiceNumber: 'INV-0001',
      clientName: 'Client',
      total: '100',
      status: 'draft',
      documentType: 'estimate',
      convertedToInvoiceId: 'inv-9',
      senderLogo: `data:image/png;base64,${'A'.repeat(270_000)}`,
      signatureData: 'data:image/png;base64,AAAA',
      createdAt: new Date('2026-11-01T10:00:00Z'),
    })
    fake.rows.push({ id: 'inv-2', userId: 'user-b', invoiceNumber: 'INV-0002', clientName: 'Other' })

    const element = await DashboardPage()
    const invoices = (element as { props: { invoices: Array<Record<string, unknown>> } }).props.invoices

    expect(invoices).toHaveLength(1)
    expect(invoices[0]).toMatchObject({ id: 'inv-1', invoiceNumber: 'INV-0001', clientName: 'Client', documentType: 'estimate', convertedToInvoiceId: 'inv-9' })
    expect(invoices[0]).not.toHaveProperty('senderLogo')
    expect(invoices[0]).not.toHaveProperty('signatureData')
  })
})
