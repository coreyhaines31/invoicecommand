'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog, syncSessionRecordingForPath } from '@/lib/posthog'
import { scrubUrl } from '@/lib/analytics-redaction'

function PostHogPageTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      syncSessionRecordingForPath(pathname)
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }
      // before_send redacts too; scrub here so the raw token never reaches
      // the capture call.
      posthog.capture('$pageview', {
        $current_url: scrubUrl(url),
      })
    }
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider() {
  useEffect(() => {
    // Initialize PostHog
    initPostHog()
  }, [])

  return (
    <Suspense fallback={null}>
      <PostHogPageTracker />
    </Suspense>
  )
}