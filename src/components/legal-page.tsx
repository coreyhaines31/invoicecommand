import type { ReactNode } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'

export const LEGAL_LAST_UPDATED = 'November 18, 2026'

type LegalPageProps = {
  title: string
  children: ReactNode
}

// Same header and prose styles as the blog post pages.
export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="container mx-auto p-4 mb-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Logo width={24} height={24} className="text-primary" />
            <span className="text-lg font-semibold text-foreground">Invoice Command</span>
          </Link>
        </div>
      </nav>

      <article className="container mx-auto p-4">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{title}</span>
          </nav>

          <header className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">{title}</h1>
            <p className="text-sm text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground">
            {children}
          </div>

          <div className="mt-12 pt-8 border-t border-border text-sm text-muted-foreground flex gap-4">
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
          </div>
        </div>
      </article>
    </div>
  )
}
