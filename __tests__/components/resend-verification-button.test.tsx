import { render, screen, fireEvent } from '@testing-library/react'
import { ResendVerificationButton } from '@/components/auth/resend-verification-button'

const mockSendVerificationEmail = jest.fn()
jest.mock('@/lib/auth-client', () => ({
  sendVerificationEmail: (args: unknown) => mockSendVerificationEmail(args),
}))

beforeEach(() => jest.clearAllMocks())

describe('ResendVerificationButton', () => {
  it('sends a link that lands on /auth/verified and confirms the inbox', async () => {
    mockSendVerificationEmail.mockResolvedValue({ data: { status: true }, error: null })
    render(<ResendVerificationButton email="me@example.test" />)
    fireEvent.click(screen.getByRole('button', { name: 'Send a new verification email' }))

    expect(await screen.findByText('Check your inbox at me@example.test.')).toBeInTheDocument()
    expect(mockSendVerificationEmail).toHaveBeenCalledWith({
      email: 'me@example.test',
      callbackURL: '/auth/verified?next=%2Fdashboard',
    })
  })

  it('shows an inline error and lets the user retry', async () => {
    mockSendVerificationEmail.mockResolvedValue({ data: null, error: { status: 429 } })
    render(<ResendVerificationButton email="me@example.test" />)
    fireEvent.click(screen.getByRole('button', { name: 'Send a new verification email' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('We could not send the verification email.')
    expect(screen.getByRole('button', { name: 'Send a new verification email' })).toBeEnabled()
  })
})
