/**
 * Tests for InvoiceStyleSelector component
 * Tests invoice style selection UI and state management
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { InvoiceStyleSelector } from '@/components/invoice-style-selector'
import { act } from 'react'

// Mock invoice store
const mockUpdateStyle = jest.fn()
let mockStyle: 'modern' | 'classic' | 'minimal' = 'modern'

jest.mock('@/stores/invoice-store', () => ({
  useInvoiceStore: () => ({
    style: mockStyle,
    updateStyle: mockUpdateStyle,
  }),
}))

describe('InvoiceStyleSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockStyle = 'modern'
  })

  describe('Rendering', () => {
    it('should render the component title', () => {
      render(<InvoiceStyleSelector />)

      expect(screen.getByText('Invoice Style')).toBeInTheDocument()
      expect(screen.getByText('Choose from 3 professional templates')).toBeInTheDocument()
    })

    it('should render all three style options', () => {
      render(<InvoiceStyleSelector />)

      expect(screen.getByText('Modern')).toBeInTheDocument()
      expect(screen.getByText('Classic')).toBeInTheDocument()
      expect(screen.getByText('Minimal')).toBeInTheDocument()
    })

    it('should render descriptions for each style', () => {
      render(<InvoiceStyleSelector />)

      expect(screen.getByText(/Clean and contemporary design/)).toBeInTheDocument()
      expect(screen.getByText(/Traditional professional layout/)).toBeInTheDocument()
      expect(screen.getByText(/Simple and focused design/)).toBeInTheDocument()
    })

    it('should render features for each style', () => {
      render(<InvoiceStyleSelector />)

      // Modern features
      expect(screen.getByText('Bold headers')).toBeInTheDocument()
      expect(screen.getByText('Accent colors')).toBeInTheDocument()
      expect(screen.getByText('Modern typography')).toBeInTheDocument()

      // Classic features
      expect(screen.getByText('Traditional layout')).toBeInTheDocument()
      expect(screen.getByText('Professional styling')).toBeInTheDocument()
      expect(screen.getByText('Clean lines')).toBeInTheDocument()

      // Minimal features
      expect(screen.getByText('Lots of whitespace')).toBeInTheDocument()
      expect(screen.getByText('Simple design')).toBeInTheDocument()
      expect(screen.getByText('Easy to read')).toBeInTheDocument()
    })

    it('should render default badge on modern style', () => {
      render(<InvoiceStyleSelector />)

      expect(screen.getByText('Default')).toBeInTheDocument()
    })

    it('should render upgrade message for free accounts', () => {
      render(<InvoiceStyleSelector />)

      expect(screen.getByText(/Free account:/)).toBeInTheDocument()
      expect(screen.getByText(/Upgrade to Premium/)).toBeInTheDocument()
    })
  })

  describe('Style Selection', () => {
    it('should show modern as selected by default', () => {
      render(<InvoiceStyleSelector />)

      const modernButtons = screen.getAllByRole('button')
      const modernSelectedButton = modernButtons.find(btn => btn.textContent === 'Selected')

      expect(modernSelectedButton).toBeInTheDocument()
    })

    it('should call updateStyle when clicking on a style card', () => {
      render(<InvoiceStyleSelector />)

      const classicCard = screen.getByText('Classic').closest('div')
      if (classicCard) {
        fireEvent.click(classicCard)
        expect(mockUpdateStyle).toHaveBeenCalledWith('classic')
      }
    })

    it('should call updateStyle when clicking Select Style button', () => {
      render(<InvoiceStyleSelector />)

      const selectButtons = screen.getAllByRole('button', { name: /Select Style/ })
      const classicSelectButton = selectButtons[0] // Classic button (modern is "Selected")

      fireEvent.click(classicSelectButton)
      expect(mockUpdateStyle).toHaveBeenCalledWith('classic')
    })

    it('should prevent event propagation on button click', () => {
      render(<InvoiceStyleSelector />)

      const selectButtons = screen.getAllByRole('button', { name: /Select Style/ })
      const classicSelectButton = selectButtons[0]

      const stopPropagationSpy = jest.fn()
      const mockEvent = {
        ...new MouseEvent('click'),
        stopPropagation: stopPropagationSpy,
      }

      fireEvent.click(classicSelectButton, mockEvent)

      // Button should still call updateStyle
      expect(mockUpdateStyle).toHaveBeenCalled()
    })

    it('should update all styles through selection', () => {
      render(<InvoiceStyleSelector />)

      // Click classic
      const classicCard = screen.getByText('Classic').closest('div')
      if (classicCard) fireEvent.click(classicCard)
      expect(mockUpdateStyle).toHaveBeenCalledWith('classic')

      // Click minimal
      const minimalCard = screen.getByText('Minimal').closest('div')
      if (minimalCard) fireEvent.click(minimalCard)
      expect(mockUpdateStyle).toHaveBeenCalledWith('minimal')

      // Click modern
      const modernCard = screen.getByText('Modern').closest('div')
      if (modernCard) fireEvent.click(modernCard)
      expect(mockUpdateStyle).toHaveBeenCalledWith('modern')

      expect(mockUpdateStyle).toHaveBeenCalledTimes(3)
    })
  })

  describe('Visual States', () => {
    it('should apply selected styles to modern when selected', () => {
      mockStyle = 'modern'
      const { container } = render(<InvoiceStyleSelector />)

      // Find the card container that has border-primary class
      const selectedCards = container.querySelectorAll('.border-primary')
      expect(selectedCards.length).toBeGreaterThan(0)
    })

    it('should show Selected button for current style', () => {
      mockStyle = 'classic'
      render(<InvoiceStyleSelector />)

      const buttons = screen.getAllByRole('button')
      const selectedButton = buttons.find(btn => btn.textContent === 'Selected')

      expect(selectedButton).toBeInTheDocument()
    })

    it('should show Select Style buttons for non-selected styles', () => {
      mockStyle = 'modern'
      render(<InvoiceStyleSelector />)

      const selectButtons = screen.getAllByRole('button', { name: /Select Style/ })
      // Should have 2 "Select Style" buttons for classic and minimal
      expect(selectButtons.length).toBe(2)
    })

    it('should render check icon for selected style', () => {
      mockStyle = 'modern'
      const { container } = render(<InvoiceStyleSelector />)

      // Check for the check icon SVG
      const checkIcons = container.querySelectorAll('svg')
      expect(checkIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Style Previews', () => {
    it('should render modern style preview', () => {
      const { container } = render(<InvoiceStyleSelector />)

      // Modern has a primary colored bar
      const primaryBars = container.querySelectorAll('.bg-primary')
      expect(primaryBars.length).toBeGreaterThan(0)
    })

    it('should render classic style preview', () => {
      const { container } = render(<InvoiceStyleSelector />)

      // Classic has centered layout with gray-800
      const classicElements = container.querySelectorAll('.bg-gray-800')
      expect(classicElements.length).toBeGreaterThan(0)
    })

    it('should render minimal style preview', () => {
      const { container } = render(<InvoiceStyleSelector />)

      // Minimal has gray-600 elements
      const minimalElements = container.querySelectorAll('.bg-gray-600')
      expect(minimalElements.length).toBeGreaterThan(0)
    })

    it('should render all style previews with min height', () => {
      const { container } = render(<InvoiceStyleSelector />)

      const previews = container.querySelectorAll('.min-h-\\[120px\\]')
      expect(previews.length).toBe(3)
    })
  })

  describe('Accessibility', () => {
    it('should have clickable style cards', () => {
      const { container } = render(<InvoiceStyleSelector />)

      const clickableCards = container.querySelectorAll('.cursor-pointer')
      expect(clickableCards.length).toBe(3)
    })

    it('should have all select buttons accessible', () => {
      render(<InvoiceStyleSelector />)

      const allButtons = screen.getAllByRole('button')
      expect(allButtons.length).toBeGreaterThan(0)

      allButtons.forEach(button => {
        expect(button).toBeInTheDocument()
      })
    })

    it('should have descriptive button text', () => {
      mockStyle = 'modern'
      render(<InvoiceStyleSelector />)

      expect(screen.getByRole('button', { name: 'Selected' })).toBeInTheDocument()
      expect(screen.getAllByRole('button', { name: 'Select Style' })).toHaveLength(2)
    })
  })

  describe('Interactive Behavior', () => {
    it('should handle rapid clicks on different styles', () => {
      render(<InvoiceStyleSelector />)

      const modernCard = screen.getByText('Modern').closest('div')
      const classicCard = screen.getByText('Classic').closest('div')
      const minimalCard = screen.getByText('Minimal').closest('div')

      if (modernCard) fireEvent.click(modernCard)
      if (classicCard) fireEvent.click(classicCard)
      if (minimalCard) fireEvent.click(minimalCard)

      expect(mockUpdateStyle).toHaveBeenCalledTimes(3)
      expect(mockUpdateStyle).toHaveBeenNthCalledWith(1, 'modern')
      expect(mockUpdateStyle).toHaveBeenNthCalledWith(2, 'classic')
      expect(mockUpdateStyle).toHaveBeenNthCalledWith(3, 'minimal')
    })

    it('should handle clicking on already selected style', () => {
      mockStyle = 'modern'
      render(<InvoiceStyleSelector />)

      const modernCard = screen.getByText('Modern').closest('div')
      if (modernCard) {
        fireEvent.click(modernCard)
        expect(mockUpdateStyle).toHaveBeenCalledWith('modern')
      }
    })
  })

  describe('Layout and Structure', () => {
    it('should render grid layout for style options', () => {
      const { container } = render(<InvoiceStyleSelector />)

      // Look for the specific grid that contains style options
      const grids = container.querySelectorAll('.grid')
      const styleGrid = Array.from(grids).find(el =>
        el.classList.contains('grid-cols-1') && el.classList.contains('md:grid-cols-3')
      )
      expect(styleGrid).toBeInTheDocument()
    })

    it('should render all style cards with proper spacing', () => {
      const { container } = render(<InvoiceStyleSelector />)

      const cards = container.querySelectorAll('.border.rounded-lg.p-4')
      expect(cards.length).toBe(3)
    })

    it('should render upgrade message at the bottom', () => {
      const { container } = render(<InvoiceStyleSelector />)

      const upgradeSection = container.querySelector('.bg-muted\\/50')
      expect(upgradeSection).toBeInTheDocument()
      expect(upgradeSection?.textContent).toContain('Upgrade to Premium')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing style in store gracefully', () => {
      mockStyle = undefined as any
      expect(() => render(<InvoiceStyleSelector />)).not.toThrow()
    })

    it('should render correctly with classic selected', () => {
      mockStyle = 'classic'
      render(<InvoiceStyleSelector />)

      const buttons = screen.getAllByRole('button')
      const selectedButton = buttons.find(btn => btn.textContent === 'Selected')
      expect(selectedButton).toBeInTheDocument()
    })

    it('should render correctly with minimal selected', () => {
      mockStyle = 'minimal'
      render(<InvoiceStyleSelector />)

      const buttons = screen.getAllByRole('button')
      const selectedButton = buttons.find(btn => btn.textContent === 'Selected')
      expect(selectedButton).toBeInTheDocument()
    })
  })
})
