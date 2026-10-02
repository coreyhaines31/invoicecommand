/**
 * Tests for Alert UI components
 * Tests alert container with variants using CVA
 */

import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

describe('Alert Components', () => {
  describe('Alert', () => {
    it('should render alert element', () => {
      render(<Alert>Alert content</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Alert>Alert</Alert>)

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toBeInTheDocument()
    })

    it('should have alert role for accessibility', () => {
      render(<Alert>Alert message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('role', 'alert')
    })

    it('should render as div element', () => {
      const { container } = render(<Alert>Alert</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert.tagName.toLowerCase()).toBe('div')
    })
  })

  describe('Alert Variants', () => {
    it('should render default variant', () => {
      const { container } = render(<Alert>Default alert</Alert>)

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toHaveClass('bg-card')
      expect(alert).toHaveClass('text-card-foreground')
    })

    it('should render destructive variant', () => {
      const { container } = render(<Alert variant="destructive">Error alert</Alert>)

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toHaveClass('text-destructive')
      expect(alert).toHaveClass('bg-card')
    })
  })

  describe('Alert Styling', () => {
    it('should have base styling classes', () => {
      const { container } = render(<Alert>Alert</Alert>)

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toHaveClass('relative')
      expect(alert).toHaveClass('w-full')
      expect(alert).toHaveClass('rounded-lg')
      expect(alert).toHaveClass('border')
      expect(alert).toHaveClass('px-4')
      expect(alert).toHaveClass('py-3')
      expect(alert).toHaveClass('text-sm')
    })

    it('should apply custom className', () => {
      const { container } = render(<Alert className="custom-alert">Alert</Alert>)

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toHaveClass('custom-alert')
    })

    it('should merge custom className with variant classes', () => {
      const { container } = render(
        <Alert variant="destructive" className="mb-4">
          Alert
        </Alert>
      )

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toHaveClass('mb-4')
      expect(alert).toHaveClass('text-destructive')
    })
  })

  describe('AlertTitle', () => {
    it('should render alert title', () => {
      render(<AlertTitle>Alert Title</AlertTitle>)

      expect(screen.getByText('Alert Title')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<AlertTitle>Title</AlertTitle>)

      const title = container.querySelector('[data-slot="alert-title"]')
      expect(title).toBeInTheDocument()
    })

    it('should have title styling classes', () => {
      const { container } = render(<AlertTitle>Title</AlertTitle>)

      const title = container.querySelector('[data-slot="alert-title"]')
      expect(title).toHaveClass('font-medium')
      expect(title).toHaveClass('tracking-tight')
      expect(title).toHaveClass('col-start-2')
    })

    it('should apply custom className', () => {
      const { container } = render(<AlertTitle className="custom-title">Title</AlertTitle>)

      const title = container.querySelector('[data-slot="alert-title"]')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('AlertDescription', () => {
    it('should render alert description', () => {
      render(<AlertDescription>Alert description text</AlertDescription>)

      expect(screen.getByText('Alert description text')).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<AlertDescription>Description</AlertDescription>)

      const description = container.querySelector('[data-slot="alert-description"]')
      expect(description).toBeInTheDocument()
    })

    it('should have description styling classes', () => {
      const { container } = render(<AlertDescription>Description</AlertDescription>)

      const description = container.querySelector('[data-slot="alert-description"]')
      expect(description).toHaveClass('text-muted-foreground')
      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('col-start-2')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <AlertDescription className="custom-description">Description</AlertDescription>
      )

      const description = container.querySelector('[data-slot="alert-description"]')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('Complete Alert Structure', () => {
    it('should render complete alert with title and description', () => {
      const { container } = render(
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Something went wrong</AlertDescription>
        </Alert>
      )

      const alert = container.querySelector('[data-slot="alert"]')
      const title = container.querySelector('[data-slot="alert-title"]')
      const description = container.querySelector('[data-slot="alert-description"]')

      expect(alert).toBeInTheDocument()
      expect(title).toHaveTextContent('Error')
      expect(description).toHaveTextContent('Something went wrong')
    })

    it('should render alert with icon', () => {
      render(
        <Alert>
          <svg data-testid="alert-icon" />
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Information message</AlertDescription>
        </Alert>
      )

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument()
      expect(screen.getByText('Info')).toBeInTheDocument()
      expect(screen.getByText('Information message')).toBeInTheDocument()
    })

    it('should render destructive alert with all elements', () => {
      const { container } = render(
        <Alert variant="destructive">
          <svg data-testid="error-icon" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>An error occurred</AlertDescription>
        </Alert>
      )

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toHaveClass('text-destructive')
      expect(screen.getByTestId('error-icon')).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should accept text content', () => {
      render(<Alert>Simple text alert</Alert>)

      expect(screen.getByText('Simple text alert')).toBeInTheDocument()
    })

    it('should accept children elements', () => {
      render(
        <Alert>
          <div>Custom content</div>
        </Alert>
      )

      expect(screen.getByText('Custom content')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have alert role', () => {
      render(<Alert>Alert message</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Alert aria-label="Error notification">Error</Alert>)

      expect(screen.getByLabelText('Error notification')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(<Alert aria-describedby="alert-description">Alert</Alert>)

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-describedby', 'alert-description')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty alert', () => {
      const { container } = render(<Alert />)

      const alert = container.querySelector('[data-slot="alert"]')
      expect(alert).toBeInTheDocument()
    })

    it('should handle alert with only title', () => {
      render(
        <Alert>
          <AlertTitle>Title Only</AlertTitle>
        </Alert>
      )

      expect(screen.getByText('Title Only')).toBeInTheDocument()
    })

    it('should handle alert with only description', () => {
      render(
        <Alert>
          <AlertDescription>Description only</AlertDescription>
        </Alert>
      )

      expect(screen.getByText('Description only')).toBeInTheDocument()
    })
  })
})
