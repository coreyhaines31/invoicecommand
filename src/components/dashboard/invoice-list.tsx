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
  Download,
  Trash2,
  FileText,
  Send,
  Share2
} from 'lucide-react'
import Link from 'next/link'
import { useInvoiceStore } from '@/stores/invoice-store'
import { formatDateOnly } from '@/lib/date-only'
import { useRouter } from 'next/navigation'
import { SendEmailDialog } from '@/components/send-email-dialog'
import { ShareInvoiceDialog } from '@/components/dashboard/share-invoice-dialog'

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail?: string | null
  total: number | string
  status: string | null
  dueDate?: string | null
  createdAt: string | Date | null
  documentType?: 'invoice' | 'estimate' | null
  signedAt?: string | Date | null
  collectSignature?: boolean | null
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
  const { loadFromDatabase, deleteFromDatabase } = useInvoiceStore()
  const router = useRouter()

  const filteredInvoices = invoices.filter(invoice =>
    invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | Date | null) => {
    return dateString ? new Date(dateString).toLocaleDateString() : '—'
  }

  const formatCurrency = (amount: number | string) => {
    const normalizedAmount = typeof amount === 'string' ? Number(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number.isFinite(normalizedAmount) ? normalizedAmount : 0)
  }

  // Each builder switches a saved document of the other type to a fresh draft, so open the matching one
  const builderPath = (invoice: Invoice) =>
    invoice.documentType === 'estimate' ? '/estimate-maker' : '/'

  const handleEditInvoice = async (invoice: Invoice) => {
    const success = await loadFromDatabase(invoice.id, userId)
    if (success) {
      router.push(builderPath(invoice))
    }
  }

  const handleDuplicateInvoice = async (invoice: Invoice) => {
    // Load the invoice and reset the ID to create a copy
    const success = await loadFromDatabase(invoice.id, userId)
    if (success) {
      useInvoiceStore.getState().detachAsCopy()
      router.push(builderPath(invoice))
    }
  }

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const success = await deleteFromDatabase(invoice.id, userId)
      if (success) {
        // Refresh the page to update the list
        router.refresh()
      }
    }
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
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No invoices yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first invoice to get started with Invoice Command
        </p>
        <Button asChild>
          <Link href="/?new=1">
            Create Your First Invoice
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
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
              <TableHead>Number</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  {invoice.invoiceNumber}
                  <div className="mt-1 flex flex-wrap gap-1">
                    <Badge variant="outline" className="font-normal">
                      {invoice.documentType === 'estimate' ? 'Estimate' : 'Invoice'}
                    </Badge>
                    {invoice.documentType === 'estimate' && invoice.signedAt && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 font-normal">
                        Signed
                      </Badge>
                    )}
                    {invoice.documentType === 'estimate' && !invoice.signedAt && invoice.collectSignature !== false && (
                      <Badge variant="secondary" className="font-normal">
                        Not signed
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{invoice.clientName || 'No client'}</TableCell>
                <TableCell>{formatCurrency(invoice.total || 0)}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(invoice.status)}
                  >
                    {invoice.status || 'draft'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {invoice.dueDate ? formatDateOnly(invoice.dueDate, undefined) : '—'}
                </TableCell>
                <TableCell>{formatDate(invoice.createdAt)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
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
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
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
                        className="text-red-600"
                        onClick={() => handleDeleteInvoice(invoice)}
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
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            No invoices found matching &ldquo;{searchTerm}&rdquo;
          </p>
        </div>
      )}

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
