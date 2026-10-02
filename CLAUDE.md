# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Invoice Command** is a free, single-page invoicing app with AI voice dictation and Stripe payments integration. Built with Next.js 15 and designed for programmatic SEO across 200+ profession-specific invoice templates.

### Tech Stack
- **Framework**: Next.js 15.5.8 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui with custom theme
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **UI Components**: shadcn/ui (New York style) with custom tweakcn theme
- **Authentication**: Supabase Auth
- **Payments**: Stripe Connect (Express)
- **Email**: Resend for invoice delivery
- **AI**: OpenAI GPT-4o-mini for voice parsing
- **Voice**: Web Speech API
- **Error Tracking**: Sentry
- **Analytics**: Fathom (privacy-focused, GDPR compliant)

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production (also uses Turbopack)
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with custom fonts
│   ├── page.tsx                # Main invoice builder homepage
│   └── globals.css             # Global styles + shadcn theme
├── components/
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── supabase.ts            # Supabase client config
│   └── utils.ts               # Utility functions (cn, etc.)
├── types/
│   └── database.ts            # TypeScript types for DB schema
└── stores/                    # Zustand stores
```

## Environment Variables

Required `.env.local` file:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://mglvipgetrvmanyzfyfp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Add when setting up integrations
OPENAI_API_KEY=

# Stripe integration (Connect + Billing)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3005

# Email integration (Resend)
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=invoices@m.invoicecommand.com
RESEND_REPLY_TO=support@m.invoicecommand.com
RESEND_APP_FROM_EMAIL=hello@m.invoicecommand.com

# Error tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

**Sentry Build Configuration** (`.env.sentry-build-plugin`):
```bash
# Required for uploading source maps to Sentry
# Get your auth token from: https://sentry.io/settings/account/api/auth-tokens/
# Required permissions: project:releases, org:read
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

## Database Setup

**IMPORTANT: Dev and prod share the same Neon database.** This is intentional. There is no separate dev branch.

- Any migration you run locally hits production immediately.
- Any test data you seed from a local script is in production.
- Always clean up test fixtures (delete seeded rows) before ending a session.
- Do not run a migration unless you're ready for it to be live on invoicecommand.com.
- `DATABASE_URL` in `.env.local` and `DATABASE_URL` in Vercel production point at the same Neon endpoint by design.

**Supabase Project**: `invoicecommand`
- **URL**: https://mglvipgetrvmanyzfyfp.supabase.co
- **Schema**: Run `database-schema.sql` in SQL Editor
- **Tables**: `users`, `invoices` with RLS policies
- **Auth**: Enabled for seamless user onboarding

### Supabase Authentication Configuration

**IMPORTANT**: For production deployment, configure these settings in Supabase Dashboard > Authentication > Settings:

1. **Disable Email Confirmations**:
   - Go to "User Signups" section
   - **Turn OFF** "Enable email confirmations"
   - This eliminates signup friction and allows immediate app access

2. **Enable Sign Up**:
   - Ensure "Enable sign up" is ON
   - Set "Allow password-based sign-up" to ON

3. **Site URL**:
   - Set to your production domain: `https://invoicecommand.com`
   - For development: `http://localhost:3005`

This configuration allows users to sign up and immediately access the dashboard without email verification, significantly reducing conversion friction.

## Stripe Integration Setup

**Current Status**: Dual environment setup with test keys for development
- **Development**: Uses Stripe test keys (sk_test_*, pk_test_*) - safe for testing
- **Production**: Uses live Stripe keys via Vercel environment variables
- **Payment Processing**: Stripe Connect with Express accounts
- **Fee Structure**: Variable rates (0.5% free/premium, 0% pro users)
- **Webhook**: Configured at https://dashboard.stripe.com/webhooks

**Test Mode Features**:
- 🧪 Automatic test mode detection in development
- 🏷️ Visual "Test Mode" badges in payment UI
- 🔒 Safe testing without real transactions
- 📝 Debug logging in console during development

**Test Keys**: Available in local .env.local file for development
- Test keys are configured automatically when you run the project locally
- Keys are safely stored in .env.local (gitignored) to prevent accidental commits

## Fathom Analytics

**CRITICAL: DO NOT REMOVE** - Fathom Analytics is essential for tracking site traffic.

- **Site ID**: `BQDNAWTT` (hardcoded in layout.tsx)
- **Dashboard**: https://app.usefathom.com
- **Implementation**: Script tag in `src/app/layout.tsx` head section

```tsx
// In src/app/layout.tsx <head>
<Script
  src="https://cdn.usefathom.com/script.js"
  data-site="BQDNAWTT"
  defer
/>
```

**Why this matters**: Fathom was accidentally removed during a merge in January 2026, causing 7+ days of lost traffic data. The script tag approach (vs. the fathom-client npm package) is more resilient because:
1. No npm dependency to manage
2. Hardcoded site ID (no env var required)
3. Simple to verify in the rendered HTML

**Verification**: After any changes to layout.tsx, check that the Fathom script is still present:
```bash
grep -i "fathom" src/app/layout.tsx
```

## Key Features to Implement

### Phase 1 (MVP)
1. **Invoice Builder**: Real-time preview + form editor
2. **LocalStorage**: Persist data for anonymous users
3. **PDF Export**: Generate downloadable invoices
4. **pSEO**: 20+ profession-specific templates

### Phase 2 (Monetization)
5. **Stripe Connect**: Payment collection with app fees
6. **Premium Subscriptions**: $20/mo for advanced features

### Phase 3 (AI & Voice)
7. **Web Speech API**: Real-time voice recognition
8. **OpenAI Integration**: Parse voice → structured invoice updates

## Custom Theme: "Cool Money"

**IMPORTANT**: Always use the "Cool Money" theme from tweakcn for all design and components.

Theme characteristics:
- **Name**: Cool Money (from tweakcn)
- **Primary**: Emerald green (oklch(0.7227 0.1920 149.5793))
- **Typography**: DM Sans (headings), IBM Plex Mono (code), Lora (serif)
- **Border Radius**: 0.5rem
- **Shadows**: Enhanced custom shadow system
- **Style**: Professional, modern, money/finance-focused

**Theme Installation**:
```bash
npx shadcn@latest add https://tweakcn.com/r/themes/cmgya34ad000604le4z2cf1l2
```

## Development Notes

- **ALWAYS use the "Cool Money" theme** - never deviate from this design system
- Uses shadcn/ui with "New York" style + Cool Money theme customizations
- Zustand for lightweight state management
- TypeScript strict mode enabled
- ESLint configured for Next.js + TypeScript
- Row Level Security (RLS) enabled for multi-tenant data isolation
- Real-time updates target <50ms latency for invoice preview

## Authenticated browser testing (agent-browser)

For testing flows that require a logged-in user (dashboard, share dialog, send-email, anything under `/dashboard`), use the persistent Chrome profile at `~/.agent-browser-profiles/invoicecommand`. The user has logged in once; the cookie sticks across runs.

```bash
# Headless, uses the saved session
agent-browser --profile ~/.agent-browser-profiles/invoicecommand open https://invoicecommand.com/dashboard

# Verify still logged in
agent-browser --profile ~/.agent-browser-profiles/invoicecommand get url  # should NOT redirect to /auth/login
```

If the session has expired (Better Auth session TTL), re-login is interactive — ask the user to handle the form in a headed window:

```bash
agent-browser --profile ~/.agent-browser-profiles/invoicecommand --headed open https://invoicecommand.com/auth/login
```

Notes:
- Do not run `agent-browser close --all` casually — it terminates every session, including this one. Close by specific session if needed.
- The profile dir is outside the repo and is not tracked in git.
- This works because Better Auth uses cookie-based sessions, so the cookie alone is enough to authenticate subsequent agent-browser requests.

## Troubleshooting

### Next.js 15 Internal Server Error / Manifest Issues

**Problem**: Development server returns 500 errors with missing manifest files:
```
Error: Cannot find module '.next/server/middleware-manifest.json'
Error: ENOENT: no such file or directory, open '.next/server/pages-manifest.json'
```

**Root Cause**: Next.js 15 has deprecated certain metadata fields in layout.tsx. Using `viewport` and `themeColor` in the metadata export prevents proper manifest generation.

**Solution Steps**:
1. **Fix metadata deprecation** (in `src/app/layout.tsx`):
   ```tsx
   // Remove from metadata export:
   // viewport: 'width=device-width, initial-scale=1',
   // themeColor: '#10b981',

   // Add separate viewport export:
   export const viewport = {
     width: 'device-width',
     initialScale: 1,
     themeColor: '#10b981',
   };
   ```

2. **Nuclear reset** (if cache corruption persists):
   ```bash
   # Complete environment reset
   rm -rf .next node_modules package-lock.json
   npm install
   npm run dev
   ```

3. **Alternative reset** (less aggressive):
   ```bash
   # Clear build cache only
   rm -rf .next
   npm run dev
   ```

**Prevention**: Always use the `viewport` export instead of viewport/themeColor in metadata when using Next.js 15+.

## Deployment to Vercel

### Production Deployment Workflow

1. **Git Workflow**:
   ```bash
   # Standard feature → development → main workflow
   git checkout development
   git merge feature/your-feature-name
   git push origin development

   git checkout main
   git merge development
   git push origin main
   ```

2. **Vercel Deployment Commands**:
   ```bash
   # Check deployment status
   npx vercel ls

   # Check environment variables
   npx vercel env ls

   # Deploy to production
   npx vercel --prod

   # Check domains
   npx vercel domains ls
   ```

3. **Production URLs**:
   - **Domain**: https://invoicecommand.com
   - **Latest Deployment**: Check with `npx vercel ls`

### Environment Variables Setup

**Required Vercel Environment Variables**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**Add Environment Variables via CLI**:
```bash
# Add each variable (will prompt for value)
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
npx vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Or pipe values directly
echo "https://mglvipgetrvmanyzfyfp.supabase.co" | npx vercel env add NEXT_PUBLIC_SUPABASE_URL production
```

### Common Deployment Issues

**Build Error: "supabaseUrl is required"**
- **Cause**: Missing Supabase environment variables in Vercel
- **Check**: Run `npx vercel env ls` - should show all 3 variables
- **Fix**: Add missing environment variables using commands above
- **Verify**: Local build works with `npm run build` but Vercel fails

**Git Push Not Triggering Deployment**
- Vercel auto-deploys from `main` branch pushes
- Manual deploy: `npx vercel --prod`
- Check Vercel dashboard for webhook/integration issues