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
| `submit_feedback` | Reports a missing, broken, or confusing tool to the Invoice Command maintainers. |

`send_invoice` never sends on the first request. If your client supports elicitation, you get a confirm prompt showing the recipient, total, and message. Otherwise the tool returns that preview with a single-use token, and it sends only when called again with the token and the same message, within 10 minutes. Your client's tool-approval prompt is the check that you, not the model, approved the second call, so don't auto-approve `send_invoice`.

## Feedback

`submit_feedback` sends the maintainers a short report when a tool is missing, fails, or gets in the way: the task, a kind (`missing`, `broken`, `confusing`, `idea`), an impact (`blocked`, `worked_around`, `friction`), and what was tried. API keys, tokens, share links, and emails are scrubbed on your machine and again on the server. The report is stored with your user and API key IDs, not your name or email, and it never touches your invoices. Any key works, including a read-only one. Unexpected errors from other tools end with a pointer to it.

