/**
 * Tests for Navigation component
 * Tests navigation bar with authenticated and unauthenticated states
 */

import { render, screen } from '@testing-library/react'
import { Navigation } from '@/components/navigation'
import { useRouter } from 'next/navigation'

type User = {
  id: string
  email?: string
  created_at?: string
}

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock Logo component
jest.mock('@/components/logo', () => ({
  Logo: ({ width, height, className }: any) => (
    <div data-testid="logo" data-width={width} data-height={height} className={className}>
      Logo
    </div>
  ),
}))

// Mock useUser hook
const mockUseUser = jest.fn()
jest.mock('@/hooks/use-user', () => ({
  useUser: () => mockUseUser(),
}))

// Mock Better Auth client
const mockSignOut = jest.fn()
jest.mock('@/lib/auth-client', () => ({
  signOut: () => mockSignOut(),
}))

jest.mock('@/components/support-widget', () => ({
  SupportWidget: () => null,
}))

// Mock Next Link component
jest.mock('next/link', () => {
  return ({ children, href, className }: any) => {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    )
  }
})

describe('Navigation', () => {
  const mockPush = jest.fn()
  const mockRefresh = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    })
  })

  describe('Loading State', () => {
    it('should show loading skeleton when loading', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: true,
      })

      const { container } = render(<Navigation />)

      expect(screen.getByText('Invoice Command')).toBeInTheDocument()
      expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    })

    it('should render logo during loading', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: true,
      })

      render(<Navigation />)

      const logo = screen.getByTestId('logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('data-width', '24')
      expect(logo).toHaveAttribute('data-height', '24')
    })
  })

  describe('Unauthenticated State', () => {
    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })
    })

    it('should render Invoice Command branding', () => {
      render(<Navigation />)

      expect(screen.getByText('Invoice Command')).toBeInTheDocument()
      expect(screen.getByTestId('logo')).toBeInTheDocument()
    })

    it('should show Browse Templates link', () => {
      render(<Navigation />)

      const templatesLink = screen.getByText('Browse 405+ Templates')
      expect(templatesLink).toBeInTheDocument()
      expect(templatesLink.closest('a')).toHaveAttribute('href', '/invoice-templates')
    })

    it('should show Login link', () => {
      render(<Navigation />)

      const loginLink = screen.getByText('Login')
      expect(loginLink).toBeInTheDocument()
      expect(loginLink.closest('a')).toHaveAttribute('href', '/auth/login')
    })

    it('should show Help button', () => {
      render(<Navigation />)

      expect(screen.getByRole('button', { name: /help/i })).toBeInTheDocument()
    })

    it('should show Create Free Account button', () => {
      render(<Navigation />)

      const signupButton = screen.getByText('Create Free Account')
      expect(signupButton).toBeInTheDocument()
      expect(signupButton.closest('a')).toHaveAttribute('href', '/auth/signup')
    })

    it('should not show user dropdown', () => {
      const { container } = render(<Navigation />)

      // User avatar/dropdown should not be present
      const avatars = container.querySelectorAll('[class*="Avatar"]')
      expect(avatars.length).toBe(0)
    })
  })

  describe('Authenticated State', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
      created_at: '2024-01-01',
    }

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })
    })

    it('should show dashboard link in header', () => {
      render(<Navigation />)

      const dashboardLinks = screen.getAllByText('Dashboard')
      expect(dashboardLinks.length).toBeGreaterThan(0)

      // Check the header dashboard link (not in dropdown)
      const headerDashboard = dashboardLinks.find(link =>
        link.closest('a')?.classList.contains('sm:inline-flex')
      )
      expect(headerDashboard).toBeTruthy()
    })

    it('should show user avatar with initials', () => {
      render(<Navigation />)

      // Email is test@example.com, initials should be TE
      const initials = screen.getByText('TE')
      expect(initials).toBeInTheDocument()
    })

    it('should generate correct initials from email', () => {
      mockUseUser.mockReturnValue({
        user: { ...mockUser, email: 'john.doe@company.com' },
        loading: false,
      })

      render(<Navigation />)

      expect(screen.getByText('JO')).toBeInTheDocument()
    })

    it('should handle email without @ symbol', () => {
      mockUseUser.mockReturnValue({
        user: { ...mockUser, email: undefined },
        loading: false,
      })

      render(<Navigation />)

      // Should default to 'U'
      expect(screen.getByText('U')).toBeInTheDocument()
    })

    it('should not show unauthenticated links', () => {
      render(<Navigation />)

      expect(screen.queryByText('Browse 405+ Templates')).not.toBeInTheDocument()
      expect(screen.queryByText('Login')).not.toBeInTheDocument()
      expect(screen.queryByText('Create Free Account')).not.toBeInTheDocument()
    })
  })

  describe('User Dropdown Menu', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
    }

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })
    })

    it('should render avatar button when authenticated', () => {
      render(<Navigation />)

      const avatarButton = screen.getByRole('button')
      expect(avatarButton).toBeInTheDocument()
      expect(screen.getByText('TE')).toBeInTheDocument()
    })

    it('should have dropdown menu component', () => {
      const { container } = render(<Navigation />)

      const avatarButton = screen.getByRole('button')
      expect(avatarButton).toBeInTheDocument()

      // Verify dropdown trigger exists
      expect(avatarButton.getAttribute('type')).toBe('button')
    })
  })

  describe('Sign Out Functionality', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
    }

    beforeEach(() => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })
      mockSignOut.mockResolvedValue(undefined)
    })

    it('should not sign out until the user acts', () => {
      render(<Navigation />)

      // Component renders successfully with auth functionality
      expect(screen.getByRole('button')).toBeInTheDocument()

      expect(mockSignOut).not.toHaveBeenCalled() // Not called until user action
    })
  })

  describe('Logo Properties', () => {
    it('should render logo with correct size', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      render(<Navigation />)

      const logo = screen.getByTestId('logo')
      expect(logo).toHaveAttribute('data-width', '24')
      expect(logo).toHaveAttribute('data-height', '24')
    })

    it('should apply primary color class to logo', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      render(<Navigation />)

      const logo = screen.getByTestId('logo')
      expect(logo).toHaveClass('text-primary')
    })
  })

  describe('Responsive Behavior', () => {
    it('should have hidden classes for mobile on certain links', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      render(<Navigation />)

      const templatesLink = screen.getByText('Browse 405+ Templates').closest('a')
      expect(templatesLink).toHaveClass('hidden')
      expect(templatesLink).toHaveClass('md:inline-flex')
    })

    it('should have hidden classes for dashboard link on mobile when authenticated', () => {
      mockUseUser.mockReturnValue({
        user: { id: '123', email: 'test@example.com' },
        loading: false,
      })

      render(<Navigation />)

      const dashboardLinks = screen.getAllByText('Dashboard')
      const headerDashboard = dashboardLinks.find(link =>
        link.closest('a')?.classList.contains('hidden')
      )
      expect(headerDashboard).toBeTruthy()
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined user email gracefully', () => {
      mockUseUser.mockReturnValue({
        user: { id: '123', email: undefined },
        loading: false,
      })

      expect(() => render(<Navigation />)).not.toThrow()
    })

    it('should handle null user object', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      expect(() => render(<Navigation />)).not.toThrow()
    })

    it('should handle very long email addresses', () => {
      mockUseUser.mockReturnValue({
        user: {
          id: '123',
          email: 'verylongemailaddress.with.many.dots@subdomain.example.com',
        },
        loading: false,
      })

      render(<Navigation />)

      // Should still extract first two characters
      expect(screen.getByText('VE')).toBeInTheDocument()
    })
  })
})
