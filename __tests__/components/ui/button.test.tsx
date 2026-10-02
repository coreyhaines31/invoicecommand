/**
 * Tests for Button UI component
 * Tests button element with variant and size styles using CVA
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  describe('Basic Rendering', () => {
    it('should render button element', () => {
      render(<Button>Click me</Button>)

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toBeInTheDocument()
    })

    it('should render as button element by default', () => {
      render(<Button>Button</Button>)

      const button = screen.getByRole('button')
      expect(button.tagName.toLowerCase()).toBe('button')
    })
  })

  describe('Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Button>Default</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('bg-primary')
      expect(button).toHaveClass('text-primary-foreground')
    })

    it('should render secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('bg-secondary')
      expect(button).toHaveClass('text-secondary-foreground')
    })

    it('should render destructive variant', () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('bg-destructive')
      expect(button).toHaveClass('text-white')
    })

    it('should render outline variant', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('border')
      expect(button).toHaveClass('bg-background')
    })

    it('should render ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('hover:bg-accent')
    })

    it('should render link variant', () => {
      const { container } = render(<Button variant="link">Link</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('text-primary')
      expect(button).toHaveClass('underline-offset-4')
    })
  })

  describe('Sizes', () => {
    it('should render default size', () => {
      const { container } = render(<Button>Default</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('h-9')
      expect(button).toHaveClass('px-4')
      expect(button).toHaveClass('py-2')
    })

    it('should render sm size', () => {
      const { container } = render(<Button size="sm">Small</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('h-8')
    })

    it('should render lg size', () => {
      const { container } = render(<Button size="lg">Large</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('h-10')
    })

    it('should render icon size', () => {
      const { container } = render(<Button size="icon">+</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('size-9')
    })

    it('should render icon-sm size', () => {
      const { container } = render(<Button size="icon-sm">+</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('size-8')
    })

    it('should render icon-lg size', () => {
      const { container } = render(<Button size="icon-lg">+</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('size-10')
    })
  })

  describe('User Interaction', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple clicks', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Click me</Button>)

      const button = screen.getByRole('button')
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(3)
    })

    it('should not trigger onClick when disabled', () => {
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      render(<Button disabled>Disabled</Button>)

      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
    })

    it('should have disabled styling classes', () => {
      const { container } = render(<Button disabled>Disabled</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('disabled:pointer-events-none')
      expect(button).toHaveClass('disabled:opacity-50')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Button className="custom-class">Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('custom-class')
    })

    it('should merge custom className with variant classes', () => {
      const { container } = render(
        <Button variant="destructive" className="ml-2">
          Delete
        </Button>
      )

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('ml-2')
      expect(button).toHaveClass('bg-destructive')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('inline-flex')
      expect(button).toHaveClass('items-center')
      expect(button).toHaveClass('justify-center')
      expect(button).toHaveClass('gap-2')
      expect(button).toHaveClass('rounded-md')
      expect(button).toHaveClass('text-sm')
      expect(button).toHaveClass('font-medium')
    })
  })

  describe('Content', () => {
    it('should display text content', () => {
      render(<Button>Submit</Button>)

      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('should accept children elements', () => {
      render(
        <Button>
          <span>Icon</span> Submit
        </Button>
      )

      expect(screen.getByText('Icon')).toBeInTheDocument()
      expect(screen.getByText('Submit')).toBeInTheDocument()
    })

    it('should support icons as children', () => {
      render(
        <Button>
          <svg data-testid="icon" />
          With Icon
        </Button>
      )

      expect(screen.getByTestId('icon')).toBeInTheDocument()
      expect(screen.getByText('With Icon')).toBeInTheDocument()
    })
  })

  describe('AsChild Prop', () => {
    it('should render as child component when asChild is true', () => {
      render(
        <Button asChild>
          <a href="/link">Link Button</a>
        </Button>
      )

      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/link')
    })

    it('should apply button styles to child component', () => {
      const { container } = render(
        <Button asChild variant="destructive">
          <a href="/delete">Delete Link</a>
        </Button>
      )

      const link = screen.getByRole('link')
      expect(link).toHaveClass('bg-destructive')
      expect(link).toHaveAttribute('data-slot', 'button')
    })
  })

  describe('HTML Attributes', () => {
    it('should support type attribute', () => {
      render(<Button type="submit">Submit</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('type', 'submit')
    })

    it('should support name attribute', () => {
      render(<Button name="action">Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('name', 'action')
    })

    it('should support value attribute', () => {
      render(<Button value="confirm">Confirm</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('value', 'confirm')
    })

    it('should support data attributes', () => {
      render(<Button data-testid="custom-button">Button</Button>)

      expect(screen.getByTestId('custom-button')).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('should work with form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Button type="submit">Submit</Button>
        </form>
      )

      const button = screen.getByRole('button')
      fireEvent.click(button)

      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should support formAction attribute', () => {
      render(<Button formAction="/submit">Submit</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('formAction', '/submit')
    })
  })

  describe('Focus Behavior', () => {
    it('should be focusable', () => {
      render(<Button>Focus me</Button>)

      const button = screen.getByRole('button')
      button.focus()

      expect(document.activeElement).toBe(button)
    })

    it('should handle focus events', () => {
      const handleFocus = jest.fn()
      render(<Button onFocus={handleFocus}>Button</Button>)

      const button = screen.getByRole('button')
      fireEvent.focus(button)

      expect(handleFocus).toHaveBeenCalled()
    })

    it('should handle blur events', () => {
      const handleBlur = jest.fn()
      render(<Button onBlur={handleBlur}>Button</Button>)

      const button = screen.getByRole('button')
      fireEvent.blur(button)

      expect(handleBlur).toHaveBeenCalled()
    })

    it('should have focus-visible styling classes', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('focus-visible:ring-ring/50')
      expect(button).toHaveClass('focus-visible:border-ring')
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>)

      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(<Button aria-describedby="button-description">Button</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'button-description')
    })

    it('should support aria-pressed for toggle buttons', () => {
      render(<Button aria-pressed="true">Toggle</Button>)

      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Styling Features', () => {
    it('should have whitespace-nowrap class', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('whitespace-nowrap')
    })

    it('should have shrink-0 class', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('shrink-0')
    })

    it('should have outline-none class', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('outline-none')
    })

    it('should have transition-all class', () => {
      const { container } = render(<Button>Button</Button>)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toHaveClass('transition-all')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty button', () => {
      const { container } = render(<Button />)

      const button = container.querySelector('[data-slot="button"]')
      expect(button).toBeInTheDocument()
    })

    it('should handle very long text', () => {
      const longText = 'Very long button text'
      render(<Button>{longText}</Button>)

      expect(screen.getByText(longText)).toBeInTheDocument()
    })

    it('should handle numeric content', () => {
      render(<Button>42</Button>)

      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should handle special characters', () => {
      render(<Button>Save & Continue</Button>)

      expect(screen.getByText('Save & Continue')).toBeInTheDocument()
    })
  })
})
