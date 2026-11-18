import * as Sentry from "@sentry/nextjs";
import { scrubSentryPayload } from "@/lib/sentry-redaction";

// Errors go to HoneyWarden, which accepts the Sentry SDK's protocol and keeps
// errors only. Tracing and session replay stay off: it would discard both.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // Redact share tokens from URLs in events and breadcrumbs.
  beforeSend: scrubSentryPayload,
  // Unused while tracing is off; kept so turning it back on can't leak tokens.
  beforeSendTransaction: scrubSentryPayload,
  beforeBreadcrumb: scrubSentryPayload,
});

// Navigation breadcrumbs for errors that follow a client-side route change.
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
