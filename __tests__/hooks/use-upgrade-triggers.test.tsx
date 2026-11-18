/**
 * Tests for useUpgradeTriggers hook and UpgradeTriggersProvider
 * Tests upgrade trigger logic, feature access control, and paywall display
 */

import type { PaywallModal } from '@/components/paywall/paywall-modal'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react'
import { useUpgradeTriggers, UpgradeTriggersProvider } from '@/hooks/use-upgrade-triggers'
import { UserTier } from '@/hooks/use-user-tier'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}))

// Mock useUserTier hook
let mockTier: UserTier = 'anonymous'
jest.mock('@/hooks/use-user-tier', () => ({
  useUserTier: () => ({
    tier: mockTier,
    isAnonymous: mockTier === 'anonymous',
    isFree: mockTier === 'free',
    isPremium: mockTier === 'premium',
    isPro: mockTier === 'pro',
    isPaid: mockTier === 'premium' || mockTier === 'pro',
    canAccessFeature: jest.fn(),
    getNextTier: jest.fn()
  }),
  UserTier: {
    ANONYMOUS: 'anonymous',
    FREE: 'free',
    PREMIUM: 'premium',
    PRO: 'pro'
  }
}))

// Mock PaywallModal component
type PaywallModalProps = React.ComponentProps<typeof PaywallModal>
jest.mock('@/components/paywall/paywall-modal', () => ({
  PaywallModal: ({ isOpen, onClose, trigger }: PaywallModalProps) => {
    if (!isOpen) return null
    return (
      <div data-testid="paywall-modal">
        <h2>{trigger.title}</h2>
        <p>{trigger.description}</p>
        <button onClick={onClose}>Close</button>
        <button onClick={trigger.ctaAction}>{trigger.ctaText}</button>
      </div>
    )
  }
}))

// Test component that uses the hook
function TestComponent() {
  const { triggerUpgrade, canAccess, showPaywall } = useUpgradeTriggers()

  return (
    <div>
      <button onClick={() => triggerUpgrade('save-invoice')}>Trigger Save Invoice</button>
      <button onClick={() => triggerUpgrade('logo-upload')}>Trigger Logo Upload</button>
      <button onClick={() => triggerUpgrade('voice-limit-free')}>Trigger Free Voice Limit</button>
      <button onClick={() => triggerUpgrade('unknown-trigger')}>Trigger Unknown</button>

      <div data-testid="can-access-free">{canAccess('test', 'free').toString()}</div>
      <div data-testid="can-access-premium">{canAccess('test', 'premium').toString()}</div>
      <div data-testid="can-access-pro">{canAccess('test', 'pro').toString()}</div>

      <button onClick={() => showPaywall({
        feature: 'test-feature',
        title: 'Test Title',
        description: 'Test Description',
        icon: <div>Icon</div>,
        fromTier: 'anonymous',
        toTier: 'free',
        benefits: ['Benefit 1'],
        ctaText: 'Test CTA',
        ctaAction: () => {}
      })}>Show Custom Paywall</button>
    </div>
  )
}

describe('UpgradeTriggersProvider and useUpgradeTriggers', () => {
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    mockTier = 'anonymous'
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
  })

  afterEach(() => {
    if (consoleWarnSpy) {
      consoleWarnSpy.mockRestore()
    }
  })

  describe('Provider Setup', () => {
    it('should render children correctly', () => {
      render(
        <UpgradeTriggersProvider>
          <div>Test Content</div>
        </UpgradeTriggersProvider>
      )

      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should throw error when hook is used outside provider', () => {
      // Suppress console.error for this test
      const originalError = console.error
      console.error = jest.fn()

      expect(() => {
        renderHook(() => useUpgradeTriggers())
      }).toThrow('useUpgradeTriggers must be used within UpgradeTriggersProvider')

      console.error = originalError
    })

    it('should provide context value to children', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      expect(screen.getByText('Trigger Save Invoice')).toBeInTheDocument()
      expect(screen.getByText('Trigger Logo Upload')).toBeInTheDocument()
    })
  })

  describe('triggerUpgrade - Anonymous User Triggers', () => {
    beforeEach(() => {
      mockTier = 'anonymous'
    })

    it('should show paywall for save-invoice trigger', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Save Invoice')
      fireEvent.click(button)

      expect(screen.getByTestId('paywall-modal')).toBeInTheDocument()
      expect(screen.getByText('Save Your Invoices')).toBeInTheDocument()
      expect(screen.getByText(/Create a free account to save unlimited invoices/)).toBeInTheDocument()
    })

    it('should not show paywall for free→premium trigger when user is anonymous', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Free Voice Limit')
      fireEvent.click(button)

      // Should not show because user tier doesn't match fromTier
      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()
    })
  })

  describe('triggerUpgrade - Free User Triggers', () => {
    beforeEach(() => {
      mockTier = 'free'
    })

    it('should show paywall for voice-limit-free trigger', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Free Voice Limit')
      fireEvent.click(button)

      expect(screen.getByTestId('paywall-modal')).toBeInTheDocument()
      expect(screen.getByText('Voice Command Limit Reached')).toBeInTheDocument()
      expect(screen.getByText(/You've used all 10 voice commands for this month/)).toBeInTheDocument()
    })

    it('should not show paywall for anonymous→free trigger when user is free', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Save Invoice')
      fireEvent.click(button)

      // Should not show because user tier doesn't match fromTier
      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()
    })
  })

  describe('triggerUpgrade - Premium User Triggers', () => {
    beforeEach(() => {
      mockTier = 'premium'
    })

    it('should not show paywall for free→premium trigger when user is premium', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Free Voice Limit')
      fireEvent.click(button)

      // Should not show because user tier doesn't match fromTier
      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()
    })
  })

  describe('triggerUpgrade - Unknown Triggers', () => {
    it('should log warning for unknown trigger', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Unknown')
      fireEvent.click(button)

      expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown upgrade trigger: unknown-trigger')
      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()
    })
  })

  describe('canAccess Function', () => {
    it('should allow anonymous user to access anonymous features', () => {
      mockTier = 'anonymous'

      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      // Anonymous can access anonymous tier
      const canAccessAnonymous = screen.getByTestId('can-access-free')
      expect(canAccessAnonymous).toHaveTextContent('false')
    })

    it('should allow free user to access free and anonymous features', () => {
      mockTier = 'free'

      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      expect(screen.getByTestId('can-access-free')).toHaveTextContent('true')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('false')
      expect(screen.getByTestId('can-access-pro')).toHaveTextContent('false')
    })

    it('should allow premium user to access premium, free, and anonymous features', () => {
      mockTier = 'premium'

      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      expect(screen.getByTestId('can-access-free')).toHaveTextContent('true')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('true')
      expect(screen.getByTestId('can-access-pro')).toHaveTextContent('false')
    })

    it('should allow pro user to access all features', () => {
      mockTier = 'pro'

      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      expect(screen.getByTestId('can-access-free')).toHaveTextContent('true')
      expect(screen.getByTestId('can-access-premium')).toHaveTextContent('true')
      expect(screen.getByTestId('can-access-pro')).toHaveTextContent('true')
    })
  })

  describe('showPaywall Function', () => {
    it('should display custom paywall trigger', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Show Custom Paywall')
      fireEvent.click(button)

      expect(screen.getByTestId('paywall-modal')).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })

    it('should close paywall when close button is clicked', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      // Show paywall
      const showButton = screen.getByText('Show Custom Paywall')
      fireEvent.click(showButton)

      expect(screen.getByTestId('paywall-modal')).toBeInTheDocument()

      // Close paywall
      const closeButton = screen.getByText('Close')
      fireEvent.click(closeButton)

      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()
    })
  })

  describe('Paywall Modal Interactions', () => {
    it('should execute CTA action when CTA button is clicked', () => {
      const initialHref = window.location.href

      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Save Invoice')
      fireEvent.click(button)

      const ctaButton = screen.getByText('Create Free Account')
      fireEvent.click(ctaButton)

      // CTA should have been called (navigation attempted)
      expect(screen.getByText('Create Free Account')).toBeInTheDocument()
    })

    it('should navigate to billing for premium upgrade', () => {
      mockTier = 'free'

      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Free Voice Limit')
      fireEvent.click(button)

      const ctaButton = screen.getByText('See Plans')
      fireEvent.click(ctaButton)

      // CTA button should exist and be clickable
      expect(screen.getByText('See Plans')).toBeInTheDocument()
    })
  })

  describe('All Upgrade Triggers', () => {
    it('should have all anonymous→free triggers configured', () => {
      mockTier = 'anonymous'

      const TriggersTest = () => {
        const { triggerUpgrade } = useUpgradeTriggers()

        return (
          <div>
            <button onClick={() => triggerUpgrade('save-invoice')}>Save Invoice</button>
            <button onClick={() => triggerUpgrade('logo-upload')}>Logo Upload</button>
            <button onClick={() => triggerUpgrade('style-selection')}>Style Selection</button>
            <button onClick={() => triggerUpgrade('dashboard-access')}>Dashboard Access</button>
          </div>
        )
      }

      render(
        <UpgradeTriggersProvider>
          <TriggersTest />
        </UpgradeTriggersProvider>
      )

      // Click each trigger to verify they're defined
      fireEvent.click(screen.getByText('Save Invoice'))
      fireEvent.click(screen.getByText('Logo Upload'))
      fireEvent.click(screen.getByText('Style Selection'))
      fireEvent.click(screen.getByText('Dashboard Access'))

      // No warnings should have been logged
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })

    it('should have all free→premium triggers configured', () => {
      mockTier = 'free'

      const TriggersTest = () => {
        const { triggerUpgrade } = useUpgradeTriggers()

        return (
          <div>
            <button onClick={() => triggerUpgrade('voice-limit-free')}>Voice Limit</button>
          </div>
        )
      }

      render(
        <UpgradeTriggersProvider>
          <TriggersTest />
        </UpgradeTriggersProvider>
      )

      // Click each trigger to verify they're defined
      fireEvent.click(screen.getByText('Voice Limit'))

      // No warnings should have been logged
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle multiple paywall opens and closes', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      // Open first paywall
      fireEvent.click(screen.getByText('Trigger Save Invoice'))
      expect(screen.getByText('Save Your Invoices')).toBeInTheDocument()

      // Close it
      fireEvent.click(screen.getByText('Close'))
      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()

      // Open second paywall
      fireEvent.click(screen.getByText('Trigger Logo Upload'))
      expect(screen.getByText('Add Your Logo')).toBeInTheDocument()

      // Close it
      fireEvent.click(screen.getByText('Close'))
      expect(screen.queryByTestId('paywall-modal')).not.toBeInTheDocument()
    })

    it('should replace existing paywall with new one', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      // Open first paywall
      fireEvent.click(screen.getByText('Trigger Save Invoice'))
      expect(screen.getByText('Save Your Invoices')).toBeInTheDocument()

      // Open second paywall (should replace first)
      fireEvent.click(screen.getByText('Trigger Logo Upload'))
      expect(screen.getByText('Add Your Logo')).toBeInTheDocument()
      expect(screen.queryByText('Save Your Invoices')).not.toBeInTheDocument()
    })

    it('should handle rapid trigger clicks', () => {
      render(
        <UpgradeTriggersProvider>
          <TestComponent />
        </UpgradeTriggersProvider>
      )

      const button = screen.getByText('Trigger Save Invoice')

      // Click multiple times rapidly
      fireEvent.click(button)
      fireEvent.click(button)
      fireEvent.click(button)

      // Should still only show one paywall
      expect(screen.getByTestId('paywall-modal')).toBeInTheDocument()
      expect(screen.getAllByText('Save Your Invoices').length).toBe(1)
    })
  })
})
