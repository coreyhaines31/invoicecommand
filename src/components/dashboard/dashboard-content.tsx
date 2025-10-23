'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { InvoiceList } from './invoice-list'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { Plus, FileText, DollarSign, Users } from 'lucide-react'

interface DashboardContentProps {
  user: User
  invoices: any[]
}

export function DashboardContent({ user, invoices }: DashboardContentProps) {

  const stats = {
    totalInvoices: invoices.length,
    totalAmount: invoices.reduce((sum, invoice) => sum + (invoice.total || 0), 0),
    paidInvoices: invoices.filter(invoice => invoice.status === 'paid').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4">
        {/* Navigation */}
        <Navigation />
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your invoices and track your business
            </p>
          </div>
          <Button asChild>
            <Link href="/" className="inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create New Invoice
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">{stats.totalInvoices}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">
                  ${stats.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid Invoices</p>
                <p className="text-2xl font-bold">{stats.paidInvoices}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Account Status */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-2">Free Account</h3>
              <p className="text-sm text-muted-foreground mb-4">
                You're currently on the free plan with limited features
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Logo Upload Available</Badge>
                <Badge variant="secondary">10 Voice Commands/Month</Badge>
                <Badge variant="secondary">3 Invoice Styles</Badge>
                <Badge variant="secondary">Stripe Integration</Badge>
              </div>
            </div>
            <Button>
              <Link href="/pricing">
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
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Manage
              </Button>
            )}
          </div>

          <InvoiceList invoices={invoices} userId={user.id} />
        </Card>
      </div>
    </div>
  )
}