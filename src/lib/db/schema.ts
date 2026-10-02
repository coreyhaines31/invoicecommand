import {
  pgTable,
  text,
  timestamp,
  boolean,
  decimal,
  integer,
  jsonb,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'

// Better Auth required tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at'),
})

// App tables
export const userProfiles = pgTable('user_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }).unique(),
  stripeAccountId: text('stripe_account_id'),
  stripeOnboardingCompleted: boolean('stripe_onboarding_completed').default(false),
  stripeChargesEnabled: boolean('stripe_charges_enabled').default(false),
  stripePayoutsEnabled: boolean('stripe_payouts_enabled').default(false),
  subscriptionTier: text('subscription_tier', { enum: ['free', 'premium', 'pro'] }).default('free'),
  subscriptionStatus: text('subscription_status', { enum: ['active', 'inactive', 'canceled', 'past_due'] }).default('inactive'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  uniqueIndex('user_profiles_stripe_account_idx').on(table.stripeAccountId),
])

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  documentType: text('document_type', { enum: ['invoice', 'estimate'] }).default('invoice'),
  invoiceNumber: text('invoice_number').notNull(),
  invoiceDate: date('invoice_date'),
  dueDate: date('due_date'),
  expirationDate: date('expiration_date'),
  status: text('status', { enum: ['draft', 'sent', 'paid'] }).default('draft'),
  // Client
  clientName: text('client_name').notNull(),
  clientEmail: text('client_email'),
  clientAddress: text('client_address'),
  clientCity: text('client_city'),
  clientState: text('client_state'),
  clientZip: text('client_zip'),
  // Sender
  senderName: text('sender_name'),
  senderEmail: text('sender_email'),
  senderAddress: text('sender_address'),
  senderCity: text('sender_city'),
  senderState: text('sender_state'),
  senderZip: text('sender_zip'),
  senderPhone: text('sender_phone'),
  senderLogo: text('sender_logo'),
  // Financials
  items: jsonb('items').notNull().default([]),
  subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull().default('0'),
  tax: decimal('tax', { precision: 10, scale: 2 }).notNull().default('0'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull().default('0'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('0'),
  discountRate: decimal('discount_rate', { precision: 5, scale: 2 }).default('0'),
  discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
  // Content
  notes: text('notes'),
  terms: text('terms'),
  currency: text('currency').default('USD'),
  style: text('style', { enum: ['modern', 'classic', 'minimal'] }).default('modern'),
  // Stripe
  stripePaymentLink: text('stripe_payment_link'),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  stripePaymentStatus: text('stripe_payment_status', { enum: ['unpaid', 'paid', 'failed', 'processing', 'canceled'] }).default('unpaid'),
  paymentEnabled: boolean('payment_enabled').default(false),
  paymentAmountCents: integer('payment_amount_cents'),
  applicationFeeCents: integer('application_fee_cents'),
  // Misc
  recurring: boolean('recurring').default(false),
  convertedToInvoiceId: text('converted_to_invoice_id'),
  // E-signature (estimates)
  collectSignature: boolean('collect_signature').default(true),
  signatureRequired: boolean('signature_required').default(false),
  signedAt: timestamp('signed_at', { withTimezone: true }),
  signatureData: text('signature_data'),
  signerName: text('signer_name'),
  signerEmail: text('signer_email'),
  signedIp: text('signed_ip'),
  signedUserAgent: text('signed_user_agent'),
  consentText: text('consent_text'),
  // Shareable link
  shareToken: text('share_token'),
  shareEnabled: boolean('share_enabled').notNull().default(false),
  shareExpiresAt: timestamp('share_expires_at', { withTimezone: true }),
  shareViewCount: integer('share_view_count').notNull().default(0),
  shareLastViewedAt: timestamp('share_last_viewed_at', { withTimezone: true }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('invoices_user_created_idx').on(table.userId, table.createdAt),
  index('invoices_user_document_created_idx').on(table.userId, table.documentType, table.createdAt),
  index('invoices_user_invoice_number_idx').on(table.userId, table.invoiceNumber),
  index('invoices_payment_intent_idx').on(table.stripePaymentIntentId),
  uniqueIndex('invoices_share_token_idx').on(table.shareToken),
])

export const voiceUsage = pgTable('voice_usage', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  monthYear: text('month_year').notNull(),
  commandCount: integer('command_count').default(0),
  lastUsed: timestamp('last_used').defaultNow(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  uniqueIndex('voice_usage_user_month_idx').on(table.userId, table.monthYear),
])

// API Keys for programmatic access
export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  keyPrefix: text('key_prefix').notNull(), // First 8 chars for identification (sk_live_xxx...)
  keyHash: text('key_hash').notNull(), // SHA-256 hash of full key
  scopes: jsonb('scopes').notNull().default(['invoices:read', 'invoices:write']),
  rateLimit: integer('rate_limit').default(1000), // Requests per hour
  requestCount: integer('request_count').default(0),
  requestCountResetAt: timestamp('request_count_reset_at').defaultNow(),
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('api_keys_user_idx').on(table.userId),
  uniqueIndex('api_keys_prefix_idx').on(table.keyPrefix),
  index('api_keys_hash_idx').on(table.keyHash),
])

// Webhook endpoints
export const webhooks = pgTable('webhooks', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  url: text('url').notNull(),
  secret: text('secret').notNull(), // For HMAC signature verification
  events: jsonb('events').notNull().default([]), // ['invoice.created', 'invoice.paid', ...]
  isActive: boolean('is_active').default(true),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('webhooks_user_idx').on(table.userId),
  index('webhooks_active_idx').on(table.userId, table.isActive),
])

// Webhook event delivery tracking
export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  webhookId: text('webhook_id').notNull().references(() => webhooks.id, { onDelete: 'cascade' }),
  eventType: text('event_type').notNull(), // 'invoice.created', 'invoice.paid', etc.
  payload: jsonb('payload').notNull(),
  status: text('status', { enum: ['pending', 'delivered', 'failed'] }).default('pending'),
  attempts: integer('attempts').default(0),
  maxAttempts: integer('max_attempts').default(5),
  nextRetryAt: timestamp('next_retry_at'),
  responseStatus: integer('response_status'),
  responseBody: text('response_body'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow(),
}, (table) => [
  index('webhook_events_webhook_idx').on(table.webhookId),
  index('webhook_events_status_idx').on(table.status, table.nextRetryAt),
])
