'use client'

import { useInvoiceStore } from '@/stores/invoice-store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, Palette, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const invoiceStyles = [
  {
    id: 'modern' as const,
    name: 'Modern',
    description: 'Clean and contemporary design with bold typography',
    isDefault: true
  },
  {
    id: 'classic' as const,
    name: 'Classic',
    description: 'Traditional professional layout with elegant spacing',
    isDefault: false
  },
  {
    id: 'minimal' as const,
    name: 'Minimal',
    description: 'Simple and focused design with lots of white space',
    isDefault: false
  }
]

export function InvoiceStyleDropdown() {
  const { style, updateStyle } = useInvoiceStore()

  const currentStyle = invoiceStyles.find(s => s.id === style) || invoiceStyles[0]

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Palette className="w-4 h-4" />
        <span>Style:</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2 min-w-[120px] justify-between">
            <div className="flex items-center gap-2">
              <span>{currentStyle.name}</span>
              {currentStyle.isDefault && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  Default
                </Badge>
              )}
            </div>
            <ChevronDown className="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-80">
          {invoiceStyles.map((styleOption) => {
            const isSelected = style === styleOption.id

            return (
              <DropdownMenuItem
                key={styleOption.id}
                onClick={() => updateStyle(styleOption.id)}
                className="flex items-start gap-3 p-3 cursor-pointer"
              >
                {/* Selection indicator */}
                <div className="flex items-center justify-center w-4 h-4 mt-0.5">
                  {isSelected && <Check className="w-3 h-3 text-primary" />}
                </div>

                {/* Style preview mockup */}
                <div className="flex-shrink-0 w-12 h-12 bg-white border rounded flex flex-col justify-between p-2">
                  {styleOption.id === 'modern' && (
                    <div className="space-y-1">
                      <div className="w-6 h-1.5 bg-primary rounded"></div>
                      <div className="space-y-0.5">
                        <div className="w-4 h-1 bg-gray-300 rounded"></div>
                        <div className="w-5 h-1 bg-gray-200 rounded"></div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="w-3 h-1 bg-gray-300 rounded"></div>
                        <div className="w-3 h-1.5 bg-primary rounded"></div>
                      </div>
                    </div>
                  )}

                  {styleOption.id === 'classic' && (
                    <div className="space-y-1">
                      <div className="text-center">
                        <div className="w-4 h-1 bg-gray-800 rounded mx-auto mb-0.5"></div>
                        <div className="w-3 h-0.5 bg-gray-400 rounded mx-auto"></div>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <div className="space-y-0.5">
                          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
                          <div className="w-2/3 h-0.5 bg-gray-200 rounded"></div>
                        </div>
                        <div className="space-y-0.5">
                          <div className="w-full h-0.5 bg-gray-300 rounded"></div>
                          <div className="w-1/2 h-0.5 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {styleOption.id === 'minimal' && (
                    <div className="space-y-1.5">
                      <div className="w-4 h-1 bg-gray-600 rounded"></div>
                      <div className="space-y-1">
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="flex justify-between">
                          <div className="w-2 h-0.5 bg-gray-300 rounded"></div>
                          <div className="w-1.5 h-0.5 bg-gray-300 rounded"></div>
                        </div>
                        <div className="w-full h-px bg-gray-200"></div>
                      </div>
                      <div className="text-right">
                        <div className="w-2 h-1 bg-gray-600 rounded ml-auto"></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Style info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{styleOption.name}</span>
                    {styleOption.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Default
                      </Badge>
                    )}
                    {isSelected && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {styleOption.description}
                  </p>
                </div>
              </DropdownMenuItem>
            )
          })}

          <div className="border-t mt-2 pt-3 px-3 pb-2">
            <p className="text-xs text-muted-foreground text-center">
              <strong>Free account:</strong> Access to all 3 styles.
              <span className="text-primary"> Upgrade</span> for custom themes.
            </p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}