import * as Sentry from "@sentry/nextjs";
import { isReplayBlockedPath, scrubSentryPayload } from "@/lib/sentry-redaction";

// Share links carry the access token in the path (/i/<token>). Replay records
// the page URL and its network requests, so it never starts on those pages.
const replayAllowed = !isReplayBlockedPath(window.location.pathname);

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // Adjust this value in production to reduce costs
  tracesSampleRate: 1.0,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Redact share tokens from URLs in events, transactions and breadcrumbs.
  beforeSend: scrubSentryPayload,
  beforeSendTransaction: scrubSentryPayload,
  beforeBreadcrumb: scrubSentryPayload,

  integrations: replayAllowed
    ? [
        Sentry.replayIntegration({
          maskAllText: true,
          blockAllMedia: true,
          beforeAddRecordingEvent: scrubSentryPayload,
        }),
      ]
    : [],
});

// Instrument navigation transitions for performance monitoring. A client-side
// move onto a share-link page stops replay for the rest of the page load.
export function onRouterTransitionStart(
  ...args: Parameters<typeof Sentry.captureRouterTransitionStart>
) {
  if (isReplayBlockedPath(args[0])) {
    void Sentry.getReplay()?.stop();
  }
  return Sentry.captureRouterTransitionStart(...args);
}
