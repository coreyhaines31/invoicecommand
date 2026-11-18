'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Reveals [data-reveal] sections once as they scroll into view.
//
// Elements are visible in the server HTML. After hydration, only elements that
// start below the fold are marked "pending" (hidden), so nothing the user can
// already see, including the LCP element, ever disappears. Each one flips to
// "shown" the first time it enters the viewport and is never hidden again.
// With reduced motion or no IntersectionObserver, this does nothing.
export function ScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.dataset.reveal = 'shown'
          observer.unobserve(el)
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )

    const fold = window.innerHeight
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.dataset.reveal === 'shown' || el.dataset.reveal === 'pending') return
      if (el.getBoundingClientRect().top < fold) return
      el.dataset.reveal = 'pending'
      observer.observe(el)
    })

    return () => {
      observer.disconnect()
      // Never leave anything hidden once we stop watching it.
      document.querySelectorAll<HTMLElement>('[data-reveal="pending"]').forEach((el) => {
        el.dataset.reveal = 'shown'
      })
    }
  }, [pathname])

  return null
}
