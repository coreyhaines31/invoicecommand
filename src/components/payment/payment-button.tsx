'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { CreditCard, Loader2, Shield, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentButtonProps {
  invoiceId: string
  amount: number // Amount in cents
  currency?: string
  invoiceNumber?: string
  recipientName?: string
  disabled?: boolean
}

export function PaymentButton({
  invoiceId,
  amount,
  currency = 'usd',
  invoiceNumber,
  recipientName,
  disabled = false
}: PaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const formatAmount = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100)
  }

  const createPaymentIntent = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoiceId,
          amount,
          currency,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create payment intent')
      }

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to initialize payment')
      setIsOpen(false)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open && !clientSecret) {
      createPaymentIntent()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          disabled={disabled}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Pay {formatAmount(amount)}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            {invoiceNumber && recipientName && (
              <>Pay invoice {invoiceNumber} to {recipientName}</>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Payment Amount */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatAmount(amount)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total amount to pay
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your payment is secured by Stripe. Your card information is encrypted and never stored.
            </AlertDescription>
          </Alert>

          {/* Payment Form */}
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#16a34a',
                  }
                }
              }}
            >
              <PaymentForm
                onSuccess={() => {
                  setIsOpen(false)
                  toast.success('Payment successful!')
                }}
                onError={(error: string) => {
                  toast.error(error)
                }}
              />
            </Elements>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Initializing payment...</span>
            </div>
          ) : (
            <div className="text-center py-8 text-red-600">
              Failed to initialize payment. Please try again.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PaymentForm({
  onSuccess,
  onError
}: {
  onSuccess: () => void
  onError: (error: string) => void
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      })

      if (error) {
        onError(error.message || 'Payment failed')
      } else {
        onSuccess()
      }
    } catch (error) {
      onError('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Payment
          </>
        )}
      </Button>
    </form>
  )
}