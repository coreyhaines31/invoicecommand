'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'

// The reset-password URL carries the reset token in its query string, and both
// TracerKit and Headstream record full URLs, so the loader skips that page.
// Reset links arrive by email, so the page is always a fresh load.
const UNTRACKED_PATHS = ['/auth/reset-password']

export function TracerKit() {
  const pathname = usePathname()
  if (UNTRACKED_PATHS.includes(pathname)) return null
  return (
    <Script
      src="https://tracerkit.com/t.js"
      data-key="tk_QciHLTTNC0Ga_1LW"
      strategy="afterInteractive"
    />
  )
}
