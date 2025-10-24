# Internal Tasks

This document tracks internal development and business tasks that need to be completed for Invoice Command.

## Analytics & Tracking

### PostHog Setup
- [x] **Install PostHog SDK** ✅ *Completed 2025-10-22*
  - [x] Add PostHog to package.json dependencies
  - [x] Configure PostHog provider in app layout
  - [x] Set up environment variables for PostHog API key
  - [x] Add PostHog tracking to key user actions (invoice creation, downloads, etc.)

- [x] **Analytics Events to Track** ✅ *Completed 2025-10-22*
  - [x] Invoice creation
  - [x] PDF downloads
  - [x] Voice command usage
  - [x] User signup/login
  - [x] Feature usage (tax, discount, line items)
  - [x] Page views and user flow

## Business & Operations

### Legal & Compliance
- [ ] **Privacy Policy**
  - [ ] Draft privacy policy
  - [ ] Add privacy policy page
  - [ ] Link from footer

- [ ] **Terms of Service**
  - [ ] Draft terms of service
  - [ ] Add terms page
  - [ ] Link from footer

### Marketing & SEO
- [ ] **Meta Tags & SEO**
  - [ ] Add proper meta descriptions
  - [ ] Set up Open Graph tags
  - [ ] Add Twitter Card meta tags
  - [ ] Set up proper canonical URLs

## Technical Improvements

### Performance
- [ ] **Bundle Analysis**
  - [ ] Analyze bundle size
  - [ ] Implement code splitting where beneficial
  - [ ] Optimize images and assets

### Monitoring
- [ ] **Error Tracking**
  - [ ] Set up Sentry or similar error monitoring
  - [ ] Add error boundaries to React components
  - [ ] Monitor deployment health

## Feature Development

### Payments Integration
- [ ] **Stripe Connect Setup**
  - [ ] Research Stripe Connect Express requirements
  - [ ] Implement account creation flow
  - [ ] Add payment collection to invoices
  - [ ] Set up webhook handling

### Voice AI Enhancement
- [ ] **OpenAI Integration**
  - [ ] Implement voice-to-text parsing
  - [ ] Add voice command recognition
  - [ ] Create voice UI components

### Authentication & Communications
- [x] **Supabase Auth Configuration** ✅ *Completed 2025-10-22*
  - [x] Disable email confirmations for friction-free signup
  - [x] Configure seamless user onboarding flow
  - [x] Document production authentication settings

- [ ] **Google OAuth Integration**
  - [ ] Add Google OAuth provider to Supabase Auth
  - [ ] Configure Google OAuth credentials
  - [ ] Add Google sign-in button to auth UI
  - [ ] Test Google sign-in flow

- [ ] **Email Service Setup** (Optional - for transactional emails)
  - [ ] Set up Resend account and API key (if needed for invoice sending)
  - [ ] Add password reset email functionality
  - [ ] Set up transactional emails for invoice delivery
  - [ ] Configure DKIM/SPF records for domain

## Notes

- Priority items should be marked with ⭐
- Completed items should show completion date
- Add estimated time/effort for larger tasks