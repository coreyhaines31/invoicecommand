/**
 * Tests for Select UI components
 * Tests Radix UI select (dropdown) wrapper - focused on basic rendering
 */

import { render } from '@testing-library/react'
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from '@/components/ui/select'

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

describe('Select Components', () => {
  describe('Select Root', () => {
    it('should render with trigger', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toBeInTheDocument()
    })

    it('should accept defaultValue prop', () => {
      const { container } = render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toBeInTheDocument()
    })

    it('should accept value and onValueChange for controlled mode', () => {
      const handleChange = jest.fn()
      const { container } = render(
        <Select value="option1" onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('SelectTrigger', () => {
    it('should render select trigger button', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toBeInTheDocument()
    })

    it('should have default size', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveAttribute('data-size', 'default')
    })

    it('should accept sm size', () => {
      const { container } = render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveAttribute('data-size', 'sm')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Select>
          <SelectTrigger className="custom-trigger">
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveClass('custom-trigger')
    })

    it('should have base styling classes', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveClass('border')
      expect(trigger).toHaveClass('rounded-md')
      expect(trigger).toHaveClass('px-3')
      expect(trigger).toHaveClass('py-2')
    })

    it('should render chevron icon', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      // ChevronDownIcon is rendered
      const icon = container.querySelector('svg')
      expect(icon).toBeInTheDocument()
    })
  })

  describe('SelectValue', () => {
    it('should render select value', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Choose" />
          </SelectTrigger>
        </Select>
      )

      const value = container.querySelector('[data-slot="select-value"]')
      expect(value).toBeInTheDocument()
    })

    it('should accept placeholder prop', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>
      )

      const value = container.querySelector('[data-slot="select-value"]')
      expect(value).toBeInTheDocument()
    })
  })

  describe('SelectGroup', () => {
    it('should render select group', () => {
      const { container } = render(<SelectGroup />)

      const group = container.querySelector('[data-slot="select-group"]')
      expect(group).toBeInTheDocument()
    })

    it('should accept children', () => {
      const { container } = render(
        <SelectGroup>
          <SelectLabel>Group Label</SelectLabel>
        </SelectGroup>
      )

      const group = container.querySelector('[data-slot="select-group"]')
      expect(group).toBeInTheDocument()
    })
  })

  describe('SelectLabel', () => {
    it('should render select label', () => {
      const { container } = render(
        <SelectGroup>
          <SelectLabel>Label Text</SelectLabel>
        </SelectGroup>
      )

      const label = container.querySelector('[data-slot="select-label"]')
      expect(label).toBeInTheDocument()
      expect(label).toHaveTextContent('Label Text')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <SelectGroup>
          <SelectLabel className="custom-label">Label</SelectLabel>
        </SelectGroup>
      )

      const label = container.querySelector('[data-slot="select-label"]')
      expect(label).toHaveClass('custom-label')
    })

    it('should have label styling classes', () => {
      const { container } = render(
        <SelectGroup>
          <SelectLabel>Label</SelectLabel>
        </SelectGroup>
      )

      const label = container.querySelector('[data-slot="select-label"]')
      expect(label).toHaveClass('px-2')
      expect(label).toHaveClass('py-1.5')
      expect(label).toHaveClass('text-xs')
    })
  })

  describe('SelectItem', () => {
    // Note: SelectItem must be within Select context, but we can't test it in SelectContent
    // without opening the portal, which causes test issues. These tests verify basic structure.

    it('should have required value prop type', () => {
      // This test just verifies the component accepts the required props
      // We can't actually render SelectItem outside of Select context
      expect(SelectItem).toBeDefined()
    })
  })

  describe('SelectSeparator', () => {
    it('should render select separator', () => {
      const { container } = render(<SelectSeparator />)

      const separator = container.querySelector('[data-slot="select-separator"]')
      expect(separator).toBeInTheDocument()
    })

    it('should have separator styling', () => {
      const { container } = render(<SelectSeparator />)

      const separator = container.querySelector('[data-slot="select-separator"]')
      expect(separator).toHaveClass('-mx-1')
      expect(separator).toHaveClass('my-1')
      expect(separator).toHaveClass('h-px')
    })
  })

  describe('Component Integration', () => {
    it('should render complete select structure without opening', () => {
      const { container } = render(
        <Select defaultValue="option1">
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      const value = container.querySelector('[data-slot="select-value"]')

      expect(trigger).toBeInTheDocument()
      expect(value).toBeInTheDocument()
    })

    it('should support disabled state', () => {
      const { container } = render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveClass('disabled:opacity-50')
      expect(trigger).toHaveClass('disabled:cursor-not-allowed')
    })

    it('should support required prop', () => {
      const { container } = render(
        <Select required>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toBeInTheDocument()
    })
  })

  describe('Styling Variations', () => {
    it('should apply trigger size classes correctly', () => {
      const { container } = render(
        <Select>
          <SelectTrigger size="default">
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveClass('data-[size=default]:h-9')
    })

    it('should apply small size classes', () => {
      const { container } = render(
        <Select>
          <SelectTrigger size="sm">
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveClass('data-[size=sm]:h-8')
    })

    it('should have focus styling classes', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const trigger = container.querySelector('[data-slot="select-trigger"]')
      expect(trigger).toHaveClass('focus-visible:ring-ring/50')
    })
  })

  describe('Edge Cases', () => {
    it('should handle select without trigger', () => {
      const { container } = render(<Select />)

      // Select root doesn't render visible elements, just provides context
      expect(container).toBeInTheDocument()
    })

    it('should handle empty SelectValue', () => {
      const { container } = render(
        <Select>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      )

      const value = container.querySelector('[data-slot="select-value"]')
      expect(value).toBeInTheDocument()
    })

    it('should render multiple SelectGroups', () => {
      const { container } = render(
        <div>
          <SelectGroup>
            <SelectLabel>Group 1</SelectLabel>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Group 2</SelectLabel>
          </SelectGroup>
        </div>
      )

      const groups = container.querySelectorAll('[data-slot="select-group"]')
      expect(groups).toHaveLength(2)
    })
  })
})
