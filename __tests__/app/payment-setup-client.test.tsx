/**
 * The setup page passes the Drizzle row (camelCase) straight to the client,
 * so the client must read the same field names to show the user's tier.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PaymentSetupClient } from '@/app/dashboard/payments/setup/payment-setup-client'
import type { User } from 'better-auth'

jest.mock('@/components/navigation', () => ({
  Navigation: () => null,
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), info: jest.fn(), error: jest.fn() },
}))

const user: User = {
  id: 'user_1',
  email: 'pro@example.com',
  emailVerified: true,
  name: 'Pro User',
  createdAt: new Date(),
  updatedAt: new Date(),
}

function renderWithTier(subscriptionTier: 'free' | 'premium' | 'pro' | null) {
  return render(
    <PaymentSetupClient
      user={user}
      userProfile={{ stripeAccountId: null, stripeOnboardingCompleted: false, subscriptionTier }}
      searchParams={{}}
    />
  )
}

describe('PaymentSetupClient subscription tier', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) })
  })

  it('shows the Pro badge and no transaction fee for pro users', () => {
    renderWithTier('pro')

    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText(/We charge a 0% application fee/)).toBeInTheDocument()
    expect(screen.queryByText(/Upgrade to Pro/)).not.toBeInTheDocument()
  })

  it('shows the Premium badge for premium users', () => {
    renderWithTier('premium')

    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText(/We charge a 0.5% application fee/)).toBeInTheDocument()
  })

  it('falls back to Free when the profile has no tier', () => {
    renderWithTier(null)

    expect(screen.getByText('Free')).toBeInTheDocument()
    expect(screen.getByText(/Upgrade to Pro/)).toBeInTheDocument()
  })
})

describe('PaymentSetupClient account status states', () => {
  it('shows a skeleton, not the create-account form, while the status loads', () => {
    global.fetch = jest.fn(() => new Promise(() => {})) as unknown as typeof fetch
    renderWithTier('free')

    expect(screen.getByRole('status', { name: 'Checking your Stripe account' })).toBeInTheDocument()
    expect(screen.queryByText('Create Stripe Express Account')).not.toBeInTheDocument()
  })

  it('offers a retry when the status request fails, then shows the form', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({}) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ hasAccount: false }) })
    renderWithTier('free')

    const retry = await screen.findByRole('button', { name: /try again/i })
    expect(screen.getByText(/couldn.t check your Stripe account/)).toBeInTheDocument()
    expect(screen.queryByText('Create Stripe Express Account')).not.toBeInTheDocument()

    fireEvent.click(retry)

    await waitFor(() => expect(screen.getByText('Create Stripe Express Account')).toBeInTheDocument())
    expect(screen.getByLabelText('Country')).toBeInTheDocument()
  })
})
