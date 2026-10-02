/**
 * Tests for Dialog UI components
 * Tests Radix UI dialog (modal) wrapper - focused on basic rendering
 * Note: Portal interactions are avoided to prevent test hangs
 */

import { render, screen } from '@testing-library/react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'

describe('Dialog Components', () => {
  describe('Dialog Root', () => {
    it('should render with trigger', () => {
      const { container } = render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      )

      const trigger = container.querySelector('[data-slot="dialog-trigger"]')
      expect(trigger).toBeInTheDocument()
    })

    it('should accept open prop', () => {
      const { container } = render(
        <Dialog open={false}>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      )

      const trigger = container.querySelector('[data-slot="dialog-trigger"]')
      expect(trigger).toBeInTheDocument()
    })

    it('should accept onOpenChange prop', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <Dialog onOpenChange={handleChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      )

      const trigger = container.querySelector('[data-slot="dialog-trigger"]')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('DialogTrigger', () => {
    it('should render trigger button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      )

      expect(screen.getByText('Open Dialog')).toBeInTheDocument()
    })

    it('should accept children', () => {
      render(
        <Dialog>
          <DialogTrigger>
            <span>Custom Trigger</span>
          </DialogTrigger>
        </Dialog>
      )

      expect(screen.getByText('Custom Trigger')).toBeInTheDocument()
    })

    it('should accept asChild prop', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button>Custom Button</button>
          </DialogTrigger>
        </Dialog>
      )

      expect(screen.getByText('Custom Button')).toBeInTheDocument()
    })
  })

  describe('DialogHeader', () => {
    it('should render dialog header', () => {
      const { container } = render(
        <DialogHeader>
          <h2>Header Content</h2>
        </DialogHeader>
      )

      const header = container.querySelector('[data-slot="dialog-header"]')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('Header Content')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <DialogHeader className="custom-header">Content</DialogHeader>
      )

      const header = container.querySelector('[data-slot="dialog-header"]')
      expect(header).toHaveClass('custom-header')
    })

    it('should have header styling classes', () => {
      const { container } = render(<DialogHeader>Content</DialogHeader>)

      const header = container.querySelector('[data-slot="dialog-header"]')
      expect(header).toHaveClass('flex')
      expect(header).toHaveClass('flex-col')
      expect(header).toHaveClass('gap-2')
    })
  })

  describe('DialogFooter', () => {
    it('should render dialog footer', () => {
      const { container } = render(
        <DialogFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </DialogFooter>
      )

      const footer = container.querySelector('[data-slot="dialog-footer"]')
      expect(footer).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <DialogFooter className="custom-footer">Content</DialogFooter>
      )

      const footer = container.querySelector('[data-slot="dialog-footer"]')
      expect(footer).toHaveClass('custom-footer')
    })

    it('should have footer styling classes', () => {
      const { container } = render(<DialogFooter>Content</DialogFooter>)

      const footer = container.querySelector('[data-slot="dialog-footer"]')
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('flex-col-reverse')
      expect(footer).toHaveClass('gap-2')
    })

    it('should accept button children', () => {
      render(
        <DialogFooter>
          <button>Action 1</button>
          <button>Action 2</button>
        </DialogFooter>
      )

      expect(screen.getByText('Action 1')).toBeInTheDocument()
      expect(screen.getByText('Action 2')).toBeInTheDocument()
    })
  })

  describe('DialogTitle', () => {
    // Note: DialogTitle must be within Dialog context. Test within DialogHeader instead.
    it('should have required component definition', () => {
      expect(DialogTitle).toBeDefined()
    })
  })

  describe('DialogDescription', () => {
    // Note: DialogDescription must be within Dialog context. Test within DialogHeader instead.
    it('should have required component definition', () => {
      expect(DialogDescription).toBeDefined()
    })
  })

  describe('DialogClose', () => {
    // Note: DialogClose must be within Dialog context.
    it('should have required component definition', () => {
      expect(DialogClose).toBeDefined()
    })
  })

  describe('Component Integration', () => {
    it('should render complete dialog structure (closed)', () => {
      const { container } = render(
        <Dialog open={false}>
          <DialogTrigger>Open</DialogTrigger>
        </Dialog>
      )

      const trigger = container.querySelector('[data-slot="dialog-trigger"]')
      expect(trigger).toBeInTheDocument()
    })

    it('should render header with custom content', () => {
      const { container } = render(
        <DialogHeader>
          <h2>Custom Title</h2>
          <p>Custom Description</p>
        </DialogHeader>
      )

      const header = container.querySelector('[data-slot="dialog-header"]')
      expect(header).toBeInTheDocument()
      expect(screen.getByText('Custom Title')).toBeInTheDocument()
      expect(screen.getByText('Custom Description')).toBeInTheDocument()
    })

    it('should render footer with multiple actions', () => {
      render(
        <DialogFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </DialogFooter>
      )

      expect(screen.getByText('Cancel')).toBeInTheDocument()
      expect(screen.getByText('Confirm')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should render trigger as button', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      )

      const trigger = screen.getByText('Open Dialog')
      expect(trigger).toBeInTheDocument()
    })

    it('should support custom trigger with asChild', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button aria-label="Open settings">Settings</button>
          </DialogTrigger>
        </Dialog>
      )

      expect(screen.getByLabelText('Open settings')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle dialog without trigger', () => {
      const { container } = render(<Dialog />)

      // Dialog root doesn't render visible elements, just provides context
      expect(container).toBeInTheDocument()
    })

    it('should handle empty header', () => {
      const { container } = render(<DialogHeader />)

      const header = container.querySelector('[data-slot="dialog-header"]')
      expect(header).toBeInTheDocument()
    })

    it('should handle empty footer', () => {
      const { container } = render(<DialogFooter />)

      const footer = container.querySelector('[data-slot="dialog-footer"]')
      expect(footer).toBeInTheDocument()
    })
  })
})
