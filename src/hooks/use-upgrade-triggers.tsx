'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useUserTier, UserTier } from '@/hooks/use-user-tier'
import { PaywallModal, PaywallTrigger } from '@/components/paywall/paywall-modal'
import {
  Mic,
  FileText,
  Palette,
  Users,
  Mail,
  RefreshCw,
  TrendingUp,
  Crown,
  Zap,
  Shield
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
      'Increase voice commands to 10/month'
    ],
    ctaText: 'Create Free Account',
    ctaAction: () => window.location.href = '/auth/signup'
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
    title: 'Voice Command Limit Reached',
    description: 'You\'ve used all 3 free voice commands. Create an account for 10 monthly commands.',
    icon: <Mic className="w-5 h-5 text-primary" />,
    fromTier: 'anonymous',
    toTier: 'free',
    benefits: [
      '10 voice commands per month (3x more)',
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
      'Search and filter invoices',
      'Real-time statistics',
      'Duplicate and edit functionality'
    ],
    ctaText: 'Create Account',
    ctaAction: () => window.location.href = '/auth/signup'
  },

  // Free → Premium
  'voice-limit-free': {
    feature: 'unlimited voice commands',
    title: 'Voice Command Limit Reached',
    description: 'You\'ve used all 10 monthly voice commands. Upgrade to Premium for unlimited AI voice.',
    icon: <Mic className="w-5 h-5 text-primary" />,
    fromTier: 'free',
    toTier: 'premium',
    benefits: [
      'Unlimited AI voice commands',
      'Custom brand themes',
      'Team collaboration features',
      'Advanced analytics dashboard'
    ],
    ctaText: 'Upgrade to Premium',
    ctaAction: () => window.location.href = '/billing'
  },

  'custom-themes': {
    feature: 'custom branding',
    title: 'Unlock Custom Themes',
    description: 'Create unlimited custom brand themes with your colors, fonts, and styling.',
    icon: <Palette className="w-5 h-5 text-primary" />,
    fromTier: 'free',
    toTier: 'premium',
    benefits: [
      'Unlimited custom brand themes',
      'Advanced color and font options',
      'Logo placement variations',
      'Branded email templates'
    ],
    ctaText: 'Upgrade to Premium',
    ctaAction: () => window.location.href = '/billing'
  },

  'team-collaboration': {
    feature: 'team features',
    title: 'Team Collaboration',
    description: 'Invite unlimited team members and collaborate on invoices together.',
    icon: <Users className="w-5 h-5 text-primary" />,
    fromTier: 'free',
    toTier: 'premium',
    benefits: [
      'Invite unlimited team members',
      'Role-based permissions',
      'Team invoice collaboration',
      'Approval workflows'
    ],
    ctaText: 'Unlock Team Features',
    ctaAction: () => window.location.href = '/billing'
  },

  'recurring-invoices': {
    feature: 'automation',
    title: 'Automate Recurring Invoices',
    description: 'Set up automated recurring billing and subscription management.',
    icon: <RefreshCw className="w-5 h-5 text-primary" />,
    fromTier: 'free',
    toTier: 'premium',
    benefits: [
      'Automated recurring invoices',
      'Subscription management',
      'Auto-send scheduling',
      'Payment reminders'
    ],
    ctaText: 'Enable Automation',
    ctaAction: () => window.location.href = '/billing'
  },

  'email-tracking': {
    feature: 'email insights',
    title: 'Track Email Opens',
    description: 'See when clients view your invoices and get detailed email analytics.',
    icon: <Mail className="w-5 h-5 text-primary" />,
    fromTier: 'free',
    toTier: 'premium',
    benefits: [
      'Email open tracking',
      'View timestamps',
      'Client engagement insights',
      'Automated follow-up reminders'
    ],
    ctaText: 'Get Email Tracking',
    ctaAction: () => window.location.href = '/billing'
  },

  // Premium → Pro
  'zero-fees': {
    feature: 'fee elimination',
    title: 'Eliminate All Transaction Fees',
    description: 'Upgrade to Pro and pay 0% fees on all Stripe transactions.',
    icon: <Zap className="w-5 h-5 text-primary" />,
    fromTier: 'premium',
    toTier: 'pro',
    benefits: [
      '0% transaction fees on all payments',
      'Direct Stripe integration',
      'Priority payment processing',
      'Advanced payment analytics'
    ],
    ctaText: 'Eliminate Fees',
    ctaAction: () => window.location.href = '/billing'
  },

  'white-label': {
    feature: 'white-label branding',
    title: 'White-Label Solution',
    description: 'Remove all InvoiceCommand branding and use your custom domain.',
    icon: <Crown className="w-5 h-5 text-primary" />,
    fromTier: 'premium',
    toTier: 'pro',
    benefits: [
      'Complete white-label branding',
      'Custom domain integration',
      'Remove all platform branding',
      'Enterprise-grade customization'
    ],
    ctaText: 'Go White-Label',
    ctaAction: () => window.location.href = '/billing'
  },

  'priority-support': {
    feature: 'enterprise support',
    title: 'Priority Support',
    description: 'Get 24/7 priority support with a dedicated account manager.',
    icon: <Shield className="w-5 h-5 text-primary" />,
    fromTier: 'premium',
    toTier: 'pro',
    benefits: [
      '24/7 priority support',
      'Dedicated account manager',
      'Phone support availability',
      'Custom onboarding session'
    ],
    ctaText: 'Get Priority Support',
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