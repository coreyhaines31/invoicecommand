/**
 * Tests for Resend client configuration
 * Tests Resend API client initialization and email constants
 */

// Mock Resend before importing
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation((apiKey: string) => ({
    apiKey,
    emails: {
      send: jest.fn(),
    },
  })),
}))

describe('Resend Client Configuration', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('API Key Validation', () => {
    it('should not construct a Resend client when RESEND_API_KEY is missing', () => {
      delete process.env.RESEND_API_KEY

      jest.isolateModules(() => {
        const { resend } = require('@/lib/resend')
        expect(resend).toBeNull()
      })
    })

    it('should initialize Resend client with API key', () => {
      process.env.RESEND_API_KEY = 'test-api-key'

      jest.isolateModules(() => {
        const { resend } = require('@/lib/resend')
        const { Resend } = require('resend')

        expect(Resend).toHaveBeenCalledWith('test-api-key')
        expect(resend).toBeDefined()
      })
    })
  })

  describe('Email Configuration Constants', () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = 'test-api-key'
    })

    it('should export FROM_EMAIL with default value', () => {
      delete process.env.RESEND_FROM_EMAIL

      jest.isolateModules(() => {
        const { FROM_EMAIL } = require('@/lib/resend')
        expect(FROM_EMAIL).toBe('invoices@m.invoicecommand.com')
      })
    })

    it('should use custom FROM_EMAIL from environment', () => {
      process.env.RESEND_FROM_EMAIL = 'custom@example.com'

      jest.isolateModules(() => {
        const { FROM_EMAIL } = require('@/lib/resend')
        expect(FROM_EMAIL).toBe('custom@example.com')
      })
    })

    it('should export REPLY_TO_EMAIL with default value', () => {
      delete process.env.RESEND_REPLY_TO

      jest.isolateModules(() => {
        const { REPLY_TO_EMAIL } = require('@/lib/resend')
        expect(REPLY_TO_EMAIL).toBe('support@m.invoicecommand.com')
      })
    })

    it('should use custom REPLY_TO_EMAIL from environment', () => {
      process.env.RESEND_REPLY_TO = 'reply@example.com'

      jest.isolateModules(() => {
        const { REPLY_TO_EMAIL } = require('@/lib/resend')
        expect(REPLY_TO_EMAIL).toBe('reply@example.com')
      })
    })

    it('should export APP_FROM_EMAIL with default value', () => {
      delete process.env.RESEND_APP_FROM_EMAIL

      jest.isolateModules(() => {
        const { APP_FROM_EMAIL } = require('@/lib/resend')
        expect(APP_FROM_EMAIL).toBe('hello@m.invoicecommand.com')
      })
    })

    it('should use custom APP_FROM_EMAIL from environment', () => {
      process.env.RESEND_APP_FROM_EMAIL = 'app@example.com'

      jest.isolateModules(() => {
        const { APP_FROM_EMAIL } = require('@/lib/resend')
        expect(APP_FROM_EMAIL).toBe('app@example.com')
      })
    })
  })

  describe('Module Exports', () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = 'test-api-key'
    })

    it('should export resend client instance', () => {
      jest.isolateModules(() => {
        const module = require('@/lib/resend')
        expect(module.resend).toBeDefined()
        expect(module.resend.apiKey).toBe('test-api-key')
      })
    })

    it('should export all email constants', () => {
      jest.isolateModules(() => {
        const module = require('@/lib/resend')
        expect(module.FROM_EMAIL).toBeDefined()
        expect(module.REPLY_TO_EMAIL).toBeDefined()
        expect(module.APP_FROM_EMAIL).toBeDefined()
      })
    })
  })

  describe('Email Address Validation', () => {
    beforeEach(() => {
      process.env.RESEND_API_KEY = 'test-api-key'
    })

    it('should have valid email format for FROM_EMAIL', () => {
      jest.isolateModules(() => {
        const { FROM_EMAIL } = require('@/lib/resend')
        expect(FROM_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })
    })

    it('should have valid email format for REPLY_TO_EMAIL', () => {
      jest.isolateModules(() => {
        const { REPLY_TO_EMAIL } = require('@/lib/resend')
        expect(REPLY_TO_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })
    })

    it('should have valid email format for APP_FROM_EMAIL', () => {
      jest.isolateModules(() => {
        const { APP_FROM_EMAIL } = require('@/lib/resend')
        expect(APP_FROM_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      })
    })
  })
})
