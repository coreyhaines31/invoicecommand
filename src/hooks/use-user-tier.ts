'use client'

import { useUser } from '@/hooks/use-user'
import { useEffect, useState } from 'react'

export type UserTier = 'anonymous' | 'free' | 'premium' | 'pro'

export interface UserTierInfo {
  tier: UserTier
  loading: boolean
  isAnonymous: boolean
  isFree: boolean
  isPremium: boolean
  isPro: boolean
  isPaid: boolean
}

export function useUserTier(): UserTierInfo {
  const { user, loading } = useUser()
  const [tier, setTier] = useState<UserTier>('anonymous')

  useEffect(() => {
    if (loading) return

    if (!user) {
      setTier('anonymous')
      return
    }

    // TODO: Implement actual subscription status check from database
    // For now, default to free for authenticated users
    // Later: Check user.subscription_status or similar field
    setTier('free')
  }, [user, loading])

  return {
    tier,
    loading,
    isAnonymous: tier === 'anonymous',
    isFree: tier === 'free',
    isPremium: tier === 'premium',
    isPro: tier === 'pro',
    isPaid: tier === 'premium' || tier === 'pro'
  }
}

// Helper function to check if user can access a feature
export function canAccessFeature(
  userTier: UserTier,
  requiredTier: UserTier
): boolean {
  const tierHierarchy: Record<UserTier, number> = {
    anonymous: 0,
    free: 1,
    premium: 2,
    pro: 3
  }

  return tierHierarchy[userTier] >= tierHierarchy[requiredTier]
}

// Helper function to get the next tier up
export function getNextTier(currentTier: UserTier): UserTier | null {
  const nextTiers: Record<UserTier, UserTier | null> = {
    anonymous: 'free',
    free: 'premium',
    premium: 'pro',
    pro: null
  }

  return nextTiers[currentTier]
}