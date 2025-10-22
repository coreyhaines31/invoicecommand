import { Metadata } from 'next';
import { professions } from '@/data/professions-expanded';
import { TemplateGrid } from '@/components/template-grid';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Invoice Templates | 405+ Professional Templates by Industry | Invoice Command',
  description: 'Browse 405+ free professional invoice templates for every industry. From freelancers to contractors, find the perfect invoice template for your business. Download instantly.',
  keywords: [
    'free invoice templates',
    'professional invoice templates',
    'invoice templates by industry',
    'business invoice templates',
    'contractor invoice templates',
    'freelancer invoice templates',
    'service invoice templates'
  ],
  openGraph: {
    title: 'Free Invoice Templates | 405+ Professional Templates by Industry',
    description: 'Browse 405+ free professional invoice templates for every industry. Find the perfect template for your business and download instantly.',
    url: 'https://invoicecommand.com/invoice-templates',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Invoice Templates by Industry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Invoice Templates | 405+ Professional Templates by Industry',
    description: 'Browse 405+ free professional invoice templates for every industry. Find the perfect template for your business.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://invoicecommand.com/invoice-templates',
  },
};

export default function InvoiceTemplatesPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Invoice Templates by Industry",
    "description": "Comprehensive collection of 405+ free professional invoice templates for every industry and profession.",
    "url": "https://invoicecommand.com/invoice-templates",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Invoice Templates",
      "description": "Professional invoice templates for all industries",
      "numberOfItems": professions.length,
      "itemListElement": professions.slice(0, 20).map((profession, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": profession.title,
        "url": `https://invoicecommand.com/invoice-templates/${profession.id}`,
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }))
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
        {/* Navigation */}
        <nav className="container mx-auto p-4 mb-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo width={24} height={24} className="text-primary" />
              <span className="text-lg font-semibold text-foreground">Invoice Command</span>
            </Link>
          </div>
        </nav>

        {/* Header */}
        <header className="container mx-auto p-4 mb-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Free Invoice Templates by Industry
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Choose from 405+ professional invoice templates designed for every industry.
              Find the perfect template for your business and start creating professional invoices instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">✨ 405+ Templates</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">🎯 Industry-Specific</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">📄 Instant PDF Export</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">🔒 100% Free</span>
            </div>
          </div>
        </header>

        {/* Template Grid */}
        <main className="container mx-auto p-4">
          <TemplateGrid templates={professions} />
        </main>

        {/* SEO Content Section */}
        <section className="container mx-auto p-4 mt-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* About Invoice Templates */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Professional Invoice Templates for Every Business
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
                <div>
                  <p className="mb-4">
                    Our comprehensive collection of 405+ free invoice templates covers every industry,
                    profession, and business type. Each template is professionally designed with
                    industry-specific features and formatting to help you create invoices that
                    reflect your professional standards.
                  </p>
                  <p>
                    Whether you're a freelancer, contractor, consultant, or service provider,
                    you'll find the perfect invoice template for your specific needs. All templates
                    include automatic calculations, professional formatting, and instant PDF export.
                  </p>
                </div>
                <div>
                  <p className="mb-4">
                    Every template is completely free to use with no registration required.
                    Your data stays private and secure in your browser - we never store your
                    business or client information on our servers.
                  </p>
                  <p>
                    Start creating professional invoices today with our industry-specific templates
                    designed by business professionals for business professionals.
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Popular Invoice Template Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">🎨 Creative & Design</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Perfect for designers, artists, and creative professionals
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href="/invoice-templates/graphic-designer" className="block text-primary hover:underline">
                      Graphic Designer
                    </Link>
                    <Link href="/invoice-templates/web-designer" className="block text-primary hover:underline">
                      Web Designer
                    </Link>
                    <Link href="/invoice-templates/photographer" className="block text-primary hover:underline">
                      Photographer
                    </Link>
                    <Link href="/invoice-templates/videographer" className="block text-primary hover:underline">
                      Videographer
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">💻 Technology</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Specialized templates for tech professionals and developers
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href="/invoice-templates/web-developer" className="block text-primary hover:underline">
                      Web Developer
                    </Link>
                    <Link href="/invoice-templates/software-developer" className="block text-primary hover:underline">
                      Software Developer
                    </Link>
                    <Link href="/invoice-templates/it-consultant" className="block text-primary hover:underline">
                      IT Consultant
                    </Link>
                    <Link href="/invoice-templates/seo-consultant" className="block text-primary hover:underline">
                      SEO Consultant
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">🏢 Business Services</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Professional templates for consultants and business services
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href="/invoice-templates/business-consultant" className="block text-primary hover:underline">
                      Business Consultant
                    </Link>
                    <Link href="/invoice-templates/marketing-consultant" className="block text-primary hover:underline">
                      Marketing Consultant
                    </Link>
                    <Link href="/invoice-templates/accountant" className="block text-primary hover:underline">
                      Accountant
                    </Link>
                    <Link href="/invoice-templates/legal-consultant" className="block text-primary hover:underline">
                      Legal Consultant
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">How many invoice templates are available?</summary>
                  <p className="text-sm text-muted-foreground mt-2">We offer 405+ professional invoice templates covering virtually every industry, profession, and business type. Each template is specifically designed for its target industry with relevant services and professional formatting.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">Are these invoice templates really free?</summary>
                  <p className="text-sm text-muted-foreground mt-2">Yes! All 405+ invoice templates are completely free to use with no hidden costs, subscriptions, or registration requirements. Create unlimited professional invoices without paying anything.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">Can I customize the invoice templates?</summary>
                  <p className="text-sm text-muted-foreground mt-2">Absolutely! Each template is fully customizable. You can modify all text fields, add your branding, adjust line items, set tax rates, and include custom notes or terms. The templates adapt to your specific business needs.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">What file format can I download my invoices in?</summary>
                  <p className="text-sm text-muted-foreground mt-2">You can download your completed invoices as high-quality PDF files that are ready to email to clients or print. The PDFs maintain professional formatting and are compatible with all devices and software.</p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}