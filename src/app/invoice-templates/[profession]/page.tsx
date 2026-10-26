import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { professionSlugs } from '@/data/professions-expanded';
import { getProfessionContent, getProfessionName, getRelatedProfessions } from '@/data/profession-content';
import { InvoiceBuilder } from '@/components/invoice-builder';
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

  const title = invoiceTitle(name);
  const description = `Free ${name.toLowerCase()} invoice template with typical rates, a sample invoice, and what to include. Fill it in online and download a PDF.`;

  return {
    title: `${title} | Invoice Command`,
    description,
    openGraph: {
      title,
      description,
      url: `https://invoicecommand.com/invoice-templates/${profession}`,
      type: 'website',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://invoicecommand.com/invoice-templates/${profession}`,
    },
  };
}

export default async function ProfessionPage({ params }: Props) {
  const { profession } = await params;
  const content = getProfessionContent(profession);
  const name = getProfessionName(profession);

  if (!content || !name) {
    notFound();
  }

  const slug = profession;
  const title = invoiceTitle(name);

  // Generate JSON-LD structured data for this profession
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": content.intro,
    "url": `https://invoicecommand.com/invoice-templates/${slug}`,
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": title,
      "applicationCategory": "BusinessApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": content.intro
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
          "name": title,
          "item": `https://invoicecommand.com/invoice-templates/${slug}`
        }
      ]
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map((faq) => ({
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
        <InvoiceBuilder title={title} description={content.intro}>
          <ProfessionGuide
            kind="invoice"
            slug={slug}
            name={name}
            content={content}
            related={getRelatedProfessions(slug)}
          />
        </InvoiceBuilder>
      </div>
    </>
  );
}

function invoiceTitle(name: string) {
  return `${name} Invoice Template (Free)`;
}
