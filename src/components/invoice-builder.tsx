'use client'

import { InvoicePreview } from './invoice-preview'
import { InvoiceForm } from './invoice-form'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Logo } from './logo'

export function InvoiceBuilder() {
  return (
    <div className="container mx-auto p-4 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Logo width={48} height={48} className="text-primary" />
          <h1 className="text-4xl font-bold text-foreground">
            Invoice Command
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Build, preview, and edit invoices in real time
        </p>
      </div>

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

      {/* Footer Actions */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="text-sm text-muted-foreground text-center">
          Your data is stored locally in your browser. No signup required.
        </div>
      </div>
    </div>
  )
}