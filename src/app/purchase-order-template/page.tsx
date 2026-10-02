import { Metadata } from 'next'
import Link from 'next/link'
import { purchaseOrderTemplates } from '@/data/purchase-order-templates'
import { buildClusterVariantPath } from '@/data/template-helpers'
import { Logo } from '@/components/logo'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const SITE = 'https://invoicecommand.com'
const HUB = purchaseOrderTemplates.hub
const BASE_PATH = purchaseOrderTemplates.basePath
const HUB_URL = `${SITE}${BASE_PATH}`

export const metadata: Metadata = {
  title: HUB.metaTitle,
  description: HUB.metaDescription,
  keywords: HUB.keywords,
  openGraph: {
    title: HUB.metaTitle,
    description: HUB.metaDescription,
    url: HUB_URL,
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: HUB.h1,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HUB.metaTitle,
    description: HUB.metaDescription,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: HUB_URL,
  },
}

const VARIANT_TYPE_LABEL: Record<string, string> = {
  format: 'Format',
  profession: 'Industry',
  integration: 'Integration',
  intent: 'Tool',
}

export default function PurchaseOrderTemplateHubPage() {
  const cluster = purchaseOrderTemplates
  const allVariants = [...cluster.clusterVariants, ...cluster.standalonePages]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: HUB.h1,
    description: HUB.metaDescription,
    url: HUB_URL,
    mainEntity: {
      '@type': 'ItemList',
      name: 'Purchase Order Templates',
      description: HUB.metaDescription,
      numberOfItems: allVariants.length,
      itemListElement: cluster.clusterVariants.map((variant, index) => ({
        '@type': 'WebPage',
        position: index + 1,
        name: variant.h1,
        url: `${SITE}${buildClusterVariantPath(cluster, variant.slug)}`,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: SITE,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Purchase Order Template',
          item: HUB_URL,
        },
      ],
    },
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HUB.faq.map((q) => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
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
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">{HUB.h1}</h1>
            <p className="text-xl text-muted-foreground mb-6">{HUB.intro}</p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                Free forever
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                No signup
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                Instant PDF
              </span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                Excel + Word + Google
              </span>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <section aria-labelledby="variants-heading" className="mb-12">
            <h2
              id="variants-heading"
              className="text-2xl font-bold text-foreground mb-6"
            >
              Pick your purchase order template
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cluster.clusterVariants.map((variant) => (
                <Link
                  key={variant.slug}
                  href={buildClusterVariantPath(cluster, variant.slug)}
                  className="block group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-lg">
                    <CardHeader>
                      <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        {VARIANT_TYPE_LABEL[variant.type]}
                      </div>
                      <CardTitle className="text-lg">{variant.h1}</CardTitle>
                      <CardDescription>{variant.metaDescription}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section aria-labelledby="tools-heading" className="mb-12">
            <h2
              id="tools-heading"
              className="text-2xl font-bold text-foreground mb-6"
            >
              Online generators and tools
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cluster.standalonePages.map((variant) => (
                <Link
                  key={variant.slug}
                  href={`/${variant.slug}`}
                  className="block group"
                >
                  <Card className="h-full transition-shadow group-hover:shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-lg">{variant.h1}</CardTitle>
                      <CardDescription>{variant.metaDescription}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section className="max-w-4xl mx-auto space-y-8">
            {HUB.sections.map((section) => (
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
                {HUB.faq.map((q) => (
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
                Need an invoice instead?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Already received the goods and need to bill the customer? Use our
                free invoice generator with the same Cool Money design.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/invoice-templates"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition"
                >
                  Browse invoice templates
                </Link>
                <Link
                  href="/sales-order-template"
                  className="inline-flex items-center justify-center px-6 py-3 bg-card border border-border text-foreground rounded-md font-semibold hover:bg-muted transition"
                >
                  Sales order templates
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
