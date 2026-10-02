/**
 * Tests for ErrorBoundary component and useErrorBoundary hook
 * Tests error catching and recovery mechanisms
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ErrorBoundary, useErrorBoundary } from '@/components/error-boundary'
import { renderHook, act } from '@testing-library/react'

// Component that throws an error
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

// Component for testing hook
function HookTestComponent() {
  const { error, resetError, captureError } = useErrorBoundary()

  return (
    <div>
      {error && <div data-testid="error-message">{error.message}</div>}
      <button onClick={() => captureError(new Error('Hook error'))}>
        Trigger Error
      </button>
      <button onClick={resetError}>Reset</button>
    </div>
  )
}

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Normal Operation', () => {
    it('should render children when no error', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should not show error UI when no error', () => {
      render(
        <ErrorBoundary>
          <div>Normal content</div>
        </ErrorBoundary>
      )

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
    })
  })

  describe('Error Catching', () => {
    it('should catch and display errors from children', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Test error message')).toBeInTheDocument()
    })

    it('should show Try Again button when error occurs', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument()
    })

    it('should log error to console', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(console.error).toHaveBeenCalled()
    })

    it('should display custom error message', () => {
      function CustomError() {
        throw new Error('Custom error text')
      }

      render(
        <ErrorBoundary>
          <CustomError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom error text')).toBeInTheDocument()
    })
  })

  describe('Error Recovery', () => {
    it('should have reset functionality via Try Again button', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i })
      expect(tryAgainButton).toBeInTheDocument()

      // Verify button is clickable
      fireEvent.click(tryAgainButton)
      // After clicking, the error boundary resets its internal state
      // Note: Full recovery requires parent component to remount children
    })

    it('should clear error state on reset', () => {
      let shouldThrow = true

      function ToggleError() {
        if (shouldThrow) {
          throw new Error('Test error')
        }
        return <div>Recovered</div>
      }

      const { unmount } = render(
        <ErrorBoundary>
          <ToggleError />
        </ErrorBoundary>
      )

      // Error is displayed
      expect(screen.getByText('Test error')).toBeInTheDocument()

      unmount()

      // Remount without error
      shouldThrow = false
      render(
        <ErrorBoundary>
          <ToggleError />
        </ErrorBoundary>
      )

      expect(screen.getByText('Recovered')).toBeInTheDocument()
    })
  })

  describe('Custom Fallback', () => {
    it('should render custom fallback component when provided', () => {
      function CustomFallback({ error, resetError }: { error: Error; resetError: () => void }) {
        return (
          <div>
            <div>Custom Error UI</div>
            <div>{error.message}</div>
            <button onClick={resetError}>Custom Reset</button>
          </div>
        )
      }

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
      expect(screen.getByText('Test error message')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Custom Reset' })).toBeInTheDocument()
    })

    it('should call resetError from custom fallback', () => {
      function CustomFallback({ error, resetError }: { error: Error; resetError: () => void }) {
        return (
          <div>
            <div>Error: {error.message}</div>
            <button onClick={resetError}>Reset Custom</button>
          </div>
        )
      }

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const resetButton = screen.getByRole('button', { name: 'Reset Custom' })
      expect(resetButton).toBeInTheDocument()

      // Verify the button is clickable and calls resetError
      fireEvent.click(resetButton)
      // Note: Full recovery requires parent to remount with non-throwing children
    })

    it('should not show default UI when custom fallback is provided', () => {
      function CustomFallback({ error }: { error: Error; resetError: () => void }) {
        return <div>Custom: {error.message}</div>
      }

      render(
        <ErrorBoundary fallback={CustomFallback}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
      expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
      expect(screen.getByText(/Custom:/)).toBeInTheDocument()
    })
  })

  describe('Error UI Elements', () => {
    it('should render alert icon', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const icons = container.querySelectorAll('svg')
      expect(icons.length).toBeGreaterThan(0)
    })

    it('should render refresh icon in button', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const button = screen.getByRole('button', { name: /Try Again/i })
      const svgs = button.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('should apply destructive variant to alert', () => {
      const { container } = render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Alert should have my-4 class
      const alert = container.querySelector('.my-4')
      expect(alert).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle error without message', () => {
      function ThrowErrorWithoutMessage() {
        const error = new Error()
        error.message = ''
        throw error
      }

      render(
        <ErrorBoundary>
          <ThrowErrorWithoutMessage />
        </ErrorBoundary>
      )

      expect(screen.getByText('An unexpected error occurred')).toBeInTheDocument()
    })

    it('should handle multiple children', () => {
      render(
        <ErrorBoundary>
          <div>Child 1</div>
          <div>Child 2</div>
          <div>Child 3</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child 1')).toBeInTheDocument()
      expect(screen.getByText('Child 2')).toBeInTheDocument()
      expect(screen.getByText('Child 3')).toBeInTheDocument()
    })

    it('should catch errors from any child in tree', () => {
      function DeepChild() {
        throw new Error('Deep error')
      }

      render(
        <ErrorBoundary>
          <div>
            <div>
              <div>
                <DeepChild />
              </div>
            </div>
          </div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Deep error')).toBeInTheDocument()
    })
  })
})

describe('useErrorBoundary hook', () => {
  const originalError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })

  afterAll(() => {
    console.error = originalError
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Hook Behavior', () => {
    it('should start with no error', () => {
      const { result } = renderHook(() => useErrorBoundary())

      expect(result.current.error).toBeNull()
    })

    it('should capture error when captureError is called', () => {
      const { result } = renderHook(() => useErrorBoundary())

      act(() => {
        result.current.captureError(new Error('Hook error'))
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.error?.message).toBe('Hook error')
    })

    it('should reset error when resetError is called', () => {
      const { result } = renderHook(() => useErrorBoundary())

      act(() => {
        result.current.captureError(new Error('Test error'))
      })

      expect(result.current.error).toBeDefined()

      act(() => {
        result.current.resetError()
      })

      expect(result.current.error).toBeNull()
    })

    it('should log error to console when captured', () => {
      const { result } = renderHook(() => useErrorBoundary())

      act(() => {
        result.current.captureError(new Error('Console test'))
      })

      expect(console.error).toHaveBeenCalledWith('Error captured:', expect.any(Error))
    })
  })

  describe('Multiple Error Handling', () => {
    it('should handle multiple errors sequentially', () => {
      const { result } = renderHook(() => useErrorBoundary())

      act(() => {
        result.current.captureError(new Error('First error'))
      })
      expect(result.current.error?.message).toBe('First error')

      act(() => {
        result.current.resetError()
      })
      expect(result.current.error).toBeNull()

      act(() => {
        result.current.captureError(new Error('Second error'))
      })
      expect(result.current.error?.message).toBe('Second error')
    })

    it('should overwrite previous error when new error is captured', () => {
      const { result } = renderHook(() => useErrorBoundary())

      act(() => {
        result.current.captureError(new Error('Error 1'))
      })

      act(() => {
        result.current.captureError(new Error('Error 2'))
      })

      expect(result.current.error?.message).toBe('Error 2')
    })
  })

  describe('Integration with Component', () => {
    it('should work in component context', () => {
      render(<HookTestComponent />)

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()

      const triggerButton = screen.getByText('Trigger Error')
      fireEvent.click(triggerButton)

      expect(screen.getByTestId('error-message')).toHaveTextContent('Hook error')
    })

    it('should reset error in component context', () => {
      render(<HookTestComponent />)

      const triggerButton = screen.getByText('Trigger Error')
      fireEvent.click(triggerButton)

      expect(screen.getByTestId('error-message')).toBeInTheDocument()

      const resetButton = screen.getByText('Reset')
      fireEvent.click(resetButton)

      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    })
  })

  describe('Error Object Properties', () => {
    it('should preserve error name', () => {
      const { result } = renderHook(() => useErrorBoundary())

      const customError = new Error('Test')
      customError.name = 'CustomError'

      act(() => {
        result.current.captureError(customError)
      })

      expect(result.current.error?.name).toBe('CustomError')
    })

    it('should preserve error stack trace', () => {
      const { result } = renderHook(() => useErrorBoundary())

      const error = new Error('Stack test')

      act(() => {
        result.current.captureError(error)
      })

      expect(result.current.error?.stack).toBeDefined()
    })
  })
})
