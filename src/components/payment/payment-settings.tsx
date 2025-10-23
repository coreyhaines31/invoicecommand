'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CreditCard, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface PaymentSettingsProps {
  onPaymentToggle: (enabled: boolean) => void
  paymentEnabled: boolean
  invoiceTotal: number
  currency?: string
}

interface AccountStatus {
  hasAccount: boolean
  onboardingCompleted: boolean
  chargesEnabled: boolean
  requiresAction: boolean
}

export function PaymentSettings({
  onPaymentToggle,
  paymentEnabled,
  invoiceTotal,
  currency = 'USD'
}: PaymentSettingsProps) {
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null)
  const [loading, setLoading] = useState(true)

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
    } finally {
      setLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  const canEnablePayments = accountStatus?.hasAccount &&
                           accountStatus?.onboardingCompleted &&
                           accountStatus?.chargesEnabled

  const handleToggle = (enabled: boolean) => {
    if (enabled && !canEnablePayments) {
      return // Don't allow enabling if not set up
    }
    onPaymentToggle(enabled)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading payment settings...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Collection
        </CardTitle>
        <CardDescription>
          Allow clients to pay this invoice online with a credit card
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* Payment Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="payment-enabled">Enable Online Payments</Label>
            <p className="text-sm text-muted-foreground">
              Add a "Pay Now" button to your invoice
            </p>
          </div>
          <Switch
            id="payment-enabled"
            checked={paymentEnabled}
            onCheckedChange={handleToggle}
            disabled={!canEnablePayments}
          />
        </div>

        {/* Payment Amount Display */}
        {paymentEnabled && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Payment Amount:</strong> {formatAmount(invoiceTotal)}
              <br />
              Clients will be able to pay this amount online.
            </AlertDescription>
          </Alert>
        )}

        {/* Account Status */}
        {!accountStatus?.hasAccount ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Setup Required:</strong> You need to connect a Stripe account to collect payments.
              <div className="mt-2">
                <Button asChild size="sm">
                  <Link href="/dashboard/payments/setup">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Set Up Payments
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : !accountStatus?.onboardingCompleted ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Onboarding Required:</strong> Complete your Stripe account setup to collect payments.
              <div className="mt-2">
                <Button asChild size="sm" variant="outline">
                  <Link href="/dashboard/payments/setup">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Complete Setup
                  </Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        ) : !accountStatus?.chargesEnabled ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Account Review:</strong> Your Stripe account is being reviewed. You'll be able to collect payments once approved.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Ready to collect payments!</strong> Your Stripe account is fully set up.
              {paymentEnabled ? (
                <span> Clients can now pay this invoice online.</span>
              ) : (
                <span> Toggle the switch above to add a "Pay Now" button.</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Fee Information */}
        {canEnablePayments && (
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
            <p><strong>Transaction Fees:</strong></p>
            <p>• Stripe processing: 2.9% + 30¢</p>
            <p>• Invoice Command: 0.5% (Pro users: 0%)</p>
            <p>• You receive the remaining amount</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}