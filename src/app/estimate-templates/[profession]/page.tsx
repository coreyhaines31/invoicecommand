import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { professionSlugs } from '@/data/professions-expanded';
import { getProfessionContent, getProfessionName, getRelatedProfessions } from '@/data/profession-content';
import { EstimateBuilder } from '@/components/estimate-builder';
import { ProfessionGuide } from '@/components/profession-guide';

interface Props {
  params: Promise<{ profession: string }>;
}

// Generate static params for all professions
export async function generateStaticParams() {
  return professionSlugs.map((profession) => ({
    profession,
  }));
}

// Generate metadata for each profession page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profession } = await params;
  const content = getProfessionContent(profession);
  const name = getProfessionName(profession);

  if (!content || !name) {
    return {
      title: 'Page Not Found',
    };
  }

  const estimateTitle = estimateTitleFor(name);
  const estimateDescription = `Free ${name.toLowerCase()} estimate and quote template: what to include, typical rates, and pricing tips. Send it for approval, then convert it to an invoice.`;

  return {
    title: `${estimateTitle} | Invoice Command`,
    description: estimateDescription,
    openGraph: {
      title: estimateTitle,
      description: estimateDescription,
      url: `https://invoicecommand.com/estimate-templates/${profession}`,
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
      canonical: `https://invoicecommand.com/estimate-templates/${profession}`,
    },
  };
}

export default async function EstimateProfessionPage({ params }: Props) {
  const { profession } = await params;
  const content = getProfessionContent(profession);
  const name = getProfessionName(profession);

  if (!content || !name) {
    notFound();
  }

  const slug = profession;
  const estimateTitle = estimateTitleFor(name);

  // Generate JSON-LD structured data for this profession estimate template
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": estimateTitle,
    "description": content.estimate.intro,
    "url": `https://invoicecommand.com/estimate-templates/${slug}`,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": estimateTitle,
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": content.estimate.intro
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
          "name": estimateTitle,
          "item": `https://invoicecommand.com/estimate-templates/${slug}`
        }
      ]
    },
    "potentialAction": {
      "@type": "CreateAction",
      "name": "Create Estimate",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://invoicecommand.com/estimate-templates/${slug}`,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.estimate.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, '\\u003c') }}
      />
      <div className="min-h-screen bg-background">
        <EstimateBuilder title={estimateTitle} description={content.estimate.intro}>
          <ProfessionGuide
            kind="estimate"
            slug={slug}
            name={name}
            content={content}
            related={getRelatedProfessions(slug)}
          />
        </EstimateBuilder>
      </div>
    </>
  );
}

function estimateTitleFor(name: string) {
  return `${name} Estimate Template (Free)`;
}
