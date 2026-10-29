# invoicecommand-mcp

MCP server for [Invoice Command](https://invoicecommand.com). It lets Claude and other MCP clients create, look up, send, and mark invoices paid through the Invoice Command API.

## Setup

1. Create an API key at [invoicecommand.com/dashboard/api-keys](https://invoicecommand.com/dashboard/api-keys).
2. Add the server to your MCP client:

```json
{
  "mcpServers": {
    "invoicecommand": {
      "command": "npx",
      "args": ["-y", "invoicecommand-mcp"],
      "env": { "INVOICE_COMMAND_API_KEY": "sk_live_..." }
    }
  }
}
```

## Choosing key permissions

New keys are read-only by default. A read-only key (`invoices:read`) is enough for `list_invoices` and `get_invoice`, and it can't create, change, or email anything. Use one if you only want lookups.

Tick **Write Invoices** (`invoices:write`) only if you want `create_invoice`, `send_invoice`, and `mark_invoice_paid`. Anyone holding a write key can email invoices to your clients, so keep it out of shared files and revoke it from the dashboard if it leaks. Revocation takes effect on the next request.

## Tools

| Tool | What it does |
|---|---|
| `create_invoice` | Creates a draft invoice or estimate. Totals are computed from the items, `discountRate`, and `taxRate`. |
| `list_invoices` | Lists invoices, filtered by type or status. Read-only. |
| `get_invoice` | Shows one invoice. Read-only. |
| `send_invoice` | Emails the invoice to the client with a PDF the server renders. Asks you to confirm first. |
| `mark_invoice_paid` | Sets the status to paid. |

`send_invoice` never sends on the first request. If your client supports elicitation, you get a confirm prompt. Otherwise the tool returns a preview with the recipient and total, and it sends only when called again with `confirm: true` after you approve.
