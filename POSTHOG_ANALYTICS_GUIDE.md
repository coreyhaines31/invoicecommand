# 🔍 PostHog Analytics & Session Replay - Comprehensive Guide

## 📋 **Overview**

This document outlines the complete PostHog analytics implementation for Invoice Command, including session replays, error logging, privacy controls, and best practices.

## 🏗️ **Architecture**

### **Core Components**

1. **PostHog Configuration** (`src/lib/posthog.ts`)
   - Environment-based settings (dev vs production)
   - Session recording with privacy controls
   - Automatic error capture
   - Performance optimization

2. **React Error Boundary** (`src/components/error-boundary-enhanced.tsx`)
   - Catches React component errors
   - Logs errors to PostHog with context
   - Provides user-friendly error UI
   - Development vs production error display

3. **Analytics Hook** (`src/hooks/use-analytics.ts`)
   - Typed event tracking
   - Error capture methods
   - Session recording controls
   - Performance tracking

4. **Privacy Controls** (`src/components/privacy/privacy-controls.tsx`)
   - GDPR-compliant consent banner
   - Granular privacy settings
   - User preference management
   - Opt-in/opt-out functionality

## ⚙️ **Configuration Details**

### **Session Recording Settings**

```typescript
session_recording: {
  enabled: !isDev, // Production only by default
  sampling_rate: isDev ? 1.0 : 0.1, // 100% dev, 10% prod
  minimum_duration_ms: 2000, // Only record 2+ second sessions
  maximum_duration_ms: 1800000, // Cap at 30 minutes
  capture_performance: true, // Include performance metrics
  capture_console: isDev, // Console logs in dev only

  // Privacy Settings
  mask_input_text: true, // Always mask input text
  mask_input_options: {
    password: true,
    email: true,
    tel: true,
  },

  // Custom masking selectors
  mask_text_selector: '[data-sensitive], .credit-card, .api-key, [data-mask]',
  block_selector: '[data-private], .private-content'
}
```

### **Error Capture Configuration**

- **Automatic**: Unhandled JavaScript errors and promise rejections
- **Manual**: Custom error tracking with context
- **React Errors**: Error boundary integration
- **API Errors**: HTTP error tracking
- **Validation Errors**: Form validation error tracking

### **Privacy Features**

- **Consent Management**: Cookie-free consent system
- **Data Masking**: Automatic PII protection
- **Opt-out Controls**: User can disable tracking
- **GDPR Compliance**: Respects Do Not Track headers
- **Local Storage**: Preferences stored locally

## 📊 **Event Tracking**

### **Automatic Events**
- Page views (manual capture for SPA)
- Error events (`$exception`)
- Performance metrics
- User interactions
- Session recording events

### **Custom Events**
- `invoice_created` - Invoice creation tracking
- `invoice_updated` - Field update tracking
- `invoice_pdf_downloaded` - PDF export tracking
- `voice_command_used` - Voice command tracking
- `user_signup` / `user_login` - Authentication events
- `feature_used` - Feature usage tracking
- `privacy_consent_given` - Privacy consent tracking

## 🔒 **Privacy & Security**

### **Data Protection Measures**

1. **Input Masking**
   - All password fields
   - Email addresses
   - Phone numbers
   - Credit card information

2. **Custom Masking**
   ```html
   <!-- These elements will be masked -->
   <div data-sensitive>Sensitive content</div>
   <div data-mask>Personal info</div>

   <!-- These elements will be completely blocked -->
   <div data-private>Private content</div>
   ```

3. **Environment Controls**
   - Session recording disabled in development
   - Debug logging only in development
   - Reduced sampling in production

### **GDPR Compliance Features**

- ✅ **Consent Banner**: Clear opt-in/opt-out choices
- ✅ **Granular Controls**: Separate controls for analytics, session recording, error tracking
- ✅ **Data Minimization**: Only essential data collection by default
- ✅ **Right to Withdraw**: Easy opt-out mechanism
- ✅ **Transparency**: Clear explanation of data usage

## 🛠️ **Usage Examples**

### **Error Tracking**
```typescript
import { useAnalytics } from '@/hooks/use-analytics'

const { trackError, trackApiError, trackValidationError } = useAnalytics()

// Manual error tracking
try {
  // Some operation
} catch (error) {
  trackError(error, {
    error_type: 'api_error',
    error_context: 'invoice_save',
    user_action: 'save_invoice'
  })
}

// API error tracking
trackApiError('/api/invoices', 500, 'Internal server error')

// Validation error tracking
trackValidationError('email', userEmail, 'Invalid email format')
```

### **Session Recording Controls**
```typescript
const { startRecording, stopRecording } = useAnalytics()

// Start recording for important user flows
const handleCriticalAction = () => {
  startRecording()
  // Perform action
  // Recording continues until user stops or session ends
}

// Stop recording when needed
const handlePrivateAction = () => {
  stopRecording()
  // Handle private action
}
```

### **Performance Tracking**
```typescript
const { trackPerformance } = useAnalytics()

// Track loading times
const startTime = performance.now()
await loadInvoiceData()
const loadTime = performance.now() - startTime

trackPerformance('invoice_load_time', loadTime, {
  invoice_count: invoices.length,
  user_type: 'premium'
})
```

## 🎯 **Best Practices**

### **Implementation Guidelines**

1. **Session Recording**
   - Use sampling rates to control performance impact
   - Mask sensitive data proactively
   - Monitor recording duration and size
   - Test privacy controls regularly

2. **Error Logging**
   - Include relevant context with errors
   - Don't log sensitive data in error messages
   - Use structured error types for better analysis
   - Implement proper error boundaries

3. **Privacy**
   - Always ask for consent before recording
   - Provide clear explanations of data usage
   - Make opt-out easily accessible
   - Respect user preferences across sessions

4. **Performance**
   - Use appropriate sampling rates
   - Monitor bundle size impact
   - Implement lazy loading where possible
   - Test on various device types

### **Production Checklist**

- [ ] Environment variables configured in Vercel
- [ ] Privacy consent banner displays correctly
- [ ] Session recording sampling rate appropriate for traffic
- [ ] Error boundary catches and logs errors
- [ ] Sensitive data masking verified
- [ ] Performance impact acceptable
- [ ] GDPR compliance reviewed
- [ ] Privacy policy updated

## 🔧 **Environment Configuration**

### **Required Environment Variables**
```bash
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_kc0g4slC5Om5CZChzu2OL1zXElNmKSzv93l2aJtrFja
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
NEXT_PUBLIC_APP_VERSION=1.0.0

# Environment Detection
NODE_ENV=production # or development
```

### **Vercel Environment Variables Setup**
```bash
# Add to Vercel via CLI or dashboard
npx vercel env add NEXT_PUBLIC_POSTHOG_KEY production
npx vercel env add NEXT_PUBLIC_POSTHOG_HOST production
npx vercel env add NEXT_PUBLIC_APP_VERSION production
```

## 📈 **Analytics Dashboard**

### **Key Metrics to Monitor**

1. **User Behavior**
   - Page views and navigation patterns
   - Feature usage frequency
   - Session duration and depth
   - Drop-off points

2. **Performance**
   - Page load times
   - API response times
   - Error rates by feature
   - Session recording file sizes

3. **Errors**
   - Error frequency and types
   - Error impact on user flows
   - Browser/device error patterns
   - Error resolution tracking

4. **Privacy**
   - Consent rates
   - Opt-out frequency
   - Privacy preference patterns
   - Data protection effectiveness

## 🚀 **Deployment Notes**

### **Production Considerations**

1. **Performance Impact**
   - Session recording adds ~2-5KB to initial bundle
   - Runtime overhead minimal with proper sampling
   - Network usage scales with session complexity

2. **Privacy Compliance**
   - EU users see consent banner automatically
   - Preferences persist across browser sessions
   - Opt-out is immediate and persistent

3. **Monitoring**
   - PostHog dashboard for real-time analytics
   - Error tracking in PostHog events
   - Performance metrics in custom dashboards

## 🔍 **Troubleshooting**

### **Common Issues**

1. **Session recordings not appearing**
   - Check sampling rate configuration
   - Verify PostHog key is correct
   - Ensure user has consented to recording

2. **Errors not being captured**
   - Check error boundary implementation
   - Verify PostHog initialization
   - Test manual error capture

3. **Privacy banner not showing**
   - Check localStorage for existing preferences
   - Verify component integration in layout
   - Test in incognito/private browsing

4. **Performance issues**
   - Reduce sampling rate
   - Check for memory leaks in error handlers
   - Monitor PostHog network requests

---

## 📞 **Support**

For PostHog-specific issues:
- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Community](https://posthog.com/questions)
- [PostHog GitHub](https://github.com/PostHog/posthog)

For implementation questions, refer to the code comments and this documentation.