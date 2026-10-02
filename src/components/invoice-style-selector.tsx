'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Palette } from 'lucide-react'
import { cn } from '@/lib/utils'

const invoiceStyles = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Clean and contemporary design with bold typography',
    preview: 'modern-preview.svg',
    features: ['Bold headers', 'Accent colors', 'Modern typography'],
    isDefault: true
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'Traditional professional layout with elegant spacing',
    preview: 'classic-preview.svg',
    features: ['Traditional layout', 'Professional styling', 'Clean lines'],
    isDefault: false
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Simple and focused design with lots of white space',
    preview: 'minimal-preview.svg',
    features: ['Lots of whitespace', 'Simple design', 'Easy to read'],
    isDefault: false
  }
]

export function InvoiceStyleSelector() {
  const { style, updateStyle } = useInvoiceStore()

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">Invoice Style</CardTitle>
            <p className="text-sm text-muted-foreground">
              Choose from 3 professional templates
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {invoiceStyles.map((styleOption) => {
            const isSelected = style === styleOption.id

            return (
              <div
                key={styleOption.id}
                className={cn(
                  "relative border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                )}
                onClick={() => updateStyle(styleOption.id)}
              >
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  </div>
                )}

                {/* Default badge */}
                {styleOption.isDefault && (
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs">
                      Default
                    </Badge>
                  </div>
                )}

                {/* Style preview mockup */}
                <div className="mb-4 bg-white border rounded p-3 min-h-[120px] flex flex-col justify-between">
                  {styleOption.id === 'modern' && (
                    <div className="space-y-2">
                      <div className="w-16 h-3 bg-primary rounded"></div>
                      <div className="space-y-1">
                        <div className="w-12 h-2 bg-gray-300 rounded"></div>
                        <div className="w-16 h-2 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex justify-between items-end mt-2">
                        <div className="space-y-1">
                          <div className="w-8 h-2 bg-gray-300 rounded"></div>
                          <div className="w-12 h-2 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-8 h-3 bg-primary rounded"></div>
                      </div>
                    </div>
                  )}

                  {styleOption.id === 'classic' && (
                    <div className="space-y-2">
                      <div className="text-center">
                        <div className="w-12 h-2 bg-gray-800 rounded mx-auto mb-1"></div>
                        <div className="w-8 h-1 bg-gray-400 rounded mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="space-y-1">
                          <div className="w-full h-1 bg-gray-300 rounded"></div>
                          <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-1">
                          <div className="w-full h-1 bg-gray-300 rounded"></div>
                          <div className="w-2/3 h-1 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {styleOption.id === 'minimal' && (
                    <div className="space-y-3">
                      <div className="w-10 h-2 bg-gray-600 rounded"></div>
                      <div className="space-y-2">
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="flex justify-between">
                          <div className="w-6 h-1 bg-gray-300 rounded"></div>
                          <div className="w-4 h-1 bg-gray-300 rounded"></div>
                        </div>
                        <div className="w-full h-px bg-gray-200"></div>
                      </div>
                      <div className="text-right">
                        <div className="w-6 h-2 bg-gray-600 rounded ml-auto"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Style info */}
                <div>
                  <h3 className="font-semibold text-sm mb-1">{styleOption.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {styleOption.description}
                  </p>

                  <div className="space-y-1">
                    {styleOption.features.map((feature, index) => (
                      <div key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateStyle(styleOption.id)
                  }}
                >
                  {isSelected ? "Selected" : "Select Style"}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            <strong>Free account:</strong> Access to all 3 professional invoice styles.
            <span className="text-primary"> Upgrade to Premium</span> for custom branding and unlimited styles.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}