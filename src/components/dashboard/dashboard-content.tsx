'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { InvoiceList, type InvoiceListItem } from './invoice-list'
import type { User } from 'better-auth'
import Link from 'next/link'
import { Plus, FileText, DollarSign, CheckCircle2 } from 'lucide-react'

interface DashboardContentProps {
  user: User
  invoices: InvoiceListItem[]
}

export function DashboardContent({ user, invoices }: DashboardContentProps) {

  // Totals are kept per currency: adding dollars to euros gives a meaningless number.
  const totalsByCurrency = invoices.reduce<Record<string, number>>((totals, invoice) => {
    const currency = invoice.currency || 'USD'
    totals[currency] = (totals[currency] || 0) + (Number(invoice.total) || 0)
    return totals
  }, {})
  const formatTotal = (currency: string, amount: number) => {
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
    } catch {
      return `${amount.toFixed(2)} ${currency}`
    }
  }
  const totalEntries = Object.entries(totalsByCurrency)

  const stats = {
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(invoice => invoice.status === 'paid').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 page-enter">
        {/* Navigation */}
        <Navigation />
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your invoices and track your business
            </p>
          </div>
          <Button asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <Plus aria-hidden="true" className="w-4 h-4" />
              Create New Invoice
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText aria-hidden="true" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold tabular-nums">{stats.totalInvoices}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign aria-hidden="true" className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground" title="Sum of every saved invoice, paid or not">
                  Total Amount
                </p>
                {totalEntries.length === 0 ? (
                  <p className="text-2xl font-bold tabular-nums">{formatTotal('USD', 0)}</p>
                ) : (
                  totalEntries.map(([currency, amount]) => (
                    <p key={currency} className="text-2xl font-bold tabular-nums break-words">
                      {formatTotal(currency, amount)}
                    </p>
                  ))
                )}
                <p className="text-xs text-muted-foreground">All saved invoices, paid or not</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CheckCircle2 aria-hidden="true" className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Invoices</p>
                <p className="text-2xl font-bold tabular-nums">
                  {stats.paidInvoices}
                  <span className="text-base font-medium text-muted-foreground"> of {stats.totalInvoices}</span>
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold mb-2">Free Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You&apos;re currently on the free plan with limited features
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Logo Upload Available</Badge>
                <Badge variant="secondary">10 Voice Commands/Month</Badge>
                <Badge variant="secondary">3 Invoice Styles</Badge>
                <Badge variant="secondary">Stripe Integration</Badge>
              </div>
            </div>
            <Button asChild className="shrink-0">
              <Link href="/billing">
                Upgrade to Premium
              </Link>
            </Button>
          </div>
        </Card>

        {/* Invoices List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Your Invoices</h3>
            {invoices.length > 0 && (
              <p className="text-sm text-muted-foreground tabular-nums">
                {invoices.length} {invoices.length === 1 ? 'invoice' : 'invoices'}
              </p>
            )}
          </div>

          <InvoiceList invoices={invoices} userId={user.id} />
        </Card>
      </div>
    </div>
  )
}
