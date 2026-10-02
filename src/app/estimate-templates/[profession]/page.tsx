import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { professions, professionSlugs, ProfessionData } from '@/data/professions-expanded';
import { EstimateBuilder } from '@/components/estimate-builder';

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

  // Convert to estimate-specific metadata
  const estimateTitle = `${profession.profession} Estimate Template (Free)`;
  const estimateDescription = profession.seoDescription.replace(/invoice/gi, 'estimate');
  const estimateKeywords = profession.keywords.map(kw => kw.replace(/invoice/gi, 'estimate'));

  // Add additional estimate-specific keywords
  estimateKeywords.push(
    `${profession.profession.toLowerCase()} quote template`,
    `${profession.profession.toLowerCase()} quote`,
    `${profession.profession.toLowerCase()} estimate maker`
  );

  return {
    title: `${estimateTitle} | Invoice Command`,
    description: estimateDescription,
    keywords: estimateKeywords,
    openGraph: {
      title: estimateTitle,
      description: estimateDescription,
      url: `https://invoicecommand.com/estimate-templates/${profession.id}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: estimateTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: estimateTitle,
      description: estimateDescription,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://invoicecommand.com/estimate-templates/${profession.id}`,
    },
  };
}

export default function EstimateProfessionPage({ params }: Props) {
  const profession = professions.find(p => p.id === params.profession);

  if (!profession) {
    notFound();
  }

  // Generate JSON-LD structured data for this profession estimate template
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `${profession.profession} Estimate Template`,
    "description": profession.seoDescription.replace(/invoice/gi, 'estimate'),
    "url": `https://invoicecommand.com/estimate-templates/${profession.id}`,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": `${profession.profession} Estimate Template`,
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": `Create professional estimates and quotes for ${profession.profession.toLowerCase()} services. Free estimate template with instant PDF export and convert to invoice functionality.`
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
          "name": "Estimate Templates",
          "item": "https://invoicecommand.com/estimate-templates"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${profession.profession} Estimate Template`,
          "item": `https://invoicecommand.com/estimate-templates/${profession.id}`
        }
      ]
    },
    "potentialAction": {
      "@type": "CreateAction",
      "name": "Create Estimate",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://invoicecommand.com/estimate-templates/${profession.id}`,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        <EstimateBuilder profession={profession} />
      </div>
    </>
  );
}
