import { render, screen, fireEvent, waitFor } from '@testing-library/react'

const mockDeleteUser = jest.fn()
const mockSignOut = jest.fn(async () => ({}))
jest.mock('@/lib/auth-client', () => ({
  authClient: { deleteUser: (args: unknown) => mockDeleteUser(args) },
  signOut: () => mockSignOut(),
}))

const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace, refresh: jest.fn() }) }))

const mockResetInvoice = jest.fn()
jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: { getState: () => ({ resetInvoice: mockResetInvoice }) },
}))

import { DeleteAccountSection } from '@/app/settings/delete-account-section'

beforeEach(() => {
  jest.clearAllMocks()
})

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText(/to confirm/i), { target: { value: email } })
  fireEvent.change(screen.getByLabelText('Current password'), { target: { value: password } })
}

const button = () => screen.getByRole('button', { name: /delete my account/i })

describe('DeleteAccountSection', () => {
  it('says what is and is not deleted', () => {
    render(<DeleteAccountSection email="a@example.com" />)
    expect(screen.getByText('Your saved invoices and estimates')).toBeInTheDocument()
    expect(screen.getByText('Your Stripe account, which you manage at Stripe')).toBeInTheDocument()
    expect(screen.getByText(/unpaid invoices stop working/i)).toHaveTextContent(
      /reach your Stripe account with no record here/i
    )
  })

  it('stays disabled with a visible reason until the email and password are entered', () => {
    render(<DeleteAccountSection email="a@example.com" />)
    expect(button()).toBeDisabled()
    expect(screen.getByText(/type your email address/i)).toBeVisible()

    fill('a@example.co', 'secret')
    expect(button()).toBeDisabled()

    fill('A@example.com ', '')
    expect(button()).toBeDisabled()
    expect(screen.getByText(/enter your current password/i)).toBeVisible()

    fill('a@example.com', 'secret')
    expect(button()).toBeEnabled()
    expect(button()).toHaveAccessibleDescription('This cannot be undone.')
  })

  it('shows an inline error and allows a retry when the password is wrong', async () => {
    mockDeleteUser.mockResolvedValue({ error: { code: 'INVALID_PASSWORD' } })
    render(<DeleteAccountSection email="a@example.com" />)
    fill('a@example.com', 'wrong')
    fireEvent.click(button())

    expect(await screen.findByRole('alert')).toHaveTextContent('That password is not correct.')
    expect(button()).toBeEnabled()
    expect(mockResetInvoice).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('says when attempts are rate limited', async () => {
    mockDeleteUser.mockResolvedValue({ error: { status: 429 } })
    render(<DeleteAccountSection email="a@example.com" />)
    fill('a@example.com', 'secret')
    fireEvent.click(button())

    expect(await screen.findByRole('alert')).toHaveTextContent(/too many attempts/i)
  })

  it('blocks a double submit while pending', async () => {
    let resolve: (value: unknown) => void = () => {}
    mockDeleteUser.mockReturnValue(new Promise((r) => { resolve = r }))
    render(<DeleteAccountSection email="a@example.com" />)
    fill('a@example.com', 'secret')
    fireEvent.click(button())

    const pendingButton = screen.getByRole('button', { name: /deleting account/i })
    expect(pendingButton).toBeDisabled()
    fireEvent.click(pendingButton)
    expect(mockDeleteUser).toHaveBeenCalledTimes(1)

    resolve({ error: null })
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'))
  })

  it('clears the local draft, signs out and goes home on success', async () => {
    mockDeleteUser.mockResolvedValue({ error: null })
    render(<DeleteAccountSection email="a@example.com" />)
    fill('a@example.com', 'secret')
    fireEvent.click(button())

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'))
    expect(mockDeleteUser).toHaveBeenCalledWith({ password: 'secret' })
    expect(mockResetInvoice).toHaveBeenCalled()
    expect(mockSignOut).toHaveBeenCalled()
  })
})
