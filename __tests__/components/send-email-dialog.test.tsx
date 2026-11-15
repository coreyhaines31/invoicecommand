import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SendEmailDialog } from '@/components/send-email-dialog'

jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn() } }))

const invoice = {
  id: 'inv_1',
  invoiceNumber: 'INV-1001',
  clientName: 'Aleksandra Wiśniewska-Kowalczyk',
  clientEmail: '',
  total: '1500',
  currency: 'EUR',
  status: 'draft',
}

function renderDialog() {
  return render(
    <SendEmailDialog invoice={invoice} open onOpenChange={jest.fn()} onEmailSent={jest.fn()} />
  )
}

describe('SendEmailDialog', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) })
  })

  it('shows the total in the invoice currency', () => {
    renderDialog()
    expect(screen.getByText('€1,500.00')).toBeInTheDocument()
  })

  it('shows an inline, linked error instead of sending when the email is missing', async () => {
    renderDialog()

    fireEvent.click(screen.getByRole('button', { name: /send invoice/i }))

    const input = screen.getByLabelText(/client email/i)
    const error = await screen.findByRole('alert')
    expect(error).toHaveTextContent('Enter the email address')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAttribute('aria-describedby', 'client-email-error')
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('flags an incomplete address, then clears the error while typing', async () => {
    renderDialog()
    const input = screen.getByLabelText(/client email/i)

    fireEvent.change(input, { target: { value: 'jo@example' } })
    fireEvent.submit(input.closest('form')!)
    expect(await screen.findByRole('alert')).toHaveTextContent('looks incomplete')

    fireEvent.change(input, { target: { value: 'jo@example.com' } })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('submits a valid address with Enter', async () => {
    renderDialog()
    const input = screen.getByLabelText(/client email/i)

    fireEvent.change(input, { target: { value: 'jo@example.com' } })
    fireEvent.submit(input.closest('form')!)

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith('/api/send-invoice', expect.anything()))
  })
})
