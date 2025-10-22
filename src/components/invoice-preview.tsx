'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { Separator } from '@/components/ui/separator'

export function InvoicePreview() {
  const invoice = useInvoiceStore()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: invoice.currency,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-sm border border-border min-h-[800px] max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">INVOICE</h1>
          <div className="text-muted-foreground">
            <div className="font-mono text-sm">#{invoice.invoiceNumber}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary mb-1">
            {formatCurrency(invoice.total)}
          </div>
          <div className="text-sm text-muted-foreground">
            Due: {formatDate(invoice.dueDate)}
          </div>
        </div>
      </div>

      {/* Sender & Recipient */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* From */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            From
          </h3>

          {/* Logo */}
          {invoice.senderLogo && (
            <div className="mb-4">
              <img
                src={invoice.senderLogo}
                alt="Company logo"
                className="max-h-16 max-w-32 object-contain"
              />
            </div>
          )}

          <div className="space-y-1">
            <div className="font-semibold text-foreground">
              {invoice.senderName || 'Your Business Name'}
            </div>
            {invoice.senderEmail && (
              <div className="text-sm text-muted-foreground">{invoice.senderEmail}</div>
            )}
            {invoice.senderAddress && (
              <div className="text-sm text-muted-foreground">{invoice.senderAddress}</div>
            )}
            <div className="text-sm text-muted-foreground">
              {[invoice.senderCity, invoice.senderState, invoice.senderZip]
                .filter(Boolean)
                .join(', ')}
            </div>
            {invoice.senderPhone && (
              <div className="text-sm text-muted-foreground">{invoice.senderPhone}</div>
            )}
          </div>
        </div>

        {/* To */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Bill To
          </h3>
          <div className="space-y-1">
            <div className="font-semibold text-foreground">
              {invoice.clientName || 'Client Name'}
            </div>
            {invoice.clientEmail && (
              <div className="text-sm text-muted-foreground">{invoice.clientEmail}</div>
            )}
            {invoice.clientAddress && (
              <div className="text-sm text-muted-foreground">{invoice.clientAddress}</div>
            )}
            <div className="text-sm text-muted-foreground">
              {[invoice.clientCity, invoice.clientState, invoice.clientZip]
                .filter(Boolean)
                .join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <div className="text-sm font-semibold text-muted-foreground mb-1">Invoice Date</div>
          <div className="text-sm">{formatDate(invoice.invoiceDate)}</div>
        </div>
        <div>
          <div className="text-sm font-semibold text-muted-foreground mb-1">Due Date</div>
          <div className="text-sm">{formatDate(invoice.dueDate)}</div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Line Items */}
      <div className="mb-8">
        <div className="grid grid-cols-12 gap-2 mb-4 pb-2 border-b border-border text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          <div className="col-span-6">Description</div>
          <div className="col-span-2 text-center">Qty</div>
          <div className="col-span-2 text-right">Rate</div>
          <div className="col-span-2 text-right">Amount</div>
        </div>

        <div className="space-y-3">
          {invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 text-sm">
              <div className="col-span-6">
                {item.description || 'Description'}
              </div>
              <div className="col-span-2 text-center font-mono">
                {item.quantity}
              </div>
              <div className="col-span-2 text-right font-mono">
                {formatCurrency(Number(item.price))}
              </div>
              <div className="col-span-2 text-right font-mono font-semibold">
                {formatCurrency(Number(item.quantity) * Number(item.price))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
          </div>

          {invoice.discountRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Discount ({invoice.discountRate}%):
              </span>
              <span className="font-mono text-destructive">
                -{formatCurrency(invoice.discountAmount)}
              </span>
            </div>
          )}

          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax ({invoice.taxRate}%):</span>
              <span className="font-mono">{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span className="font-mono text-primary">{formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="space-y-4">
          <Separator />

          {invoice.notes && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Notes
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {invoice.notes}
              </div>
            </div>
          )}

          {invoice.terms && (
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Terms & Conditions
              </h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {invoice.terms}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}