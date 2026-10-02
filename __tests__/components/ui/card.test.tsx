/**
 * Tests for Card UI components
 * Tests card container with header, content, and footer sections
 */

import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card element', () => {
      const { container } = render(<Card>Card content</Card>)

      const card = container.querySelector('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Card />)

      const card = container.querySelector('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it('should have card styling classes', () => {
      const { container } = render(<Card />)

      const card = container.querySelector('[data-slot="card"]')
      expect(card).toHaveClass('bg-card')
      expect(card).toHaveClass('text-card-foreground')
      expect(card).toHaveClass('flex')
      expect(card).toHaveClass('flex-col')
      expect(card).toHaveClass('gap-6')
      expect(card).toHaveClass('rounded-xl')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('py-6')
      expect(card).toHaveClass('shadow-sm')
    })

    it('should apply custom className', () => {
      const { container } = render(<Card className="custom-card">Card</Card>)

      const card = container.querySelector('[data-slot="card"]')
      expect(card).toHaveClass('custom-card')
    })

    it('should accept children', () => {
      render(<Card>Card content text</Card>)

      expect(screen.getByText('Card content text')).toBeInTheDocument()
    })
  })

  describe('CardHeader', () => {
    it('should render card header', () => {
      const { container } = render(<CardHeader>Header content</CardHeader>)

      const header = container.querySelector('[data-slot="card-header"]')
      expect(header).toBeInTheDocument()
    })

    it('should have header styling classes', () => {
      const { container } = render(<CardHeader />)

      const header = container.querySelector('[data-slot="card-header"]')
      expect(header).toHaveClass('grid')
      expect(header).toHaveClass('auto-rows-min')
      expect(header).toHaveClass('items-start')
      expect(header).toHaveClass('gap-2')
      expect(header).toHaveClass('px-6')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardHeader className="custom-header">Header</CardHeader>)

      const header = container.querySelector('[data-slot="card-header"]')
      expect(header).toHaveClass('custom-header')
    })

    it('should accept children', () => {
      render(<CardHeader>Header text</CardHeader>)

      expect(screen.getByText('Header text')).toBeInTheDocument()
    })
  })

  describe('CardTitle', () => {
    it('should render card title', () => {
      const { container } = render(<CardTitle>Card Title</CardTitle>)

      const title = container.querySelector('[data-slot="card-title"]')
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Card Title')
    })

    it('should have title styling classes', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)

      const title = container.querySelector('[data-slot="card-title"]')
      expect(title).toHaveClass('leading-none')
      expect(title).toHaveClass('font-semibold')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardTitle className="custom-title">Title</CardTitle>)

      const title = container.querySelector('[data-slot="card-title"]')
      expect(title).toHaveClass('custom-title')
    })

    it('should display text content', () => {
      render(<CardTitle>My Card Title</CardTitle>)

      expect(screen.getByText('My Card Title')).toBeInTheDocument()
    })
  })

  describe('CardDescription', () => {
    it('should render card description', () => {
      const { container } = render(<CardDescription>Description text</CardDescription>)

      const description = container.querySelector('[data-slot="card-description"]')
      expect(description).toBeInTheDocument()
    })

    it('should have description styling classes', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)

      const description = container.querySelector('[data-slot="card-description"]')
      expect(description).toHaveClass('text-muted-foreground')
      expect(description).toHaveClass('text-sm')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <CardDescription className="custom-description">Description</CardDescription>
      )

      const description = container.querySelector('[data-slot="card-description"]')
      expect(description).toHaveClass('custom-description')
    })

    it('should display text content', () => {
      render(<CardDescription>Card description text</CardDescription>)

      expect(screen.getByText('Card description text')).toBeInTheDocument()
    })
  })

  describe('CardAction', () => {
    it('should render card action', () => {
      const { container } = render(<CardAction>Action</CardAction>)

      const action = container.querySelector('[data-slot="card-action"]')
      expect(action).toBeInTheDocument()
    })

    it('should have action styling classes', () => {
      const { container } = render(<CardAction>Action</CardAction>)

      const action = container.querySelector('[data-slot="card-action"]')
      expect(action).toHaveClass('col-start-2')
      expect(action).toHaveClass('row-span-2')
      expect(action).toHaveClass('row-start-1')
      expect(action).toHaveClass('self-start')
      expect(action).toHaveClass('justify-self-end')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardAction className="custom-action">Action</CardAction>)

      const action = container.querySelector('[data-slot="card-action"]')
      expect(action).toHaveClass('custom-action')
    })

    it('should accept button children', () => {
      render(
        <CardAction>
          <button>Action Button</button>
        </CardAction>
      )

      expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument()
    })
  })

  describe('CardContent', () => {
    it('should render card content', () => {
      const { container } = render(<CardContent>Content</CardContent>)

      const content = container.querySelector('[data-slot="card-content"]')
      expect(content).toBeInTheDocument()
    })

    it('should have content styling classes', () => {
      const { container } = render(<CardContent>Content</CardContent>)

      const content = container.querySelector('[data-slot="card-content"]')
      expect(content).toHaveClass('px-6')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardContent className="custom-content">Content</CardContent>)

      const content = container.querySelector('[data-slot="card-content"]')
      expect(content).toHaveClass('custom-content')
    })

    it('should accept children', () => {
      render(
        <CardContent>
          <p>Main card content</p>
        </CardContent>
      )

      expect(screen.getByText('Main card content')).toBeInTheDocument()
    })
  })

  describe('CardFooter', () => {
    it('should render card footer', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)

      const footer = container.querySelector('[data-slot="card-footer"]')
      expect(footer).toBeInTheDocument()
    })

    it('should have footer styling classes', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)

      const footer = container.querySelector('[data-slot="card-footer"]')
      expect(footer).toHaveClass('flex')
      expect(footer).toHaveClass('items-center')
      expect(footer).toHaveClass('px-6')
    })

    it('should apply custom className', () => {
      const { container } = render(<CardFooter className="custom-footer">Footer</CardFooter>)

      const footer = container.querySelector('[data-slot="card-footer"]')
      expect(footer).toHaveClass('custom-footer')
    })

    it('should accept button children', () => {
      render(
        <CardFooter>
          <button>Save</button>
          <button>Cancel</button>
        </CardFooter>
      )

      expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
    })
  })

  describe('Complete Card Structure', () => {
    it('should render complete card', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Main content</CardContent>
          <CardFooter>Footer content</CardFooter>
        </Card>
      )

      const card = container.querySelector('[data-slot="card"]')
      const header = container.querySelector('[data-slot="card-header"]')
      const title = container.querySelector('[data-slot="card-title"]')
      const description = container.querySelector('[data-slot="card-description"]')
      const content = container.querySelector('[data-slot="card-content"]')
      const footer = container.querySelector('[data-slot="card-footer"]')

      expect(card).toBeInTheDocument()
      expect(header).toBeInTheDocument()
      expect(title).toHaveTextContent('Card Title')
      expect(description).toHaveTextContent('Card description')
      expect(content).toHaveTextContent('Main content')
      expect(footer).toHaveTextContent('Footer content')
    })

    it('should render card with header and action', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Description</CardDescription>
            <CardAction>
              <button>Edit</button>
            </CardAction>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      const action = container.querySelector('[data-slot="card-action"]')
      expect(action).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument()
    })

    it('should render card with only content', () => {
      render(
        <Card>
          <CardContent>Simple card content</CardContent>
        </Card>
      )

      expect(screen.getByText('Simple card content')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty card', () => {
      const { container } = render(<Card />)

      const card = container.querySelector('[data-slot="card"]')
      expect(card).toBeInTheDocument()
    })

    it('should handle empty header', () => {
      const { container } = render(<CardHeader />)

      const header = container.querySelector('[data-slot="card-header"]')
      expect(header).toBeInTheDocument()
    })

    it('should handle empty content', () => {
      const { container } = render(<CardContent />)

      const content = container.querySelector('[data-slot="card-content"]')
      expect(content).toBeInTheDocument()
    })

    it('should handle empty footer', () => {
      const { container } = render(<CardFooter />)

      const footer = container.querySelector('[data-slot="card-footer"]')
      expect(footer).toBeInTheDocument()
    })

    it('should handle card with only header', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title Only</CardTitle>
          </CardHeader>
        </Card>
      )

      expect(screen.getByText('Title Only')).toBeInTheDocument()
    })

    it('should handle card with only footer', () => {
      render(
        <Card>
          <CardFooter>Footer only</CardFooter>
        </Card>
      )

      expect(screen.getByText('Footer only')).toBeInTheDocument()
    })
  })
})
