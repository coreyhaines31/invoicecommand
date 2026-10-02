/**
 * Tests for InvoicePreview component
 * Tests style-based preview component rendering
 */

import { render, screen } from '@testing-library/react'
import { InvoicePreview } from '@/components/invoice-preview'

// Mock the store
let mockStyle: 'modern' | 'classic' | 'minimal' = 'modern'
jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: () => ({
    style: mockStyle,
  }),
}))

// Mock the preview components
jest.mock('@/components/invoice-preview-modern', () => ({
  InvoicePreviewModern: () => <div data-testid="modern-preview">Modern Preview</div>,
}))

jest.mock('@/components/invoice-preview-classic', () => ({
  InvoicePreviewClassic: () => <div data-testid="classic-preview">Classic Preview</div>,
}))

jest.mock('@/components/invoice-preview-minimal', () => ({
  InvoicePreviewMinimal: () => <div data-testid="minimal-preview">Minimal Preview</div>,
}))

describe('InvoicePreview', () => {
  beforeEach(() => {
    mockStyle = 'modern'
  })

  describe('Style Rendering', () => {
    it('should render modern preview by default', () => {
      render(<InvoicePreview />)

      expect(screen.getByTestId('modern-preview')).toBeInTheDocument()
      expect(screen.getByText('Modern Preview')).toBeInTheDocument()
    })

    it('should render modern preview when style is modern', () => {
      mockStyle = 'modern'
      render(<InvoicePreview />)

      expect(screen.getByTestId('modern-preview')).toBeInTheDocument()
      expect(screen.queryByTestId('classic-preview')).not.toBeInTheDocument()
      expect(screen.queryByTestId('minimal-preview')).not.toBeInTheDocument()
    })

    it('should render classic preview when style is classic', () => {
      mockStyle = 'classic'
      render(<InvoicePreview />)

      expect(screen.getByTestId('classic-preview')).toBeInTheDocument()
      expect(screen.queryByTestId('modern-preview')).not.toBeInTheDocument()
      expect(screen.queryByTestId('minimal-preview')).not.toBeInTheDocument()
    })

    it('should render minimal preview when style is minimal', () => {
      mockStyle = 'minimal'
      render(<InvoicePreview />)

      expect(screen.getByTestId('minimal-preview')).toBeInTheDocument()
      expect(screen.queryByTestId('modern-preview')).not.toBeInTheDocument()
      expect(screen.queryByTestId('classic-preview')).not.toBeInTheDocument()
    })
  })

  describe('Default Fallback', () => {
    it('should fall back to modern preview for invalid style', () => {
      mockStyle = 'invalid-style' as any
      render(<InvoicePreview />)

      expect(screen.getByTestId('modern-preview')).toBeInTheDocument()
      expect(screen.getByText('Modern Preview')).toBeInTheDocument()
    })

    it('should fall back to modern preview for undefined style', () => {
      mockStyle = undefined as any
      render(<InvoicePreview />)

      expect(screen.getByTestId('modern-preview')).toBeInTheDocument()
    })

    it('should fall back to modern preview for null style', () => {
      mockStyle = null as any
      render(<InvoicePreview />)

      expect(screen.getByTestId('modern-preview')).toBeInTheDocument()
    })
  })

  describe('Component Integration', () => {
    it('should only render one preview at a time', () => {
      mockStyle = 'modern'
      const { container } = render(<InvoicePreview />)

      const previews = container.querySelectorAll('[data-testid$="-preview"]')
      expect(previews.length).toBe(1)
    })

    it('should switch between previews based on store state', () => {
      mockStyle = 'modern'
      const { rerender } = render(<InvoicePreview />)
      expect(screen.getByTestId('modern-preview')).toBeInTheDocument()

      mockStyle = 'classic'
      rerender(<InvoicePreview />)
      expect(screen.getByTestId('classic-preview')).toBeInTheDocument()

      mockStyle = 'minimal'
      rerender(<InvoicePreview />)
      expect(screen.getByTestId('minimal-preview')).toBeInTheDocument()
    })
  })

  describe('Rendering Stability', () => {
    it('should not crash when rendering modern', () => {
      mockStyle = 'modern'
      expect(() => render(<InvoicePreview />)).not.toThrow()
    })

    it('should not crash when rendering classic', () => {
      mockStyle = 'classic'
      expect(() => render(<InvoicePreview />)).not.toThrow()
    })

    it('should not crash when rendering minimal', () => {
      mockStyle = 'minimal'
      expect(() => render(<InvoicePreview />)).not.toThrow()
    })
  })
})
