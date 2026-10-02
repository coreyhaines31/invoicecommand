'use client'

import { useEffect } from 'react'
import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'
import { InvoiceStyleDropdown } from './invoice-style-dropdown'
import { Navigation } from './navigation'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Mic, FileDown, Zap, Shield, ArrowRight } from 'lucide-react'
import { useInvoiceInitialization } from '@/hooks/use-invoice-initialization'
import { useInvoiceStore } from '@/stores/invoice-store'
import { ProfessionData } from '@/data/professions-expanded'
import Link from 'next/link'

interface EstimateBuilderProps {
  profession?: ProfessionData; // Optional profession customization
}

export function EstimateBuilder({ profession }: EstimateBuilderProps = {}) {
  // Initialize invoice numbering
  useInvoiceInitialization()

  // Set document type to estimate on mount
  const updateDocumentType = useInvoiceStore((state) => state.updateDocumentType)

  useEffect(() => {
    // Set to estimate mode when component mounts
    updateDocumentType('estimate')
  }, [updateDocumentType])

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Header with SEO-optimized content */}
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            {profession ? `${profession.profession} Estimate Template (Free)` : 'Free Estimate Template Generator'}
          </h1>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground text-lg">
            {profession
              ? `Create professional estimates and quotes for ${profession.profession.toLowerCase()} services. Get client approval before starting work, then convert to an invoice with one click.`
              : 'Create professional estimates and quotes instantly with our free estimate builder. Perfect for freelancers, consultants, contractors, and service providers.'
            }
          </p>

          {/* Profession-specific info */}
          {profession && (
            <>
              <div className="flex flex-wrap gap-3 items-center">
                {profession.averageRates.hourly && (
                  <Badge variant="secondary" className="text-sm">
                    Average Rate: {profession.averageRates.hourly}
                  </Badge>
                )}
                {profession.averageRates.project && (
                  <Badge variant="outline" className="text-sm">
                    Project Range: {profession.averageRates.project}
                  </Badge>
                )}
              </div>

              {/* Common services preview */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Common Services for Estimates:</h3>
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
            </>
          )}

          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-6">
            <span className="bg-primary/10 text-primary px-2 py-1 rounded inline-flex items-center gap-1">
              <Mic className="w-3 h-3" />
              AI Voice Commands
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded inline-flex items-center gap-1">
              <FileDown className="w-3 h-3" />
              PDF Export
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded inline-flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Real-time Preview
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded inline-flex items-center gap-1">
              <ArrowRight className="w-3 h-3" />
              Convert to Invoice
            </span>
            <span className="bg-primary/10 text-primary px-2 py-1 rounded inline-flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Privacy First
            </span>
          </div>

          {/* Estimate vs Invoice explanation */}
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">When to use estimates:</strong> Use estimates to provide project quotes and get client approval before starting work.
              Once approved, convert your estimate to an invoice with one click to collect payment.
            </p>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Panel (Form) + Right Panel (Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-120px)]">
        {/* Left Panel - Estimate Form */}
        <div className="order-1 lg:order-1">
          <Card className="bg-card border-border shadow-lg lg:h-full">
            <div className="p-6 lg:h-full lg:flex lg:flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Estimate Editor
                </h2>
                <div className="text-sm text-muted-foreground">
                  Fill in details
                </div>
              </div>
              <Separator className="mb-6" />

              <div className="lg:flex-1 lg:overflow-auto lg:max-h-[calc(100vh-250px)]">
                <InvoiceForm />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Panel - Estimate Preview */}
        <div className="order-2 lg:order-2">
          <Card className="lg:sticky lg:top-8 bg-card border-border shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Estimate Preview
                </h2>
                <div className="flex items-center gap-4">
                  <InvoiceStyleDropdown />
                  <div className="text-sm text-muted-foreground">
                    Live Preview
                  </div>
                </div>
              </div>
              <Separator className="mb-6" />

              <div className="max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-250px)] overflow-auto">
                <InvoicePreview />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* SEO Content Section */}
      <section className="mt-20 space-y-12">
        {/* How It Works */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {profession
              ? `How to Create ${profession.profession} Estimates in 3 Simple Steps`
              : 'How to Create Professional Estimates in 3 Simple Steps'
            }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                1
              </div>
              <h3 className="font-semibold text-lg">Fill in Details</h3>
              <p className="text-sm text-muted-foreground">
                Enter your business information, client details, and the services or items you're quoting.
                Add descriptions, quantities, and rates for each line item.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                2
              </div>
              <h3 className="font-semibold text-lg">Preview & Download</h3>
              <p className="text-sm text-muted-foreground">
                See your estimate update in real-time as you type. Set the validity period, add terms,
                and download as a professional PDF to send to your client.
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                3
              </div>
              <h3 className="font-semibold text-lg">Convert to Invoice</h3>
              <p className="text-sm text-muted-foreground">
                Once your client approves the estimate, convert it to an invoice with one click.
                All details transfer automatically, ready for payment collection.
              </p>
            </div>
          </div>
        </div>

        {/* Why Use Estimates */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Why Use Estimates Before Invoicing?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-primary">Benefits for Your Business</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Set clear expectations before starting work</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Reduce scope creep and payment disputes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Win more projects with professional quotes</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Track conversion from estimate to paid invoice</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-primary">Benefits for Your Clients</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Understand project costs upfront</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Compare quotes from multiple providers</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Make informed decisions before committing</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">✓</span>
                  <span>Budget accurately for projects</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Estimate Template Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Professional PDF Export</h3>
                <p className="text-sm text-muted-foreground">
                  Download print-ready PDFs with your branding and professional formatting.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Real-time Calculations</h3>
                <p className="text-sm text-muted-foreground">
                  Automatic subtotals, tax, discounts, and total calculations as you type.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <ArrowRight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Convert to Invoice</h3>
                <p className="text-sm text-muted-foreground">
                  One-click conversion from estimate to invoice when approved.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your data stays in your browser. No server storage or registration required.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">AI Voice Input</h3>
                <p className="text-sm text-muted-foreground">
                  Use voice commands to create estimates hands-free with AI assistance.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <FileDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Multiple Templates</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from Modern, Classic, or Minimal styles for your estimates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA to Invoice Templates */}
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Need an Invoice Instead?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If you're ready to collect payment for completed work, check out our invoice templates.
            Same professional design, optimized for payment collection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={profession ? `/invoice-templates/${profession.id}` : '/invoice-templates'}>
              <Button size="lg" className="w-full sm:w-auto">
                View Invoice Templates
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/estimate-templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Browse All Estimate Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
