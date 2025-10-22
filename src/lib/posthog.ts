import posthog from 'posthog-js'

interface PostHogConfig {
  enableSessionRecording: boolean
  enableErrorCapture: boolean
  sessionSamplingRate: number
  environment: 'development' | 'production' | 'staging'
}

const getPostHogConfig = (): PostHogConfig => {
  const isDev = process.env.NODE_ENV === 'development'

  return {
    enableSessionRecording: !isDev, // Only in production by default
    enableErrorCapture: true,
    sessionSamplingRate: isDev ? 1.0 : 0.1, // 100% in dev, 10% in prod
    environment: isDev ? 'development' : 'production'
  }
}

export function initPostHog() {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
    const config = getPostHogConfig()

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        person_profiles: 'identified_only',
        capture_pageview: false, // Manual pageview capture
        capture_pageleave: true,

        // Session Recording Configuration
        session_recording: {
          enabled: config.enableSessionRecording,
          sampling_rate: config.sessionSamplingRate,
          minimum_duration_ms: 2000, // Only record sessions longer than 2 seconds
          maximum_duration_ms: 1800000, // Cap at 30 minutes
          capture_performance: true, // Include performance metrics
          capture_console: config.environment === 'development', // Console logs in dev only

          // Privacy Settings
          mask_all_element_attributes: false,
          mask_all_text: false,
          mask_input_text: true, // Always mask input text for privacy

          // Specific elements to mask (CSS selectors)
          mask_input_options: {
            password: true,
            email: true,
            tel: true,
          },

          // Custom masking for sensitive elements
          mask_text_selector: [
            '[data-sensitive]',
            '.credit-card',
            '.social-security',
            '.api-key',
            '[data-mask]'
          ].join(','),

          // Block specific elements from recording
          block_selector: [
            '[data-private]',
            '.private-content'
          ].join(','),
        },

        // Error Capture Configuration
        capture_heatmaps: false, // Disable for performance
        disable_session_recording_for_opt_out: true,

        // Performance Settings
        batch_size: 10,
        request_timeout_ms: 10000,

        // Privacy Settings
        opt_out_capturing_by_default: false,
        respect_dnt: true, // Respect Do Not Track header

        // Development Settings
        debug: config.environment === 'development',
        verbose: config.environment === 'development',

        // Custom properties for all events
        properties: {
          environment: config.environment,
          app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        },

        // Feature flags
        bootstrap: {
          featureFlags: {},
        },
      })

      // Set up automatic error capture
      if (config.enableErrorCapture) {
        setupErrorCapture()
      }

      // Set global properties
      posthog.register({
        environment: config.environment,
        app_name: 'Invoice Command',
        platform: 'web',
      })
    }
  }

  return posthog
}

function setupErrorCapture() {
  // Capture unhandled JavaScript errors
  window.addEventListener('error', (event) => {
    posthog.capture('$exception', {
      error_message: event.message,
      error_source: event.filename,
      error_line: event.lineno,
      error_column: event.colno,
      error_stack: event.error?.stack,
      error_type: 'javascript_error',
      user_agent: navigator.userAgent,
    })
  })

  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    posthog.capture('$exception', {
      error_message: event.reason?.message || 'Unhandled Promise Rejection',
      error_stack: event.reason?.stack,
      error_type: 'unhandled_rejection',
      promise_rejection_reason: String(event.reason),
      user_agent: navigator.userAgent,
    })
  })
}

// Manual error capture function
export function captureError(error: Error, context?: Record<string, any>) {
  posthog.capture('$exception', {
    error_message: error.message,
    error_name: error.name,
    error_stack: error.stack,
    error_type: 'manual_capture',
    ...context,
  })
}

// Session replay controls
export function startSessionRecording() {
  posthog.startSessionRecording()
}

export function stopSessionRecording() {
  posthog.stopSessionRecording()
}

// Privacy controls
export function optOutOfRecording() {
  posthog.opt_out_capturing()
}

export function optInToRecording() {
  posthog.opt_in_capturing()
}

export { posthog }