import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { professions, professionSlugs, ProfessionData } from '@/data/professions-expanded';
import { ProfessionInvoiceBuilder } from '@/components/profession-invoice-builder';

interface Props {
  params: { profession: string };
}

// Generate static params for all professions
export async function generateStaticParams() {
  return professionSlugs.map((profession) => ({
    profession,
  }));
}

// Generate metadata for each profession page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const profession = professions.find(p => p.id === params.profession);

  if (!profession) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `${profession.title} | Invoice Command`,
    description: profession.seoDescription,
    keywords: profession.keywords,
    openGraph: {
      title: profession.title,
      description: profession.seoDescription,
      url: `https://invoicecommand.com/invoice-templates/${profession.id}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: profession.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: profession.title,
      description: profession.seoDescription,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://invoicecommand.com/invoice-templates/${profession.id}`,
    },
  };
}

export default function ProfessionPage({ params }: Props) {
  const profession = professions.find(p => p.id === params.profession);

  if (!profession) {
    notFound();
  }

  // Generate JSON-LD structured data for this profession
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": profession.title,
    "description": profession.seoDescription,
    "url": `https://invoicecommand.com/invoice-templates/${profession.id}`,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": profession.title,
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": profession.description
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://invoicecommand.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Invoice Templates",
          "item": "https://invoicecommand.com/invoice-templates"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": profession.title,
          "item": `https://invoicecommand.com/invoice-templates/${profession.id}`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <ProfessionInvoiceBuilder profession={profession} />
      </div>
    </>
  );
}