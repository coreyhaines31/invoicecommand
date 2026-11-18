import * as Sentry from "@sentry/nextjs";
import { scrubSentryPayload } from "@/lib/sentry-redaction";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Errors go to HoneyWarden, which keeps errors only, so tracing is off.
  tracesSampleRate: 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Redact share tokens (/i/<token>) from request.url, headers and breadcrumbs.
  beforeSend: scrubSentryPayload,
  // Unused while tracing is off; kept so turning it back on can't leak tokens.
  beforeSendTransaction: scrubSentryPayload,
  beforeBreadcrumb: scrubSentryPayload,
});
