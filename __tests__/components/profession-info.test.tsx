/**
 * Tests for ProfessionInfo component
 * Tests profession template header and information display
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { ProfessionInfo } from '@/components/profession-info'
import { ProfessionData } from '@/data/professions-expanded'

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
})

// Mock Logo component
jest.mock('@/components/logo', () => ({
  Logo: ({ width, height, className }: any) => (
    <div data-testid="logo" data-width={width} data-height={height} className={className}>
      Logo
    </div>
  ),
}))

// Sample profession data
const mockProfession: ProfessionData = {
  id: 'web-developer',
  name: 'Web Developer',
  profession: 'Web Developer',
  title: 'Web Developer Invoice Template (Free)',
  description: 'Professional invoice template designed specifically for web developers and software engineers.',
  keywords: ['web developer invoice', 'developer billing', 'software invoice'],
  commonServices: [
    'Website Development',
    'API Integration',
    'Bug Fixes',
    'Code Review',
    'Technical Consulting',
    'Database Design',
  ],
  averageRates: {
    hourly: '$75-150',
    project: '$2000-20000',
  },
  industryInfo: 'Web developers typically charge between $75-150 per hour depending on expertise and project complexity.',
  seoDescription: 'Free web developer invoice template with professional formatting.',
}

const mockProfessionNoProject: ProfessionData = {
  ...mockProfession,
  averageRates: {
    hourly: '$50-100',
  },
}

const mockProfessionNoHourly: ProfessionData = {
  ...mockProfession,
  averageRates: {
    project: '$1000-5000',
  },
}

describe('ProfessionInfo', () => {
  describe('Navigation Bar', () => {
    it('should render logo in navigation', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      const logo = screen.getByTestId('logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('data-width', '24')
      expect(logo).toHaveAttribute('data-height', '24')
    })

    it('should render Invoice Command branding', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Invoice Command')).toBeInTheDocument()
    })

    it('should render back to generator link', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      const backLink = screen.getByText('Back to Invoice Generator').closest('a')
      expect(backLink).toBeInTheDocument()
      expect(backLink).toHaveAttribute('href', '/')
    })
  })

  describe('Profession Header', () => {
    it('should render profession title', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Web Developer Invoice Template (Free)')).toBeInTheDocument()
    })

    it('should render profession description', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/Professional invoice template designed specifically for web developers/)).toBeInTheDocument()
    })
  })

  describe('Industry Rates', () => {
    it('should render hourly rate when available', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Hourly:')).toBeInTheDocument()
      expect(screen.getByText('$75-150')).toBeInTheDocument()
    })

    it('should render project rate when available', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.getByText('$2000-20000')).toBeInTheDocument()
    })

    it('should render industry info', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/Web developers typically charge between/)).toBeInTheDocument()
    })

    it('should not render project rate label when not available', () => {
      render(<ProfessionInfo profession={mockProfessionNoProject} />)

      expect(screen.getByText('Hourly:')).toBeInTheDocument()
      expect(screen.queryByText('Project:')).not.toBeInTheDocument()
    })

    it('should not render hourly rate label when not available', () => {
      render(<ProfessionInfo profession={mockProfessionNoHourly} />)

      expect(screen.getByText('Project:')).toBeInTheDocument()
      expect(screen.queryByText('Hourly:')).not.toBeInTheDocument()
    })

    it('should render Industry Rates heading', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Industry Rates')).toBeInTheDocument()
    })
  })

  describe('Common Services', () => {
    it('should render common services heading', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/Common Web Developer Services/)).toBeInTheDocument()
    })

    it('should render all common services as badges', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Website Development')).toBeInTheDocument()
      expect(screen.getByText('API Integration')).toBeInTheDocument()
      expect(screen.getByText('Bug Fixes')).toBeInTheDocument()
      expect(screen.getByText('Code Review')).toBeInTheDocument()
      expect(screen.getByText('Technical Consulting')).toBeInTheDocument()
      expect(screen.getByText('Database Design')).toBeInTheDocument()
    })

    it('should render correct number of service badges', () => {
      const { container } = render(<ProfessionInfo profession={mockProfession} />)

      // All 6 services should be rendered
      const services = mockProfession.commonServices
      services.forEach(service => {
        expect(screen.getByText(service)).toBeInTheDocument()
      })
    })
  })

  describe('Quick Start Guide', () => {
    it('should render Quick Start Guide heading', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Quick Start Guide')).toBeInTheDocument()
    })

    it('should render quick start description', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/This template is pre-optimized for web developer services/)).toBeInTheDocument()
    })

    it('should render Start Creating Invoice button', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Start Creating Invoice')).toBeInTheDocument()
    })

    it('should scroll to form when button is clicked', () => {
      // Mock scrollIntoView
      const mockScrollIntoView = jest.fn()
      const mockElement = { scrollIntoView: mockScrollIntoView }
      jest.spyOn(document, 'getElementById').mockReturnValue(mockElement as any)

      render(<ProfessionInfo profession={mockProfession} />)

      const button = screen.getByText('Start Creating Invoice')
      fireEvent.click(button)

      expect(document.getElementById).toHaveBeenCalledWith('invoice-form')
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })

      jest.restoreAllMocks()
    })

    it('should not crash if invoice-form element does not exist', () => {
      jest.spyOn(document, 'getElementById').mockReturnValue(null)

      render(<ProfessionInfo profession={mockProfession} />)

      const button = screen.getByText('Start Creating Invoice')
      expect(() => fireEvent.click(button)).not.toThrow()

      jest.restoreAllMocks()
    })
  })

  describe('SEO Content', () => {
    it('should render SEO title', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText('Web Developer Invoice Template (Free) - Free Download')).toBeInTheDocument()
    })

    it('should render SEO description paragraphs', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/Our free web developer invoice template is specifically designed/)).toBeInTheDocument()
      expect(screen.getByText(/The template supports both hourly and project-based billing/)).toBeInTheDocument()
      expect(screen.getByText(/Features include automatic calculations/)).toBeInTheDocument()
      expect(screen.getByText(/Start creating professional web developer invoices today/)).toBeInTheDocument()
    })

    it('should use profession name in SEO content', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      const content = screen.getByText(/Our free web developer invoice template/)
      expect(content).toBeInTheDocument()
    })
  })

  describe('Layout Structure', () => {
    it('should render with gradient background', () => {
      const { container } = render(<ProfessionInfo profession={mockProfession} />)

      const gradient = container.querySelector('.bg-gradient-to-r')
      expect(gradient).toBeInTheDocument()
    })

    it('should render grid layout for profession header', () => {
      const { container } = render(<ProfessionInfo profession={mockProfession} />)

      const grids = container.querySelectorAll('.grid')
      expect(grids.length).toBeGreaterThan(0)
    })

    it('should render cards for industry rates and quick start', () => {
      const { container } = render(<ProfessionInfo profession={mockProfession} />)

      // Should have at least 2 cards (Industry Rates + Quick Start)
      const cards = container.querySelectorAll('.p-4')
      expect(cards.length).toBeGreaterThanOrEqual(2)
    })
  })

  describe('Profession Name Usage', () => {
    it('should use profession name in common services heading', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/Common Web Developer Services/)).toBeInTheDocument()
    })

    it('should use profession name in quick start description', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      expect(screen.getByText(/pre-optimized for web developer services/)).toBeInTheDocument()
    })

    it('should use profession name in SEO content (lowercase)', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      // Should appear in lowercase in SEO descriptions
      expect(screen.getByText(/free web developer invoice template/)).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle profession with empty common services', () => {
      const emptyServices: ProfessionData = {
        ...mockProfession,
        commonServices: [],
      }

      render(<ProfessionInfo profession={emptyServices} />)

      expect(screen.getByText(/Common Web Developer Services/)).toBeInTheDocument()
    })

    it('should handle profession with no rates', () => {
      const noRates: ProfessionData = {
        ...mockProfession,
        averageRates: {},
      }

      render(<ProfessionInfo profession={noRates} />)

      expect(screen.getByText('Industry Rates')).toBeInTheDocument()
      expect(screen.queryByText('Hourly:')).not.toBeInTheDocument()
      expect(screen.queryByText('Project:')).not.toBeInTheDocument()
    })

    it('should handle very long profession names', () => {
      const longName: ProfessionData = {
        ...mockProfession,
        profession: 'Very Long Profession Name That Might Wrap Multiple Lines',
      }

      render(<ProfessionInfo profession={longName} />)

      expect(screen.getByText(/Common Very Long Profession Name/)).toBeInTheDocument()
    })

    it('should handle many common services', () => {
      const manyServices: ProfessionData = {
        ...mockProfession,
        commonServices: Array(20).fill('Service').map((s, i) => `${s} ${i + 1}`),
      }

      render(<ProfessionInfo profession={manyServices} />)

      // All services should render
      expect(screen.getByText('Service 1')).toBeInTheDocument()
      expect(screen.getByText('Service 20')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should render navigation as nav element', () => {
      const { container } = render(<ProfessionInfo profession={mockProfession} />)

      const nav = container.querySelector('nav')
      expect(nav).toBeInTheDocument()
    })

    it('should render headings with proper hierarchy', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent('Web Developer Invoice Template (Free)')

      const h2Elements = screen.getAllByRole('heading', { level: 2 })
      expect(h2Elements.length).toBeGreaterThan(0)

      const h3Elements = screen.getAllByRole('heading', { level: 3 })
      expect(h3Elements.length).toBeGreaterThan(0)
    })

    it('should render clickable button', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      const button = screen.getByRole('button', { name: /Start Creating Invoice/ })
      expect(button).toBeInTheDocument()
    })

    it('should render accessible link', () => {
      render(<ProfessionInfo profession={mockProfession} />)

      const link = screen.getByRole('link', { name: /Back to Invoice Generator/ })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/')
    })
  })
})
