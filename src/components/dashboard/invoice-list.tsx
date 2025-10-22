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
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useInvoiceStore } from '@/stores/invoice-store'
import { useRouter } from 'next/navigation'

interface Invoice {
  id: string
  invoice_number: string
  client_name: string
  total: number
  status: string
  due_date: string
  created_at: string
}

interface InvoiceListProps {
  invoices: Invoice[]
  userId: string
}

export function InvoiceList({ invoices, userId }: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const { loadFromDatabase, deleteFromDatabase } = useInvoiceStore()
  const router = useRouter()

  const filteredInvoices = invoices.filter(invoice =>
    invoice.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
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

  const handleDeleteInvoice = async (invoice: Invoice) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      const success = await deleteFromDatabase(invoice.id, userId)
      if (success) {
        // Refresh the page to update the list
        router.refresh()
      }
    }
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
          <Link href="/">
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
              <TableHead>Invoice #</TableHead>
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
                  {invoice.invoice_number}
                </TableCell>
                <TableCell>{invoice.client_name || 'No client'}</TableCell>
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
                  {invoice.due_date ? formatDate(invoice.due_date) : '—'}
                </TableCell>
                <TableCell>{formatDate(invoice.created_at)}</TableCell>
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
            No invoices found matching "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  )
}