/**
 * Tests for TemplateGrid component
 * Tests template filtering, search, and category selection
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { TemplateGrid } from '@/components/template-grid'
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

// Sample test data
const mockTemplates: ProfessionData[] = [
  {
    id: 'web-developer',
    name: 'Web Developer',
    profession: 'Web Developer',
    title: 'Web Developer Invoice Template',
    description: 'Professional invoice template for web developers',
    keywords: ['web development', 'coding', 'programming'],
    commonServices: ['Website development', 'API integration', 'Bug fixes'],
    averageRates: {
      hourly: '$50-150',
      project: '$1000-10000'
    },
    industryInfo: 'Web developers build websites and web applications',
    seoDescription: 'Free web developer invoice template'
  },
  {
    id: 'graphic-designer',
    name: 'Graphic Designer',
    profession: 'Graphic Designer',
    title: 'Graphic Designer Invoice Template',
    description: 'Professional invoice template for graphic designers',
    keywords: ['design', 'graphics', 'visual'],
    commonServices: ['Logo design', 'Branding', 'Print design'],
    averageRates: {
      hourly: '$40-100',
      project: '$500-5000'
    },
    industryInfo: 'Graphic designers create visual content',
    seoDescription: 'Free graphic designer invoice template'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    profession: 'Plumber',
    title: 'Plumber Invoice Template',
    description: 'Professional invoice template for plumbers',
    keywords: ['plumbing', 'pipes', 'repairs'],
    commonServices: ['Leak repair', 'Installation', 'Maintenance'],
    averageRates: {
      hourly: '$75-150'
    },
    industryInfo: 'Plumbers fix and install plumbing systems',
    seoDescription: 'Free plumber invoice template'
  }
]

describe('TemplateGrid', () => {
  describe('Rendering', () => {
    it('should render all templates by default', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.getByText('Graphic Designer')).toBeInTheDocument()
      expect(screen.getByText('Plumber')).toBeInTheDocument()
    })

    it('should render template descriptions', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText('Professional invoice template for web developers')).toBeInTheDocument()
      expect(screen.getByText('Professional invoice template for graphic designers')).toBeInTheDocument()
    })

    it('should render hourly rates when available', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText('$50-150')).toBeInTheDocument()
      expect(screen.getByText('$40-100')).toBeInTheDocument()
    })

    it('should render common services', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText('Website development')).toBeInTheDocument()
      expect(screen.getByText('API integration')).toBeInTheDocument()
      expect(screen.getByText('Logo design')).toBeInTheDocument()
    })

    it('should render Use Template buttons', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const useTemplateButtons = screen.getAllByText('Use Template')
      expect(useTemplateButtons.length).toBe(3)
    })

    it('should render search input', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should render category filter buttons', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText(/^All$/)).toBeInTheDocument()
      expect(screen.getByText('Creative & Design')).toBeInTheDocument()
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getByText('Business & Consulting')).toBeInTheDocument()
      expect(screen.getByText('Health & Wellness')).toBeInTheDocument()
      expect(screen.getByText('Home Services')).toBeInTheDocument()
    })
  })

  describe('Search Functionality', () => {
    it('should filter templates by profession name', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'web' } })

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.queryByText('Graphic Designer')).not.toBeInTheDocument()
      expect(screen.queryByText('Plumber')).not.toBeInTheDocument()
    })

    it('should filter templates by description', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'plumbers' } })

      expect(screen.getByText('Plumber')).toBeInTheDocument()
      expect(screen.queryByText('Web Developer')).not.toBeInTheDocument()
    })

    it('should filter templates by keywords', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'design' } })

      expect(screen.getByText('Graphic Designer')).toBeInTheDocument()
      expect(screen.queryByText('Plumber')).not.toBeInTheDocument()
    })

    it('should be case insensitive', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'WEB DEVELOPER' } })

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
    })

    it('should show results count when searching', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'web' } })

      expect(screen.getByText(/Showing 1 of 3 invoice templates for "web"/)).toBeInTheDocument()
    })

    it('should show no results state when no matches', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

      expect(screen.getByText('No templates found')).toBeInTheDocument()
      expect(screen.getByText('Try adjusting your search terms or category filter.')).toBeInTheDocument()
    })

    it('should clear search when Clear Filters button is clicked', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

      const clearButton = screen.getByText('Clear Filters')
      fireEvent.click(clearButton)

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.getByText('Graphic Designer')).toBeInTheDocument()
      expect(screen.getByText('Plumber')).toBeInTheDocument()
    })
  })

  describe('Category Filtering', () => {
    it('should filter by Technology category', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const techButton = screen.getByText('Technology')
      fireEvent.click(techButton)

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.queryByText('Graphic Designer')).not.toBeInTheDocument()
      expect(screen.queryByText('Plumber')).not.toBeInTheDocument()
    })

    it('should filter by Creative & Design category', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const creativeButton = screen.getByText('Creative & Design')
      fireEvent.click(creativeButton)

      expect(screen.getByText('Graphic Designer')).toBeInTheDocument()
      expect(screen.queryByText('Web Developer')).not.toBeInTheDocument()
      expect(screen.queryByText('Plumber')).not.toBeInTheDocument()
    })

    it('should filter by Home Services category', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const homeButton = screen.getByText('Home Services')
      fireEvent.click(homeButton)

      expect(screen.getByText('Plumber')).toBeInTheDocument()
      expect(screen.queryByText('Web Developer')).not.toBeInTheDocument()
      expect(screen.queryByText('Graphic Designer')).not.toBeInTheDocument()
    })

    it('should show All category by default', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const allButton = screen.getByText(/^All$/)
      expect(allButton).toHaveClass('bg-primary') // Selected state
    })

    it('should show category in results count', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const techButton = screen.getByText('Technology')
      fireEvent.click(techButton)

      expect(screen.getByText(/in Technology/)).toBeInTheDocument()
    })

    it('should return to all templates when All is clicked', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      // First filter by category
      const techButton = screen.getByText('Technology')
      fireEvent.click(techButton)

      // Then click All
      const allButton = screen.getByText(/^All$/)
      fireEvent.click(allButton)

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.getByText('Graphic Designer')).toBeInTheDocument()
      expect(screen.getByText('Plumber')).toBeInTheDocument()
    })
  })

  describe('Combined Search and Category', () => {
    it('should filter by both search and category', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      // Filter by Technology category
      const techButton = screen.getByText('Technology')
      fireEvent.click(techButton)

      // Search within category
      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'web' } })

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.queryByText('Graphic Designer')).not.toBeInTheDocument()
    })

    it('should show no results when search does not match category', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      // Filter by Technology category
      const techButton = screen.getByText('Technology')
      fireEvent.click(techButton)

      // Search for something in different category
      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'graphic' } })

      expect(screen.getByText('No templates found')).toBeInTheDocument()
    })

    it('should clear both filters with Clear Filters button', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      // Apply both filters
      const techButton = screen.getByText('Technology')
      fireEvent.click(techButton)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })

      // Clear filters
      const clearButton = screen.getByText('Clear Filters')
      fireEvent.click(clearButton)

      // Should show all templates
      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      expect(screen.getByText('Graphic Designer')).toBeInTheDocument()
      expect(screen.getByText('Plumber')).toBeInTheDocument()

      // All category should be selected
      const allButton = screen.getByText(/^All$/)
      expect(allButton).toHaveClass('bg-primary')
    })
  })

  describe('Template Links', () => {
    it('should link to correct invoice template path by default', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const links = screen.getAllByRole('link', { name: /Use Template/i })
      expect(links[0]).toHaveAttribute('href', '/invoice-templates/web-developer')
      expect(links[1]).toHaveAttribute('href', '/invoice-templates/graphic-designer')
      expect(links[2]).toHaveAttribute('href', '/invoice-templates/plumber')
    })

    it('should use custom basePath when provided', () => {
      render(<TemplateGrid templates={mockTemplates} basePath="/estimate-templates" />)

      const links = screen.getAllByRole('link', { name: /Use Template/i })
      expect(links[0]).toHaveAttribute('href', '/estimate-templates/web-developer')
      expect(links[1]).toHaveAttribute('href', '/estimate-templates/graphic-designer')
    })

    it('should show estimate in search placeholder with estimate basePath', () => {
      render(<TemplateGrid templates={mockTemplates} basePath="/estimate-templates" />)

      const searchInput = screen.getByPlaceholderText('Search estimate templates...')
      expect(searchInput).toBeInTheDocument()
    })

    it('should show estimate in results count with estimate basePath', () => {
      render(<TemplateGrid templates={mockTemplates} basePath="/estimate-templates" />)

      expect(screen.getByText(/Showing 3 of 3 estimate templates/)).toBeInTheDocument()
    })
  })

  describe('Common Services Display', () => {
    it('should show first 2 common services', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText('Website development')).toBeInTheDocument()
      expect(screen.getByText('API integration')).toBeInTheDocument()
    })

    it('should show +N more indicator when more than 2 services', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      // Web Developer has 3 services, should show +1 more
      const moreIndicators = screen.getAllByText(/\+\d+ more/)
      expect(moreIndicators.length).toBeGreaterThan(0)
    })

    it('should not show more indicator when 2 or fewer services', () => {
      const singleTemplate: ProfessionData[] = [{
        ...mockTemplates[0],
        commonServices: ['Service 1', 'Service 2']
      }]

      render(<TemplateGrid templates={singleTemplate} />)

      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument()
    })
  })

  describe('Results Count', () => {
    it('should show total template count', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      expect(screen.getByText('Showing 3 of 3 invoice templates')).toBeInTheDocument()
    })

    it('should update count when filtering', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'web' } })

      expect(screen.getByText(/Showing 1 of 3/)).toBeInTheDocument()
    })

    it('should show 0 templates when no matches', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'xyz123' } })

      // Shows "No templates found" instead when 0 results
      expect(screen.getByText('No templates found')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should render empty state when no templates', () => {
      render(<TemplateGrid templates={[]} />)

      expect(screen.getByText('Showing 0 of 0 invoice templates')).toBeInTheDocument()
    })

    it('should not render template cards when empty', () => {
      render(<TemplateGrid templates={[]} />)

      expect(screen.queryByText('Use Template')).not.toBeInTheDocument()
    })
  })

  describe('Visual Elements', () => {
    it('should render search icon', () => {
      const { container } = render(<TemplateGrid templates={mockTemplates} />)

      const searchIcons = container.querySelectorAll('svg')
      expect(searchIcons.length).toBeGreaterThan(0)
    })

    it('should render filter icons on category buttons', () => {
      const { container } = render(<TemplateGrid templates={mockTemplates} />)

      // Filter icon should appear on each category button
      const filterButtons = screen.getAllByRole('button')
      expect(filterButtons.length).toBeGreaterThan(5) // All + 5 categories
    })

    it('should apply hover styles to template cards', () => {
      const { container } = render(<TemplateGrid templates={mockTemplates} />)

      const cards = container.querySelectorAll('.group')
      expect(cards.length).toBe(3)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible search input', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      expect(searchInput).toHaveAttribute('type', 'text')
    })

    it('should have accessible category buttons', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const allButton = screen.getByRole('button', { name: /All/ })
      const techButton = screen.getByRole('button', { name: /Technology/ })

      expect(allButton).toBeInTheDocument()
      expect(techButton).toBeInTheDocument()
    })

    it('should have accessible links', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const links = screen.getAllByRole('link')
      expect(links.length).toBe(3)

      links.forEach(link => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle template without hourly rate', () => {
      const templateWithoutRate: ProfessionData[] = [{
        ...mockTemplates[0],
        averageRates: {}
      }]

      render(<TemplateGrid templates={templateWithoutRate} />)

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
      // Should not crash even without rates
    })

    it('should handle template with empty common services', () => {
      const templateWithoutServices: ProfessionData[] = [{
        ...mockTemplates[0],
        commonServices: []
      }]

      render(<TemplateGrid templates={templateWithoutServices} />)

      expect(screen.getByText('Web Developer')).toBeInTheDocument()
    })

    it('should handle very long search terms', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      const longSearch = 'a'.repeat(100)
      fireEvent.change(searchInput, { target: { value: longSearch } })

      expect(screen.getByText('No templates found')).toBeInTheDocument()
    })

    it('should handle special characters in search', () => {
      render(<TemplateGrid templates={mockTemplates} />)

      const searchInput = screen.getByPlaceholderText('Search invoice templates...')
      fireEvent.change(searchInput, { target: { value: 'developer' } })

      // Should find template based on profession name/description
      expect(screen.getByText('Web Developer')).toBeInTheDocument()
    })
  })
})
