'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Navigation } from '@/components/navigation'
import {
  CreditCard,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Loader2,
  DollarSign,
  Users,
  Crown
} from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '@supabase/supabase-js'

interface UserProfile {
  stripe_account_id?: string
  stripe_onboarding_completed?: boolean
  subscription_tier?: 'free' | 'premium' | 'pro'
}

interface PaymentSetupClientProps {
  user: User
  userProfile: UserProfile | null
  searchParams: { success?: string; refresh?: string }
}

interface AccountStatus {
  hasAccount: boolean
  accountId?: string
  onboardingCompleted: boolean
  chargesEnabled: boolean
  payoutsEnabled: boolean
  requiresAction: boolean
  country?: string
  currency?: string
  businessType?: string
  email?: string
}

export function PaymentSetupClient({ user, userProfile, searchParams }: PaymentSetupClientProps) {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState(user.email || '')
  const [country, setCountry] = useState('US')
  const [businessType, setBusinessType] = useState('individual')

  // Handle success/refresh from Stripe onboarding
  useEffect(() => {
    if (searchParams.success) {
      toast.success('Payment setup completed successfully!')
      fetchAccountStatus()
    } else if (searchParams.refresh) {
      toast.info('Please complete the payment setup process.')
      fetchAccountStatus()
    }
  }, [searchParams])

  // Fetch account status on component mount
  useEffect(() => {
    fetchAccountStatus()
  }, [])

  const fetchAccountStatus = async () => {
    try {
      const response = await fetch('/api/stripe/connect/account-status')
      if (response.ok) {
        const status = await response.json()
        setAccountStatus(status)
      }
    } catch (error) {
      console.error('Failed to fetch account status:', error)
    }
  }

  const createStripeAccount = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/connect/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, country, businessType }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create account')
      }

      toast.success('Stripe account created! Starting onboarding...')
      await startOnboarding()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  const startOnboarding = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/connect/onboarding-link', {
        method: 'POST',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create onboarding link')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to start onboarding')
    } finally {
      setLoading(false)
    }
  }

  const getSubscriptionBadge = () => {
    const tier = userProfile?.subscription_tier || 'free'
    switch (tier) {
      case 'pro':
        return <Badge variant="default" className="bg-purple-100 text-purple-800"><Crown className="w-3 h-3 mr-1" />Pro</Badge>
      case 'premium':
        return <Badge variant="default" className="bg-blue-100 text-blue-800"><Users className="w-3 h-3 mr-1" />Premium</Badge>
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  const getApplicationFeeRate = () => {
    const tier = userProfile?.subscription_tier || 'free'
    switch (tier) {
      case 'pro':
        return '0%'
      case 'premium':
      case 'free':
      default:
        return '0.5%'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Payment Setup</h1>
            <p className="text-muted-foreground">
              Connect your Stripe account to collect payments from your clients
            </p>
            <div className="flex justify-center">
              {getSubscriptionBadge()}
            </div>
          </div>

          {/* Application Fee Notice */}
          <Alert>
            <DollarSign className="h-4 w-4" />
            <AlertDescription>
              <strong>Transaction Fee:</strong> We charge a {getApplicationFeeRate()} application fee on payments you collect.
              {userProfile?.subscription_tier !== 'pro' && (
                <span className="text-blue-600"> Upgrade to Pro to eliminate all transaction fees!</span>
              )}
            </AlertDescription>
          </Alert>

          {/* Account Status Card */}
          {accountStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Stripe Account Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {accountStatus.hasAccount ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {accountStatus.hasAccount ? 'Account Created' : 'No Account'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {accountStatus.onboardingCompleted ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {accountStatus.onboardingCompleted ? 'Onboarding Complete' : 'Onboarding Needed'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {accountStatus.chargesEnabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {accountStatus.chargesEnabled ? 'Charges Enabled' : 'Charges Disabled'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {accountStatus.payoutsEnabled ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm">
                      {accountStatus.payoutsEnabled ? 'Payouts Enabled' : 'Payouts Disabled'}
                    </span>
                  </div>
                </div>

                {accountStatus.hasAccount && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Account ID:</strong> {accountStatus.accountId}</p>
                    <p><strong>Country:</strong> {accountStatus.country?.toUpperCase()}</p>
                    <p><strong>Currency:</strong> {accountStatus.currency?.toUpperCase()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Setup Actions */}
          {!accountStatus?.hasAccount ? (
            <Card>
              <CardHeader>
                <CardTitle>Create Stripe Express Account</CardTitle>
                <CardDescription>
                  Set up your payment account to start collecting payments from clients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                        {/* Add more countries as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Select value={businessType} onValueChange={setBusinessType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="company">Company</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={createStripeAccount}
                  disabled={loading || !email}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Create Stripe Account
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : accountStatus?.requiresAction ? (
            <Card>
              <CardHeader>
                <CardTitle>Complete Account Setup</CardTitle>
                <CardDescription>
                  Your Stripe account needs additional information to start processing payments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={startOnboarding}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Continue Setup with Stripe
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600">✅ Payment Setup Complete!</CardTitle>
                <CardDescription>
                  Your Stripe account is ready to collect payments. You can now add "Pay Now" buttons to your invoices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <a href="/dashboard">Go to Dashboard</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}