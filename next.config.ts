import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: These flags suppress pre-existing build errors. See SECURITY_AUDIT_2026-05-11.md
  // "Remove `ignoreDuringBuilds` / `ignoreBuildErrors`" — should be removed once the
  // legacy type/lint errors in the template pages are fixed.
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Expose the build commit SHA to the client bundle so the bottom-right
  // version badge can render it. Lets support quickly identify whether a
  // user is on a stale cached bundle vs. the current deploy.
  env: {
    NEXT_PUBLIC_BUILD_SHA:
      process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'dev',
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['@/components/ui', '@/lib'],
  },
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Compression
  compress: true,
  // SEO optimizations
  trailingSlash: false,
  // Security headers for SEO (restored from security audit)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=(), payment=()',
          },
          {
            key: 'Content-Security-Policy',
            // Stripe: js.stripe.com (Stripe.js), api.stripe.com + m.stripe.com (XHR/beacons),
            // hooks.stripe.com + js.stripe.com frames (Elements iframes + 3DS challenges).
            // PostHog: *.i.posthog.com for analytics (connect-src) and remote config/recorder scripts
            // from us-assets.i.posthog.com (script-src). Sentry Replay compresses in a blob: worker.
            // Dev only: Next's dev runtime evaluates strings, so without 'unsafe-eval' the page never hydrates.
            value: `default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''} https://cdn.usefathom.com https://js.stripe.com https://*.i.posthog.com; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.openai.com https://cdn.usefathom.com https://*.sentry.io https://api.stripe.com https://m.stripe.com https://r.stripe.com https://*.i.posthog.com https://app.posthog.com; media-src 'self'; object-src 'none'; frame-src 'self' https://js.stripe.com https://hooks.stripe.com;`,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ]
  },
  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/invoicecommand',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "coreys-apps",
  project: "invoicecommand",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Webpack-specific options
  webpack: {
    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },
    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,
  },
});
