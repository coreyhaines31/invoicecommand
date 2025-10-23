import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'

// Server-side Stripe instance
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
})

// Client-side Stripe promise
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Stripe Connect configuration
export const STRIPE_CONNECT_CONFIG = {
  // Application fee rates based on user tier
  APPLICATION_FEE_RATES: {
    free: 0.5, // 0.5% for free users
    premium: 0.5, // 0.5% for premium users
    pro: 0, // 0% for pro users (they pay $100/mo to eliminate fees)
  },

  // Express account settings
  EXPRESS_ACCOUNT_SETTINGS: {
    type: 'express' as const,
    country: 'US', // Default country, can be customized per user
    email: '', // Will be set from user's email
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual' as const, // Default, can be changed during onboarding
    settings: {
      payouts: {
        schedule: {
          interval: 'daily' as const,
        },
      },
    },
  },
} as const

// Helper function to calculate application fee
export function calculateApplicationFee(
  amount: number,
  userTier: 'free' | 'premium' | 'pro'
): number {
  const rate = STRIPE_CONNECT_CONFIG.APPLICATION_FEE_RATES[userTier]
  return Math.round(amount * rate / 100) // Convert percentage to cents
}

// Helper function to get user tier from database
export async function getUserTier(userId: string): Promise<'free' | 'premium' | 'pro'> {
  // TODO: Implement database lookup for user subscription status
  // For now, return 'free' as default
  return 'free'
}