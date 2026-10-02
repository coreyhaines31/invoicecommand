/**
 * Tests for PostHog provider component
 * Tests PostHog initialization and page tracking
 */

import { render, waitFor } from '@testing-library/react'
import { PostHogProvider } from '@/components/providers/posthog-provider'

// Mock Next.js navigation
const mockPathname = jest.fn()
const mockSearchParams = jest.fn()

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useSearchParams: () => ({
    toString: () => mockSearchParams(),
  }),
}))

// Mock PostHog
jest.mock('@/lib/posthog', () => ({
  initPostHog: jest.fn(),
  posthog: {
    capture: jest.fn(),
  },
}))

describe('PostHogProvider', () => {
  const originalWindow = global.window
  let mockInitPostHog: jest.Mock
  let mockPostHogCapture: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()

    // Get mocked functions
    const { initPostHog, posthog } = require('@/lib/posthog')
    mockInitPostHog = initPostHog as jest.Mock
    mockPostHogCapture = posthog.capture as jest.Mock

    mockPathname.mockReturnValue('/dashboard')
    mockSearchParams.mockReturnValue('')

    // Mock window.origin
    Object.defineProperty(global.window, 'origin', {
      writable: true,
      value: 'https://invoicecommand.com',
    })
  })

  afterEach(() => {
    global.window = originalWindow
  })

  describe('Initialization', () => {
    it('should initialize PostHog on mount', async () => {
      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockInitPostHog).toHaveBeenCalled()
      })
    })

    it('should initialize PostHog only once', async () => {
      const { rerender } = render(<PostHogProvider />)

      rerender(<PostHogProvider />)

      await waitFor(() => {
        expect(mockInitPostHog).toHaveBeenCalledTimes(1)
      })
    })

    it('should render without errors', () => {
      const { container } = render(<PostHogProvider />)
      expect(container).toBeInTheDocument()
    })
  })

  describe('Page Tracking', () => {
    it('should track pageview on mount', async () => {
      mockPathname.mockReturnValue('/dashboard')
      mockSearchParams.mockReturnValue('')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/dashboard',
        })
      })
    })

    it('should track pageview with query parameters', async () => {
      mockPathname.mockReturnValue('/invoices')
      mockSearchParams.mockReturnValue('id=123&view=preview')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/invoices?id=123&view=preview',
        })
      })
    })

    it('should track pageview on pathname change', async () => {
      mockPathname.mockReturnValue('/dashboard')
      mockSearchParams.mockReturnValue('')

      const { rerender } = render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/dashboard',
        })
      })

      mockPostHogCapture.mockClear()
      mockPathname.mockReturnValue('/settings')

      rerender(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/settings',
        })
      })
    })

    it('should track pageview on search params change', async () => {
      mockPathname.mockReturnValue('/invoices')
      mockSearchParams.mockReturnValue('')

      const { rerender } = render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalled()
      })

      mockPostHogCapture.mockClear()
      mockSearchParams.mockReturnValue('filter=paid')

      rerender(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/invoices?filter=paid',
        })
      })
    })

    it('should use window origin for URL construction', async () => {
      Object.defineProperty(global.window, 'origin', {
        writable: true,
        value: 'http://localhost:3005',
      })

      mockPathname.mockReturnValue('/test')
      mockSearchParams.mockReturnValue('')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'http://localhost:3005/test',
        })
      })
    })

    it('should handle root path', async () => {
      mockPathname.mockReturnValue('/')
      mockSearchParams.mockReturnValue('')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/',
        })
      })
    })

    it('should handle empty search params', async () => {
      mockPathname.mockReturnValue('/dashboard')
      mockSearchParams.mockReturnValue('')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/dashboard',
        })
      })
    })
  })

  describe('Suspense Fallback', () => {
    it('should wrap page tracker in Suspense', () => {
      const { container } = render(<PostHogProvider />)
      expect(container).toBeInTheDocument()
    })

    it('should not render visible content', () => {
      const { container } = render(<PostHogProvider />)
      expect(container.textContent).toBe('')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null pathname', async () => {
      mockPathname.mockReturnValue(null)
      mockSearchParams.mockReturnValue('')

      render(<PostHogProvider />)

      // Should not crash, but also not track
      await waitFor(() => {
        expect(mockInitPostHog).toHaveBeenCalled()
      })
    })

    it('should handle complex query strings', async () => {
      mockPathname.mockReturnValue('/search')
      mockSearchParams.mockReturnValue('q=test&category=invoice&sort=date&order=desc')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/search?q=test&category=invoice&sort=date&order=desc',
        })
      })
    })

    it('should handle special characters in pathname', async () => {
      mockPathname.mockReturnValue('/invoices/INV-2024-001')
      mockSearchParams.mockReturnValue('')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/invoices/INV-2024-001',
        })
      })
    })

    it('should handle URL encoded parameters', async () => {
      mockPathname.mockReturnValue('/search')
      mockSearchParams.mockReturnValue('q=hello%20world')

      render(<PostHogProvider />)

      await waitFor(() => {
        expect(mockPostHogCapture).toHaveBeenCalledWith('$pageview', {
          $current_url: 'https://invoicecommand.com/search?q=hello%20world',
        })
      })
    })
  })
})
