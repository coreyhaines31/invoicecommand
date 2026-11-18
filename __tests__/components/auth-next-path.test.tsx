import type React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/auth/login-form'
import { SignupForm } from '@/components/auth/signup-form'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, refresh: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

const mockSignInEmail = jest.fn()
const mockSignUpEmail = jest.fn()
jest.mock('@/lib/auth-client', () => ({
  signIn: { email: (args: unknown) => mockSignInEmail(args) },
  signUp: { email: (args: unknown) => mockSignUpEmail(args) },
}))

const mockTrackUserSignup = jest.fn()
const mockIdentifyUser = jest.fn()
jest.mock('@/hooks/use-analytics', () => ({
  useAnalytics: () => ({ trackUserSignup: mockTrackUserSignup, identifyUser: mockIdentifyUser }),
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

function fillAndSubmit(buttonName: RegExp) {
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })
  fireEvent.click(screen.getByRole('button', { name: buttonName }))
}

const CREATED = 'Account created. We sent a verification email to a@example.com. Redirecting...'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('LoginForm next path', () => {
  it('redirects to a valid next path after sign in', async () => {
    mockSignInEmail.mockResolvedValue({ error: null })
    render(<LoginForm next="/dashboard/payments/setup" />)
    fillAndSubmit(/sign in/i)

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard/payments/setup'))
    expect(mockSignInEmail).toHaveBeenCalledWith(
      expect.objectContaining({ callbackURL: '/dashboard/payments/setup' })
    )
  })

  it('falls back to the dashboard when next is absent', async () => {
    mockSignInEmail.mockResolvedValue({ error: null })
    render(<LoginForm />)
    fillAndSubmit(/sign in/i)

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
  })

  it('ignores an off-site next path', async () => {
    mockSignInEmail.mockResolvedValue({ error: null })
    render(<LoginForm next="//evil.com" />)
    fillAndSubmit(/sign in/i)

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
  })

  it('carries next onto the "Create one" link', async () => {
    mockSignInEmail.mockResolvedValue({ error: { code: 'USER_NOT_FOUND' } })
    render(<LoginForm next="/" />)
    fillAndSubmit(/sign in/i)

    const link = await screen.findByText('Create one')
    expect(link.closest('a')).toHaveAttribute('href', '/auth/signup?next=%2F')
  })
})

describe('SignupForm next path', () => {
  it('sends verification links to /auth/verified with the next path', async () => {
    mockSignUpEmail.mockResolvedValue({ error: null })
    render(<SignupForm next="/" />)
    fillAndSubmit(/create account/i)

    await screen.findByText(CREATED)
    expect(mockSignUpEmail).toHaveBeenCalledWith(expect.objectContaining({ callbackURL: '/auth/verified?next=%2F' }))
  })

  it('uses the dashboard when next is unsafe', async () => {
    mockSignUpEmail.mockResolvedValue({ error: null })
    render(<SignupForm next="https://evil.com" />)
    fillAndSubmit(/create account/i)

    await screen.findByText(CREATED)
    expect(mockSignUpEmail).toHaveBeenCalledWith(
      expect.objectContaining({ callbackURL: '/auth/verified?next=%2Fdashboard' })
    )
  })

  it('carries next onto the "Sign in instead" link', async () => {
    mockSignUpEmail.mockResolvedValue({ error: { code: 'USER_ALREADY_EXISTS' } })
    render(<SignupForm next="/dashboard/payments/setup" />)
    fillAndSubmit(/create account/i)

    const link = await screen.findByText('Sign in instead')
    expect(link.closest('a')).toHaveAttribute('href', '/auth/login?next=%2Fdashboard%2Fpayments%2Fsetup')
  })
})

describe('SignupForm analytics', () => {
  it('identifies the new user by id only and fires the signup event', async () => {
    mockSignUpEmail.mockResolvedValue({
      data: { user: { id: 'user-123', email: 'a@example.com', name: 'a' } },
      error: null,
    })
    render(<SignupForm />)
    fillAndSubmit(/create account/i)

    await screen.findByText(CREATED)
    expect(mockIdentifyUser).toHaveBeenCalledWith('user-123')
    expect(mockTrackUserSignup).toHaveBeenCalledWith('email')
  })

  it('sends nothing when signup fails', async () => {
    mockSignUpEmail.mockResolvedValue({ data: null, error: { code: 'USER_ALREADY_EXISTS' } })
    render(<SignupForm />)
    fillAndSubmit(/create account/i)

    await screen.findByText('Sign in instead')
    expect(mockIdentifyUser).not.toHaveBeenCalled()
    expect(mockTrackUserSignup).not.toHaveBeenCalled()
  })
})

describe('SignupForm submit button', () => {
  it('stays disabled after a successful signup until the redirect', async () => {
    mockSignUpEmail.mockResolvedValue({ data: { user: { id: 'user-123' } }, error: null })
    render(<SignupForm />)
    fillAndSubmit(/create account/i)

    await screen.findByText(CREATED)
    expect(screen.getByRole('button', { name: /creat/i })).toBeDisabled()
  })

  it('re-enables after a failed signup', async () => {
    mockSignUpEmail.mockResolvedValue({ data: null, error: { code: 'USER_ALREADY_EXISTS' } })
    render(<SignupForm />)
    fillAndSubmit(/create account/i)

    await screen.findByText('Sign in instead')
    expect(screen.getByRole('button', { name: /create account/i })).toBeEnabled()
  })
})
