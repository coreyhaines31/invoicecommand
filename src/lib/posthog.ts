import posthog from 'posthog-js'
import { isSensitivePath, scrubEvent } from '@/lib/analytics-redaction'

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

let recordingEnabled = false
let pausedForPath = false

export function initPostHog() {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'
    const config = getPostHogConfig()

    if (apiKey) {
      recordingEnabled = config.enableSessionRecording
      pausedForPath = isSensitivePath(window.location.pathname)
      posthog.init(apiKey, {
        api_host: host,
        person_profiles: 'identified_only',
        capture_pageview: false, // Manual pageview capture
        capture_pageleave: true,

        // Redact share tokens (/i/<token>) and token query params from every
        // event, and drop click events on invoice pages.
        before_send: (event) => scrubEvent(event, window.location.pathname),

        // Session recording: off in development and on pages that show a share
        // token or invoice content. Sampling and min/max duration are set in
        // the PostHog project's replay settings, not here.
        disable_session_recording: !config.enableSessionRecording || pausedForPath,
        enable_recording_console_log: config.environment === 'development',
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: [
            '[data-sensitive]',
            '.credit-card',
            '.social-security',
            '.api-key',
            '[data-mask]',
            '[data-exclude]'
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

// Called on every route change: replay stops on sensitive pages and resumes
// (still subject to the project's sampling) once the visitor leaves them.
export function syncSessionRecordingForPath(pathname: string) {
  if (!recordingEnabled || !posthog.__loaded) return
  if (isSensitivePath(pathname)) {
    if (!pausedForPath) posthog.stopSessionRecording()
    pausedForPath = true
  } else if (pausedForPath) {
    pausedForPath = false
    posthog.startSessionRecording()
  }
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