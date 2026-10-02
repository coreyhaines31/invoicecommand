/**
 * Tests for Badge UI component
 * Tests badge span element with variant styles using CVA
 */

import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge', () => {
  describe('Basic Rendering', () => {
    it('should render badge element', () => {
      render(<Badge>Badge Text</Badge>)

      expect(screen.getByText('Badge Text')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toBeInTheDocument()
    })

    it('should render as span by default', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('span')
      expect(badge).toBeInTheDocument()
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Badge>Default</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-primary')
      expect(badge).toHaveClass('text-primary-foreground')
    })

    it('should render secondary variant', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-secondary')
      expect(badge).toHaveClass('text-secondary-foreground')
    })

    it('should render destructive variant', () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('bg-destructive')
      expect(badge).toHaveClass('text-white')
    })

    it('should render outline variant', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('text-foreground')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Badge className="custom-class">Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('custom-class')
    })

    it('should merge custom className with variant classes', () => {
      const { container } = render(
        <Badge variant="secondary" className="ml-2">
          Badge
        </Badge>
      )

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('ml-2')
      expect(badge).toHaveClass('bg-secondary')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('inline-flex')
      expect(badge).toHaveClass('items-center')
      expect(badge).toHaveClass('justify-center')
      expect(badge).toHaveClass('rounded-md')
      expect(badge).toHaveClass('border')
      expect(badge).toHaveClass('px-2')
      expect(badge).toHaveClass('py-0.5')
      expect(badge).toHaveClass('text-xs')
      expect(badge).toHaveClass('font-medium')
    })
  })

  describe('Content', () => {
    it('should display text content', () => {
      render(<Badge>New</Badge>)

      expect(screen.getByText('New')).toBeInTheDocument()
    })

    it('should accept children elements', () => {
      render(
        <Badge>
          <span>Complex</span> Badge
        </Badge>
      )

      expect(screen.getByText('Complex')).toBeInTheDocument()
      expect(screen.getByText('Badge')).toBeInTheDocument()
    })

    it('should support icons as children', () => {
      render(
        <Badge>
          <svg data-testid="icon" />
          With Icon
        </Badge>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })
  })

  describe('AsChild Prop', () => {
    it('should render as child component when asChild is true', () => {
      render(
        <Badge asChild>
          <a href="/link">Link Badge</a>
        </Badge>
      )

      const link = screen.getByRole('link', { name: 'Link Badge' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/link')
    })

    it('should apply badge styles to child component', () => {
      const { container } = render(
        <Badge asChild variant="destructive">
          <button>Button Badge</button>
        </Badge>
      )

      const button = screen.getByRole('button')
      expect(button).toHaveClass('bg-destructive')
      expect(button).toHaveAttribute('data-slot', 'badge')
    })
  })

  describe('HTML Attributes', () => {
    it('should support data attributes', () => {
      render(<Badge data-testid="custom-badge">Badge</Badge>)

      expect(screen.getByTestId('custom-badge')).toBeInTheDocument()
    })

    it('should support aria attributes', () => {
      render(<Badge aria-label="Status badge">Active</Badge>)

      expect(screen.getByLabelText('Status badge')).toBeInTheDocument()
    })

    it('should support title attribute', () => {
      render(<Badge title="Badge tooltip">Hover me</Badge>)

      const badge = screen.getByText('Hover me')
      expect(badge).toHaveAttribute('title', 'Badge tooltip')
    })
  })

  describe('Styling Features', () => {
    it('should have whitespace-nowrap class', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('whitespace-nowrap')
    })

    it('should have w-fit class', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('w-fit')
    })

    it('should have shrink-0 class', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('shrink-0')
    })

    it('should have gap-1 class for icon spacing', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('gap-1')
    })

    it('should have focus-visible styling classes', () => {
      const { container } = render(<Badge>Badge</Badge>)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toHaveClass('focus-visible:ring-ring/50')
      expect(badge).toHaveClass('focus-visible:border-ring')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty badge', () => {
      const { container } = render(<Badge />)

      const badge = container.querySelector('[data-slot="badge"]')
      expect(badge).toBeInTheDocument()
    })

    it('should handle very long text', () => {
      const longText = 'Very long badge text'
      render(<Badge>{longText}</Badge>)

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('should handle numeric content', () => {
      render(<Badge>42</Badge>)

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should handle special characters', () => {
      render(<Badge>New & Updated!</Badge>)

      expect(screen.getByText('New & Updated!')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with screen readers', () => {
      render(<Badge aria-label="Status: Active">Active</Badge>)

      const badge = screen.getByLabelText('Status: Active')
      expect(badge).toBeInTheDocument()
    })

    it('should support role attribute', () => {
      render(<Badge role="status">Loading...</Badge>)

      const badge = screen.getByRole('status')
      expect(badge).toBeInTheDocument()
    })
  })
})
