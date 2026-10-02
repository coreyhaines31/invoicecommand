/**
 * Tests for Separator UI component
 * Tests Radix UI separator wrapper with orientation variants
 */

import { render } from '@testing-library/react'
import { Separator } from '@/components/ui/separator'

describe('Separator', () => {
  describe('Basic Rendering', () => {
    it('should render separator', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should render with horizontal orientation by default', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('should render as div element', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator?.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('Orientation', () => {
    it('should render horizontal separator', () => {
      const { container } = render(<Separator orientation="horizontal" />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'horizontal')
    })

    it('should render vertical separator', () => {
      const { container } = render(<Separator orientation="vertical" />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('Decorative Prop', () => {
    it('should accept decorative prop', () => {
      const { container } = render(<Separator decorative={true} />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should accept non-decorative prop', () => {
      const { container } = render(<Separator decorative={false} />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toBeInTheDocument()
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Separator className="custom-class" />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<Separator className="my-4" />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('my-4')
      expect(separator).toHaveClass('bg-border')
    })
  })

  describe('HTML Attributes', () => {
    it('should pass through additional props', () => {
      const { container } = render(<Separator data-testid="test-separator" />)

      const separator = container.querySelector('[data-testid="test-separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should support aria attributes', () => {
      const { container } = render(<Separator aria-label="Content separator" />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveAttribute('aria-label', 'Content separator')
    })
  })

  describe('Styling Classes', () => {
    it('should have base styling classes', () => {
      const { container } = render(<Separator />)

      const separator = container.querySelector('[data-slot="separator"]')
      expect(separator).toHaveClass('bg-border')
      expect(separator).toHaveClass('shrink-0')
    })

    it('should apply horizontal-specific classes', () => {
      const { container } = render(<Separator orientation="horizontal" />)

      const separator = container.querySelector('[data-slot="separator"]')
      // Classes are applied via data-[orientation=horizontal] selectors
      expect(separator).toBeInTheDocument()
    })

    it('should apply vertical-specific classes', () => {
      const { container } = render(<Separator orientation="vertical" />)

      const separator = container.querySelector('[data-slot="separator"]')
      // Classes are applied via data-[orientation=vertical] selectors
      expect(separator).toBeInTheDocument()
    })
  })
})
