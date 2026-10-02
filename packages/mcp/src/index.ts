#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { ApiClient, type InvoiceCreate } from './lib/api-client.js'

const API_KEY = process.env.INVOICE_COMMAND_API_KEY
const BASE_URL = process.env.INVOICE_COMMAND_BASE_URL || 'https://invoicecommand.com'

if (!API_KEY) {
  console.error('INVOICE_COMMAND_API_KEY environment variable is required')
  process.exit(1)
}

const client = new ApiClient(API_KEY, BASE_URL)

const server = new Server(
  {
    name: 'invoicecommand',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
)

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'create_invoice',
        description:
          'Create a new invoice or estimate. Returns the created invoice with its ID. You can then send it to the client using send_invoice.',
        inputSchema: {
          type: 'object',
          properties: {
            invoiceNumber: {
              type: 'string',
              description: 'Invoice number (e.g., INV-001)',
            },
            clientName: {
              type: 'string',
              description: 'Client or company name',
            },
            clientEmail: {
              type: 'string',
              description: 'Client email address for sending the invoice',
            },
            senderName: {
              type: 'string',
              description: 'Your company or business name',
            },
            senderEmail: {
              type: 'string',
              description: 'Your email address (used as reply-to)',
            },
            items: {
              type: 'array',
              description: 'Line items on the invoice',
              items: {
                type: 'object',
                properties: {
                  description: { type: 'string', description: 'Item description' },
                  quantity: { type: 'number', description: 'Quantity' },
                  price: { type: 'number', description: 'Price per unit' },
                },
                required: ['description', 'quantity', 'price'],
              },
            },
            invoiceDate: {
              type: 'string',
              description: 'Invoice date in YYYY-MM-DD format',
            },
            dueDate: {
              type: 'string',
              description: 'Due date in YYYY-MM-DD format',
            },
            notes: {
              type: 'string',
              description: 'Notes to include on the invoice',
            },
            terms: {
              type: 'string',
              description: 'Payment terms',
            },
            currency: {
              type: 'string',
              description: '3-letter currency code (default: USD)',
            },
            documentType: {
              type: 'string',
              enum: ['invoice', 'estimate'],
              description: 'Type of document (default: invoice)',
            },
          },
          required: ['invoiceNumber', 'clientName', 'items'],
        },
      },
      {
        name: 'list_invoices',
        description: 'List all invoices, optionally filtered by type or status.',
        inputSchema: {
          type: 'object',
          properties: {
            documentType: {
              type: 'string',
              enum: ['invoice', 'estimate'],
              description: 'Filter by document type',
            },
            status: {
              type: 'string',
              enum: ['draft', 'sent', 'paid'],
              description: 'Filter by status',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of invoices to return (default: 20)',
            },
          },
        },
      },
      {
        name: 'get_invoice',
        description: 'Get details of a specific invoice by ID.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Invoice ID',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'send_invoice',
        description:
          'Send an invoice to the client via email. The invoice must have client email and sender email set.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Invoice ID',
            },
            message: {
              type: 'string',
              description: 'Optional message to include in the email',
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'mark_invoice_paid',
        description: 'Mark an invoice as paid.',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Invoice ID',
            },
          },
          required: ['id'],
        },
      },
    ],
  }
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params

  try {
    switch (name) {
      case 'create_invoice': {
        const invoiceData: InvoiceCreate = {
          invoiceNumber: args.invoiceNumber as string,
          clientName: args.clientName as string,
          clientEmail: args.clientEmail as string | undefined,
          senderName: args.senderName as string | undefined,
          senderEmail: args.senderEmail as string | undefined,
          items: args.items as Array<{ description: string; quantity: number; price: number }>,
          invoiceDate: args.invoiceDate as string | undefined,
          dueDate: args.dueDate as string | undefined,
          notes: args.notes as string | undefined,
          terms: args.terms as string | undefined,
          currency: args.currency as string | undefined,
          documentType: args.documentType as 'invoice' | 'estimate' | undefined,
        }

        // Calculate totals if not provided
        if (invoiceData.items) {
          const subtotal = invoiceData.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          )
          invoiceData.subtotal = subtotal
          invoiceData.total = subtotal
        }

        const invoice = await client.createInvoice(invoiceData)

        return {
          content: [
            {
              type: 'text',
              text: `Created invoice ${invoice.invoiceNumber} (ID: ${invoice.id})

Client: ${invoice.clientName}
Total: ${formatCurrency(invoice.total, invoice.currency)}
Status: ${invoice.status}

${invoice.clientEmail ? `The invoice can be sent to ${invoice.clientEmail} using send_invoice.` : 'Note: No client email set. Add one to send the invoice.'}`,
            },
          ],
        }
      }

      case 'list_invoices': {
        const invoices = await client.listInvoices({
          documentType: args.documentType as 'invoice' | 'estimate' | undefined,
          status: args.status as 'draft' | 'sent' | 'paid' | undefined,
          limit: (args.limit as number) || 20,
        })

        if (invoices.length === 0) {
          return {
            content: [{ type: 'text', text: 'No invoices found.' }],
          }
        }

        const list = invoices
          .map(
            (inv) =>
              `• ${inv.invoiceNumber} - ${inv.clientName} - ${formatCurrency(inv.total, inv.currency)} [${inv.status}] (ID: ${inv.id})`
          )
          .join('\n')

        return {
          content: [
            {
              type: 'text',
              text: `Found ${invoices.length} invoice(s):\n\n${list}`,
            },
          ],
        }
      }

      case 'get_invoice': {
        const invoice = await client.getInvoice(args.id as string)

        const items = (invoice.items || [])
          .map((item) => `  - ${item.description}: ${item.quantity} × ${formatCurrency(item.price.toString(), invoice.currency)}`)
          .join('\n')

        return {
          content: [
            {
              type: 'text',
              text: `Invoice ${invoice.invoiceNumber}
ID: ${invoice.id}
Type: ${invoice.documentType}
Status: ${invoice.status}

Client: ${invoice.clientName}
${invoice.clientEmail ? `Email: ${invoice.clientEmail}` : ''}

From: ${invoice.senderName || '(not set)'}
${invoice.senderEmail ? `Email: ${invoice.senderEmail}` : ''}

Items:
${items}

Total: ${formatCurrency(invoice.total, invoice.currency)}
${invoice.invoiceDate ? `Date: ${invoice.invoiceDate}` : ''}
${invoice.dueDate ? `Due: ${invoice.dueDate}` : ''}

${invoice.notes ? `Notes: ${invoice.notes}` : ''}`,
            },
          ],
        }
      }

      case 'send_invoice': {
        const invoice = await client.getInvoice(args.id as string)

        if (!invoice.clientEmail) {
          return {
            content: [
              {
                type: 'text',
                text: `Cannot send invoice ${invoice.invoiceNumber}: No client email address set.`,
              },
            ],
            isError: true,
          }
        }

        if (!invoice.senderEmail) {
          return {
            content: [
              {
                type: 'text',
                text: `Cannot send invoice ${invoice.invoiceNumber}: No sender email address set.`,
              },
            ],
            isError: true,
          }
        }

        // Download PDF
        const pdfBuffer = await client.downloadPdf(args.id as string)
        const base64Pdf = Buffer.from(pdfBuffer).toString('base64')

        // Send invoice
        const result = await client.sendInvoice(
          args.id as string,
          base64Pdf,
          args.message as string | undefined
        )

        return {
          content: [
            {
              type: 'text',
              text: `Invoice ${invoice.invoiceNumber} sent to ${invoice.clientEmail}

Email ID: ${result.emailId}`,
            },
          ],
        }
      }

      case 'mark_invoice_paid': {
        const invoice = await client.updateInvoice(args.id as string, {
          status: 'paid',
        } as any)

        return {
          content: [
            {
              type: 'text',
              text: `Invoice ${invoice.invoiceNumber} marked as paid.

Client: ${invoice.clientName}
Total: ${formatCurrency(invoice.total, invoice.currency)}`,
            },
          ],
        }
      }

      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        }
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      ],
      isError: true,
    }
  }
})

function formatCurrency(amount: string, currency: string): string {
  const num = parseFloat(amount)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
  }).format(num)
}

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Invoice Command MCP Server running')
}

main().catch((error) => {
  console.error('Server error:', error)
  process.exit(1)
})
