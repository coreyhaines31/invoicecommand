'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUserTier, UserTier } from '@/hooks/use-user-tier'
import { PaywallModal, PaywallTrigger } from '@/components/paywall/paywall-modal'
import {
  Mic,
  FileText,
  Palette,
  TrendingUp
} from 'lucide-react'

interface UpgradeTriggersContextType {
  triggerUpgrade: (triggerKey: string) => void
  canAccess: (feature: string, requiredTier: UserTier) => boolean
  showPaywall: (trigger: PaywallTrigger) => void
}

const UpgradeTriggersContext = createContext<UpgradeTriggersContextType | null>(null)

// Predefined upgrade triggers
const UPGRADE_TRIGGERS: Record<string, PaywallTrigger> = {
  // Anonymous → Free
  'save-invoice': {
    feature: 'invoice saving',
    title: 'Save Your Invoices',
    description: 'Create a free account to save unlimited invoices and access your invoice history.',
    icon: <FileText className="w-5 h-5 text-primary" />,
    fromTier: 'anonymous',
    toTier: 'free',
    benefits: [
      'Save unlimited invoices',
      'Access invoice history dashboard',
      'Duplicate and edit saved invoices',
      '10 voice commands per month'
    ],
    ctaText: 'Create Free Account',
    // The draft stays in localStorage, so send the new user back to the builder.
    ctaAction: () => window.location.href = '/auth/signup?next=%2F'
  },

  'logo-upload': {
    feature: 'logo customization',
    title: 'Add Your Logo',
    description: 'Sign up for free to add your professional logo to all invoices.',
    icon: <Palette className="w-5 h-5 text-primary" />,
    fromTier: 'anonymous',
    toTier: 'free',
    benefits: [
      'Upload custom logo to invoices',
      'Professional branded appearance',
      'Save unlimited invoices',
      '10 voice commands per month'
    ],
    ctaText: 'Sign Up Free',
    ctaAction: () => window.location.href = '/auth/signup'
  },

  'style-selection': {
    feature: 'invoice styles',
    title: 'Unlock More Styles',
    description: 'Create a free account to access Classic and Minimal invoice styles.',
    icon: <Palette className="w-5 h-5 text-primary" />,
    fromTier: 'anonymous',
    toTier: 'free',
    benefits: [
      'Access to all 3 invoice styles',
      'Professional template variety',
      'Save unlimited invoices',
      'Upload custom logos'
    ],
    ctaText: 'Sign Up Free',
    ctaAction: () => window.location.href = '/auth/signup'
  },

  'voice-limit-anonymous': {
    feature: 'voice commands',
    title: 'Sign In to Use Voice Commands',
    description: 'Voice commands need a free account. Free accounts get 10 a month.',
    icon: <Mic className="w-5 h-5 text-primary" />,
    fromTier: 'anonymous',
    toTier: 'free',
    benefits: [
      '10 voice commands per month',
      'Save and manage invoices',
      'Add custom logos',
      'Access 3 professional templates'
    ],
    ctaText: 'Upgrade to Free Account',
    ctaAction: () => window.location.href = '/auth/signup'
  },

  'dashboard-access': {
    feature: 'invoice dashboard',
    title: 'Access Your Dashboard',
    description: 'Create a free account to view your invoice history and manage saved invoices.',
    icon: <TrendingUp className="w-5 h-5 text-primary" />,
    fromTier: 'anonymous',
    toTier: 'free',
    benefits: [
      'Complete invoice history',
      'Search invoices by client or number',
      'Invoice totals and paid count',
      'Duplicate and edit functionality'
    ],
    ctaText: 'Create Account',
    ctaAction: () => window.location.href = '/auth/signup'
  },

  // Free → Premium
  'voice-limit-free': {
    feature: 'voice commands',
    title: 'Voice Command Limit Reached',
    description: 'You\'ve used all 10 voice commands for this month. More become available at the start of next month.',
    icon: <Mic className="w-5 h-5 text-primary" />,
    fromTier: 'free',
    toTier: 'premium',
    benefits: [],
    ctaText: 'See Plans',
    ctaAction: () => window.location.href = '/billing'
  }
}

interface UpgradeTriggersProviderProps {
  children: ReactNode
}

export function UpgradeTriggersProvider({ children }: UpgradeTriggersProviderProps) {
  const [currentPaywall, setCurrentPaywall] = useState<PaywallTrigger | null>(null)
  const { tier } = useUserTier()
  const router = useRouter()

  const triggerUpgrade = useCallback((triggerKey: string) => {
    const trigger = UPGRADE_TRIGGERS[triggerKey]
    if (!trigger) {
      console.warn(`Unknown upgrade trigger: ${triggerKey}`)
      return
    }

    // Only show paywall if user is on the expected tier
    if (tier === trigger.fromTier) {
      setCurrentPaywall(trigger)
    }
  }, [tier])

  const canAccess = useCallback((feature: string, requiredTier: UserTier) => {
    const tierHierarchy: Record<UserTier, number> = {
      anonymous: 0,
      free: 1,
      premium: 2,
      pro: 3
    }

    return tierHierarchy[tier] >= tierHierarchy[requiredTier]
  }, [tier])

  const showPaywall = useCallback((trigger: PaywallTrigger) => {
    setCurrentPaywall(trigger)
  }, [])

  const closePaywall = useCallback(() => {
    setCurrentPaywall(null)
  }, [])

  return (
    <UpgradeTriggersContext.Provider
      value={{
        triggerUpgrade,
        canAccess,
        showPaywall
      }}
    >
      {children}
      {currentPaywall && (
        <PaywallModal
          isOpen={true}
          onClose={closePaywall}
          trigger={currentPaywall}
        />
      )}
    </UpgradeTriggersContext.Provider>
  )
}

export function useUpgradeTriggers() {
  const context = useContext(UpgradeTriggersContext)
  if (!context) {
    throw new Error('useUpgradeTriggers must be used within UpgradeTriggersProvider')
  }
  return context
}