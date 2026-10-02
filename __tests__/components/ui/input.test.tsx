/**
 * Tests for Input UI component
 * Tests standard HTML input element with custom styling
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  describe('Basic Rendering', () => {
    it('should render input element', () => {
      render(<Input />)

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Input />)

      const input = container.querySelector('[data-slot="input"]')
      expect(input).toBeInTheDocument()
    })

    it('should be an input element', () => {
      const { container } = render(<Input />)

      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
    })
  })

  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Input />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.type).toBe('text')
    })

    it('should accept type prop', () => {
      render(<Input type="email" />)

      const input = document.querySelector('input') as HTMLInputElement
      expect(input.type).toBe('email')
    })

    it('should support password type', () => {
      render(<Input type="password" />)

      const input = document.querySelector('input') as HTMLInputElement
      expect(input.type).toBe('password')
    })

    it('should support number type', () => {
      render(<Input type="number" />)

      const input = document.querySelector('input') as HTMLInputElement
      expect(input.type).toBe('number')
    })
  })

  describe('Value and User Input', () => {
    it('should accept and display value', () => {
      render(<Input value="Test value" readOnly />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('Test value')
    })

    it('should handle onChange events', () => {
      const handleChange = jest.fn()
      render(<Input onChange={handleChange} />)

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'New text' } })

      expect(handleChange).toHaveBeenCalled()
    })

    it('should update value on user input', () => {
      render(<Input defaultValue="Initial" />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Updated' } })

      expect(input.value).toBe('Updated')
    })
  })

  describe('Placeholder', () => {
    it('should display placeholder text', () => {
      render(<Input placeholder="Enter text..." />)

      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument()
    })

    it('should hide placeholder when value is present', () => {
      render(<Input placeholder="Enter text" value="Has value" readOnly />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('Has value')
      expect(input.placeholder).toBe('Enter text')
    })
  })

  describe('Disabled State', () => {
    it('should render disabled input', () => {
      render(<Input disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toBeDisabled()
    })

    it('should have disabled attribute', () => {
      render(<Input disabled />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('disabled')
    })

    it('should have disabled styling classes', () => {
      const { container } = render(<Input disabled />)

      const input = container.querySelector('input')
      expect(input).toHaveClass('disabled:opacity-50')
      expect(input).toHaveClass('disabled:pointer-events-none')
    })
  })

  describe('Read-only State', () => {
    it('should render read-only input', () => {
      render(<Input readOnly value="Read-only value" />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.readOnly).toBe(true)
    })

    it('should not allow editing when read-only', () => {
      render(<Input readOnly value="Original" />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      fireEvent.change(input, { target: { value: 'Changed' } })

      expect(input.value).toBe('Original')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Input className="custom-class" />)

      const input = container.querySelector('input')
      expect(input).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<Input className="w-64" />)

      const input = container.querySelector('input')
      expect(input).toHaveClass('w-64')
      expect(input).toHaveClass('rounded-md')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Input />)

      const input = container.querySelector('input')
      expect(input).toHaveClass('border')
      expect(input).toHaveClass('rounded-md')
      expect(input).toHaveClass('px-3')
      expect(input).toHaveClass('h-9')
    })
  })

  describe('HTML Attributes', () => {
    it('should support name attribute', () => {
      render(<Input name="username" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'username')
    })

    it('should support id attribute', () => {
      render(<Input id="my-input" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('id', 'my-input')
    })

    it('should support maxLength attribute', () => {
      render(<Input maxLength={50} />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('maxLength', '50')
    })

    it('should support required attribute', () => {
      render(<Input required />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('required')
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Input aria-label="Username input" />)

      expect(screen.getByLabelText('Username input')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(<Input aria-describedby="help-text" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('should support aria-invalid for validation', () => {
      const { container } = render(<Input aria-invalid="true" />)

      const input = container.querySelector('input')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveClass('aria-invalid:border-destructive')
    })

    it('should support aria-required', () => {
      render(<Input aria-required="true" />)

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Form Integration', () => {
    it('should work with form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Input name="email" defaultValue="test@example.com" />
          <button type="submit">Submit</button>
        </form>
      )

      const button = screen.getByRole('button', { name: 'Submit' })
      fireEvent.click(button)

      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should be part of form elements', () => {
      render(
        <form>
          <Input name="email" />
        </form>
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('name', 'email')
    })
  })

  describe('Focus and Blur', () => {
    it('should handle focus events', () => {
      const handleFocus = jest.fn()
      render(<Input onFocus={handleFocus} />)

      const input = screen.getByRole('textbox')
      fireEvent.focus(input)

      expect(handleFocus).toHaveBeenCalled()
    })

    it('should handle blur events', () => {
      const handleBlur = jest.fn()
      render(<Input onBlur={handleBlur} />)

      const input = screen.getByRole('textbox')
      fireEvent.blur(input)

      expect(handleBlur).toHaveBeenCalled()
    })

    it('should be focusable', () => {
      render(<Input />)

      const input = screen.getByRole('textbox')
      input.focus()

      expect(document.activeElement).toBe(input)
    })

    it('should have focus styling classes', () => {
      const { container } = render(<Input />)

      const input = container.querySelector('input')
      expect(input).toHaveClass('focus-visible:ring-ring/50')
      expect(input).toHaveClass('focus-visible:border-ring')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Input value="" readOnly />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('')
    })

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000)
      render(<Input value={longText} readOnly />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe(longText)
    })

    it('should handle special characters', () => {
      const specialText = '<script>alert("test")</script>'
      render(<Input value={specialText} readOnly />)

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe(specialText)
    })

    it('should handle numeric input', () => {
      render(<Input type="number" defaultValue="42" />)

      const input = document.querySelector('input') as HTMLInputElement
      expect(input.value).toBe('42')
    })
  })
})
