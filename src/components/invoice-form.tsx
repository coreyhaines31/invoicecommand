'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { usePDFDownload } from '@/hooks/use-pdf-download'
import { useUser } from '@/hooks/use-user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ErrorBoundary } from '@/components/error-boundary'
import { VoiceToggle } from '@/components/voice/voice-toggle'
import { LogoUpload } from '@/components/logo-upload'
import { InvoiceStyleSelector } from '@/components/invoice-style-selector'
import { PricingMethodSelector } from '@/components/pricing-method-selector'
import { useVoiceCommands } from '@/hooks/use-voice-commands'
import { useInvoiceInitialization } from '@/hooks/use-invoice-initialization'
import { useState } from 'react'
import { Plus, Trash2, Download, Loader2, AlertCircle, Save } from 'lucide-react'

export function InvoiceForm() {
  const invoice = useInvoiceStore()
  const { isGenerating, error, downloadPDF, clearError } = usePDFDownload()
  const { processVoiceCommand } = useVoiceCommands()
  const { user, isAuthenticated } = useUser()
  const [isSaving, setIsSaving] = useState(false)

  // Initialize invoice number based on user authentication status
  useInvoiceInitialization()

  const {
    // Data
    senderName, senderEmail, senderAddress, senderCity, senderState, senderZip, senderPhone, senderLogo,
    clientName, clientEmail, clientAddress, clientCity, clientState, clientZip,
    invoiceNumber, invoiceDate, dueDate,
    items, taxRate, discountRate, notes, terms,

    // Actions
    updateSender, updateClient, updateInvoiceDetails,
    updateTax, updateDiscount,
    addItem, updateItem, removeItem,
    resetInvoice, saveToDatabase
  } = invoice

  const handlePDFDownload = async () => {
    await downloadPDF(invoice)
  }

  const handleVoiceCommand = async (transcript: string) => {
    await processVoiceCommand(transcript)
  }

  const handleSave = async () => {
    if (!user) return

    setIsSaving(true)
    try {
      const invoiceId = await saveToDatabase(user.id)
      if (invoiceId) {
        // Show success feedback
        console.log('Invoice saved successfully:', invoiceId)
      } else {
        console.error('Failed to save invoice')
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
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
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Business Name</Label>
              <Input
                id="senderName"
                value={senderName}
                onChange={(e) => updateSender('senderName', e.target.value)}
                placeholder="Your Business Name"
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
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderAddress">Address</Label>
            <Input
              id="senderAddress"
              value={senderAddress}
              onChange={(e) => updateSender('senderAddress', e.target.value)}
              placeholder="123 Business St"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="senderCity">City</Label>
              <Input
                id="senderCity"
                value={senderCity}
                onChange={(e) => updateSender('senderCity', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderState">State</Label>
              <Input
                id="senderState"
                value={senderState}
                onChange={(e) => updateSender('senderState', e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderZip">ZIP Code</Label>
              <Input
                id="senderZip"
                value={senderZip}
                onChange={(e) => updateSender('senderZip', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderPhone">Phone (Optional)</Label>
            <Input
              id="senderPhone"
              value={senderPhone}
              onChange={(e) => updateSender('senderPhone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>

          {/* Logo Upload */}
          <LogoUpload
            currentLogo={senderLogo}
            onLogoChange={(logoUrl) => {
              if (logoUrl) {
                updateSender('senderLogo', logoUrl)
              } else {
                updateSender('senderLogo', '')
              }
            }}
            disabled={isGenerating || isSaving}
          />
        </CardContent>
      </Card>

      {/* Invoice Style Selection */}
      <InvoiceStyleSelector />

      {/* Pricing Method Templates */}
      <PricingMethodSelector />

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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientState">State</Label>
              <Input
                id="clientState"
                value={clientState}
                onChange={(e) => updateClient('clientState', e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientZip">ZIP Code</Label>
              <Input
                id="clientZip"
                value={clientZip}
                onChange={(e) => updateClient('clientZip', e.target.value)}
                placeholder="12345"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input
                id="invoiceNumber"
                value={invoiceNumber}
                onChange={(e) => updateInvoiceDetails('invoiceNumber', e.target.value)}
                placeholder="1001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => updateInvoiceDetails('invoiceDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => updateInvoiceDetails('dueDate', e.target.value)}
              />
            </div>
          </div>
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
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={resetInvoice}
            variant="outline"
            className="flex-1"
            disabled={isGenerating || isSaving}
          >
            Reset Invoice
          </Button>

          {isAuthenticated && (
            <Button
              onClick={handleSave}
              variant="outline"
              className="flex-1"
              disabled={isGenerating || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Invoice
                </>
              )}
            </Button>
          )}

          <Button
            onClick={handlePDFDownload}
            disabled={isGenerating || isSaving}
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

        {/* PDF Generation Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            PDF will be generated with filename: <br />
            <span className="font-mono text-xs">
              Invoice_{invoiceNumber}_{clientName || 'Client'}_{new Date().toISOString().split('T')[0]}.pdf
            </span>
          </p>
        </div>
      </ErrorBoundary>
    </div>
  )
}