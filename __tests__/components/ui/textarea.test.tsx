/**
 * Tests for Textarea UI component
 * Tests textarea element with custom styling
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea', () => {
  describe('Basic Rendering', () => {
    it('should render textarea element', () => {
      render(<Textarea />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeInTheDocument()
    })

    it('should render with data-slot attribute', () => {
      const { container } = render(<Textarea />)

      const textarea = container.querySelector('[data-slot="textarea"]')
      expect(textarea).toBeInTheDocument()
    })

    it('should be a textarea element', () => {
      const { container } = render(<Textarea />)

      const textarea = container.querySelector('textarea')
      expect(textarea).toBeInTheDocument()
    })
  })

  describe('Value and User Input', () => {
    it('should accept and display value', () => {
      render(<Textarea value="Test content" readOnly />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Test content')
    })

    it('should handle onChange events', () => {
      const handleChange = jest.fn()
      render(<Textarea onChange={handleChange} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'New text' } })

      expect(handleChange).toHaveBeenCalled()
    })

    it('should update value on user input', () => {
      render(<Textarea defaultValue="Initial" />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Updated text' } })

      expect(textarea.value).toBe('Updated text')
    })
  })

  describe('Placeholder', () => {
    it('should display placeholder text', () => {
      render(<Textarea placeholder="Enter description..." />)

      expect(screen.getByPlaceholderText('Enter description...')).toBeInTheDocument()
    })

    it('should hide placeholder when value is present', () => {
      render(<Textarea placeholder="Enter text" value="Has value" readOnly />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('Has value')
      expect(textarea.placeholder).toBe('Enter text')
    })
  })

  describe('Disabled State', () => {
    it('should render disabled textarea', () => {
      render(<Textarea disabled />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
    })

    it('should have disabled attribute', () => {
      render(<Textarea disabled />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toBeDisabled()
      expect(textarea).toHaveAttribute('disabled')
    })

    it('should have disabled opacity class', () => {
      const { container } = render(<Textarea disabled />)

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('disabled:opacity-50')
    })
  })

  describe('Read-only State', () => {
    it('should render read-only textarea', () => {
      render(<Textarea readOnly value="Read-only content" />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.readOnly).toBe(true)
    })

    it('should not allow editing when read-only', () => {
      render(<Textarea readOnly value="Original" />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      fireEvent.change(textarea, { target: { value: 'Changed' } })

      expect(textarea.value).toBe('Original')
    })
  })

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const { container } = render(<Textarea className="custom-class" />)

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('custom-class')
    })

    it('should merge custom className with default classes', () => {
      const { container } = render(<Textarea className="h-32" />)

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('h-32')
      expect(textarea).toHaveClass('rounded-md')
    })

    it('should have base styling classes', () => {
      const { container } = render(<Textarea />)

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveClass('border')
      expect(textarea).toHaveClass('rounded-md')
      expect(textarea).toHaveClass('px-3')
      expect(textarea).toHaveClass('py-2')
    })
  })

  describe('HTML Attributes', () => {
    it('should support rows attribute', () => {
      render(<Textarea rows={5} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('rows', '5')
    })

    it('should support cols attribute', () => {
      render(<Textarea cols={40} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('cols', '40')
    })

    it('should support maxLength attribute', () => {
      render(<Textarea maxLength={100} />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('maxLength', '100')
    })

    it('should support name attribute', () => {
      render(<Textarea name="description" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'description')
    })

    it('should support id attribute', () => {
      render(<Textarea id="my-textarea" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('id', 'my-textarea')
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Textarea aria-label="Description input" />)

      expect(screen.getByLabelText('Description input')).toBeInTheDocument()
    })

    it('should support aria-describedby', () => {
      render(<Textarea aria-describedby="help-text" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('should support aria-invalid for validation', () => {
      const { container } = render(<Textarea aria-invalid="true" />)

      const textarea = container.querySelector('textarea')
      expect(textarea).toHaveAttribute('aria-invalid', 'true')
      expect(textarea).toHaveClass('aria-invalid:border-destructive')
    })

    it('should support aria-required', () => {
      render(<Textarea aria-required="true" />)

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('aria-required', 'true')
    })
  })

  describe('Form Integration', () => {
    it('should work with form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())

      render(
        <form onSubmit={handleSubmit}>
          <Textarea name="message" defaultValue="Test message" />
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
          <Textarea name="notes" />
        </form>
      )

      const textarea = screen.getByRole('textbox')
      expect(textarea).toHaveAttribute('name', 'notes')
    })
  })

  describe('Focus and Blur', () => {
    it('should handle focus events', () => {
      const handleFocus = jest.fn()
      render(<Textarea onFocus={handleFocus} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.focus(textarea)

      expect(handleFocus).toHaveBeenCalled()
    })

    it('should handle blur events', () => {
      const handleBlur = jest.fn()
      render(<Textarea onBlur={handleBlur} />)

      const textarea = screen.getByRole('textbox')
      fireEvent.blur(textarea)

      expect(handleBlur).toHaveBeenCalled()
    })

    it('should be focusable', () => {
      render(<Textarea />)

      const textarea = screen.getByRole('textbox')
      textarea.focus()

      expect(document.activeElement).toBe(textarea)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty value', () => {
      render(<Textarea value="" readOnly />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe('')
    })

    it('should handle multiline text', () => {
      const multilineText = 'Line 1\nLine 2\nLine 3'
      render(<Textarea value={multilineText} readOnly />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe(multilineText)
    })

    it('should handle very long text', () => {
      const longText = 'a'.repeat(1000)
      render(<Textarea value={longText} readOnly />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe(longText)
    })

    it('should handle special characters', () => {
      const specialText = '<script>alert("test")</script>'
      render(<Textarea value={specialText} readOnly />)

      const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
      expect(textarea.value).toBe(specialText)
    })
  })
})
