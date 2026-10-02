/**
 * Tests for Label UI component
 * Tests Radix UI label wrapper with custom styling
 */

import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label', () => {
  describe('Basic Rendering', () => {
    it('should render label element', () => {
      render(<Label>Label Text</Label>)

      expect(screen.getByText('Label Text')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Label>Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toBeInTheDocument()
    })
  })

  describe('HTML Attributes', () => {
    it('should support htmlFor attribute', () => {
      render(<Label htmlFor="input-id">Label</Label>)

      const label = screen.getByText('Label')
      expect(label).toHaveAttribute('for', 'input-id')
    })

    it('should support id attribute', () => {
      render(<Label id="my-label">Label</Label>)

      const label = screen.getByText('Label')
      expect(label).toHaveAttribute('id', 'my-label')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Label className="custom-class">Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<Label className="font-bold">Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toHaveClass('font-bold')
      expect(label).toHaveClass('text-sm')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Label>Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toHaveClass('flex')
      expect(label).toHaveClass('items-center')
      expect(label).toHaveClass('gap-2')
      expect(label).toHaveClass('text-sm')
      expect(label).toHaveClass('font-medium')
    })
  })

  describe('Content', () => {
    it('should display text content', () => {
      render(<Label>Simple Label</Label>)

      expect(screen.getByText('Simple Label')).toBeInTheDocument()
    })

    it('should accept children elements', () => {
      render(
        <Label>
          <span>Complex</span> Label
        </Label>
      )

      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('Label')).toBeInTheDocument()
    })

    it('should support icons as children', () => {
      render(
        <Label>
          <svg data-testid="icon" />
          With Icon
        </Label>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('should associate with input using htmlFor', () => {
      render(
        <div>
          <Label htmlFor="test-input">Username</Label>
          <input id="test-input" />
        </div>
      )

      const label = screen.getByText('Username')
      expect(label).toHaveAttribute('for', 'test-input')
    })

    it('should work with nested input', () => {
      render(
        <Label>
          Email
          <input type="email" />
        </Label>
      )

      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })
  })

  describe('Disabled State', () => {
    it('should have peer-disabled styling classes', () => {
      const { container } = render(<Label>Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed')
      expect(label).toHaveClass('peer-disabled:opacity-50')
    })

    it('should have group disabled styling classes', () => {
      const { container } = render(<Label>Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toHaveClass('group-data-[disabled=true]:pointer-events-none')
      expect(label).toHaveClass('group-data-[disabled=true]:opacity-50')
    })
  })

  describe('Accessibility', () => {
    it('should have select-none class for better UX', () => {
      const { container } = render(<Label>Label</Label>)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toHaveClass('select-none')
    })

    it('should support aria attributes', () => {
      render(<Label aria-label="Form label">Label</Label>)

      const label = screen.getByLabelText('Form label')
      expect(label).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty label', () => {
      const { container } = render(<Label />)

      const label = container.querySelector('[data-slot="label"]')
      expect(label).toBeInTheDocument()
    })

    it('should handle very long text', () => {
      const longText = 'Very long label text'
      render(<Label>{longText}</Label>)

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('should handle special characters', () => {
      render(<Label>Label with &amp; special characters</Label>)

      expect(screen.getByText(/Label with & special/)).toBeInTheDocument()
    })
  })
})
