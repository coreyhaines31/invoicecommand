/**
 * Tests for useUserTier hook and helper functions
 * Tests user tier determination and feature access control
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useUserTier, canAccessFeature, getNextTier } from '@/hooks/use-user-tier'
type User = {
  id: string
  email: string
  created_at: string
}

// Mock useUser hook
const mockUseUser = jest.fn()

jest.mock('@/hooks/use-user', () => ({
  useUser: () => mockUseUser(),
}))

describe('useUserTier', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Anonymous User', () => {
    it('should return anonymous tier when no user', async () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      const { result } = renderHook(() => useUserTier())

      await waitFor(() => {
        expect(result.current.tier).toBe('anonymous')
      })

      expect(result.current.isAnonymous).toBe(true)
      expect(result.current.isFree).toBe(false)
      expect(result.current.isPremium).toBe(false)
      expect(result.current.isPro).toBe(false)
      expect(result.current.isPaid).toBe(false)
    })

    it('should return anonymous tier while loading', () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: true,
      })

      const { result } = renderHook(() => useUserTier())

      expect(result.current.tier).toBe('anonymous')
      expect(result.current.isAnonymous).toBe(true)
    })
  })

  describe('Free User', () => {
    const mockUser: Partial<User> = {
      id: 'user-123',
      email: 'test@example.com',
      created_at: '2024-01-01',
    }

    it('should return free tier for authenticated user', async () => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })

      const { result } = renderHook(() => useUserTier())

      await waitFor(() => {
        expect(result.current.tier).toBe('free')
      })

      expect(result.current.isAnonymous).toBe(false)
      expect(result.current.isFree).toBe(true)
      expect(result.current.isPremium).toBe(false)
      expect(result.current.isPro).toBe(false)
      expect(result.current.isPaid).toBe(false)
    })

    it('should not change tier while loading', async () => {
      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: true,
      })

      const { result, rerender } = renderHook(() => useUserTier())

      expect(result.current.tier).toBe('anonymous')

      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })

      rerender()

      await waitFor(() => {
        expect(result.current.tier).toBe('free')
      })
    })
  })

  describe('Tier State Updates', () => {
    it('should update from anonymous to free when user logs in', async () => {
      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      const { result, rerender } = renderHook(() => useUserTier())

      await waitFor(() => {
        expect(result.current.tier).toBe('anonymous')
      })

      const mockUser: Partial<User> = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })

      rerender()

      await waitFor(() => {
        expect(result.current.tier).toBe('free')
      })
    })

    it('should update from free to anonymous when user logs out', async () => {
      const mockUser: Partial<User> = {
        id: 'user-123',
        email: 'test@example.com',
      }

      mockUseUser.mockReturnValue({
        user: mockUser,
        loading: false,
      })

      const { result, rerender } = renderHook(() => useUserTier())

      await waitFor(() => {
        expect(result.current.tier).toBe('free')
      })

      mockUseUser.mockReturnValue({
        user: null,
        loading: false,
      })

      rerender()

      await waitFor(() => {
        expect(result.current.tier).toBe('anonymous')
      })
    })
  })

  describe('Tier Properties', () => {
    it('should have correct boolean properties for each tier', async () => {
      const tiers = [
        { tier: 'anonymous', booleans: { isAnonymous: true, isFree: false, isPremium: false, isPro: false, isPaid: false } },
        { tier: 'free', booleans: { isAnonymous: false, isFree: true, isPremium: false, isPro: false, isPaid: false } },
      ]

      for (const { tier, booleans } of tiers) {
        mockUseUser.mockReturnValue({
          user: tier === 'anonymous' ? null : { id: '123' },
          loading: false,
        })

        const { result } = renderHook(() => useUserTier())

        await waitFor(() => {
          expect(result.current.tier).toBe(tier)
        })

        expect(result.current.isAnonymous).toBe(booleans.isAnonymous)
        expect(result.current.isFree).toBe(booleans.isFree)
        expect(result.current.isPremium).toBe(booleans.isPremium)
        expect(result.current.isPro).toBe(booleans.isPro)
        expect(result.current.isPaid).toBe(booleans.isPaid)
      }
    })
  })
})

describe('canAccessFeature', () => {
  describe('Feature Access Control', () => {
    it('should allow anonymous to access anonymous features', () => {
      expect(canAccessFeature('anonymous', 'anonymous')).toBe(true)
    })

    it('should deny anonymous access to free features', () => {
      expect(canAccessFeature('anonymous', 'free')).toBe(false)
    })

    it('should deny anonymous access to premium features', () => {
      expect(canAccessFeature('anonymous', 'premium')).toBe(false)
    })

    it('should deny anonymous access to pro features', () => {
      expect(canAccessFeature('anonymous', 'pro')).toBe(false)
    })

    it('should allow free user to access anonymous features', () => {
      expect(canAccessFeature('free', 'anonymous')).toBe(true)
    })

    it('should allow free user to access free features', () => {
      expect(canAccessFeature('free', 'free')).toBe(true)
    })

    it('should deny free user access to premium features', () => {
      expect(canAccessFeature('free', 'premium')).toBe(false)
    })

    it('should deny free user access to pro features', () => {
      expect(canAccessFeature('free', 'pro')).toBe(false)
    })

    it('should allow premium user to access all non-pro features', () => {
      expect(canAccessFeature('premium', 'anonymous')).toBe(true)
      expect(canAccessFeature('premium', 'free')).toBe(true)
      expect(canAccessFeature('premium', 'premium')).toBe(true)
    })

    it('should deny premium user access to pro features', () => {
      expect(canAccessFeature('premium', 'pro')).toBe(false)
    })

    it('should allow pro user to access all features', () => {
      expect(canAccessFeature('pro', 'anonymous')).toBe(true)
      expect(canAccessFeature('pro', 'free')).toBe(true)
      expect(canAccessFeature('pro', 'premium')).toBe(true)
      expect(canAccessFeature('pro', 'pro')).toBe(true)
    })
  })

  describe('Tier Hierarchy', () => {
    it('should respect tier hierarchy order', () => {
      const tiers = ['anonymous', 'free', 'premium', 'pro'] as const

      for (let i = 0; i < tiers.length; i++) {
        for (let j = 0; j < tiers.length; j++) {
          const hasAccess = canAccessFeature(tiers[i], tiers[j])
          const shouldHaveAccess = i >= j

          expect(hasAccess).toBe(shouldHaveAccess)
        }
      }
    })
  })
})

describe('getNextTier', () => {
  it('should return free for anonymous', () => {
    expect(getNextTier('anonymous')).toBe('free')
  })

  it('should return premium for free', () => {
    expect(getNextTier('free')).toBe('premium')
  })

  it('should return pro for premium', () => {
    expect(getNextTier('premium')).toBe('pro')
  })

  it('should return null for pro (highest tier)', () => {
    expect(getNextTier('pro')).toBe(null)
  })

  describe('Upgrade Path', () => {
    it('should provide correct upgrade path from anonymous to pro', () => {
      let currentTier = 'anonymous' as any
      const path = []

      while (currentTier) {
        path.push(currentTier)
        currentTier = getNextTier(currentTier)
      }

      expect(path).toEqual(['anonymous', 'free', 'premium', 'pro'])
    })

    it('should provide correct upgrade path from free to pro', () => {
      let currentTier = 'free' as any
      const path = []

      while (currentTier) {
        path.push(currentTier)
        currentTier = getNextTier(currentTier)
      }

      expect(path).toEqual(['free', 'premium', 'pro'])
    })
  })
})
