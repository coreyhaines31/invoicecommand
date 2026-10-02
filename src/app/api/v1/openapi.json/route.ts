import { NextResponse } from 'next/server'

const openApiSpec = {
  openapi: '3.1.0',
  info: {
    title: 'Invoice Command API',
    description: 'REST API for programmatic invoice management. Create, send, and manage invoices programmatically.',
    version: '1.0.0',
    contact: {
      name: 'Invoice Command Support',
      url: 'https://invoicecommand.com',
      email: 'support@invoicecommand.com',
    },
  },
  servers: [
    {
      url: 'https://invoicecommand.com/api/v1',
      description: 'Production',
    },
    {
      url: 'http://localhost:3005/api/v1',
      description: 'Development',
    },
  ],
  security: [{ bearerAuth: [] }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        description: 'API key authentication. Use format: Bearer sk_live_xxx',
      },
    },
    schemas: {
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          documentType: { type: 'string', enum: ['invoice', 'estimate'] },
          invoiceNumber: { type: 'string' },
          invoiceDate: { type: 'string', format: 'date' },
          dueDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['draft', 'sent', 'paid'] },
          clientName: { type: 'string' },
          clientEmail: { type: 'string', format: 'email' },
          clientAddress: { type: 'string' },
          clientCity: { type: 'string' },
          clientState: { type: 'string' },
          clientZip: { type: 'string' },
          senderName: { type: 'string' },
          senderEmail: { type: 'string', format: 'email' },
          senderAddress: { type: 'string' },
          senderCity: { type: 'string' },
          senderState: { type: 'string' },
          senderZip: { type: 'string' },
          senderPhone: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                description: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'number' },
              },
              required: ['description', 'quantity', 'price'],
            },
          },
          subtotal: { type: 'string' },
          tax: { type: 'string' },
          total: { type: 'string' },
          taxRate: { type: 'string' },
          discountRate: { type: 'string' },
          discountAmount: { type: 'string' },
          notes: { type: 'string' },
          terms: { type: 'string' },
          currency: { type: 'string', default: 'USD' },
          style: { type: 'string', enum: ['modern', 'classic', 'minimal'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      InvoiceCreate: {
        type: 'object',
        required: ['clientName', 'invoiceNumber', 'items'],
        properties: {
          documentType: { type: 'string', enum: ['invoice', 'estimate'] },
          invoiceNumber: { type: 'string', maxLength: 64 },
          invoiceDate: { type: 'string', format: 'date' },
          dueDate: { type: 'string', format: 'date' },
          clientName: { type: 'string', maxLength: 255 },
          clientEmail: { type: 'string', format: 'email', maxLength: 255 },
          clientAddress: { type: 'string', maxLength: 500 },
          clientCity: { type: 'string', maxLength: 255 },
          clientState: { type: 'string', maxLength: 255 },
          clientZip: { type: 'string', maxLength: 64 },
          senderName: { type: 'string', maxLength: 255 },
          senderEmail: { type: 'string', format: 'email', maxLength: 255 },
          senderAddress: { type: 'string', maxLength: 500 },
          senderCity: { type: 'string', maxLength: 255 },
          senderState: { type: 'string', maxLength: 255 },
          senderZip: { type: 'string', maxLength: 64 },
          senderPhone: { type: 'string', maxLength: 64 },
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['description', 'quantity', 'price'],
              properties: {
                description: { type: 'string', maxLength: 500 },
                quantity: { type: 'number', minimum: 0 },
                price: { type: 'number', minimum: 0 },
              },
            },
          },
          subtotal: { type: 'number', minimum: 0 },
          tax: { type: 'number', minimum: 0 },
          total: { type: 'number', minimum: 0 },
          taxRate: { type: 'number', minimum: 0, maximum: 100 },
          discountRate: { type: 'number', minimum: 0, maximum: 100 },
          discountAmount: { type: 'number', minimum: 0 },
          notes: { type: 'string', maxLength: 10000 },
          terms: { type: 'string', maxLength: 10000 },
          currency: { type: 'string', pattern: '^[A-Z]{3}$', default: 'USD' },
          style: { type: 'string', enum: ['modern', 'classic', 'minimal'] },
        },
      },
      ApiKey: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          keyPrefix: { type: 'string', description: 'First 12 characters of the key for identification' },
          scopes: { type: 'array', items: { type: 'string' } },
          rateLimit: { type: 'integer' },
          expiresAt: { type: 'string', format: 'date-time', nullable: true },
          lastUsedAt: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Webhook: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          url: { type: 'string', format: 'uri' },
          events: { type: 'array', items: { type: 'string' } },
          isActive: { type: 'boolean' },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          details: { type: 'string' },
        },
        required: ['error'],
      },
    },
  },
  paths: {
    '/invoices': {
      get: {
        summary: 'List invoices',
        description: 'Retrieve a paginated list of invoices',
        operationId: 'listInvoices',
        tags: ['Invoices'],
        parameters: [
          {
            name: 'documentType',
            in: 'query',
            schema: { type: 'string', enum: ['invoice', 'estimate'] },
            description: 'Filter by document type',
          },
          {
            name: 'status',
            in: 'query',
            schema: { type: 'string', enum: ['draft', 'sent', 'paid'] },
            description: 'Filter by status',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
            description: 'Maximum number of invoices to return',
          },
          {
            name: 'offset',
            in: 'query',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Number of invoices to skip',
          },
        ],
        responses: {
          '200': {
            description: 'List of invoices',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Invoice' } },
                    pagination: {
                      type: 'object',
                      properties: {
                        limit: { type: 'integer' },
                        offset: { type: 'integer' },
                        hasMore: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      post: {
        summary: 'Create invoice',
        description: 'Create a new invoice or estimate',
        operationId: 'createInvoice',
        tags: ['Invoices'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/InvoiceCreate' },
            },
          },
        },
        responses: {
          '201': {
            description: 'Invoice created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { $ref: '#/components/schemas/Invoice' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid request', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '401': { description: 'Unauthorized', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
    },
    '/invoices/{id}': {
      get: {
        summary: 'Get invoice',
        description: 'Retrieve a single invoice by ID',
        operationId: 'getInvoice',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'Invoice details',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Invoice' } } } } },
          },
          '404': { description: 'Invoice not found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
        },
      },
      put: {
        summary: 'Update invoice',
        description: 'Update an existing invoice',
        operationId: 'updateInvoice',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/InvoiceCreate' } } },
        },
        responses: {
          '200': {
            description: 'Invoice updated',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { $ref: '#/components/schemas/Invoice' } } } } },
          },
          '404': { description: 'Invoice not found' },
          '409': { description: 'Conflict (signed estimate cannot be edited)' },
        },
      },
      delete: {
        summary: 'Delete invoice',
        description: 'Delete an invoice',
        operationId: 'deleteInvoice',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Invoice deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' } } } } } },
          '404': { description: 'Invoice not found' },
        },
      },
    },
    '/invoices/{id}/send': {
      post: {
        summary: 'Send invoice',
        description: 'Send an invoice to the client via email',
        operationId: 'sendInvoice',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['pdfBuffer'],
                properties: {
                  pdfBuffer: { type: 'string', description: 'Base64 encoded PDF content' },
                  senderMessage: { type: 'string', maxLength: 5000, description: 'Optional message to include in the email' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Invoice sent',
            content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, emailId: { type: 'string' }, message: { type: 'string' } } } } },
          },
          '400': { description: 'Invalid request' },
          '404': { description: 'Invoice not found' },
        },
      },
    },
    '/invoices/{id}/pdf': {
      get: {
        summary: 'Download PDF',
        description: 'Download invoice as a PDF file',
        operationId: 'downloadInvoicePdf',
        tags: ['Invoices'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': {
            description: 'PDF file',
            content: { 'application/pdf': { schema: { type: 'string', format: 'binary' } } },
          },
          '404': { description: 'Invoice not found' },
        },
      },
    },
    '/api-keys': {
      get: {
        summary: 'List API keys',
        description: 'List all active API keys. Requires session authentication.',
        operationId: 'listApiKeys',
        tags: ['API Keys'],
        responses: {
          '200': {
            description: 'List of API keys',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/ApiKey' } } } } } },
          },
        },
      },
      post: {
        summary: 'Create API key',
        description: 'Create a new API key. The full key is only returned once.',
        operationId: 'createApiKey',
        tags: ['API Keys'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', maxLength: 100 },
                  scopes: { type: 'array', items: { type: 'string', enum: ['invoices:read', 'invoices:write', 'webhooks:read', 'webhooks:write', '*'] } },
                  rateLimit: { type: 'integer', minimum: 1, maximum: 10000, default: 1000 },
                  expiresAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'API key created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      allOf: [{ $ref: '#/components/schemas/ApiKey' }, { type: 'object', properties: { key: { type: 'string', description: 'Full API key (only shown once)' } } }],
                    },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api-keys/{id}': {
      delete: {
        summary: 'Revoke API key',
        description: 'Revoke an API key',
        operationId: 'revokeApiKey',
        tags: ['API Keys'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'API key revoked', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } },
          '404': { description: 'API key not found' },
        },
      },
    },
    '/webhooks': {
      get: {
        summary: 'List webhooks',
        description: 'List all registered webhooks',
        operationId: 'listWebhooks',
        tags: ['Webhooks'],
        responses: {
          '200': {
            description: 'List of webhooks',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Webhook' } } } } } },
          },
        },
      },
      post: {
        summary: 'Create webhook',
        description: 'Register a new webhook endpoint',
        operationId: 'createWebhook',
        tags: ['Webhooks'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url', 'events'],
                properties: {
                  url: { type: 'string', format: 'uri', maxLength: 2000 },
                  events: { type: 'array', items: { type: 'string', enum: ['invoice.created', 'invoice.updated', 'invoice.sent', 'invoice.paid', 'invoice.overdue', 'estimate.signed', '*'] } },
                  description: { type: 'string', maxLength: 500 },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Webhook created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      allOf: [{ $ref: '#/components/schemas/Webhook' }, { type: 'object', properties: { secret: { type: 'string', description: 'Webhook secret for signature verification (only shown once)' } } }],
                    },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/webhooks/{id}': {
      put: {
        summary: 'Update webhook',
        description: 'Update a webhook endpoint',
        operationId: 'updateWebhook',
        tags: ['Webhooks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: { type: 'string', format: 'uri' },
                  events: { type: 'array', items: { type: 'string' } },
                  isActive: { type: 'boolean' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Webhook updated', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } },
          '404': { description: 'Webhook not found' },
        },
      },
      delete: {
        summary: 'Delete webhook',
        description: 'Delete a webhook endpoint',
        operationId: 'deleteWebhook',
        tags: ['Webhooks'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: {
          '200': { description: 'Webhook deleted', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } } } } },
          '404': { description: 'Webhook not found' },
        },
      },
    },
  },
  tags: [
    { name: 'Invoices', description: 'Invoice and estimate management' },
    { name: 'API Keys', description: 'API key management (session auth required)' },
    { name: 'Webhooks', description: 'Webhook endpoint management' },
  ],
}

export async function GET() {
  return NextResponse.json(openApiSpec, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
