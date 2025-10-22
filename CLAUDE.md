# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Invoice Command** is a free, single-page invoicing app with AI voice dictation and Stripe payments integration. Built with Next.js 15 and designed for programmatic SEO across 200+ profession-specific invoice templates.

### Tech Stack
- **Framework**: Next.js 15.5.6 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui with custom theme
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **UI Components**: shadcn/ui (New York style) with custom tweakcn theme
- **Authentication**: Supabase Auth
- **Payments**: Stripe Connect (Express)
- **AI**: OpenAI GPT-4o-mini for voice parsing
- **Voice**: Web Speech API

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
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Database Setup

**Supabase Project**: `invoicecommand`
- **URL**: https://mglvipgetrvmanyzfyfp.supabase.co
- **Schema**: Run `database-schema.sql` in SQL Editor
- **Tables**: `users`, `invoices` with RLS policies
- **Auth**: Enabled for Stripe-connected users

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