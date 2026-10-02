/**
 * Tests for useAnalytics hook
 * Tests PostHog analytics tracking integration
 */

import { renderHook } from '@testing-library/react'
import { useAnalytics } from '@/hooks/use-analytics'

// Mock PostHog
const mockCapture = jest.fn()
const mockIdentify = jest.fn()
const mockCaptureError = jest.fn()
const mockStartSessionRecording = jest.fn()
const mockStopSessionRecording = jest.fn()

jest.mock('@/lib/posthog', () => ({
  posthog: {
    capture: jest.fn(),
    identify: jest.fn(),
  },
  captureError: jest.fn(),
  startSessionRecording: jest.fn(),
  stopSessionRecording: jest.fn(),
}))

// Import mocked functions after mock
import { posthog, captureError, startSessionRecording, stopSessionRecording } from '@/lib/posthog'

const mockedPosthog = posthog as jest.Mocked<typeof posthog>
const mockedCaptureError = captureError as jest.MockedFunction<typeof captureError>
const mockedStartSessionRecording = startSessionRecording as jest.MockedFunction<typeof startSessionRecording>
const mockedStopSessionRecording = stopSessionRecording as jest.MockedFunction<typeof stopSessionRecording>

describe('useAnalytics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Invoice Tracking', () => {
    it('should track invoice creation with default values', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackInvoiceCreated()

      expect(mockedPosthog.capture).toHaveBeenCalledWith('invoice_created', {
        items_count: 0,
        has_tax: false,
        has_discount: false,
        total_amount: 0,
        currency: 'USD',
        voice_used: false,
      })
    })

    it('should track invoice creation with custom data', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackInvoiceCreated({
        items_count: 5,
        has_tax: true,
        has_discount: true,
        total_amount: 1500.50,
        currency: 'EUR',
        voice_used: true,
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('invoice_created', {
        items_count: 5,
        has_tax: true,
        has_discount: true,
        total_amount: 1500.50,
        currency: 'EUR',
        voice_used: true,
      })
    })

    it('should track invoice update with field name', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackInvoiceUpdated('clientName', {
        items_count: 3,
        total_amount: 500,
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('invoice_updated', {
        field_updated: 'clientName',
        items_count: 3,
        has_tax: false,
        has_discount: false,
        total_amount: 500,
        currency: 'USD',
      })
    })

    it('should track PDF download', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackPdfDownload({
        items_count: 2,
        has_tax: true,
        total_amount: 750,
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('invoice_pdf_downloaded', {
        items_count: 2,
        has_tax: true,
        has_discount: false,
        total_amount: 750,
        currency: 'USD',
      })
    })
  })

  describe('Voice Command Tracking', () => {
    it('should track voice command with default values', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackVoiceCommand()

      expect(mockedPosthog.capture).toHaveBeenCalledWith('voice_command_used', {
        command_type: 'unknown',
        success: false,
        error: null,
      })
    })

    it('should track successful voice command', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackVoiceCommand({
        command_type: 'add_item',
        success: true,
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('voice_command_used', {
        command_type: 'add_item',
        success: true,
        error: null,
      })
    })

    it('should track failed voice command with error', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackVoiceCommand({
        command_type: 'update_field',
        success: false,
        error: 'Invalid field name',
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('voice_command_used', {
        command_type: 'update_field',
        success: false,
        error: 'Invalid field name',
      })
    })
  })

  describe('Feature Tracking', () => {
    it('should track feature usage with name only', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackFeatureUsed('payment_settings')

      expect(mockedPosthog.capture).toHaveBeenCalledWith('feature_used', {
        feature_name: 'payment_settings',
      })
    })

    it('should track feature usage with additional details', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackFeatureUsed('export_pdf', {
        format: 'A4',
        color: 'full',
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('feature_used', {
        feature_name: 'export_pdf',
        format: 'A4',
        color: 'full',
      })
    })
  })

  describe('User Authentication Tracking', () => {
    it('should track user signup with email', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackUserSignup('email')

      expect(mockedPosthog.capture).toHaveBeenCalledWith('user_signup', {
        signup_method: 'email',
      })
    })

    it('should track user signup with google', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackUserSignup('google')

      expect(mockedPosthog.capture).toHaveBeenCalledWith('user_signup', {
        signup_method: 'google',
      })
    })

    it('should track user login with github', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackUserLogin('github')

      expect(mockedPosthog.capture).toHaveBeenCalledWith('user_login', {
        login_method: 'github',
      })
    })
  })

  describe('User Identification', () => {
    it('should identify user with ID only', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.identifyUser('user-123')

      expect(mockedPosthog.identify).toHaveBeenCalledWith('user-123', undefined)
    })

    it('should identify user with properties', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.identifyUser('user-456', {
        email: 'test@example.com',
        tier: 'premium',
      })

      expect(mockedPosthog.identify).toHaveBeenCalledWith('user-456', {
        email: 'test@example.com',
        tier: 'premium',
      })
    })
  })

  describe('Error Tracking', () => {
    it('should track generic error with default type', () => {
      const { result } = renderHook(() => useAnalytics())
      const error = new Error('Something went wrong')

      result.current.trackError(error)

      expect(mockedCaptureError).toHaveBeenCalledWith(error, {
        error_type: 'system_error',
        error_context: undefined,
        user_action: undefined,
      })
    })

    it('should track error with custom data', () => {
      const { result } = renderHook(() => useAnalytics())
      const error = new Error('Network timeout')

      result.current.trackError(error, {
        error_type: 'network_error',
        error_context: 'invoice_save',
        user_action: 'clicking_save_button',
        additional_data: {
          retry_count: 3,
        },
      })

      expect(mockedCaptureError).toHaveBeenCalledWith(error, {
        error_type: 'network_error',
        error_context: 'invoice_save',
        user_action: 'clicking_save_button',
        retry_count: 3,
      })
    })

    it('should track API error', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackApiError('/api/invoices', 404, 'Not found')

      expect(mockedCaptureError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'API Error: Not found',
        }),
        {
          error_type: 'api_error',
          error_context: '/api/invoices',
          status_code: 404,
          endpoint: '/api/invoices',
        }
      )
    })

    it('should track validation error', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackValidationError('email', 'invalid-email', 'Invalid email format')

      expect(mockedCaptureError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation Error: Invalid email format',
        }),
        {
          error_type: 'validation_error',
          error_context: 'email',
          field: 'email',
          value: 'invalid-email',
        }
      )
    })

    it('should truncate long validation values', () => {
      const { result } = renderHook(() => useAnalytics())
      const longValue = 'a'.repeat(200)

      result.current.trackValidationError('description', longValue, 'Too long')

      expect(mockedCaptureError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          value: longValue.substring(0, 100),
        })
      )
    })
  })

  describe('Session Recording', () => {
    it('should start session recording', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.startRecording()

      expect(mockedStartSessionRecording).toHaveBeenCalled()
      expect(mockedPosthog.capture).toHaveBeenCalledWith('session_recording_started', {
        timestamp: expect.any(String),
      })
    })

    it('should stop session recording', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.stopRecording()

      expect(mockedStopSessionRecording).toHaveBeenCalled()
      expect(mockedPosthog.capture).toHaveBeenCalledWith('session_recording_stopped', {
        timestamp: expect.any(String),
      })
    })
  })

  describe('Performance Tracking', () => {
    it('should track performance metric without context', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackPerformance('page_load', 1234)

      expect(mockedPosthog.capture).toHaveBeenCalledWith('performance_metric', {
        metric_name: 'page_load',
        metric_value: 1234,
        timestamp: expect.any(String),
      })
    })

    it('should track performance metric with context', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackPerformance('api_response', 456, {
        endpoint: '/api/invoices',
        method: 'POST',
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('performance_metric', {
        metric_name: 'api_response',
        metric_value: 456,
        timestamp: expect.any(String),
        endpoint: '/api/invoices',
        method: 'POST',
      })
    })
  })

  describe('User Interaction Tracking', () => {
    it('should track user interaction without context', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackUserInteraction('save_button', 'click')

      expect(mockedPosthog.capture).toHaveBeenCalledWith('user_interaction', {
        element: 'save_button',
        action: 'click',
        timestamp: expect.any(String),
        page_url: expect.any(String),
      })
    })

    it('should track user interaction with context', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackUserInteraction('invoice_item', 'edit', {
        item_index: 2,
        field: 'quantity',
      })

      expect(mockedPosthog.capture).toHaveBeenCalledWith('user_interaction', {
        element: 'invoice_item',
        action: 'edit',
        timestamp: expect.any(String),
        page_url: expect.any(String),
        item_index: 2,
        field: 'quantity',
      })
    })
  })

  describe('Multiple Tracking Calls', () => {
    it('should handle multiple tracking calls independently', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackInvoiceCreated()
      result.current.trackPdfDownload()
      result.current.trackFeatureUsed('test')

      expect(mockedPosthog.capture).toHaveBeenCalledTimes(3)
    })

    it('should not interfere with each other', () => {
      const { result } = renderHook(() => useAnalytics())

      result.current.trackVoiceCommand({ success: true })
      result.current.trackUserLogin('email')

      expect(mockedPosthog.capture).toHaveBeenNthCalledWith(1, 'voice_command_used', expect.any(Object))
      expect(mockedPosthog.capture).toHaveBeenNthCalledWith(2, 'user_login', expect.any(Object))
    })
  })
})
