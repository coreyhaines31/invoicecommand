import type React from 'react'
import { render, screen } from '@testing-library/react'
import VerifiedPage from '@/app/auth/verified/page'

const mockGetSession = jest.fn()
jest.mock('@/lib/auth', () => ({
  auth: { api: { getSession: (args: unknown) => mockGetSession(args) } },
}))
jest.mock('next/headers', () => ({ headers: async () => new Headers() }))

jest.mock('@/components/auth/resend-verification-button', () => ({
  ResendVerificationButton: ({ email }: { email: string }) => (
    <button type="button" data-email={email}>Send a new verification email</button>
  ),
}))

jest.mock('@/components/logo', () => ({
  Logo: () => <div data-testid="logo" />,
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

function signedIn(emailVerified: boolean) {
  mockGetSession.mockResolvedValue({ user: { id: 'u1', email: 'me@example.test', emailVerified } })
}

async function renderPage(params: { next?: string; error?: string }) {
  render(await VerifiedPage({ searchParams: Promise.resolve(params) }))
}

const resendButton = () => screen.queryByRole('button', { name: 'Send a new verification email' })

beforeEach(() => {
  jest.clearAllMocks()
  mockGetSession.mockResolvedValue(null)
})

describe('VerifiedPage', () => {
  it('does not claim success on a bare visit without a session', async () => {
    await renderPage({})
    expect(screen.queryByText('Your email is verified')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Email verification' })).toBeInTheDocument()
    expect(screen.getByText(/if you just opened a verification link/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/auth/login?next=%2Fdashboard')
  })

  it('confirms verification for a signed-in verified user and continues to the next path', async () => {
    signedIn(true)
    await renderPage({ next: '/' })
    expect(screen.getByRole('heading', { name: 'Your email is verified' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/')
  })

  it('falls back to the dashboard for an unsafe next path', async () => {
    signedIn(true)
    await renderPage({ next: '//evil.com' })
    expect(screen.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/dashboard')
  })

  it('explains a failed link and asks a signed-out visitor to sign in', async () => {
    await renderPage({ error: 'TOKEN_EXPIRED' })
    expect(screen.getByRole('heading', { name: 'This link did not work' })).toBeInTheDocument()
    expect(screen.getByText(/sign in and request a new one/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Sign in' })).toBeInTheDocument()
    expect(resendButton()).not.toBeInTheDocument()
  })

  it('offers a new verification email right there to a signed-in unverified user', async () => {
    signedIn(false)
    await renderPage({ error: 'INVALID_TOKEN' })
    expect(screen.getByRole('heading', { name: 'This link did not work' })).toBeInTheDocument()
    expect(resendButton()).toHaveAttribute('data-email', 'me@example.test')
  })

  it('offers a verification email to a signed-in unverified user with no error', async () => {
    signedIn(false)
    await renderPage({})
    expect(screen.queryByText('Your email is verified')).not.toBeInTheDocument()
    expect(resendButton()).toBeInTheDocument()
  })
})
