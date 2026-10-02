import { Metadata } from 'next'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import type { TemplateCluster, TemplateVariant } from '@/types/templates'

const SITE = 'https://invoicecommand.com'

export function buildStandaloneMetadata(variant: TemplateVariant): Metadata {
  const url = `${SITE}/${variant.slug}`
  return {
    title: variant.metaTitle,
    description: variant.metaDescription,
    keywords: variant.keywords,
    openGraph: {
      title: variant.metaTitle,
      description: variant.metaDescription,
      url,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: variant.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: variant.metaTitle,
      description: variant.metaDescription,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: url,
    },
  }
}

type Props = {
  variant: TemplateVariant
  cluster: TemplateCluster
  hubLabel: string
}

export function StandaloneToolPage({ variant, cluster, hubLabel }: Props) {
  const url = `${SITE}/${variant.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: variant.h1,
    description: variant.metaDescription,
    url,
    mainEntity: {
      '@type': 'SoftwareApplication',
      name: variant.h1,
      applicationCategory: 'BusinessApplication',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      description: variant.metaDescription,
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: variant.h1, item: url },
      ],
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: variant.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: { '@type': 'Answer', text: q.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <nav className="container mx-auto p-4 mb-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">
                Invoice Command
              </span>
            </Link>
          </div>
        </nav>

        <header className="container mx-auto p-4 mb-8">
          <div className="max-w-4xl mx-auto">
            <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-primary">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{variant.h1}</span>
            </nav>
            <h1 className="text-4xl font-bold text-foreground mb-4">{variant.h1}</h1>
            <p className="text-xl text-muted-foreground">{variant.intro}</p>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <section className="max-w-4xl mx-auto space-y-8">
            {variant.sections.map((section) => (
              <div
                key={section.heading}
                className="bg-card border border-border rounded-lg p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {section.heading}
                </h2>
                <p className="text-muted-foreground">{section.body}</p>
              </div>
            ))}

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-4">
                {variant.faq.map((q) => (
                  <details key={q.question} className="border-b border-border pb-4">
                    <summary className="font-semibold cursor-pointer hover:text-primary">
                      {q.question}
                    </summary>
                    <p className="text-sm text-muted-foreground mt-2">{q.answer}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Browse all {hubLabel} templates
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Need a different format or industry? See our full library — Excel,
                Word, PDF, and profession-specific variants.
              </p>
              <Link
                href={cluster.basePath}
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition"
              >
                View all {hubLabel} templates
              </Link>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
