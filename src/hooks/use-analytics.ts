import { posthog } from '@/lib/posthog'

export interface InvoiceAnalyticsData {
  items_count?: number
  has_tax?: boolean
  has_discount?: boolean
  total_amount?: number
  currency?: string
  voice_used?: boolean
}

export interface VoiceAnalyticsData {
  command_type?: string
  success?: boolean
  error?: string
}

export function useAnalytics() {
  const trackInvoiceCreated = (data?: InvoiceAnalyticsData) => {
    posthog.capture('invoice_created', {
      items_count: data?.items_count || 0,
      has_tax: data?.has_tax || false,
      has_discount: data?.has_discount || false,
      total_amount: data?.total_amount || 0,
      currency: data?.currency || 'USD',
      voice_used: data?.voice_used || false,
    })
  }

  const trackInvoiceUpdated = (field: string, data?: InvoiceAnalyticsData) => {
    posthog.capture('invoice_updated', {
      field_updated: field,
      items_count: data?.items_count || 0,
      has_tax: data?.has_tax || false,
      has_discount: data?.has_discount || false,
      total_amount: data?.total_amount || 0,
      currency: data?.currency || 'USD',
    })
  }

  const trackPdfDownload = (data?: InvoiceAnalyticsData) => {
    posthog.capture('invoice_pdf_downloaded', {
      items_count: data?.items_count || 0,
      has_tax: data?.has_tax || false,
      has_discount: data?.has_discount || false,
      total_amount: data?.total_amount || 0,
      currency: data?.currency || 'USD',
    })
  }

  const trackVoiceCommand = (data?: VoiceAnalyticsData) => {
    posthog.capture('voice_command_used', {
      command_type: data?.command_type || 'unknown',
      success: data?.success || false,
      error: data?.error || null,
    })
  }

  const trackFeatureUsed = (feature: string, details?: Record<string, any>) => {
    posthog.capture('feature_used', {
      feature_name: feature,
      ...details,
    })
  }

  const trackUserSignup = (method: 'email' | 'google' | 'github') => {
    posthog.capture('user_signup', {
      signup_method: method,
    })
  }

  const trackUserLogin = (method: 'email' | 'google' | 'github') => {
    posthog.capture('user_login', {
      login_method: method,
    })
  }

  const identifyUser = (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties)
  }

  return {
    trackInvoiceCreated,
    trackInvoiceUpdated,
    trackPdfDownload,
    trackVoiceCommand,
    trackFeatureUsed,
    trackUserSignup,
    trackUserLogin,
    identifyUser,
  }
}