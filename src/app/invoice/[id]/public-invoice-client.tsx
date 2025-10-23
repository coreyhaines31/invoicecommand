'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Download, CreditCard, Clock, XCircle } from 'lucide-react'
import { PublicPaymentButton } from '@/components/payment/public-payment-button'

interface InvoiceData {
  id: string
  senderName: string
  senderEmail: string
  senderAddress: string
  senderCity: string
  senderState: string
  senderZip: string
  senderPhone: string
  senderLogo: string
  clientName: string
  clientEmail: string
  clientAddress: string
  clientCity: string
  clientState: string
  clientZip: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  items: Array<{ description: string; quantity: number; price: number }>
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  notes: string
  terms: string
  currency: string
  paymentEnabled: boolean
  stripePaymentStatus: string
  style: 'modern' | 'classic' | 'minimal'
}

interface PublicInvoiceClientProps {
  invoice: InvoiceData
}

export function PublicInvoiceClient({ invoice }: PublicInvoiceClientProps) {
  const [paymentStatus, setPaymentStatus] = useState(invoice.stripePaymentStatus)

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

  const getPaymentStatusBadge = () => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )
      case 'processing':
        return (
          <Badge className="bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Processing
          </Badge>
        )
      case 'failed':
        return (
          <Badge className="bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <CreditCard className="w-3 h-3 mr-1" />
            Unpaid
          </Badge>
        )
    }
  }

  const handlePaymentSuccess = () => {
    setPaymentStatus('paid')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
              <p className="text-muted-foreground">From {invoice.senderName}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(invoice.total)}
              </div>
              {getPaymentStatusBadge()}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Invoice Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* Invoice Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Invoice Number</p>
                    <p className="font-mono">{invoice.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Invoice Date</p>
                    <p>{formatDate(invoice.invoiceDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                    <p>{formatDate(invoice.dueDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Status</p>
                    {getPaymentStatusBadge()}
                  </div>
                </div>

                <Separator />

                {/* From & To */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">From</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{invoice.senderName}</p>
                      {invoice.senderEmail && <p>{invoice.senderEmail}</p>}
                      {invoice.senderAddress && <p>{invoice.senderAddress}</p>}
                      {(invoice.senderCity || invoice.senderState || invoice.senderZip) && (
                        <p>{invoice.senderCity} {invoice.senderState} {invoice.senderZip}</p>
                      )}
                      {invoice.senderPhone && <p>{invoice.senderPhone}</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">To</h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{invoice.clientName}</p>
                      {invoice.clientEmail && <p>{invoice.clientEmail}</p>}
                      {invoice.clientAddress && <p>{invoice.clientAddress}</p>}
                      {(invoice.clientCity || invoice.clientState || invoice.clientZip) && (
                        <p>{invoice.clientCity} {invoice.clientState} {invoice.clientZip}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Line Items */}
                <div>
                  <h3 className="font-semibold mb-4">Items</h3>
                  <div className="space-y-2">
                    {invoice.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <div className="flex-1">
                          <p className="font-medium">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.quantity * item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(invoice.subtotal)}</span>
                    </div>
                    {invoice.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({invoice.discountRate}%):</span>
                        <span>-{formatCurrency(invoice.discountAmount)}</span>
                      </div>
                    )}
                    {invoice.taxAmount > 0 && (
                      <div className="flex justify-between">
                        <span>Tax ({invoice.taxRate}%):</span>
                        <span>{formatCurrency(invoice.taxAmount)}</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(invoice.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms */}
                {(invoice.notes || invoice.terms) && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      {invoice.notes && (
                        <div>
                          <h3 className="font-semibold mb-2">Notes</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {invoice.notes}
                          </p>
                        </div>
                      )}
                      {invoice.terms && (
                        <div>
                          <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {invoice.terms}
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">

              {/* Payment Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="text-2xl font-bold">
                      {formatCurrency(invoice.total)}
                    </div>
                    {getPaymentStatusBadge()}

                    {/* Payment Button */}
                    {invoice.paymentEnabled && paymentStatus === 'unpaid' && (
                      <PublicPaymentButton
                        invoiceId={invoice.id}
                        amount={Math.round(invoice.total * 100)} // Convert to cents
                        currency={invoice.currency}
                        invoiceNumber={invoice.invoiceNumber}
                        recipientName={invoice.senderName}
                        onSuccess={handlePaymentSuccess}
                      />
                    )}

                    {paymentStatus === 'paid' && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          This invoice has been paid. Thank you!
                        </AlertDescription>
                      </Alert>
                    )}

                    {!invoice.paymentEnabled && (
                      <Alert>
                        <AlertDescription>
                          Online payments are not enabled for this invoice. Please follow the payment instructions provided separately.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}