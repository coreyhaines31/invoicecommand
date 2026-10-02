'use client'

import { useState } from 'react'
import { useInvoiceStore } from '@/stores/invoice-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, DollarSign, Clock, Package, Calendar, Target, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

const pricingMethods = [
  {
    id: 'hourly',
    name: 'Hourly Rate',
    description: 'Perfect for consulting, design work, and time-based services',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    template: {
      description: 'Consulting Services - {hours} hours @ {rate}/hour',
      defaultRate: 75,
      defaultQuantity: 8,
      suggestions: ['Web Development', 'Graphic Design', 'Legal Consultation', 'Business Consulting']
    }
  },
  {
    id: 'fixed',
    name: 'Fixed Project',
    description: 'One-time fee for complete project deliverables',
    icon: Package,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    template: {
      description: 'Project: {projectName} - Complete deliverables',
      defaultRate: 2500,
      defaultQuantity: 1,
      suggestions: ['Website Development', 'Logo Design Package', 'Marketing Campaign', 'App Development']
    }
  },
  {
    id: 'retainer',
    name: 'Monthly Retainer',
    description: 'Recurring monthly fee for ongoing services',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    template: {
      description: 'Monthly Retainer - {serviceName} (Month of {month})',
      defaultRate: 3000,
      defaultQuantity: 1,
      suggestions: ['SEO Services', 'Social Media Management', 'IT Support', 'Content Creation']
    }
  },
  {
    id: 'unit',
    name: 'Per Unit/Quantity',
    description: 'Price per item, unit, or specific deliverable',
    icon: Target,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    template: {
      description: '{itemName} - Unit price',
      defaultRate: 25,
      defaultQuantity: 10,
      suggestions: ['Blog Articles', 'Product Photos', 'Email Templates', 'Landing Pages']
    }
  },
  {
    id: 'milestone',
    name: 'Milestone-based',
    description: 'Payment tied to specific project milestones',
    icon: Zap,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    template: {
      description: 'Milestone: {milestoneName} ({percentage}% complete)',
      defaultRate: 1250,
      defaultQuantity: 1,
      suggestions: ['Design Approval', 'Development Phase 1', 'Testing Complete', 'Final Delivery']
    }
  }
]

interface PricingMethodSelectorProps {
  onApplyTemplate?: (template: any) => void
}

export function PricingMethodSelector({ onApplyTemplate }: PricingMethodSelectorProps) {
  const { addItem, updateItem, items } = useInvoiceStore()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [customValues, setCustomValues] = useState({
    description: '',
    rate: 0,
    quantity: 1,
    hours: 8,
    projectName: '',
    serviceName: '',
    month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    itemName: '',
    milestoneName: '',
    percentage: 25
  })

  const handleMethodSelect = (methodId: string) => {
    const method = pricingMethods.find(m => m.id === methodId)
    if (!method) return

    setSelectedMethod(methodId)
    setCustomValues({
      ...customValues,
      description: method.template.description,
      rate: method.template.defaultRate,
      quantity: method.template.defaultQuantity
    })
    setIsDialogOpen(true)
  }

  const handleApplyTemplate = () => {
    if (!selectedMethod) return

    const method = pricingMethods.find(m => m.id === selectedMethod)
    if (!method) return

    // Replace placeholders in description
    let finalDescription = customValues.description

    switch (selectedMethod) {
      case 'hourly':
        finalDescription = finalDescription
          .replace('{hours}', customValues.hours.toString())
          .replace('{rate}', `$${customValues.rate}`)
        break
      case 'fixed':
        finalDescription = finalDescription
          .replace('{projectName}', customValues.projectName || 'Project')
        break
      case 'retainer':
        finalDescription = finalDescription
          .replace('{serviceName}', customValues.serviceName || 'Services')
          .replace('{month}', customValues.month)
        break
      case 'unit':
        finalDescription = finalDescription
          .replace('{itemName}', customValues.itemName || 'Item')
        break
      case 'milestone':
        finalDescription = finalDescription
          .replace('{milestoneName}', customValues.milestoneName || 'Milestone')
          .replace('{percentage}', customValues.percentage.toString())
        break
    }

    // Add new item with template
    addItem()
    const newItemIndex = items.length
    updateItem(newItemIndex, 'description', finalDescription)
    updateItem(newItemIndex, 'quantity', customValues.quantity)
    updateItem(newItemIndex, 'price', customValues.rate)

    // Close dialog and reset
    setIsDialogOpen(false)
    setSelectedMethod(null)
    setCustomValues({
      description: '',
      rate: 0,
      quantity: 1,
      hours: 8,
      projectName: '',
      serviceName: '',
      month: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      itemName: '',
      milestoneName: '',
      percentage: 25
    })
  }

  const renderCustomFields = () => {
    if (!selectedMethod) return null

    const method = pricingMethods.find(m => m.id === selectedMethod)
    if (!method) return null

    return (
      <div className="space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={customValues.quantity}
              onChange={(e) => setCustomValues({ ...customValues, quantity: Number(e.target.value) })}
              min="1"
            />
          </div>
          <div>
            <Label htmlFor="rate">Rate ($)</Label>
            <Input
              id="rate"
              type="number"
              value={customValues.rate}
              onChange={(e) => setCustomValues({ ...customValues, rate: Number(e.target.value) })}
              min="0"
            />
          </div>
        </div>

        {selectedMethod === 'hourly' && (
          <div>
            <Label htmlFor="hours">Hours</Label>
            <Input
              id="hours"
              type="number"
              value={customValues.hours}
              onChange={(e) => setCustomValues({ ...customValues, hours: Number(e.target.value) })}
              min="0.5"
              step="0.5"
            />
          </div>
        )}

        {selectedMethod === 'fixed' && (
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input
              id="projectName"
              value={customValues.projectName}
              onChange={(e) => setCustomValues({ ...customValues, projectName: e.target.value })}
              placeholder="Website Redesign"
            />
          </div>
        )}

        {selectedMethod === 'retainer' && (
          <>
            <div>
              <Label htmlFor="serviceName">Service Name</Label>
              <Input
                id="serviceName"
                value={customValues.serviceName}
                onChange={(e) => setCustomValues({ ...customValues, serviceName: e.target.value })}
                placeholder="SEO Services"
              />
            </div>
            <div>
              <Label htmlFor="month">Month/Period</Label>
              <Input
                id="month"
                value={customValues.month}
                onChange={(e) => setCustomValues({ ...customValues, month: e.target.value })}
              />
            </div>
          </>
        )}

        {selectedMethod === 'unit' && (
          <div>
            <Label htmlFor="itemName">Item/Unit Name</Label>
            <Input
              id="itemName"
              value={customValues.itemName}
              onChange={(e) => setCustomValues({ ...customValues, itemName: e.target.value })}
              placeholder="Blog Article"
            />
          </div>
        )}

        {selectedMethod === 'milestone' && (
          <>
            <div>
              <Label htmlFor="milestoneName">Milestone Name</Label>
              <Input
                id="milestoneName"
                value={customValues.milestoneName}
                onChange={(e) => setCustomValues({ ...customValues, milestoneName: e.target.value })}
                placeholder="Design Phase Complete"
              />
            </div>
            <div>
              <Label htmlFor="percentage">Completion %</Label>
              <Input
                id="percentage"
                type="number"
                value={customValues.percentage}
                onChange={(e) => setCustomValues({ ...customValues, percentage: Number(e.target.value) })}
                min="1"
                max="100"
              />
            </div>
          </>
        )}

        <div>
          <Label htmlFor="description">Description Preview</Label>
          <Textarea
            id="description"
            value={customValues.description}
            onChange={(e) => setCustomValues({ ...customValues, description: e.target.value })}
            rows={2}
          />
        </div>

        {method.template.suggestions && (
          <div>
            <Label>Common Examples</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {method.template.suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => {
                    if (selectedMethod === 'fixed') {
                      setCustomValues({ ...customValues, projectName: suggestion })
                    } else if (selectedMethod === 'retainer') {
                      setCustomValues({ ...customValues, serviceName: suggestion })
                    } else if (selectedMethod === 'unit') {
                      setCustomValues({ ...customValues, itemName: suggestion })
                    } else if (selectedMethod === 'milestone') {
                      setCustomValues({ ...customValues, milestoneName: suggestion })
                    }
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Pricing Templates</CardTitle>
            <p className="text-sm text-muted-foreground">
              Quick-start templates for common pricing models
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {pricingMethods.map((method) => {
            const IconComponent = method.icon

            return (
              <div
                key={method.id}
                className={cn(
                  "relative border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md",
                  method.borderColor,
                  method.bgColor
                )}
                onClick={() => handleMethodSelect(method.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", method.bgColor)}>
                    <IconComponent className={cn("w-5 h-5", method.color)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{method.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleMethodSelect(method.id)
                  }}
                >
                  Use Template
                </Button>
              </div>
            )
          })}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Free account:</strong> Access to all 5 professional pricing templates.
            <span className="text-primary"> Create custom templates</span> with Premium.
          </p>
        </div>

        {/* Template Configuration Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Configure {selectedMethod && pricingMethods.find(m => m.id === selectedMethod)?.name} Template
              </DialogTitle>
            </DialogHeader>

            {renderCustomFields()}

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleApplyTemplate} className="flex-1">
                Add to Invoice
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}