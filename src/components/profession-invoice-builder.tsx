'use client'

import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Logo } from './logo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProfessionData } from '@/data/professions-expanded'

interface ProfessionInvoiceBuilderProps {
  profession: ProfessionData;
}

export function ProfessionInvoiceBuilder({ profession }: ProfessionInvoiceBuilderProps) {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Navigation Bar */}
      <nav className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo width={24} height={24} className="text-primary" />
            <span className="text-lg font-semibold text-foreground">Invoice Command</span>
          </div>
          <Link href="/invoice-templates" className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium">
            Browse 405+ Industry-Specific Templates
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Header with profession-specific content */}
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            {profession.title}
          </h1>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground text-lg">
            {profession.description}
          </p>

          {/* Profession-specific info */}
          <div className="flex flex-wrap gap-3 items-center">
            {profession.averageRates.hourly && (
              <Badge variant="secondary" className="text-sm">
                Average Rate: {profession.averageRates.hourly}
              </Badge>
            )}
            <Badge variant="outline" className="text-sm">
              {profession.industryInfo.marketSize}
            </Badge>
          </div>

          {/* Common services preview */}
          <div className="bg-card border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Common Services:</h3>
            <div className="flex flex-wrap gap-2">
              {profession.commonServices.slice(0, 6).map((service, index) => (
                <span key={index} className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                  {service}
                </span>
              ))}
              {profession.commonServices.length > 6 && (
                <span className="text-sm text-muted-foreground">
                  +{profession.commonServices.length - 6} more
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-6">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">✨ AI Voice Commands</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">📄 PDF Export</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">⚡ Real-time Preview</span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded">🔒 Privacy First</span>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Panel (Preview) + Right Panel (Form) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[calc(100vh-200px)]">
        {/* Left Panel - Invoice Preview */}
        <div className="order-2 lg:order-1">
          <Card className="h-full bg-card border-border shadow-lg">
            <div className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Invoice Preview
                </h2>
                <div className="text-sm text-muted-foreground">
                  Live Preview
                </div>
              </div>
              <Separator className="mb-6" />

              <div className="h-full overflow-auto">
                <InvoicePreview />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Invoice Form */}
        <div className="order-1 lg:order-2">
          <Card className="h-full bg-card border-border shadow-lg">
            <div className="p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Invoice Editor
                </h2>
                <div className="text-sm text-muted-foreground">
                  Fill in details
                </div>
              </div>
              <Separator className="mb-6" />

              <div className="h-full overflow-auto">
                <InvoiceForm />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SEO Content Section - Profession specific */}
      <section className="mt-12 space-y-8">
        {/* How It Works */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">How to Create {profession.profession} Invoices in 3 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Fill Invoice Details</h3>
              <p className="text-sm text-muted-foreground">Enter your {profession.profession.toLowerCase()} business information, client details, and service items using our intuitive form or AI voice commands.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Preview & Customize</h3>
              <p className="text-sm text-muted-foreground">See your professional {profession.profession.toLowerCase()} invoice preview in real-time. Adjust formatting, add notes, and set payment terms.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Download PDF</h3>
              <p className="text-sm text-muted-foreground">Export your finished {profession.profession.toLowerCase()} invoice as a professional PDF ready to send to clients or print for your records.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Our {profession.profession} Invoice Template?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Industry-Specific Template</h3>
                  <p className="text-sm text-muted-foreground">Designed specifically for {profession.profession.toLowerCase()} professionals with relevant fields and terminology.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">AI Voice Commands</h3>
                  <p className="text-sm text-muted-foreground">Unique voice-to-invoice feature. Simply speak your {profession.profession.toLowerCase()} service details and watch them populate automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Real-time Preview</h3>
                  <p className="text-sm text-muted-foreground">See exactly how your {profession.profession.toLowerCase()} invoice will look as you type. No surprises, just professional results.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">100% Free</h3>
                  <p className="text-sm text-muted-foreground">No hidden fees, no subscription required. Create unlimited professional {profession.profession.toLowerCase()} invoices completely free.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Professional PDF Export</h3>
                  <p className="text-sm text-muted-foreground">Download high-quality PDF invoices ready for email or print. Perfect for any {profession.profession.toLowerCase()} business size.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">Your {profession.profession.toLowerCase()} business data stays in your browser. No servers, no storage, no privacy concerns.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Profession specific */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions - {profession.profession} Invoices</h2>
          <div className="space-y-4">
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Is this {profession.profession.toLowerCase()} invoice template really free?</summary>
              <p className="text-sm text-muted-foreground mt-2">Yes! Our {profession.profession.toLowerCase()} invoice maker is completely free with no hidden costs, subscriptions, or limits. Create unlimited professional invoices for your {profession.profession.toLowerCase()} business.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Can I use this for my {profession.profession.toLowerCase()} business invoices?</summary>
              <p className="text-sm text-muted-foreground mt-2">Absolutely! Our professional {profession.profession.toLowerCase()} invoice templates are designed specifically for {profession.profession.toLowerCase()} businesses and include all required business elements and industry-relevant fields.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">What makes this different from other {profession.profession.toLowerCase()} invoice templates?</summary>
              <p className="text-sm text-muted-foreground mt-2">Our template is specifically designed for {profession.profession.toLowerCase()} professionals with relevant service categories, industry-standard rates, and terminology that your clients will recognize and trust.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">How does the AI voice feature work for {profession.profession.toLowerCase()} services?</summary>
              <p className="text-sm text-muted-foreground mt-2">Simply click the voice button and speak naturally about your {profession.profession.toLowerCase()} services. For example, say "Add {profession.commonServices[0]?.toLowerCase() || 'consultation'} for 2 hours at ${profession.averageRates.hourly?.replace('$', '').replace('/hr', '') || '100'} per hour" and watch it populate automatically.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="text-sm text-muted-foreground text-center">
          Your {profession.profession.toLowerCase()} business data is stored locally in your browser. No signup required.
        </div>
      </footer>
    </div>
  )
}