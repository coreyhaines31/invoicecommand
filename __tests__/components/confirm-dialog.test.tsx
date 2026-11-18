import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConfirmDialog } from '@/components/confirm-dialog'

describe('ConfirmDialog', () => {
  it('names the consequence and closes after a successful action', async () => {
    const onOpenChange = jest.fn()
    const onConfirm = jest.fn().mockResolvedValue(true)
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Delete INV-1?"
        description="This cannot be undone."
        confirmLabel="Delete invoice"
        destructive
        onConfirm={onConfirm}
      />
    )

    expect(screen.getByRole('alertdialog')).toHaveTextContent('This cannot be undone.')
    fireEvent.click(screen.getByRole('button', { name: 'Delete invoice' }))

    await waitFor(() => expect(onConfirm).toHaveBeenCalled())
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it('stays open when the action reports failure', async () => {
    const onOpenChange = jest.fn()
    const onConfirm = jest.fn().mockResolvedValue(false)
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Revoke key?"
        description="Scripts using it will stop working."
        confirmLabel="Revoke key"
        onConfirm={onConfirm}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Revoke key' }))

    await waitFor(() => expect(onConfirm).toHaveBeenCalled())
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Revoke key' })).not.toBeDisabled()
  })

  it('cancels without running the action', () => {
    const onOpenChange = jest.fn()
    const onConfirm = jest.fn()
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Delete?"
        description="Gone for good."
        confirmLabel="Delete"
        onConfirm={onConfirm}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })
})
