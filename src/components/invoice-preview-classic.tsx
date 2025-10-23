'use client'

import { useInvoiceStore } from '@/stores/invoice-store'

export function InvoicePreviewClassic() {
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
      {/* Header - Centered */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <h1 className="text-4xl font-serif font-bold text-gray-800 mb-2">INVOICE</h1>
        <div className="text-gray-600 font-mono">#{invoice.invoiceNumber}</div>
      </div>

      {/* Company Info - Centered */}
      <div className="text-center mb-8">
        {/* Logo */}
        {invoice.senderLogo && (
          <div className="mb-4">
            <img
              src={invoice.senderLogo}
              alt="Company logo"
              className="max-h-20 max-w-40 object-contain mx-auto"
            />
          </div>
        )}

        <div className="space-y-1">
          <div className="text-xl font-semibold text-gray-800">
            {invoice.senderName || 'Your Business Name'}
          </div>
          {invoice.senderEmail && (
            <div className="text-gray-600">{invoice.senderEmail}</div>
          )}
          {invoice.senderAddress && (
            <div className="text-gray-600">{invoice.senderAddress}</div>
          )}
          <div className="text-gray-600">
            {[invoice.senderCity, invoice.senderState, invoice.senderZip]
              .filter(Boolean)
              .join(', ')}
          </div>
          {invoice.senderPhone && (
            <div className="text-gray-600">{invoice.senderPhone}</div>
          )}
        </div>
      </div>

      {/* Invoice Details and Bill To in two columns */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left: Invoice Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Invoice Details
          </h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-700">Invoice Date:</span>
              <div className="text-gray-600">{formatDate(invoice.invoiceDate)}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Due Date:</span>
              <div className="text-gray-600">{formatDate(invoice.dueDate)}</div>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Amount Due:</span>
              <div className="text-xl font-bold text-gray-800">{formatCurrency(invoice.total)}</div>
            </div>
          </div>
        </div>

        {/* Right: Bill To */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">
            Bill To
          </h3>
          <div className="space-y-1">
            <div className="font-semibold text-gray-800">
              {invoice.clientName || 'Client Name'}
            </div>
            {invoice.clientEmail && (
              <div className="text-gray-600">{invoice.clientEmail}</div>
            )}
            {invoice.clientAddress && (
              <div className="text-gray-600">{invoice.clientAddress}</div>
            )}
            <div className="text-gray-600">
              {[invoice.clientCity, invoice.clientState, invoice.clientZip]
                .filter(Boolean)
                .join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-4 py-3 text-left font-semibold text-gray-800">
                Description
              </th>
              <th className="border border-gray-400 px-4 py-3 text-center font-semibold text-gray-800 w-20">
                Qty
              </th>
              <th className="border border-gray-400 px-4 py-3 text-right font-semibold text-gray-800 w-28">
                Rate
              </th>
              <th className="border border-gray-400 px-4 py-3 text-right font-semibold text-gray-800 w-28">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-400 px-4 py-3">
                  {item.description || 'Description'}
                </td>
                <td className="border border-gray-400 px-4 py-3 text-center font-mono">
                  {item.quantity}
                </td>
                <td className="border border-gray-400 px-4 py-3 text-right font-mono">
                  {formatCurrency(Number(item.price))}
                </td>
                <td className="border border-gray-400 px-4 py-3 text-right font-mono font-semibold">
                  {formatCurrency(Number(item.quantity) * Number(item.price))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-80">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="px-4 py-2 text-right font-semibold text-gray-700">Subtotal:</td>
                <td className="px-4 py-2 text-right font-mono border-b border-gray-200">
                  {formatCurrency(invoice.subtotal)}
                </td>
              </tr>

              {invoice.discountRate > 0 && (
                <tr>
                  <td className="px-4 py-2 text-right font-semibold text-gray-700">
                    Discount ({invoice.discountRate}%):
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-red-600 border-b border-gray-200">
                    -{formatCurrency(invoice.discountAmount)}
                  </td>
                </tr>
              )}

              {invoice.taxRate > 0 && (
                <tr>
                  <td className="px-4 py-2 text-right font-semibold text-gray-700">
                    Tax ({invoice.taxRate}%):
                  </td>
                  <td className="px-4 py-2 text-right font-mono border-b border-gray-200">
                    {formatCurrency(invoice.taxAmount)}
                  </td>
                </tr>
              )}

              <tr className="bg-gray-100">
                <td className="px-4 py-3 text-right text-lg font-bold text-gray-800">Total:</td>
                <td className="px-4 py-3 text-right text-lg font-bold font-mono text-gray-800">
                  {formatCurrency(invoice.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes & Terms */}
      {(invoice.notes || invoice.terms) && (
        <div className="border-t-2 border-gray-300 pt-6 space-y-6">
          {invoice.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Notes
              </h3>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {invoice.notes}
              </div>
            </div>
          )}

          {invoice.terms && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Terms & Conditions
              </h3>
              <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {invoice.terms}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}