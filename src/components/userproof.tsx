'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SDK_SRC = 'https://ingest.getuserproof.com/sdk.js'
const SITE_ID = '90e7df49-1078-44b6-87e4-271fb2716fd7'

// UserProof records clicks and page text, so it only runs on public pages —
// never on auth, dashboard, settings, billing, saved or shared invoices.
// The live invoice preview on the builder pages is marked data-exclude.
const PUBLIC_SECTIONS = [
  '/blank-purchase-order',
  '/blog',
  '/estimate-maker',
  '/estimate-templates',
  '/free-purchase-order',
  '/invoice-templates',
  '/purchase-order-generator',
  '/purchase-order-maker',
  '/purchase-order-software',
  '/purchase-order-template',
  '/sales-order-form',
  '/sales-order-generator',
  '/sales-order-template',
]

function isPublicPage(pathname: string) {
  return (
    pathname === '/' ||
    PUBLIC_SECTIONS.some((s) => pathname === s || pathname.startsWith(`${s}/`))
  )
}

export function UserProof() {
  const pathname = usePathname()
  const recordable = isPublicPage(pathname)

  useEffect(() => {
    // The recorder survives client-side navigation, so reload to drop it when
    // a public link leads somewhere private.
    if (!recordable && document.querySelector(`script[src="${SDK_SRC}"]`)) {
      window.location.reload()
    }
  }, [recordable])

  if (!recordable) return null
  return <Script src={SDK_SRC} data-site={SITE_ID} strategy="afterInteractive" />
}
