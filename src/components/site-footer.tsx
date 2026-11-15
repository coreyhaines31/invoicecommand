import Link from 'next/link'
import { Logo } from './logo'

const LINKS = [
  { href: '/', label: 'Invoice generator' },
  { href: '/estimate-maker', label: 'Estimate maker' },
  { href: '/invoice-templates', label: 'Invoice templates' },
  { href: '/estimate-templates', label: 'Estimate templates' },
  { href: '/purchase-order-template', label: 'Purchase orders' },
  { href: '/sales-order-template', label: 'Sales orders' },
  { href: '/blog', label: 'Blog' },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border pt-8 pb-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md font-semibold text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <Logo width={20} height={20} className="text-primary" />
            Invoice Command
          </Link>
          <p className="max-w-sm text-sm text-muted-foreground">
            Your data is stored locally in your browser. No signup required.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm sm:grid-cols-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:min-h-8"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="mt-8 text-xs text-muted-foreground" suppressHydrationWarning>
        © {new Date().getFullYear()} Swipe Files LLC. All rights reserved.
      </p>
    </footer>
  )
}
