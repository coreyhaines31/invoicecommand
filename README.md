# Invoice Command

Free, open-source invoicing. Build an invoice in the browser with a live preview, dictate it by voice, download a PDF, email it, and get paid by card through Stripe. The hosted version is at [invoicecommand.com](https://invoicecommand.com).

- **Invoice and estimate builder** with live preview, three styles, and 400+ profession templates
- **No account needed**: drafts are saved in the browser; sign up to save invoices and send them
- **Voice dictation**: speak line items and details, and an OpenAI model (through the Vercel AI Gateway) turns them into form fields
- **Payments**: Stripe Connect lets clients pay invoices by card
- **E-signatures** on estimates, shareable invoice links, PDF export
- **API, CLI, and MCP server** (`packages/cli`, `packages/mcp`) for creating and sending invoices from scripts or AI agents

## Tech stack

Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 + shadcn/ui · Postgres via Drizzle · Better Auth · Stripe Connect · PostShiba (Resend fallback) · Vercel AI Gateway + AI SDK · Sentry · PostHog

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
| `POSTSHIBA_API_KEY` | Sending email through PostShiba. When unset, email goes through Resend with `RESEND_API_KEY` |
| `MAIL_FROM_EMAIL`, `MAIL_APP_FROM_EMAIL`, `MAIL_REPLY_TO` | From addresses for invoices and app email, and the reply-to. Default to `invoices@` and `hello@mail.invoicecommand.com`, and `support@invoicecommand.com` (the mail subdomain has no inbox). The old `RESEND_FROM_EMAIL`, `RESEND_APP_FROM_EMAIL` and `RESEND_REPLY_TO` names are still read. With PostShiba on, a from address outside `mail.invoicecommand.com` is ignored |
| `SUPPORT_EMAIL` | Inbox that receives the in-app support form |
| `AI_GATEWAY_API_KEY` | Voice dictation, the voice eval (`npm run eval:voice`) and e2e agent steps, through the Vercel AI Gateway. Locally, set this or run `vercel env pull` on a linked project for a short-lived `VERCEL_OIDC_TOKEN`. On Vercel the deployment's OIDC token is used and no key is needed. `OPENAI_API_KEY` is no longer used |
| `VOICE_MODEL` | Gateway model ID for voice dictation (optional, default `openai/gpt-6-luna`) |
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
