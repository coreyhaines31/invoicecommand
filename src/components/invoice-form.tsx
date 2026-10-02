'use client'

import React, { memo, useCallback } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { usePDFDownload } from '@/hooks/use-pdf-download'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ErrorBoundary } from '@/components/error-boundary'
import { VoiceToggle } from '@/components/voice/voice-toggle'
import { DocumentTypeToggle } from '@/components/document-type-toggle'
import { useVoiceCommands } from '@/hooks/use-voice-commands'
import { useInvoiceInitialization } from '@/hooks/use-invoice-initialization'
import { useUpgradeTriggers } from '@/hooks/use-upgrade-triggers'
import { useUserTier } from '@/hooks/use-user-tier'
import { useUser } from '@/hooks/use-user'
import { LogoUpload } from '@/components/logo-upload'
import { Plus, Trash2, Download, Loader2, AlertCircle, Share2, Copy, Save, ArrowRight } from 'lucide-react'
import { PaymentSettings } from '@/components/payment/payment-settings'
import { toast } from 'sonner'
import { validateExpirationDate } from '@/lib/utils'

export function InvoiceForm() {
  const invoice = useInvoiceStore()
  const { isGenerating, error, downloadPDF, clearError } = usePDFDownload()
  const { processVoiceCommand } = useVoiceCommands()
  const { triggerUpgrade } = useUpgradeTriggers()
  const { isAnonymous, loading: sessionLoading } = useUserTier()
  const { user } = useUser()
  const [isConverting, setIsConverting] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [expirationDateError, setExpirationDateError] = React.useState<string | null>(null)

  // Initialize invoice number based on user authentication status
  useInvoiceInitialization()

  const {
    // Data
    documentType,
    senderName, senderEmail, senderAddress, senderCity, senderState, senderZip, senderPhone,
    clientName, clientEmail, clientAddress, clientCity, clientState, clientZip,
    invoiceNumber, invoiceDate, dueDate, expirationDate,
    items, taxRate, discountRate, notes, terms, total, currency,
    paymentEnabled,
    collectSignature, signatureRequired, signedAt,

    // Actions
    updateSender, updateClient, updateInvoiceDetails,
    updateTax, updateDiscount,
    addItem, updateItem, removeItem,
    resetInvoice, updatePaymentSettings, updateEsignatureSettings, convertEstimateToInvoice
  } = invoice

  const handlePDFDownload = async () => {
    await downloadPDF(invoice)
  }

  const handleVoiceCommand = async (transcript: string) => {
    await processVoiceCommand(transcript)
  }

  const handleSaveInvoice = async () => {
    // Don't trigger the paywall during initial session load — useUserTier
    // starts at 'anonymous' until useSession resolves, so a fast click on a
    // logged-in user would otherwise see the upgrade modal incorrectly.
    if (sessionLoading) return

    if (isAnonymous) {
      triggerUpgrade('save-invoice')
      return
    }

    if (!user) return

    setIsSaving(true)
    try {
      const savedId = await invoice.saveToDatabase(user.id)
      if (savedId) {
        toast.success(`${documentType === 'estimate' ? 'Estimate' : 'Invoice'} saved to dashboard!`)
      } else {
        toast.error('Failed to save. Please try again.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleShareInvoice = async () => {
    if (!invoice.id) {
      toast.error('Please save the invoice first before sharing')
      return
    }

    const shareUrl = `${window.location.origin}/invoice/${invoice.id}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success(`${documentType === 'estimate' ? 'Estimate' : 'Invoice'} link copied to clipboard!`)
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      toast.success(`${documentType === 'estimate' ? 'Estimate' : 'Invoice'} link copied to clipboard!`)
    }
  }

  const handleExpirationDateChange = (value: string) => {
    updateInvoiceDetails('expirationDate', value)

    // Validate the expiration date
    if (value && documentType === 'estimate') {
      const validation = validateExpirationDate(value)
      if (!validation.valid) {
        setExpirationDateError(validation.error || 'Invalid expiration date')
      } else {
        setExpirationDateError(null)
      }
    } else {
      setExpirationDateError(null)
    }
  }

  const handleConvertToInvoice = async () => {
    if (documentType !== 'estimate') {
      toast.error('Only estimates can be converted to invoices')
      return
    }

    if (sessionLoading) return

    if (isAnonymous) {
      triggerUpgrade('convert-estimate')
      return
    }

    setIsConverting(true)
    toast.loading('Converting estimate to invoice...', { id: 'converting' })

    try {
      const newInvoiceId = await convertEstimateToInvoice()

      if (newInvoiceId) {
        toast.success('Estimate converted to invoice successfully!', { id: 'converting' })
      } else {
        toast.error('Failed to convert estimate to invoice. Please try again.', { id: 'converting' })
      }
    } catch (error) {
      toast.error('An error occurred during conversion', { id: 'converting' })
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Document Type Toggle */}
      <DocumentTypeToggle />

      {/* Voice Mode Toggle */}
      <VoiceToggle
        onVoiceCommand={handleVoiceCommand}
        disabled={isGenerating}
      />

      {/* Sender Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left side: All input fields in 3 rows */}
            <div className="lg:col-span-3 space-y-4">
              {/* Row 1: Business Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Business Name</Label>
                  <Input
                    id="senderName"
                    value={senderName}
                    onChange={(e) => updateSender('senderName', e.target.value)}
                    placeholder="Your Business Name"
                    autoComplete="organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={senderEmail}
                    onChange={(e) => updateSender('senderEmail', e.target.value)}
                    placeholder="business@example.com"
                    autoComplete="email"
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Row 2: Address + Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderAddress">Address</Label>
                  <Input
                    id="senderAddress"
                    value={senderAddress}
                    onChange={(e) => updateSender('senderAddress', e.target.value)}
                    placeholder="123 Business St"
                    autoComplete="street-address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderPhone">Phone (Optional)</Label>
                  <Input
                    id="senderPhone"
                    type="tel"
                    value={senderPhone}
                    onChange={(e) => updateSender('senderPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                    inputMode="tel"
                  />
                </div>
              </div>

              {/* Row 3: City + State + ZIP */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderCity">City</Label>
                  <Input
                    id="senderCity"
                    value={senderCity}
                    onChange={(e) => updateSender('senderCity', e.target.value)}
                    placeholder="City"
                    autoComplete="address-level2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderState">State</Label>
                  <Input
                    id="senderState"
                    value={senderState}
                    onChange={(e) => updateSender('senderState', e.target.value)}
                    placeholder="State"
                    autoComplete="address-level1"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderZip">ZIP Code</Label>
                  <Input
                    id="senderZip"
                    value={senderZip}
                    onChange={(e) => updateSender('senderZip', e.target.value)}
                    placeholder="12345"
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>

            {/* Right side: Logo upload (full height) */}
            <div className="lg:col-span-1 flex flex-col">
              <Label className="mb-2">Company Logo</Label>
              <div className="flex-1">
                <LogoUpload />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Bill To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client Name</Label>
              <Input
                id="clientName"
                value={clientName}
                onChange={(e) => updateClient('clientName', e.target.value)}
                placeholder="Client Name"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                value={clientEmail}
                onChange={(e) => updateClient('clientEmail', e.target.value)}
                placeholder="client@example.com"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress">Address</Label>
            <Input
              id="clientAddress"
              value={clientAddress}
              onChange={(e) => updateClient('clientAddress', e.target.value)}
              placeholder="123 Client St"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientCity">City</Label>
              <Input
                id="clientCity"
                value={clientCity}
                onChange={(e) => updateClient('clientCity', e.target.value)}
                placeholder="City"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientState">State</Label>
              <Input
                id="clientState"
                value={clientState}
                onChange={(e) => updateClient('clientState', e.target.value)}
                placeholder="State"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientZip">ZIP Code</Label>
              <Input
                id="clientZip"
                value={clientZip}
                onChange={(e) => updateClient('clientZip', e.target.value)}
                placeholder="12345"
                autoComplete="off"
                inputMode="numeric"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">
            {documentType === 'estimate' ? 'Estimate Details' : 'Invoice Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">
                {documentType === 'estimate' ? 'Estimate Number' : 'Invoice Number'}
              </Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => updateInvoiceDetails('invoiceNumber', e.target.value)}
                placeholder={documentType === 'estimate' ? 'EST-1001' : 'INV-1001'}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">
                {documentType === 'estimate' ? 'Estimate Date' : 'Invoice Date'}
              </Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => updateInvoiceDetails('invoiceDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={documentType === 'estimate' ? 'expirationDate' : 'dueDate'}>
                {documentType === 'estimate' ? 'Valid Until' : 'Due Date'}
              </Label>
              <Input
                id={documentType === 'estimate' ? 'expirationDate' : 'dueDate'}
                type="date"
                value={documentType === 'estimate' ? (expirationDate || '') : dueDate}
                onChange={(e) => {
                  if (documentType === 'estimate') {
                    handleExpirationDateChange(e.target.value)
                  } else {
                    updateInvoiceDetails('dueDate', e.target.value)
                  }
                }}
                className={expirationDateError && documentType === 'estimate' ? 'border-red-500' : ''}
              />
              {expirationDateError && documentType === 'estimate' && (
                <p className="text-sm text-red-500">{expirationDateError}</p>
              )}
            </div>
          </div>

          {/* E-signature settings for estimates */}
          {documentType === 'estimate' && (
            <div className="space-y-3 pt-2 border-t">
              <Label className="text-sm font-medium">Electronic signature</Label>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={collectSignature !== false}
                  onChange={(e) => updateEsignatureSettings({ collectSignature: e.target.checked })}
                  disabled={Boolean(signedAt)}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">Collect signature</span>
                  <span className="block text-xs text-muted-foreground">
                    Show the recipient a signature pad on the public estimate page.
                  </span>
                </span>
              </label>
              <label className="flex items-start gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={signatureRequired === true}
                  onChange={(e) => updateEsignatureSettings({ signatureRequired: e.target.checked })}
                  disabled={Boolean(signedAt) || collectSignature === false}
                  className="mt-1"
                />
                <span>
                  <span className="font-medium">Mark signature as required</span>
                  <span className="block text-xs text-muted-foreground">
                    Show a prominent &ldquo;signature required&rdquo; notice on the public estimate page.
                  </span>
                </span>
              </label>
              {signedAt && (
                <p className="text-xs text-muted-foreground">
                  Signed estimates are locked — these settings can no longer be changed.
                </p>
              )}
            </div>
          )}

          {/* Convert to Invoice button for estimates */}
          {documentType === 'estimate' && !isAnonymous && (
            <Button
              type="button"
              onClick={handleConvertToInvoice}
              variant="outline"
              className="w-full"
              disabled={isConverting || sessionLoading}
            >
              {isConverting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Convert to Invoice
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg text-foreground">Line Items</CardTitle>
            <Button
              onClick={addItem}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">
                  Item {index + 1}
                </div>
                {items.length > 1 && (
                  <Button
                    onClick={() => removeItem(index)}
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`item-description-${index}`}>Description</Label>
                <Input
                  id={`item-description-${index}`}
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  placeholder="Service or product description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`item-quantity-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    placeholder="1"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`item-price-${index}`}>Rate ($)</Label>
                  <Input
                    id={`item-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Amount: <span className="font-mono font-semibold">
                    ${((Number(item.quantity) || 0) * (Number(item.price) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tax & Discount */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Tax & Discount</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={taxRate}
                onChange={(e) => updateTax(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discountRate">Discount Rate (%)</Label>
              <Input
                id="discountRate"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={discountRate}
                onChange={(e) => updateDiscount(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes & Terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => updateInvoiceDetails('notes', e.target.value)}
              placeholder="Additional notes for your client..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Terms & Conditions</Label>
            <Textarea
              id="terms"
              value={terms}
              onChange={(e) => updateInvoiceDetails('terms', e.target.value)}
              placeholder="Payment terms and conditions..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment Settings */}
      <PaymentSettings
        paymentEnabled={paymentEnabled || false}
        onPaymentToggle={(enabled) => updatePaymentSettings({ paymentEnabled: enabled })}
        invoiceTotal={total}
        currency={currency}
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="h-auto p-1 hover:bg-transparent"
            >
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Actions */}
      <ErrorBoundary>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={resetInvoice}
              variant="outline"
              className="flex-1"
              disabled={isGenerating}
            >
              Reset {documentType === 'estimate' ? 'Estimate' : 'Invoice'}
            </Button>

            {/* Save Button */}
            <Button
              onClick={handleSaveInvoice}
              variant="outline"
              className="flex-1"
              disabled={isGenerating || isSaving || sessionLoading}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? 'Saving...' : `Save ${documentType === 'estimate' ? 'Estimate' : 'Invoice'}`}
            </Button>

            <Button
              onClick={handlePDFDownload}
              disabled={isGenerating}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {/* Share Button (only show if invoice is saved) */}
          {invoice.id && (
            <Button
              onClick={handleShareInvoice}
              variant="outline"
              className="w-full"
              disabled={isGenerating}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share {documentType === 'estimate' ? 'Estimate' : 'Invoice'} Link
            </Button>
          )}
        </div>

        {/* PDF Generation Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            PDF will be generated with filename: <br />
            <span className="font-mono text-xs">
              {documentType === 'estimate' ? 'Estimate' : 'Invoice'}_{invoiceNumber}_{clientName || 'Client'}_{new Date().toISOString().split('T')[0]}.pdf
            </span>
          </p>
        </div>
      </ErrorBoundary>
    </div>
  )
}