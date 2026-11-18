'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Search,
  Copy,
  Edit,
  Trash2,
  FileText,
  Send,
  Share2,
  CheckCircle2,
  PencilLine,
  AlertCircle,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ConfirmDialog } from '@/components/confirm-dialog'
import Link from 'next/link'
import { useInvoiceStore } from '@/stores/invoice-store'
import { useRouter } from 'next/navigation'
import { SendEmailDialog } from '@/components/send-email-dialog'
import { ShareInvoiceDialog } from '@/components/dashboard/share-invoice-dialog'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string | null
  total: number | string
  currency?: string | null
  status: string | null
  dueDate?: string | null
  createdAt: string | Date | null
}

export type InvoiceListItem = Invoice

interface InvoiceListProps {
  invoices: Invoice[]
  userId: string
}

export function InvoiceList({ invoices, userId }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null)
  const { loadFromDatabase, deleteFromDatabase } = useInvoiceStore()
  const router = useRouter()

  const filteredInvoices = invoices.filter(invoice =>
    invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Date-only values (YYYY-MM-DD) are calendar dates, so parse them as local dates.
  // new Date('2026-11-14') is UTC midnight and shows the previous day in the Americas.
  const toDate = (value: string | Date) => {
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number)
      return new Date(year, month - 1, day)
    }
    return new Date(value)
  }

  const formatDate = (dateString: string | Date | null | undefined) => {
    return dateString ? toDate(dateString).toLocaleDateString() : 'Not set'
  }

  const formatCurrency = (amount: number | string, currency?: string | null) => {
    const normalizedAmount = typeof amount === 'string' ? Number(amount) : amount
    const value = Number.isFinite(normalizedAmount) ? normalizedAmount : 0
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(value)
    } catch {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    }
  }

  const isOverdue = (invoice: Invoice) => {
    if (invoice.status === 'paid' || !invoice.dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return toDate(invoice.dueDate) < today
  }

  // Status is spelled out and paired with an icon, so it never relies on color alone.
  const getStatus = (invoice: Invoice) => {
    if (isOverdue(invoice)) {
      return { label: 'Overdue', icon: AlertCircle, className: 'border-destructive/30 bg-destructive/10 text-destructive' }
    }
    switch (invoice.status) {
      case 'paid':
        return { label: 'Paid', icon: CheckCircle2, className: 'border-primary/30 bg-accent text-accent-foreground' }
      case 'sent':
        return { label: 'Sent', icon: Send, className: 'border-border bg-secondary text-secondary-foreground' }
      default:
        return { label: 'Draft', icon: PencilLine, className: 'border-border bg-muted text-muted-foreground' }
    }
  }

  const handleEditInvoice = async (invoice: Invoice) => {
    // Load the invoice into the store and navigate to the main page
    const success = await loadFromDatabase(invoice.id, userId)
    if (success) {
      router.push('/')
    }
  }

  const handleDuplicateInvoice = async (invoice: Invoice) => {
    // Load the invoice and reset the ID to create a copy
    const success = await loadFromDatabase(invoice.id, userId)
    if (success) {
      // Reset the invoice ID and number to create a new invoice
      useInvoiceStore.setState({ id: undefined, invoiceNumber: '' })
      router.push('/')
    }
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return false
    const success = await deleteFromDatabase(invoiceToDelete.id, userId)
    if (success) {
      toast.success(`Deleted ${invoiceToDelete.invoiceNumber || 'invoice'}`)
      router.refresh()
      return true
    }
    toast.error('Could not delete the invoice. Please try again.')
    return false
  }

  const handleSendEmail = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setEmailDialogOpen(true)
  }

  const handleShare = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShareDialogOpen(true)
  }

  const handleEmailSent = () => {
    // Refresh the page to update invoice status
    router.refresh()
  }

  if (invoices.length === 0) {
    return (
      <div className="motion-rise text-center py-12">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-accent">
          <FileText aria-hidden="true" className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
          Invoices you save from the builder show up here, ready to send, share, or duplicate.
        </p>
        <Button asChild>
          <Link href="/">
            <Plus aria-hidden="true" />
            Create your first invoice
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="search"
          aria-label="Search invoices"
          placeholder="Search invoices by client or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Due Date</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="w-12"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {/* One click to open the invoice in the builder */}
                  <button
                    type="button"
                    onClick={() => handleEditInvoice(invoice)}
                    className="rounded-sm underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    title="Open in the builder"
                  >
                    {invoice.invoiceNumber}
                  </button>
                </TableCell>
                <TableCell className="max-w-[14rem]">
                  <span className="block truncate" title={invoice.clientName || undefined}>
                    {invoice.clientName || <span className="text-muted-foreground">No client</span>}
                  </span>
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  {formatCurrency(invoice.total || 0, invoice.currency)}
                </TableCell>
                <TableCell>
                  {(() => {
                    const status = getStatus(invoice)
                    const StatusIcon = status.icon
                    return (
                      <Badge variant="outline" className={cn('gap-1', status.className)}>
                        <StatusIcon aria-hidden="true" />
                        {status.label}
                      </Badge>
                    )
                  })()}
                </TableCell>
                <TableCell className="hidden md:table-cell whitespace-nowrap">
                  {invoice.dueDate ? formatDate(invoice.dueDate) : <span className="text-muted-foreground">Not set</span>}
                </TableCell>
                <TableCell className="hidden lg:table-cell whitespace-nowrap text-muted-foreground">{formatDate(invoice.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="max-sm:size-11"
                        aria-label={`Actions for ${invoice.invoiceNumber || 'invoice'}`}
                      >
                        <MoreHorizontal aria-hidden="true" className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditInvoice(invoice)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateInvoice(invoice)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSendEmail(invoice)}>
                        <Send className="w-4 h-4 mr-2" />
                        Send via Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShare(invoice)}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share link & QR
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                        onClick={() => setInvoiceToDelete(invoice)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredInvoices.length === 0 && searchTerm && (
        <div className="text-center py-8 space-y-3">
          <p className="text-muted-foreground">
            No invoices match &ldquo;{searchTerm}&rdquo;. Search works on client names and invoice numbers.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
            Clear search
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={invoiceToDelete !== null}
        onOpenChange={(open) => !open && setInvoiceToDelete(null)}
        title={`Delete ${invoiceToDelete?.invoiceNumber || 'this invoice'}?`}
        description="This removes the invoice from your dashboard and turns off any share link for it. This cannot be undone."
        confirmLabel="Delete invoice"
        pendingLabel="Deleting..."
        destructive
        onConfirm={handleDeleteInvoice}
      />

      <SendEmailDialog
        invoice={selectedInvoice}
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        onEmailSent={handleEmailSent}
      />

      <ShareInvoiceDialog
        invoiceId={selectedInvoice?.id ?? null}
        invoiceNumber={selectedInvoice?.invoiceNumber}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
      />
    </div>
  )
}
