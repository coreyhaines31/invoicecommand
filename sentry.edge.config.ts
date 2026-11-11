import * as Sentry from "@sentry/nextjs";
import { scrubSentryPayload } from "@/lib/sentry-redaction";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Adjust this value in production to reduce costs
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Redact share tokens (/i/<token>) from request.url, headers, transaction
  // names, spans and breadcrumbs.
  beforeSend: scrubSentryPayload,
  beforeSendTransaction: scrubSentryPayload,
  beforeBreadcrumb: scrubSentryPayload,
});
