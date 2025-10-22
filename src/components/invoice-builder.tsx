'use client'

import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Logo } from './logo'

export function InvoiceBuilder() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Navigation Bar */}
      <nav className="mb-6">
        <div className="flex items-center gap-3">
          <Logo width={24} height={24} className="text-primary" />
          <span className="text-lg font-semibold text-foreground">Invoice Command</span>
        </div>
      </nav>

      {/* Header with SEO-optimized content */}
      <header className="mb-8">
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-foreground">
            Free Invoice Template Generator
          </h1>
        </div>
        <div className="space-y-3">
          <p className="text-muted-foreground text-lg">
            Create professional invoices instantly with our free invoice builder. Perfect for freelancers, consultants, and small businesses.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
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

      {/* SEO Content Section */}
      <section className="mt-12 space-y-8">
        {/* How It Works */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">How to Create Professional Invoices in 3 Simple Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">1</div>
              <h3 className="font-semibold mb-2">Fill Invoice Details</h3>
              <p className="text-sm text-muted-foreground">Enter your business information, client details, and invoice items using our intuitive form or AI voice commands.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">2</div>
              <h3 className="font-semibold mb-2">Preview & Customize</h3>
              <p className="text-sm text-muted-foreground">See your professional invoice preview in real-time. Adjust formatting, add notes, and set payment terms.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-3 text-xl font-bold">3</div>
              <h3 className="font-semibold mb-2">Download PDF</h3>
              <p className="text-sm text-muted-foreground">Export your finished invoice as a professional PDF ready to send to clients or print for your records.</p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose Our Free Invoice Template Generator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">100% Free Invoice Maker</h3>
                  <p className="text-sm text-muted-foreground">No hidden fees, no subscription required. Create unlimited professional invoices completely free.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">AI Voice Commands</h3>
                  <p className="text-sm text-muted-foreground">Unique voice-to-invoice feature. Simply speak your invoice details and watch them populate automatically.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Real-time Preview</h3>
                  <p className="text-sm text-muted-foreground">See exactly how your invoice will look as you type. No surprises, just professional results.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">Your data stays in your browser. No servers, no storage, no privacy concerns. Complete data control.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-primary/10 text-primary rounded flex items-center justify-center flex-shrink-0 mt-0.5">✓</div>
                <div>
                  <h3 className="font-semibold">Professional PDF Export</h3>
                  <p className="text-sm text-muted-foreground">Download high-quality PDF invoices ready for email or print. Perfect for any business size.</p>
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
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Is this invoice template generator really free?</summary>
              <p className="text-sm text-muted-foreground mt-2">Yes! Our invoice maker is completely free with no hidden costs, subscriptions, or limits. Create unlimited professional invoices without paying anything.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Can I use this for my business invoices?</summary>
              <p className="text-sm text-muted-foreground mt-2">Absolutely! Our professional invoice templates are designed for businesses of all sizes - freelancers, consultants, small businesses, and contractors. The invoices include all required business elements.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">How does the AI voice feature work?</summary>
              <p className="text-sm text-muted-foreground mt-2">Simply click the voice button and speak naturally about your invoice details. Our AI understands commands like "Add 5 hours of consulting at $150 per hour" and automatically populates your invoice.</p>
            </details>
            <details className="border-b border-border pb-4">
              <summary className="font-semibold cursor-pointer hover:text-primary">Is my data secure and private?</summary>
              <p className="text-sm text-muted-foreground mt-2">Your privacy is our priority. All data is stored locally in your browser only. We never store your business or client information on our servers. You have complete control over your data.</p>
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
      <footer className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="text-sm text-muted-foreground text-center">
          Your data is stored locally in your browser. No signup required.
        </div>
      </footer>
    </div>
  )
}