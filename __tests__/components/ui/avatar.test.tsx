/**
 * Tests for Avatar UI components
 * Tests Radix UI avatar wrapper with image and fallback
 */

import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar Components', () => {
  describe('Avatar', () => {
    it('should render avatar container', () => {
      const { container } = render(<Avatar />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toBeInTheDocument()
    })

    it('should have data-slot attribute', () => {
      const { container } = render(<Avatar />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toBeInTheDocument()
    })

    it('should have avatar styling classes', () => {
      const { container } = render(<Avatar />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveClass('relative')
      expect(avatar).toHaveClass('flex')
      expect(avatar).toHaveClass('size-8')
      expect(avatar).toHaveClass('shrink-0')
      expect(avatar).toHaveClass('overflow-hidden')
      expect(avatar).toHaveClass('rounded-full')
    })

    it('should apply custom className', () => {
      const { container } = render(<Avatar className="custom-avatar" />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveClass('custom-avatar')
    })
  })

  describe('AvatarImage', () => {
    // Note: Radix Avatar.Image doesn't render synchronously in tests
    // It waits for image load events. We test the component is defined.
    it('should have AvatarImage component defined', () => {
      expect(AvatarImage).toBeDefined()
    })
  })

  describe('AvatarFallback', () => {
    it('should render avatar fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      const fallback = container.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toBeInTheDocument()
    })

    it('should display fallback text', () => {
      render(
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('AB')).toBeInTheDocument()
    })

    it('should have fallback styling classes', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      const fallback = container.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toHaveClass('bg-muted')
      expect(fallback).toHaveClass('flex')
      expect(fallback).toHaveClass('size-full')
      expect(fallback).toHaveClass('items-center')
      expect(fallback).toHaveClass('justify-center')
      expect(fallback).toHaveClass('rounded-full')
    })

    it('should apply custom className', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback className="custom-fallback">JD</AvatarFallback>
        </Avatar>
      )

      const fallback = container.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toHaveClass('custom-fallback')
    })
  })

  describe('Complete Avatar Structure', () => {
    it('should render avatar with fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="/avatar.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )

      const avatar = container.querySelector('[data-slot="avatar"]')
      const fallback = container.querySelector('[data-slot="avatar-fallback"]')

      expect(avatar).toBeInTheDocument()
      expect(fallback).toBeInTheDocument()
    })

    it('should render avatar with only fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      const fallback = container.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toBeInTheDocument()
      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should render avatar container', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="/avatar.jpg" alt="User" />
        </Avatar>
      )

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toBeInTheDocument()
    })
  })

  describe('Content', () => {
    it('should display initials as fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('JD')).toBeInTheDocument()
    })

    it('should support icon as fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>
            <svg data-testid="user-icon" />
          </AvatarFallback>
        </Avatar>
      )

      expect(screen.getByTestId('user-icon')).toBeInTheDocument()
    })

    it('should support single letter fallback', () => {
      render(
        <Avatar>
          <AvatarFallback>J</AvatarFallback>
        </Avatar>
      )

      expect(screen.getByText('J')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label on avatar', () => {
      const { container } = render(<Avatar aria-label="User profile picture" />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveAttribute('aria-label', 'User profile picture')
    })

    it('should support aria-describedby', () => {
      const { container } = render(<Avatar aria-describedby="avatar-description" />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveAttribute('aria-describedby', 'avatar-description')
    })
  })

  describe('Custom Sizing', () => {
    it('should support custom size classes', () => {
      const { container } = render(<Avatar className="size-12" />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveClass('size-12')
    })

    it('should support large avatar', () => {
      const { container } = render(<Avatar className="size-16" />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveClass('size-16')
    })

    it('should support small avatar', () => {
      const { container } = render(<Avatar className="size-6" />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toHaveClass('size-6')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty avatar', () => {
      const { container } = render(<Avatar />)

      const avatar = container.querySelector('[data-slot="avatar"]')
      expect(avatar).toBeInTheDocument()
    })

    it('should handle image with missing src', () => {
      const { container } = render(
        <Avatar>
          <AvatarImage src="" alt="Empty" />
          <AvatarFallback>E</AvatarFallback>
        </Avatar>
      )

      const fallback = container.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toBeInTheDocument()
    })

    it('should handle empty fallback', () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback />
        </Avatar>
      )

      const fallback = container.querySelector('[data-slot="avatar-fallback"]')
      expect(fallback).toBeInTheDocument()
    })
  })
})
