import { posthog, captureError, startSessionRecording, stopSessionRecording } from '@/lib/posthog'

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

export interface ErrorAnalyticsData {
  error_type?: 'api_error' | 'validation_error' | 'network_error' | 'user_error' | 'system_error'
  error_context?: string
  user_action?: string
  additional_data?: Record<string, any>
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

  // Enhanced error tracking methods
  const trackError = (error: Error, data?: ErrorAnalyticsData) => {
    captureError(error, {
      error_type: data?.error_type || 'system_error',
      error_context: data?.error_context,
      user_action: data?.user_action,
      ...data?.additional_data,
    })
  }

  const trackApiError = (endpoint: string, status: number, message: string) => {
    trackError(new Error(`API Error: ${message}`), {
      error_type: 'api_error',
      error_context: endpoint,
      additional_data: {
        status_code: status,
        endpoint,
      }
    })
  }

  const trackValidationError = (field: string, value: any, message: string) => {
    trackError(new Error(`Validation Error: ${message}`), {
      error_type: 'validation_error',
      error_context: field,
      additional_data: {
        field,
        value: typeof value === 'string' ? value.substring(0, 100) : value, // Limit sensitive data
      }
    })
  }

  // Session recording controls
  const startRecording = () => {
    startSessionRecording()
    posthog.capture('session_recording_started', {
      timestamp: new Date().toISOString(),
    })
  }

  const stopRecording = () => {
    stopSessionRecording()
    posthog.capture('session_recording_stopped', {
      timestamp: new Date().toISOString(),
    })
  }

  // Performance tracking
  const trackPerformance = (metric: string, value: number, context?: Record<string, any>) => {
    posthog.capture('performance_metric', {
      metric_name: metric,
      metric_value: value,
      timestamp: new Date().toISOString(),
      ...context,
    })
  }

  // User interaction tracking
  const trackUserInteraction = (element: string, action: string, context?: Record<string, any>) => {
    posthog.capture('user_interaction', {
      element,
      action,
      timestamp: new Date().toISOString(),
      page_url: window.location.href,
      ...context,
    })
  }

  return {
    // Original methods
    trackInvoiceCreated,
    trackInvoiceUpdated,
    trackPdfDownload,
    trackVoiceCommand,
    trackFeatureUsed,
    trackUserSignup,
    trackUserLogin,
    identifyUser,

    // Enhanced error tracking
    trackError,
    trackApiError,
    trackValidationError,

    // Session recording controls
    startRecording,
    stopRecording,

    // Additional tracking methods
    trackPerformance,
    trackUserInteraction,
  }
}