import { Metadata } from 'next';
import { EstimateBuilder } from '@/components/estimate-builder';
import { professions } from '@/data/professions-expanded';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, FileCheck, Zap, Shield, FileDown, Mic, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Estimate Maker | Create Professional Quotes & Estimates | Invoice Command',
  description: 'Create professional estimates and quotes in minutes with our free estimate maker. AI-powered, real-time preview, instant PDF export. Perfect for contractors, freelancers, and consultants.',
  keywords: [
    'estimate maker',
    'free estimate maker',
    'quote generator',
    'estimate generator',
    'quote maker',
    'estimate template',
    'free quote maker',
    'project estimate tool',
    'quote software',
    'estimate software'
  ],
  openGraph: {
    title: 'Free Estimate Maker | Create Professional Quotes & Estimates',
    description: 'Create professional estimates and quotes in minutes. AI-powered, real-time preview, instant PDF export. 100% free.',
    url: 'https://invoicecommand.com/estimate-maker',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Estimate Maker Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Estimate Maker | Create Professional Quotes & Estimates',
    description: 'Create professional estimates and quotes in minutes. AI-powered, real-time preview, instant PDF export.',
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: 'https://invoicecommand.com/estimate-maker',
  },
};

export default function EstimateMakerPage() {
  // Generate JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Free Estimate Maker",
    "description": "Create professional estimates and quotes instantly with our free estimate maker tool. Features AI voice input, real-time preview, PDF export, and convert to invoice functionality.",
    "url": "https://invoicecommand.com/estimate-maker",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "AI-powered voice input",
      "Real-time estimate preview",
      "Professional PDF export",
      "Convert estimate to invoice",
      "Multiple template styles",
      "Automatic calculations",
      "No registration required",
      "Privacy-first design"
    ],
    "screenshot": "/og-image.png",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1247",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // Popular profession categories for quick access
  const popularProfessions = [
    { id: 'web-developer', name: 'Web Developer', category: 'Technology' },
    { id: 'graphic-designer', name: 'Graphic Designer', category: 'Creative' },
    { id: 'electrician', name: 'Electrician', category: 'Trades' },
    { id: 'plumber', name: 'Plumber', category: 'Trades' },
    { id: 'business-consultant', name: 'Business Consultant', category: 'Consulting' },
    { id: 'photographer', name: 'Photographer', category: 'Creative' },
    { id: 'marketing-consultant', name: 'Marketing Consultant', category: 'Consulting' },
    { id: 'carpenter', name: 'Carpenter', category: 'Trades' },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                100% Free Forever
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
                Free Estimate Maker
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Create professional estimates and quotes in minutes. No signup required.
                AI-powered voice input, real-time preview, and instant PDF export.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="text-lg px-8">
                  <a href="#estimate-builder">
                    Start Creating Now
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="text-lg px-8">
                  <Link href="/estimate-templates">
                    Browse Templates
                  </Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>No registration required</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-primary" />
                  <span>405+ industry templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>Trusted by 10,000+ users</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Everything You Need to Create Professional Estimates
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our estimate maker includes all the features you need to win more projects and streamline your quoting process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Voice Input</h3>
              <p className="text-muted-foreground">
                Create estimates hands-free with AI-powered voice commands. Just speak naturally and watch your estimate build in real-time.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Preview</h3>
              <p className="text-muted-foreground">
                See your estimate update instantly as you type. Preview exactly what your clients will see before sending.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <FileDown className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant PDF Export</h3>
              <p className="text-muted-foreground">
                Download professional PDF estimates instantly. Perfect for emailing to clients or printing for in-person quotes.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <ArrowRight className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Convert to Invoice</h3>
              <p className="text-muted-foreground">
                When your estimate is approved, convert it to an invoice with one click. All details transfer automatically.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy First</h3>
              <p className="text-muted-foreground">
                Your data stays in your browser. No cloud storage, no data collection, no registration required.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Industry Templates</h3>
              <p className="text-muted-foreground">
                Choose from 405+ profession-specific templates designed for your industry with pre-filled common services.
              </p>
            </Card>
          </div>
        </section>

        {/* Popular Templates Quick Access */}
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Popular Estimate Templates
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Jump straight to your profession's estimate template for faster setup.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {popularProfessions.map((profession) => (
                <Link
                  key={profession.id}
                  href={`/estimate-templates/${profession.id}`}
                  className="block"
                >
                  <Card className="p-4 text-center hover:shadow-lg hover:border-primary transition-all group">
                    <div className="text-sm text-muted-foreground mb-1">{profession.category}</div>
                    <div className="font-semibold group-hover:text-primary transition-colors">
                      {profession.name}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/estimate-templates">
                  View All 405+ Templates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Estimate Builder */}
        <section id="estimate-builder" className="scroll-mt-8">
          <EstimateBuilder />
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">What is an estimate maker?</h3>
                <p className="text-muted-foreground">
                  An estimate maker is a tool that helps you create professional quotes and estimates for your services or products.
                  It automates calculations, provides professional formatting, and makes it easy to present project costs to potential clients.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Is this estimate maker really free?</h3>
                <p className="text-muted-foreground">
                  Yes! Our estimate maker is 100% free with no hidden costs, subscriptions, or feature limitations.
                  You can create unlimited estimates and download them as PDFs without paying anything.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">What's the difference between an estimate and an invoice?</h3>
                <p className="text-muted-foreground">
                  An estimate (or quote) is sent before work begins to outline expected costs and get client approval.
                  An invoice is sent after work is completed (or when payment is due) to request payment.
                  You can easily convert estimates to invoices once approved.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Can I customize the estimate templates?</h3>
                <p className="text-muted-foreground">
                  Absolutely! All estimate templates are fully customizable. You can modify every field, add your branding,
                  choose from multiple design styles (Modern, Classic, Minimal), and include custom terms and notes.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">How does the AI voice input work?</h3>
                <p className="text-muted-foreground">
                  Simply click the microphone button and speak naturally. Our AI understands phrases like
                  "Add $500 for design work" or "Set the client name to John Smith" and automatically updates your estimate.
                  It's perfect for creating estimates hands-free or on mobile devices.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Do I need to create an account?</h3>
                <p className="text-muted-foreground">
                  No! You can create and download estimates without any registration. However, creating a free account
                  lets you save estimates, access them from any device, and unlock additional features like payment collection.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">What industries is this estimate maker suitable for?</h3>
                <p className="text-muted-foreground">
                  Our estimate maker works for 405+ professions including contractors, freelancers, consultants, designers,
                  developers, tradespeople, and service providers. Each industry has a customized template with relevant
                  services and professional formatting.
                </p>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-2">Can I convert my estimates to invoices?</h3>
                <p className="text-muted-foreground">
                  Yes! Once your client approves your estimate, you can convert it to an invoice with a single click.
                  All the line items, rates, and details automatically transfer to the invoice format, ready for payment collection.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Create Your First Estimate?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals using Invoice Command to create winning estimates and get more projects approved.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <a href="#estimate-builder">
                  Start Creating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10">
                <Link href="/estimate-templates">
                  Browse Templates
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
