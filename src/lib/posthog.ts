import posthog from 'posthog-js'

// Query params that carry auth/share secrets. Stripped from any URL-shaped
// string captured by PostHog (pageleave $current_url, $referrer, etc) so the
// secrets don't end up viewable in PostHog session replays / event logs.
const SENSITIVE_QUERY_PARAMS = new Set([
  'token',
  't',
  'reset_token',
  'verification_token',
  'access_token',
  'apiKey',
  'api_key',
  'key',
])

function scrubUrl(value: string): string {
  try {
    const looksAbsolute = /^https?:\/\//i.test(value)
    const u = new URL(value, looksAbsolute ? undefined : 'https://placeholder.invalid')
    let mutated = false
    for (const param of SENSITIVE_QUERY_PARAMS) {
      if (u.searchParams.has(param)) {
        u.searchParams.set(param, 'REDACTED')
        mutated = true
      }
    }
    if (!mutated) return value
    return looksAbsolute ? u.toString() : `${u.pathname}${u.search}${u.hash}`
  } catch {
    return value
  }
}

function scrubProperties<T extends Record<string, unknown>>(properties: T): T {
  for (const key of Object.keys(properties)) {
    const value = properties[key]
    if (typeof value === 'string' && (value.includes('?') || value.startsWith('/'))) {
      (properties as Record<string, unknown>)[key] = scrubUrl(value)
    }
  }
  return properties
}

interface PostHogConfig {
  enableSessionRecording: boolean
  enableErrorCapture: boolean
  environment: 'development' | 'production' | 'staging'
}

const getPostHogConfig = (): PostHogConfig => {
  const isDev = process.env.NODE_ENV === 'development'

  return {
    enableSessionRecording: !isDev, // Only in production by default
    enableErrorCapture: true,
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

        // Strip token-bearing query params from every event before it ships.
        // Reset/share/verification URLs would otherwise leak into PostHog.
        before_send: (event) => {
          if (event?.properties) scrubProperties(event.properties as Record<string, unknown>)
          return event
        },

        // Session recording: off in development. Sampling and min/max duration
        // are set in the PostHog project's replay settings, not here.
        disable_session_recording: !config.enableSessionRecording,
        enable_recording_console_log: config.environment === 'development',
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: [
            '[data-sensitive]',
            '.credit-card',
            '.social-security',
            '.api-key',
            '[data-mask]'
          ].join(','),
          blockSelector: [
            '[data-private]',
            '.private-content'
          ].join(','),
        },

        capture_heatmaps: false, // Disable for performance

        // Privacy Settings
        opt_out_capturing_by_default: false,
        respect_dnt: true, // Respect Do Not Track header

        // Development Settings
        debug: config.environment === 'development',
        verbose: config.environment === 'development',

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
        app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
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
export function captureError(error: Error, context?: Record<string, unknown>) {
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