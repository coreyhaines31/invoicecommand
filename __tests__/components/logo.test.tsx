/**
 * Tests for Logo component
 * Tests SVG rendering and prop handling
 */

import { render } from '@testing-library/react'
import { Logo } from '@/components/logo'

describe('Logo', () => {
  it('should render SVG element', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    expect(svg).toBeInTheDocument()
  })

  it('should use default dimensions', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '40')
    expect(svg).toHaveAttribute('height', '48')
  })

  it('should accept custom width', () => {
    const { container } = render(<Logo width={100} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '100')
  })

  it('should accept custom height', () => {
    const { container } = render(<Logo height={80} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('height', '80')
  })

  it('should accept custom width and height', () => {
    const { container } = render(<Logo width={120} height={90} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '120')
    expect(svg).toHaveAttribute('height', '90')
  })

  it('should accept className prop', () => {
    const { container } = render(<Logo className="custom-class" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('custom-class')
  })

  it('should have correct viewBox', () => {
    const { container } = render(<Logo />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('viewBox', '0 0 40 48')
  })

  it('should render all paths', () => {
    const { container } = render(<Logo />)
    const paths = container.querySelectorAll('path')

    expect(paths).toHaveLength(8)
  })

  it('should use currentColor for fill', () => {
    const { container } = render(<Logo />)
    const g = container.querySelector('g')

    expect(g).toHaveAttribute('fill', 'currentColor')
  })

  it('should handle zero width', () => {
    const { container } = render(<Logo width={0} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '0')
  })

  it('should handle zero height', () => {
    const { container } = render(<Logo height={0} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('height', '0')
  })

  it('should handle very large dimensions', () => {
    const { container } = render(<Logo width={1000} height={1000} />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('width', '1000')
    expect(svg).toHaveAttribute('height', '1000')
  })

  it('should handle empty className', () => {
    const { container } = render(<Logo className="" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveAttribute('class', '')
  })

  it('should handle multiple className values', () => {
    const { container } = render(<Logo className="class1 class2 class3" />)
    const svg = container.querySelector('svg')

    expect(svg).toHaveClass('class1')
    expect(svg).toHaveClass('class2')
    expect(svg).toHaveClass('class3')
  })
})
