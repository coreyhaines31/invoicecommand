'use client'

import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'
import { InvoiceStyleDropdown } from './invoice-style-dropdown'
import { Navigation } from './navigation'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Mic, FileDown, Zap, Shield } from 'lucide-react'
import { useInvoiceInitialization } from '@/hooks/use-invoice-initialization'
import { ProfessionData } from '@/data/professions-expanded'

interface InvoiceBuilderProps {
  profession?: ProfessionData; // Optional profession customization
}

export function InvoiceBuilder({ profession }: InvoiceBuilderProps = {}) {
  // Initialize invoice numbering
  useInvoiceInitialization()
  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Navigation Bar */}
      <Navigation />

      {/* Header with SEO-optimized content */}
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            {profession ? profession.title : 'Free Invoice Template Generator'}
          </h1>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground text-lg">
            {profession
              ? profession.description
              : 'Create professional invoices instantly with our free invoice builder. Perfect for freelancers, consultants, and small businesses.'
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
              <Shield className="w-3 h-3" />
              Privacy First
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
              ? `How to Create ${profession.profession} Invoices in 3 Simple Steps`
              : 'How to Create Professional Invoices in 3 Simple Steps'
            }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Fill Invoice Details</h3>
              <p className="text-sm text-muted-foreground">
                {profession
                  ? `Enter your ${profession.profession.toLowerCase()} business information, client details, and service items using our intuitive form or AI voice commands.`
                  : 'Enter your business information, client details, and invoice items using our intuitive form or AI voice commands.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Preview & Customize</h3>
              <p className="text-sm text-muted-foreground">
                {profession
                  ? `See your professional ${profession.profession.toLowerCase()} invoice preview in real-time. Adjust formatting, add notes, and set payment terms.`
                  : 'See your professional invoice preview in real-time. Adjust formatting, add notes, and set payment terms.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Download PDF</h3>
              <p className="text-sm text-muted-foreground">
                {profession
                  ? `Export your finished ${profession.profession.toLowerCase()} invoice as a professional PDF ready to send to clients or print for your records.`
                  : 'Export your finished invoice as a professional PDF ready to send to clients or print for your records.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-card border-border rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {profession
              ? `Why Choose Our ${profession.profession} Invoice Template?`
              : 'Why Choose Our Free Invoice Template Generator?'
            }
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {profession && (
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                  <div>
                    <h3 className="font-semibold">Industry-Specific Template</h3>
                    <p className="text-sm text-muted-foreground">Designed specifically for {profession.profession.toLowerCase()} professionals with relevant fields and terminology.</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">{profession ? '100% Free' : '100% Free Invoice Maker'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {profession
                      ? `No hidden fees, no subscription required. Create unlimited professional ${profession.profession.toLowerCase()} invoices completely free.`
                      : 'No hidden fees, no subscription required. Create unlimited professional invoices completely free.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">AI Voice Commands</h3>
                  <p className="text-sm text-muted-foreground">
                    {profession
                      ? `Unique voice-to-invoice feature. Simply speak your ${profession.profession.toLowerCase()} service details and watch them populate automatically.`
                      : 'Unique voice-to-invoice feature. Simply speak your invoice details and watch them populate automatically.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Real-time Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    {profession
                      ? `See exactly how your ${profession.profession.toLowerCase()} invoice will look as you type. No surprises, just professional results.`
                      : 'See exactly how your invoice will look as you type. No surprises, just professional results.'
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    {profession
                      ? `Your ${profession.profession.toLowerCase()} business data stays in your browser. No servers, no storage, no privacy concerns.`
                      : 'Your data stays in your browser. No servers, no storage, no privacy concerns. Complete data control.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Professional PDF Export</h3>
                  <p className="text-sm text-muted-foreground">
                    {profession
                      ? `Download high-quality PDF invoices ready for email or print. Perfect for any ${profession.profession.toLowerCase()} business size.`
                      : 'Download high-quality PDF invoices ready for email or print. Perfect for any business size.'
                    }
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
            {profession
              ? `Frequently Asked Questions - ${profession.profession} Invoices`
              : 'Frequently Asked Questions'
            }
          </h2>
          <div className="space-y-4">
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">
                {profession
                  ? `Is this ${profession.profession.toLowerCase()} invoice template really free?`
                  : 'Is this invoice template generator really free?'
                }
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                {profession
                  ? `Yes! Our ${profession.profession.toLowerCase()} invoice maker is completely free with no hidden costs, subscriptions, or limits. Create unlimited professional invoices for your ${profession.profession.toLowerCase()} business.`
                  : 'Yes! Our invoice maker is completely free with no hidden costs, subscriptions, or limits. Create unlimited professional invoices without paying anything.'
                }
              </p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">
                {profession
                  ? `Can I use this for my ${profession.profession.toLowerCase()} business invoices?`
                  : 'Can I use this for my business invoices?'
                }
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                {profession
                  ? `Absolutely! Our professional ${profession.profession.toLowerCase()} invoice templates are designed specifically for ${profession.profession.toLowerCase()} businesses and include all required business elements and industry-relevant fields.`
                  : 'Absolutely! Our professional invoice templates are designed for businesses of all sizes - freelancers, consultants, small businesses, and contractors. The invoices include all required business elements.'
                }
              </p>
            </details>
            {profession && (
              <details className="border-b border-border pb-4">
                <summary className="font-semibold cursor-pointer hover:text-primary">
                  What makes this different from other {profession.profession.toLowerCase()} invoice templates?
                </summary>
                <p className="text-sm text-muted-foreground mt-2">
                  Our template is specifically designed for {profession.profession.toLowerCase()} professionals with relevant service categories, industry-standard rates, and terminology that your clients will recognize and trust.
                </p>
              </details>
            )}
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">
                {profession
                  ? `How does the AI voice feature work for ${profession.profession.toLowerCase()} services?`
                  : 'How does the AI voice feature work?'
                }
              </summary>
              <p className="text-sm text-muted-foreground mt-2">
                {profession
                  ? `Simply click the voice button and speak naturally about your ${profession.profession.toLowerCase()} services. For example, say "Add ${profession.commonServices[0]?.toLowerCase() || 'consultation'} for 2 hours at ${profession.averageRates.hourly?.replace('$', '').replace('/hr', '') || '100'} per hour" and watch it populate automatically.`
                  : 'Simply click the voice button and speak naturally about your invoice details. Our AI understands commands like "Add 5 hours of consulting at $150 per hour" and automatically populates your invoice.'
                }
              </p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Is my data secure and private?</summary>
              <p className="text-sm text-muted-foreground mt-2">
                {profession
                  ? `Your privacy is our priority. All data is stored locally in your browser only. We never store your ${profession.profession.toLowerCase()} business or client information on our servers. You have complete control over your data.`
                  : 'Your privacy is our priority. All data is stored locally in your browser only. We never store your business or client information on our servers. You have complete control over your data.'
                }
              </p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">What file format can I download my invoice in?</summary>
              <p className="text-sm text-muted-foreground mt-2">You can download your invoice as a professional PDF file that's ready to email to clients or print. The PDF maintains high quality and professional formatting.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Do I need to create an account or sign up?</summary>
              <p className="text-sm text-muted-foreground mt-2">No registration required! Start creating professional invoices immediately without providing any personal information. Your invoices are saved locally in your browser for convenience.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Footer Actions */}
      <footer className="mt-8 flex flex-col gap-4 justify-center items-center">
        <div className="text-sm text-muted-foreground text-center">
          {profession
            ? `Your ${profession.profession.toLowerCase()} business data is stored locally in your browser. No signup required.`
            : 'Your data is stored locally in your browser. No signup required.'
          }
        </div>
        <div className="text-sm text-muted-foreground text-center" suppressHydrationWarning>
          © {new Date().getFullYear()} Swipe Files LLC. All rights reserved.
        </div>
      </footer>
    </div>
  )
}