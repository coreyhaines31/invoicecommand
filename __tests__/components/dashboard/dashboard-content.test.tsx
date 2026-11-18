/**
 * Issue #88: the dashboard offers to start an estimate as well as an invoice.
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import type { User } from 'better-auth'

jest.mock('@/components/navigation', () => ({ Navigation: () => null }))
jest.mock('@/components/dashboard/invoice-list', () => ({ InvoiceList: () => null }))

import { DashboardContent } from '@/components/dashboard/dashboard-content'

describe('DashboardContent', () => {
  it('links to a new invoice and a new estimate', () => {
    render(<DashboardContent user={{ id: 'user-1' } as User} invoices={[]} />)

    expect(screen.getByRole('link', { name: /create new invoice/i })).toHaveAttribute('href', '/?new=1')
    expect(screen.getByRole('link', { name: /new estimate/i })).toHaveAttribute('href', '/estimate-maker?new=1')
  })
})
