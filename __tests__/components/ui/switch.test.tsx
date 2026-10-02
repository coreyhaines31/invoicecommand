/**
 * Tests for Switch UI component
 * Tests Radix UI switch (toggle) wrapper
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { Switch } from '@/components/ui/switch'

describe('Switch', () => {
  describe('Basic Rendering', () => {
    it('should render switch component', () => {
      const { container } = render(<Switch />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toBeInTheDocument()
    })

    it('should render switch thumb', () => {
      const { container } = render(<Switch />)

      const thumb = container.querySelector('[data-slot="switch-thumb"]')
      expect(thumb).toBeInTheDocument()
    })

    it('should render as button role', () => {
      render(<Switch />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })
  })

  describe('Checked State', () => {
    it('should render unchecked by default', () => {
      const { container } = render(<Switch />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    })

    it('should render checked when checked prop is true', () => {
      const { container } = render(<Switch checked={true} onCheckedChange={() => {}} />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveAttribute('data-state', 'checked')
    })

    it('should render unchecked when checked prop is false', () => {
      const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    })

    it('should toggle state on click', () => {
      const { container } = render(<Switch defaultChecked={false} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      const updatedSwitch = container.querySelector('[data-slot="switch"]')
      expect(updatedSwitch).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('User Interaction', () => {
    it('should call onCheckedChange when clicked', () => {
      const handleChange = jest.fn()
      render(<Switch onCheckedChange={handleChange} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledWith(true)
    })

    it('should call onCheckedChange with false when unchecking', () => {
      const handleChange = jest.fn()
      render(<Switch defaultChecked={true} onCheckedChange={handleChange} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledWith(false)
    })

    it('should handle multiple toggles', () => {
      const handleChange = jest.fn()
      render(<Switch onCheckedChange={handleChange} />)

      const switchElement = screen.getByRole('switch')

      fireEvent.click(switchElement) // Check
      fireEvent.click(switchElement) // Uncheck
      fireEvent.click(switchElement) // Check again

      expect(handleChange).toHaveBeenCalledTimes(3)
      expect(handleChange).toHaveBeenNthCalledWith(1, true)
      expect(handleChange).toHaveBeenNthCalledWith(2, false)
      expect(handleChange).toHaveBeenNthCalledWith(3, true)
    })
  })

  describe('Disabled State', () => {
    it('should render disabled switch', () => {
      render(<Switch disabled />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
    })

    it('should not toggle when disabled', () => {
      const handleChange = jest.fn()
      render(<Switch disabled onCheckedChange={handleChange} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      expect(handleChange).not.toHaveBeenCalled()
    })

    it('should have disabled styling classes', () => {
      const { container } = render(<Switch disabled />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveClass('disabled:opacity-50')
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Switch className="custom-class" />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<Switch className="ml-2" />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveClass('ml-2')
      expect(switchElement).toHaveClass('inline-flex')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Switch />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveClass('inline-flex')
      expect(switchElement).toHaveClass('items-center')
      expect(switchElement).toHaveClass('rounded-full')
    })
  })

  describe('Accessibility', () => {
    it('should have switch role', () => {
      render(<Switch />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toBeInTheDocument()
    })

    it('should support aria-label', () => {
      render(<Switch aria-label="Toggle feature" />)

      expect(screen.getByLabelText('Toggle feature')).toBeInTheDocument()
    })

    it('should support aria-labelledby', () => {
      render(<Switch aria-labelledby="switch-label" />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-labelledby', 'switch-label')
    })

    it('should support aria-describedby', () => {
      render(<Switch aria-describedby="switch-description" />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-describedby', 'switch-description')
    })

    it('should have aria-checked attribute', () => {
      render(<Switch checked={true} onCheckedChange={() => {}} />)

      const switchElement = screen.getByRole('switch')
      expect(switchElement).toHaveAttribute('aria-checked', 'true')
    })
  })

  describe('Keyboard Interaction', () => {
    it('should be focusable', () => {
      render(<Switch />)

      const switchElement = screen.getByRole('switch')
      switchElement.focus()

      expect(document.activeElement).toBe(switchElement)
    })
  })

  describe('State Classes', () => {
    it('should apply checked state classes', () => {
      const { container } = render(<Switch checked={true} onCheckedChange={() => {}} />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveClass('data-[state=checked]:bg-primary')
    })

    it('should apply unchecked state classes', () => {
      const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input')
    })
  })

  describe('Thumb Animation', () => {
    it('should have transform transition classes on thumb', () => {
      const { container } = render(<Switch />)

      const thumb = container.querySelector('[data-slot="switch-thumb"]')
      expect(thumb).toHaveClass('transition-transform')
    })

    it('should apply translate classes for checked state', () => {
      const { container } = render(<Switch checked={true} onCheckedChange={() => {}} />)

      const thumb = container.querySelector('[data-slot="switch-thumb"]')
      expect(thumb).toHaveClass('data-[state=checked]:translate-x-[calc(100%-2px)]')
    })

    it('should apply translate classes for unchecked state', () => {
      const { container } = render(<Switch checked={false} onCheckedChange={() => {}} />)

      const thumb = container.querySelector('[data-slot="switch-thumb"]')
      expect(thumb).toHaveClass('data-[state=unchecked]:translate-x-0')
    })
  })

  describe('defaultChecked Prop', () => {
    it('should initialize with defaultChecked true', () => {
      const { container } = render(<Switch defaultChecked={true} />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveAttribute('data-state', 'checked')
    })

    it('should initialize with defaultChecked false', () => {
      const { container } = render(<Switch defaultChecked={false} />)

      const switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveAttribute('data-state', 'unchecked')
    })

    it('should allow uncontrolled state changes with defaultChecked', () => {
      const { container } = render(<Switch defaultChecked={false} />)

      const switchElement = screen.getByRole('switch')
      fireEvent.click(switchElement)

      const updatedSwitch = container.querySelector('[data-slot="switch"]')
      expect(updatedSwitch).toHaveAttribute('data-state', 'checked')
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid toggling', () => {
      const handleChange = jest.fn()
      render(<Switch onCheckedChange={handleChange} />)

      const switchElement = screen.getByRole('switch')

      // Rapid clicks
      fireEvent.click(switchElement)
      fireEvent.click(switchElement)
      fireEvent.click(switchElement)
      fireEvent.click(switchElement)

      expect(handleChange).toHaveBeenCalledTimes(4)
    })

    it('should maintain disabled state across renders', () => {
      const { rerender } = render(<Switch disabled />)

      let switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()

      rerender(<Switch disabled />)

      switchElement = screen.getByRole('switch')
      expect(switchElement).toBeDisabled()
    })

    it('should handle controlled to uncontrolled transition', () => {
      const { rerender, container } = render(<Switch checked={true} onCheckedChange={() => {}} />)

      let switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toHaveAttribute('data-state', 'checked')

      rerender(<Switch />)

      switchElement = container.querySelector('[data-slot="switch"]')
      expect(switchElement).toBeInTheDocument()
    })
  })
})
