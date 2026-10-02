# Invoice Command

Free, open-source invoicing. Build an invoice in the browser with a live preview, dictate it by voice, download a PDF, email it, and get paid by card through Stripe. The hosted version is at [invoicecommand.com](https://invoicecommand.com).

- **Invoice and estimate builder** with live preview, three styles, and 400+ profession templates
- **No account needed**: drafts are saved in the browser; sign up to save invoices and send them
- **Voice dictation**: speak line items and details, and OpenAI turns them into form fields
- **Payments**: Stripe Connect lets clients pay invoices by card
- **E-signatures** on estimates, shareable invoice links, PDF export
- **API, CLI, and MCP server** (`packages/cli`, `packages/mcp`) for creating and sending invoices from scripts or AI agents

## Tech stack

Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 + shadcn/ui · Postgres via Drizzle · Better Auth · Stripe Connect · Resend · OpenAI · Sentry · PostHog

## Running it locally

Requires Node.js 22.12 or newer and a Postgres database (a free [Neon](https://neon.tech) project works).

```bash
npm install
# create .env.local with the variables below; DATABASE_URL and BETTER_AUTH_SECRET are enough to start
npm run db:push   # creates the tables
npm run dev       # http://localhost:3005
```

| Variable | Needed for |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (required) |
| `BETTER_AUTH_SECRET` | Session signing, any long random string (required) |
| `NEXT_PUBLIC_APP_URL` | Absolute links in emails and share links, e.g. `http://localhost:3005` |
| `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Card payments via Stripe Connect (Express accounts) |
| `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `RESEND_APP_FROM_EMAIL`, `RESEND_REPLY_TO` | Emailing invoices |
| `SUPPORT_EMAIL` | Inbox that receives the in-app support form |
| `OPENAI_API_KEY` | Voice dictation |
| `CRON_SECRET` | The scheduled jobs in `vercel.json` |
| `NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Error tracking and analytics (optional) |

Features whose keys are missing stay off; the invoice builder itself works with just the database and auth secret.

## Tests

```bash
npm test           # Jest unit and component tests
npm run test:e2e   # end-to-end tests in a real browser
```

The end-to-end tests use [e2e](https://tester.army/e2e): an AI agent drives the app through flows like building an invoice, and exact assertions check the results. Agent steps call a model through the [Vercel AI Gateway](https://vercel.com/ai-gateway), so set `AI_GATEWAY_API_KEY` (or `vercel link` the project). The runner starts the dev server itself.

## Contributing

Issues and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md). Contributors sign a short [CLA](CLA.md) on their first pull request.

## License

[AGPL-3.0](LICENSE). You can use, modify, and self-host Invoice Command freely. If you run a modified version as a network service, you must make your source code available to its users under the same license.
