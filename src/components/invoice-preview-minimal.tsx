'use client'

import { useInvoiceStore } from '@/stores/invoice-store'

export function InvoicePreviewMinimal() {
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
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white text-black p-12 rounded-lg shadow-sm border border-border min-h-[800px] max-w-2xl mx-auto">
      {/* Header - Simple */}
      <div className="mb-16">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-2">Invoice</h1>
            <div className="text-sm text-gray-500">#{invoice.invoiceNumber}</div>
          </div>
          <div className="text-right">
            {invoice.senderLogo && (
              <div className="mb-4">
                <img
                  src={invoice.senderLogo}
                  alt="Logo"
                  className="max-h-12 max-w-24 object-contain ml-auto"
                />
              </div>
            )}
            <div className="text-2xl font-light text-gray-900">
              {formatCurrency(invoice.total)}
            </div>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-16 mb-16">
        {/* From */}
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">From</div>
          <div className="space-y-1 text-sm">
            <div className="font-medium text-gray-900">
              {invoice.senderName || 'Your Business Name'}
            </div>
            {invoice.senderEmail && (
              <div className="text-gray-600">{invoice.senderEmail}</div>
            )}
            {invoice.senderAddress && (
              <div className="text-gray-600">{invoice.senderAddress}</div>
            )}
            {(invoice.senderCity || invoice.senderState || invoice.senderZip) && (
              <div className="text-gray-600">
                {[invoice.senderCity, invoice.senderState, invoice.senderZip]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
            {invoice.senderPhone && (
              <div className="text-gray-600">{invoice.senderPhone}</div>
            )}
          </div>
        </div>

        {/* To */}
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">To</div>
          <div className="space-y-1 text-sm">
            <div className="font-medium text-gray-900">
              {invoice.clientName || 'Client Name'}
            </div>
            {invoice.clientEmail && (
              <div className="text-gray-600">{invoice.clientEmail}</div>
            )}
            {invoice.clientAddress && (
              <div className="text-gray-600">{invoice.clientAddress}</div>
            )}
            {(invoice.clientCity || invoice.clientState || invoice.clientZip) && (
              <div className="text-gray-600">
                {[invoice.clientCity, invoice.clientState, invoice.clientZip]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-16 mb-16">
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Date</div>
          <div className="text-sm text-gray-900">{formatDate(invoice.invoiceDate)}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Due</div>
          <div className="text-sm text-gray-900">{formatDate(invoice.dueDate)}</div>
        </div>
      </div>

      {/* Line Items - Minimal table */}
      <div className="mb-16">
        {/* Header */}
        <div className="border-b border-gray-200 pb-2 mb-6">
          <div className="grid grid-cols-12 gap-4 text-xs text-gray-400 uppercase tracking-widest">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-center">Qty</div>
            <div className="col-span-2 text-right">Rate</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 text-sm py-2">
              <div className="col-span-6 text-gray-900">
                {item.description || 'Description'}
              </div>
              <div className="col-span-2 text-center text-gray-600 font-mono">
                {item.quantity}
              </div>
              <div className="col-span-2 text-right text-gray-600 font-mono">
                {formatCurrency(Number(item.price))}
              </div>
              <div className="col-span-2 text-right text-gray-900 font-mono">
                {formatCurrency(Number(item.quantity) * Number(item.price))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals - Right aligned, minimal */}
      <div className="flex justify-end mb-16">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-mono text-gray-900">{formatCurrency(invoice.subtotal)}</span>
          </div>

          {invoice.discountRate > 0 && (
            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-600">Discount ({invoice.discountRate}%)</span>
              <span className="font-mono text-gray-600">
                -{formatCurrency(invoice.discountAmount)}
              </span>
            </div>
          )}

          {invoice.taxRate > 0 && (
            <div className="flex justify-between text-sm border-b border-gray-100 pb-2">
              <span className="text-gray-600">Tax ({invoice.taxRate}%)</span>
              <span className="font-mono text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
            </div>
          )}

          <div className="flex justify-between text-base pt-4 border-t border-gray-300">
            <span className="font-medium text-gray-900">Total</span>
            <span className="font-mono font-medium text-gray-900">
              {formatCurrency(invoice.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes & Terms - Minimal styling */}
      {(invoice.notes || invoice.terms) && (
        <div className="space-y-12 pt-8 border-t border-gray-200">
          {invoice.notes && (
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                Notes
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {invoice.notes}
              </div>
            </div>
          )}

          {invoice.terms && (
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                Terms
              </div>
              <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                {invoice.terms}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}