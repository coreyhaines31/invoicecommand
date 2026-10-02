'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Crown,
  Zap,
  Users,
  Palette,
  Mic,
  FileText,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { UserTier, getNextTier } from '@/hooks/use-user-tier'

export interface PaywallTrigger {
  feature: string
  title: string
  description: string
  icon: React.ReactNode
  fromTier: UserTier
  toTier: UserTier
  benefits: string[]
  ctaText: string
  ctaAction: () => void
}

interface PaywallModalProps {
  isOpen: boolean
  onClose: () => void
  trigger: PaywallTrigger
}

const tierColors = {
  free: 'bg-blue-50 border-blue-200 text-blue-800',
  premium: 'bg-purple-50 border-purple-200 text-purple-800',
  pro: 'bg-amber-50 border-amber-200 text-amber-800'
}

const tierPricing = {
  free: 'Free Forever',
  premium: '$10/month',
  pro: '$100/month'
}

const tierFeatures = {
  free: [
    '10 voice commands/month',
    'Save unlimited invoices',
    'Logo upload',
    '3 professional templates',
    'Basic payment collection'
  ],
  premium: [
    'Unlimited voice AI',
    'Custom brand themes',
    'Team collaboration',
    'Recurring invoices',
    'Advanced analytics',
    'Email tracking'
  ],
  pro: [
    '0% transaction fees',
    'White-label branding',
    'Priority 24/7 support',
    'Custom domain',
    'API access',
    'Dedicated account manager'
  ]
}

export function PaywallModal({ isOpen, onClose, trigger }: PaywallModalProps) {
  const [isUpgrading, setIsUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setIsUpgrading(true)
    try {
      await trigger.ctaAction()
    } finally {
      setIsUpgrading(false)
    }
  }

  const getTierIcon = (tier: UserTier) => {
    switch (tier) {
      case 'free': return <FileText className="w-5 h-5" />
      case 'premium': return <Crown className="w-5 h-5" />
      case 'pro': return <Sparkles className="w-5 h-5" />
      default: return null
    }
  }

  const currentFeatures = trigger.toTier ? tierFeatures[trigger.toTier] : []

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="text-center space-y-6 py-4">
          {/* Header */}
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold">
              {trigger.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {trigger.toTier === 'free'
                ? 'Create a free account to unlock this feature'
                : `Upgrade to ${trigger.toTier} to unlock this feature`}
            </DialogDescription>
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="text-4xl font-bold">
              {trigger.toTier === 'free' ? 'Free' :
               trigger.toTier === 'premium' ? '$10' :
               '$100'}
            </div>
            {trigger.toTier !== 'free' && (
              <div className="text-sm text-muted-foreground">
                per month
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 text-left">
            {currentFeatures.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleUpgrade}
            disabled={isUpgrading}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {isUpgrading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Loading...
              </>
            ) : (
              <>
                {trigger.toTier === 'free' ? 'Create Free Account' : 'Upgrade Now'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* Trust indicators */}
          <div className="text-xs text-muted-foreground">
            ✨ Instant access • 💳 Cancel anytime
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}