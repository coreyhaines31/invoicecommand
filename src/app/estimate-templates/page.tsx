import { Metadata } from 'next';
import { professions } from '@/data/professions-expanded';
import { TemplateGrid } from '@/components/template-grid';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Free Estimate Templates | 405+ Professional Templates by Industry | Invoice Command',
  description: 'Browse 405+ free professional estimate templates for every industry. From freelancers to contractors, find the perfect estimate template for your business. Download instantly.',
  keywords: [
    'free estimate templates',
    'professional estimate templates',
    'estimate templates by industry',
    'business estimate templates',
    'contractor estimate templates',
    'freelancer estimate templates',
    'quote templates',
    'estimate maker',
    'free quote templates'
  ],
  openGraph: {
    title: 'Free Estimate Templates | 405+ Professional Templates by Industry',
    description: 'Browse 405+ free professional estimate templates for every industry. Find the perfect template for your business and download instantly.',
    url: 'https://invoicecommand.com/estimate-templates',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Estimate Templates by Industry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Estimate Templates | 405+ Professional Templates by Industry',
    description: 'Browse 405+ free professional estimate templates for every industry. Find the perfect template for your business.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://invoicecommand.com/estimate-templates',
  },
};

export default function EstimateTemplatesPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Free Estimate Templates by Industry",
    "description": "Comprehensive collection of 405+ free professional estimate templates for every industry and profession.",
    "url": "https://invoicecommand.com/estimate-templates",
    "mainEntity": {
      "@type": "ItemList",
      "name": "Estimate Templates",
      "description": "Professional estimate and quote templates for all industries",
      "numberOfItems": professions.length,
      "itemListElement": professions.slice(0, 20).map((profession, index) => ({
        "@type": "SoftwareApplication",
        "position": index + 1,
        "name": `${profession.profession} Estimate Template`,
        "url": `https://invoicecommand.com/estimate-templates/${profession.id}`,
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
          "name": "Estimate Templates",
          "item": "https://invoicecommand.com/estimate-templates"
        }
      ]
    }
  };

  // Transform professions to estimate templates
  const estimateTemplates = professions.map(profession => ({
    ...profession,
    title: `${profession.profession} Estimate Template (Free)`,
    seoDescription: profession.seoDescription.replace('invoice', 'estimate'),
  }));

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
              Free Estimate Templates by Industry
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Choose from 405+ professional estimate templates designed for every industry.
              Find the perfect template for your business and start creating professional estimates instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm mb-6">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">✨ 405+ Templates</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">🎯 Industry-Specific</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">📄 Instant PDF Export</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">🔄 Convert to Invoice</span>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">🔒 100% Free</span>
            </div>

            {/* CTA to estimate maker */}
            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/estimate-maker"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Create Estimate Now
              </Link>
              <Link
                href="/invoice-templates"
                className="bg-muted text-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted/80 transition-colors"
              >
                Browse Invoice Templates
              </Link>
            </div>
          </div>
        </header>

        {/* Template Grid */}
        <main className="container mx-auto p-4">
          <TemplateGrid templates={estimateTemplates} basePath="/estimate-templates" />
        </main>

        {/* SEO Content Section */}
        <section className="container mx-auto p-4 mt-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* About Estimate Templates */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Professional Estimate Templates for Every Business
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
                <div>
                  <p className="mb-4">
                    Our comprehensive collection of 405+ free estimate templates covers every industry,
                    profession, and business type. Each template is professionally designed with
                    industry-specific features and formatting to help you create estimates and quotes that
                    reflect your professional standards.
                  </p>
                  <p>
                    Whether you're a freelancer, contractor, consultant, or service provider,
                    you'll find the perfect estimate template for your specific needs. All templates
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
                    Start creating professional estimates today with our industry-specific templates
                    designed by business professionals for business professionals. Convert estimates
                    to invoices with a single click when your clients approve.
                  </p>
                </div>
              </div>
            </div>

            {/* Estimates vs Invoices */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                When to Use Estimates vs Invoices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">📋 Use Estimates When:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Providing project quotes before starting work</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Seeking client approval for project scope and cost</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Competing for contracts or bids</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Setting expectations before commitment</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Offering different pricing tiers or options</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">💰 Use Invoices When:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Requesting payment for completed work</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Billing for ongoing services or subscriptions</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Collecting deposits or milestone payments</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Creating formal payment records</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>Converting approved estimates to payment requests</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Popular Estimate Template Categories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">🎨 Creative & Design</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Perfect for designers, artists, and creative professionals
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href="/estimate-templates/graphic-designer" className="block text-primary hover:underline">
                      Graphic Designer
                    </Link>
                    <Link href="/estimate-templates/web-designer" className="block text-primary hover:underline">
                      Web Designer
                    </Link>
                    <Link href="/estimate-templates/photographer" className="block text-primary hover:underline">
                      Photographer
                    </Link>
                    <Link href="/estimate-templates/videographer" className="block text-primary hover:underline">
                      Videographer
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">🔨 Trades & Construction</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Specialized templates for contractors and tradespeople
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href="/estimate-templates/electrician" className="block text-primary hover:underline">
                      Electrician
                    </Link>
                    <Link href="/estimate-templates/plumber" className="block text-primary hover:underline">
                      Plumber
                    </Link>
                    <Link href="/estimate-templates/carpenter" className="block text-primary hover:underline">
                      Carpenter
                    </Link>
                    <Link href="/estimate-templates/contractor" className="block text-primary hover:underline">
                      General Contractor
                    </Link>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3">🏢 Business Services</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Professional templates for consultants and business services
                  </p>
                  <div className="space-y-1 text-sm">
                    <Link href="/estimate-templates/business-consultant" className="block text-primary hover:underline">
                      Business Consultant
                    </Link>
                    <Link href="/estimate-templates/marketing-consultant" className="block text-primary hover:underline">
                      Marketing Consultant
                    </Link>
                    <Link href="/estimate-templates/accountant" className="block text-primary hover:underline">
                      Accountant
                    </Link>
                    <Link href="/estimate-templates/legal-consultant" className="block text-primary hover:underline">
                      Legal Consultant
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Cross-link to PO + SO templates */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Need a purchase order or sales order too?
              </h2>
              <p className="text-muted-foreground mb-4">
                Estimates win the work. Invoices collect payment. PO templates help
                you <strong>order materials from a vendor</strong>; SO templates
                confirm <strong>customer orders before fulfillment</strong>. Same
                Cool Money design, same instant PDF.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/purchase-order-template"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 transition"
                >
                  Browse purchase order templates
                </Link>
                <Link
                  href="/sales-order-template"
                  className="inline-flex items-center px-4 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition"
                >
                  Browse sales order templates
                </Link>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">How many estimate templates are available?</summary>
                  <p className="text-sm text-muted-foreground mt-2">We offer 405+ professional estimate templates covering virtually every industry, profession, and business type. Each template is specifically designed for its target industry with relevant services and professional formatting.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">Are these estimate templates really free?</summary>
                  <p className="text-sm text-muted-foreground mt-2">Yes! All 405+ estimate templates are completely free to use with no hidden costs, subscriptions, or registration requirements. Create unlimited professional estimates without paying anything.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">Can I convert an estimate to an invoice?</summary>
                  <p className="text-sm text-muted-foreground mt-2">Absolutely! Once your client approves your estimate, you can convert it to an invoice with a single click. All the details from your estimate are automatically transferred to the invoice format.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">What's the difference between an estimate and a quote?</summary>
                  <p className="text-sm text-muted-foreground mt-2">Estimates and quotes are very similar - both provide project costs before work begins. Some industries prefer "estimate" (construction, trades) while others use "quote" (creative services). Our templates work perfectly for both purposes.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">Can I customize the estimate templates?</summary>
                  <p className="text-sm text-muted-foreground mt-2">Yes! Each template is fully customizable. You can modify all text fields, add your branding, adjust line items, set validity periods, and include custom notes or terms. The templates adapt to your specific business needs.</p>
                </details>
                <details className="border-b border-border pb-4">
                  <summary className="font-semibold cursor-pointer hover:text-primary">What file format can I download my estimates in?</summary>
                  <p className="text-sm text-muted-foreground mt-2">You can download your completed estimates as high-quality PDF files that are ready to email to clients or print. The PDFs maintain professional formatting and are compatible with all devices and software.</p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
