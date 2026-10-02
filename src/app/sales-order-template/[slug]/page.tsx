import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { salesOrderTemplates } from '@/data/sales-order-templates'
import {
  getClusterVariantBySlug,
  buildClusterVariantPath,
} from '@/data/template-helpers'
import { Logo } from '@/components/logo'

const SITE = 'https://invoicecommand.com'
const CLUSTER = salesOrderTemplates
const HUB_PATH = CLUSTER.basePath
const HUB_URL = `${SITE}${HUB_PATH}`

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return CLUSTER.clusterVariants.map((v) => ({ slug: v.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const variant = getClusterVariantBySlug(CLUSTER, slug)
  if (!variant) return { title: 'Page Not Found' }

  const url = `${SITE}${buildClusterVariantPath(CLUSTER, slug)}`
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

export default async function SalesOrderTemplateVariantPage({ params }: Props) {
  const { slug } = await params
  const variant = getClusterVariantBySlug(CLUSTER, slug)
  if (!variant) notFound()

  const url = `${SITE}${buildClusterVariantPath(CLUSTER, slug)}`

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
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sales Order Template',
          item: HUB_URL,
        },
        { '@type': 'ListItem', position: 3, name: variant.h1, item: url },
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
              <Link href={HUB_PATH} className="hover:text-primary">
                Sales Order Template
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
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Skip the download — generate online
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our free SO generator produces a clean PDF in under a minute. No
                signup, no watermark, no template formatting headaches.
              </p>
              <Link
                href="/sales-order-generator"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md font-semibold hover:opacity-90 transition"
              >
                Open the SO generator
              </Link>
            </div>

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

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Other sales order templates
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLUSTER.clusterVariants
                  .filter((v) => v.slug !== variant.slug)
                  .slice(0, 6)
                  .map((v) => (
                    <li key={v.slug}>
                      <Link
                        href={buildClusterVariantPath(CLUSTER, v.slug)}
                        className="text-primary hover:underline"
                      >
                        {v.h1}
                      </Link>
                    </li>
                  ))}
              </ul>
              <div className="mt-4">
                <Link href={HUB_PATH} className="text-sm text-primary hover:underline">
                  ← Back to all SO templates
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
