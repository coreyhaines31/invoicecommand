'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { hasTokenInPath } from '@/lib/analytics-redaction'

const LOADER_SRC = 'https://tracerkit.com/t.js'

// TracerKit and the tags it serves (Headstream, Fathom) record full URLs, and
// we can't redact what a third-party script reads from location. So the loader
// skips pages whose URL carries a secret: the reset-password query token and
// the share-link token in /i/<token>. Both links arrive by email or SMS, so
// those pages are normally a fresh load.
const UNTRACKED_PATHS = ['/auth/reset-password']

export function isUntrackedPath(pathname: string) {
  return UNTRACKED_PATHS.includes(pathname) || hasTokenInPath(pathname)
}

export function TracerKit() {
  const pathname = usePathname()
  const untracked = isUntrackedPath(pathname)

  useEffect(() => {
    // The tracker survives client-side navigation, so reload to drop it when a
    // tracked page links to an untracked one.
    if (untracked && document.querySelector(`script[src="${LOADER_SRC}"]`)) {
      window.location.reload()
    }
  }, [untracked])

  if (untracked) return null
  return (
    <Script
      src={LOADER_SRC}
      data-key="tk_QciHLTTNC0Ga_1LW"
      strategy="afterInteractive"
    />
  )
}
