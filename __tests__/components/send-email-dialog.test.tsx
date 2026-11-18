import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SendEmailDialog } from '@/components/send-email-dialog'

const mockUseSession = jest.fn()
const mockSendVerificationEmail = jest.fn()
const mockRefetch = jest.fn()
jest.mock('@/lib/auth-client', () => ({
  useSession: () => mockUseSession(),
  sendVerificationEmail: (args: unknown) => mockSendVerificationEmail(args),
}))
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const invoice = {
  id: 'inv-1',
  invoiceNumber: 'INV-001',
  clientName: 'Client',
  clientEmail: 'client@example.test',
  total: 100,
  status: 'draft',
}

function sessionFor(emailVerified: boolean) {
  mockUseSession.mockReturnValue({
    data: { user: { id: 'u1', email: 'me@example.test', emailVerified } },
    refetch: mockRefetch,
  })
}

function renderDialog() {
  render(<SendEmailDialog invoice={invoice} open onOpenChange={jest.fn()} onEmailSent={jest.fn()} />)
}

const sendButton = () => screen.getByRole('button', { name: /send invoice/i })

beforeEach(() => {
  jest.clearAllMocks()
  global.fetch = jest.fn()
})

describe('SendEmailDialog email verification', () => {
  it('enables Send with no notice for a verified account', () => {
    sessionFor(true)
    renderDialog()
    expect(sendButton()).toBeEnabled()
    expect(screen.queryByText(/needs a verified account email/i)).not.toBeInTheDocument()
  })

  it('disables Send and explains why for an unverified account', () => {
    sessionFor(false)
    renderDialog()
    expect(screen.getByText(/needs a verified account email/i)).toBeInTheDocument()
    expect(screen.getByText('Verify your email to send.')).toBeInTheDocument()
    expect(sendButton()).toBeDisabled()
  })

  it('sends a verification email and confirms the inbox', async () => {
    sessionFor(false)
    let resolve: (value: unknown) => void = () => {}
    mockSendVerificationEmail.mockReturnValue(new Promise((r) => { resolve = r }))
    renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Send verification email' }))
    expect(await screen.findByRole('button', { name: /sending/i })).toBeDisabled()
    expect(mockSendVerificationEmail).toHaveBeenCalledWith({
      email: 'me@example.test',
      callbackURL: '/auth/verified?next=%2Fdashboard',
    })

    resolve({ data: { status: true }, error: null })
    expect(await screen.findByText('Check your inbox at me@example.test.')).toBeInTheDocument()
  })

  it('shows an inline error when the verification email fails', async () => {
    sessionFor(false)
    mockSendVerificationEmail.mockResolvedValue({ data: null, error: { status: 500, message: 'boom' } })
    renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Send verification email' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('We could not send the verification email.')
    expect(screen.getByRole('button', { name: 'Send verification email' })).toBeEnabled()
  })

  it('shows the notice when the server rejects an unverified send', async () => {
    sessionFor(true)
    jest.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({ error: 'Verify', code: 'EMAIL_NOT_VERIFIED' }),
    } as Response)
    renderDialog()

    fireEvent.click(sendButton())
    expect(await screen.findByText(/needs a verified account email/i)).toBeInTheDocument()
    await waitFor(() => expect(sendButton()).toBeDisabled())
  })
})
