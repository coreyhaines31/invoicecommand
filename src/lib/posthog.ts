import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window !== 'undefined') {
    const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

    if (apiKey) {
      posthog.init(apiKey, {
        api_host: host,
        person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
        capture_pageview: false, // Disable automatic pageview capture, as we capture manually
        capture_pageleave: true, // Enable pageleave capture
      })
    }
  }

  return posthog
}

export { posthog }