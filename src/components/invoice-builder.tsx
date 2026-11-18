'use client'

import { useEffect, type ReactNode } from 'react'
import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'
import { InvoiceStyleDropdown } from './invoice-style-dropdown'
import { Navigation } from './navigation'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Mic, FileDown, Zap, Shield } from 'lucide-react'
import { useInvoiceInitialization } from '@/hooks/use-invoice-initialization'
import { useInvoiceStore } from '@/stores/invoice-store'

interface InvoiceBuilderProps {
  title?: string
  description?: string
  // Replaces the default content below the builder (profession pages pass their guide)
  children?: ReactNode
}

export function InvoiceBuilder({ title, description, children }: InvoiceBuilderProps = {}) {
  // Initialize invoice numbering
  useInvoiceInitialization()

  // Switch a draft left by the estimate builder back to an invoice (see updateDocumentType for the rules)
  const updateDocumentType = useInvoiceStore((state) => state.updateDocumentType)

  useEffect(() => {
    updateDocumentType('invoice', 'mount')
  }, [updateDocumentType])

  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Header with SEO-optimized content */}
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            {title ?? 'Free Invoice Template Generator'}
          </h1>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground text-lg">
            {description ??
              'Create professional invoices instantly with our free invoice builder. Perfect for freelancers, consultants, and small businesses.'}
          </p>

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
              <Shield className="w-3 h-3" />
              No Signup Needed
            </span>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Panel (Form) + Right Panel (Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:h-[calc(100vh-120px)]">
        {/* Left Panel - Invoice Form */}
        <div className="order-1 lg:order-1">
          <Card className="bg-card border-border shadow-lg lg:h-full">
            <div className="p-6 lg:h-full lg:flex lg:flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Invoice Editor
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

        {/* Right Panel - Invoice Preview */}
        <div className="order-2 lg:order-2">
          <Card className="lg:sticky lg:top-8 bg-card border-border shadow-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Invoice Preview
                </h2>
                <div className="flex items-center gap-4">
                  <InvoiceStyleDropdown />
                  <div className="text-sm text-muted-foreground">
                    Live Preview
                  </div>
                </div>
              </div>
              <Separator className="mb-6" />

              <div className="max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-250px)] overflow-auto" data-exclude>
                <InvoicePreview />
              </div>
            </div>
          </Card>
        </div>
      </div>

      {children ?? (
        <section className="mt-20 space-y-12">
          {/* How It Works */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              How to Create Professional Invoices in 3 Simple Steps
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
                <h3 className="font-semibold mb-2">Fill Invoice Details</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your business information, client details, and invoice items using our intuitive form or AI voice commands.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
                <h3 className="font-semibold mb-2">Preview & Customize</h3>
                <p className="text-sm text-muted-foreground">
                  See your professional invoice preview in real-time. Adjust formatting, add notes, and set payment terms.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
                <h3 className="font-semibold mb-2">Download PDF</h3>
                <p className="text-sm text-muted-foreground">
                  Export your finished invoice as a professional PDF ready to send to clients or print for your records.
                </p>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="bg-card border-border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Why Choose Our Free Invoice Template Generator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">100% Free Invoice Maker</h3>
                    <p className="text-sm text-muted-foreground">
                      No hidden fees, no subscription required. Create unlimited professional invoices completely free.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">AI Voice Commands</h3>
                    <p className="text-sm text-muted-foreground">
                      Sign in and speak your invoice details to fill them in. Free accounts get 10 voice commands a month.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">Real-time Preview</h3>
                    <p className="text-sm text-muted-foreground">
                      See exactly how your invoice will look as you type. No surprises, just professional results.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">Drafts Stay in Your Browser</h3>
                    <p className="text-sm text-muted-foreground">
                      Drafts stay in your browser until you create an account. No signup needed to build and download an invoice.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">Professional PDF Export</h3>
                    <p className="text-sm text-muted-foreground">
                      Download high-quality PDF invoices ready for email or print. Perfect for any business size.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">Mobile Friendly</h3>
                    <p className="text-sm text-muted-foreground">Create invoices on any device. Fully responsive design works perfectly on phones, tablets, and desktops.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card border-border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">
                  Is this invoice template generator really free?
                </summary>
                <p className="text-sm text-muted-foreground mt-2">
                  Yes. Building and downloading invoices is free, with no subscription, and you can make as many as you like. Voice commands are capped at 10 a month on a free account.
                </p>
              </details>
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">
                  Can I use this for my business invoices?
                </summary>
                <p className="text-sm text-muted-foreground mt-2">
                  Absolutely! Our professional invoice templates are designed for businesses of all sizes - freelancers, consultants, small businesses, and contractors. The invoices include all required business elements.
                </p>
              </details>
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">
                  How does the AI voice feature work?
                </summary>
                <p className="text-sm text-muted-foreground mt-2">
                  Sign in, click the voice button and say what you want, like &quot;Add 5 hours of consulting at $150 per hour&quot;. Your words and the current invoice are sent to OpenAI to work out the change. Free accounts get 10 voice commands a month.
                </p>
              </details>
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">Is my data secure and private?</summary>
                <p className="text-sm text-muted-foreground mt-2">
                  Until you create an account, your draft is saved only in your browser. Once you sign in, invoices you save are stored in our database. Voice commands are processed by OpenAI, invoices you email go through our email provider, and online payments go through Stripe. We use analytics, session recording and error reporting to improve the site.
                </p>
              </details>
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">What file format can I download my invoice in?</summary>
                <p className="text-sm text-muted-foreground mt-2">You can download your invoice as a professional PDF file that&apos;s ready to email to clients or print. The PDF maintains high quality and professional formatting.</p>
              </details>
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">Do I need to create an account or sign up?</summary>
                <p className="text-sm text-muted-foreground mt-2">No. You can build and download an invoice without an account, and your draft is saved in your browser. Create a free account to save invoices, add a logo and use voice commands.</p>
              </details>
            </div>
          </div>
        </section>
      )}

      {/* Footer Actions */}
      <footer className="mt-8 flex flex-col gap-4 justify-center items-center">
        <div className="text-sm text-muted-foreground text-center">
          Drafts stay in your browser until you create an account. No signup needed to download an invoice.
        </div>
        <div className="text-sm text-muted-foreground text-center" suppressHydrationWarning>
          © {new Date().getFullYear()} Swipe Files LLC. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
