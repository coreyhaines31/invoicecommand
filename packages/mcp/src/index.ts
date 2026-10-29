#!/usr/bin/env node

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import { ApiClient, INVOICE_ID_PATTERN, type Invoice } from './lib/api-client.js'

const VERSION = '1.1.0'
const API_KEY = process.env.INVOICE_COMMAND_API_KEY
const BASE_URL = process.env.INVOICE_COMMAND_BASE_URL || 'https://invoicecommand.com'

if (!API_KEY) {
  console.error('INVOICE_COMMAND_API_KEY environment variable is required')
  process.exit(1)
}

const client = new ApiClient(API_KEY, BASE_URL)
const server = new McpServer({ name: 'invoicecommand', version: VERSION })

const invoiceId = z.string().regex(INVOICE_ID_PATTERN, 'Invoice ID must be a UUID').describe('Invoice ID (UUID)')
const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
const documentType = z.enum(['invoice', 'estimate'])
const status = z.enum(['draft', 'sent', 'paid'])

function text(body: string, isError = false): CallToolResult {
  return { content: [{ type: 'text', text: body }], ...(isError ? { isError: true } : {}) }
}

async function run(fn: () => Promise<CallToolResult>): Promise<CallToolResult> {
  try {
    return await fn()
  } catch (error) {
    return text(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, true)
  }
}

server.registerTool(
  'create_invoice',
  {
    title: 'Create invoice',
    description:
      'Create a draft invoice or estimate. Subtotal, discount, tax, and total are computed from the items and rates. Nothing is emailed.',
    inputSchema: {
      invoiceNumber: z.string().trim().min(1).max(64).describe('Invoice number (e.g., INV-001)'),
      clientName: z.string().trim().min(1).max(255).describe('Client or company name'),
      clientEmail: z.email().max(255).optional().describe('Client email address for sending the invoice'),
      senderName: z.string().max(255).optional().describe('Your company or business name'),
      senderEmail: z.email().max(255).optional().describe('Your email address (used as reply-to)'),
      items: z
        .array(
          z.object({
            description: z.string().trim().min(1).max(500).describe('Item description'),
            quantity: z.number().min(0).max(1_000_000).describe('Quantity'),
            price: z.number().min(0).max(1_000_000_000).describe('Price per unit'),
          })
        )
        .min(1)
        .max(100)
        .describe('Line items on the invoice'),
      taxRate: z.number().min(0).max(100).optional().describe('Tax percentage, applied after any discount (e.g., 8.25)'),
      discountRate: z.number().min(0).max(100).optional().describe('Discount percentage of the subtotal (e.g., 10)'),
      invoiceDate: dateString.optional().describe('Invoice date in YYYY-MM-DD format'),
      dueDate: dateString.optional().describe('Due date in YYYY-MM-DD format'),
      notes: z.string().max(10_000).optional().describe('Notes to include on the invoice'),
      terms: z.string().max(10_000).optional().describe('Payment terms'),
      currency: z
        .string()
        .regex(/^[A-Za-z]{3}$/, 'Use a 3-letter ISO currency code')
        .transform((c) => c.toUpperCase())
        .optional()
        .describe('3-letter currency code (default: USD)'),
      documentType: documentType.optional().describe('Type of document (default: invoice)'),
    },
    annotations: { title: 'Create invoice', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  },
  (args) =>
    run(async () => {
      const invoice = await client.createInvoice(args)
      return text(`Created ${invoice.documentType} ${invoice.invoiceNumber} (ID: ${invoice.id})

Client: ${invoice.clientName}
${formatTotals(invoice)}
Status: ${invoice.status}

${invoice.clientEmail ? `Client email on file: ${invoice.clientEmail}` : 'No client email set, so it cannot be sent yet.'}`)
    })
)

server.registerTool(
  'list_invoices',
  {
    title: 'List invoices',
    description: 'List invoices and estimates, newest first, optionally filtered by type or status.',
    inputSchema: {
      documentType: documentType.optional().describe('Filter by document type'),
      status: status.optional().describe('Filter by status'),
      limit: z.number().int().min(1).max(100).optional().describe('Maximum number of invoices to return (default: 20)'),
    },
    annotations: { title: 'List invoices', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  (args) =>
    run(async () => {
      const invoices = await client.listInvoices({ ...args, limit: args.limit ?? 20 })
      if (invoices.length === 0) return text('No invoices found.')

      const list = invoices
        .map((inv) => `• ${inv.invoiceNumber} - ${inv.clientName} - ${formatCurrency(inv.total, inv.currency)} [${inv.status}] (ID: ${inv.id})`)
        .join('\n')
      return text(`Found ${invoices.length} invoice(s):\n\n${list}`)
    })
)

server.registerTool(
  'get_invoice',
  {
    title: 'Get invoice',
    description: 'Get the details of one invoice or estimate by ID.',
    inputSchema: { id: invoiceId },
    annotations: { title: 'Get invoice', readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  ({ id }) => run(async () => text(describeInvoice(await client.getInvoice(id))))
)

server.registerTool(
  'send_invoice',
  {
    title: 'Email invoice to client',
    description:
      "Email an invoice to the client's address on file, with the PDF attached, and mark it sent. Emails a third party and cannot be undone.",
    inputSchema: {
      id: invoiceId,
      message: z.string().max(5000).optional().describe('Optional message to include in the email'),
    },
    annotations: { title: 'Email invoice to client', readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true },
  },
  ({ id, message }) =>
    run(async () => {
      const invoice = await client.getInvoice(id)

      if (!invoice.clientEmail) {
        return text(`Cannot send invoice ${invoice.invoiceNumber}: No client email address set.`, true)
      }
      if (!invoice.senderEmail) {
        return text(`Cannot send invoice ${invoice.invoiceNumber}: No sender email address set.`, true)
      }

      const result = await client.sendInvoice(id, message)
      return text(`Invoice ${invoice.invoiceNumber} sent to ${invoice.clientEmail}\n\nEmail ID: ${result.emailId}`)
    })
)

server.registerTool(
  'mark_invoice_paid',
  {
    title: 'Mark invoice paid',
    description: 'Set an invoice’s status to paid.',
    inputSchema: { id: invoiceId },
    annotations: { title: 'Mark invoice paid', readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  ({ id }) =>
    run(async () => {
      const invoice = await client.updateInvoice(id, { status: 'paid' })
      return text(`Invoice ${invoice.invoiceNumber} marked as paid.

Client: ${invoice.clientName}
Total: ${formatCurrency(invoice.total, invoice.currency)}`)
    })
)

function describeInvoice(invoice: Invoice): string {
  const items = (invoice.items || [])
    .map((item) => `  - ${item.description}: ${item.quantity} × ${formatCurrency(item.price, invoice.currency)}`)
    .join('\n')

  return [
    `Invoice ${invoice.invoiceNumber}`,
    `ID: ${invoice.id}`,
    `Type: ${invoice.documentType}`,
    `Status: ${invoice.status}`,
    '',
    `Client: ${invoice.clientName}`,
    invoice.clientEmail ? `Email: ${invoice.clientEmail}` : '',
    '',
    `From: ${invoice.senderName || '(not set)'}`,
    invoice.senderEmail ? `Email: ${invoice.senderEmail}` : '',
    '',
    'Items:',
    items,
    '',
    formatTotals(invoice),
    invoice.invoiceDate ? `Date: ${invoice.invoiceDate}` : '',
    invoice.dueDate ? `Due: ${invoice.dueDate}` : '',
    '',
    invoice.notes ? `Notes: ${invoice.notes}` : '',
  ].join('\n')
}

function formatTotals(invoice: Invoice): string {
  const lines = [`Subtotal: ${formatCurrency(invoice.subtotal, invoice.currency)}`]
  if (Number(invoice.discountAmount) > 0) {
    lines.push(`Discount (${Number(invoice.discountRate)}%): -${formatCurrency(invoice.discountAmount ?? 0, invoice.currency)}`)
  }
  if (Number(invoice.tax) > 0) {
    lines.push(`Tax (${Number(invoice.taxRate)}%): ${formatCurrency(invoice.tax, invoice.currency)}`)
  }
  lines.push(`Total: ${formatCurrency(invoice.total, invoice.currency)}`)
  return lines.join('\n')
}

function formatCurrency(amount: string | number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(Number(amount))
}

async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Invoice Command MCP Server running')
}

main().catch((error) => {
  console.error('Server error:', error instanceof Error ? error.message : error)
  process.exit(1)
})
