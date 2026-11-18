import type React from 'react'
import { render, screen } from '@testing-library/react'
import { PaymentSettings } from '@/components/payment/payment-settings'

const mockUseUser = jest.fn()
jest.mock('@/hooks/use-user', () => ({
  useUser: () => mockUseUser(),
}))

jest.mock('next/link', () => {
  function MockLink({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
  return MockLink
})

const mockFetch = jest.fn()
const originalFetch = global.fetch

afterAll(() => {
  global.fetch = originalFetch
})

function renderSettings() {
  render(<PaymentSettings onPaymentToggle={jest.fn()} paymentEnabled={false} invoiceTotal={100} />)
}

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = mockFetch as unknown as typeof fetch
})

describe('PaymentSettings', () => {
  it('asks anonymous visitors for a free account instead of a Stripe setup', async () => {
    mockUseUser.mockReturnValue({ user: null, loading: false, isAuthenticated: false })
    renderSettings()

    const link = await screen.findByText('Create a free account')
    expect(link.closest('a')).toHaveAttribute('href', '/auth/signup?next=%2Fdashboard%2Fpayments%2Fsetup')
    expect(screen.getByText(/Accepting online payments needs a free account/)).toBeInTheDocument()
    expect(screen.queryByText('Setup Required:')).not.toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('shows the Stripe setup alert to signed-in users without an account', async () => {
    mockUseUser.mockReturnValue({ user: { id: 'user-1' }, loading: false, isAuthenticated: true })
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ hasAccount: false, onboardingCompleted: false, chargesEnabled: false, requiresAction: false }),
    })
    renderSettings()

    expect(await screen.findByText('Setup Required:')).toBeInTheDocument()
    expect(screen.getByText('Set Up Payments').closest('a')).toHaveAttribute('href', '/dashboard/payments/setup')
    expect(screen.queryByText('Create a free account')).not.toBeInTheDocument()
    expect(mockFetch).toHaveBeenCalledWith('/api/stripe/connect/account-status')
  })

  it('waits for the session before deciding', () => {
    mockUseUser.mockReturnValue({ user: null, loading: true, isAuthenticated: false })
    renderSettings()

    expect(screen.getByText('Loading payment settings...')).toBeInTheDocument()
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
