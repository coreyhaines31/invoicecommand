/**
 * Tests for voice usage tracking utilities
 * Tests anonymous and authenticated user voice command limits
 */

import {
  getVoiceUsageThisMonth,
  incrementVoiceUsage,
  canUseVoiceCommand,
} from '@/lib/utils'

// Mock fetch for authenticated user API calls
global.fetch = jest.fn()

describe('Voice Usage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
    ;(global.fetch as jest.Mock).mockReset()
  })

  describe('getVoiceUsageThisMonth', () => {
    describe('Anonymous Users', () => {
      it('should return 0 used and 3 limit for new anonymous users', async () => {
        const result = await getVoiceUsageThisMonth()

        expect(result.used).toBe(0)
        expect(result.limit).toBe(3)
      })

      it('should return current usage from localStorage', async () => {
        const currentMonth = new Date().toISOString().slice(0, 7)
        localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, '2')

        const result = await getVoiceUsageThisMonth()

        expect(result.used).toBe(2)
        expect(result.limit).toBe(3)
      })

      it('should handle invalid localStorage data', async () => {
        const currentMonth = new Date().toISOString().slice(0, 7)
        localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, 'invalid')

        const result = await getVoiceUsageThisMonth()

        expect(result.used).toBe(0)
        expect(result.limit).toBe(3)
      })
    })

    describe('Authenticated Users', () => {
      it('should fetch usage from API for authenticated users', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ used: 5, limit: 10 }),
        })

        const result = await getVoiceUsageThisMonth('user-123')

        expect(global.fetch).toHaveBeenCalledWith('/api/voice-usage')
        expect(result.used).toBe(5)
        expect(result.limit).toBe(10)
      })

      it('should return fallback values on API error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

        const result = await getVoiceUsageThisMonth('user-123')

        expect(result.used).toBe(0)
        expect(result.limit).toBe(10)
      })

      it('should return fallback values on non-OK response', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        })

        const result = await getVoiceUsageThisMonth('user-123')

        expect(result.used).toBe(0)
        expect(result.limit).toBe(10)
      })
    })
  })

  describe('incrementVoiceUsage', () => {
    describe('Anonymous Users', () => {
      it('should increment usage in localStorage', async () => {
        const result = await incrementVoiceUsage()

        expect(result).toBe(true)

        const currentMonth = new Date().toISOString().slice(0, 7)
        const stored = localStorage.getItem(`invoicecommand-voice-usage-${currentMonth}`)
        expect(stored).toBe('1')
      })

      it('should increment from existing usage', async () => {
        const currentMonth = new Date().toISOString().slice(0, 7)
        localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, '1')

        const result = await incrementVoiceUsage()

        expect(result).toBe(true)
        const stored = localStorage.getItem(`invoicecommand-voice-usage-${currentMonth}`)
        expect(stored).toBe('2')
      })

      it('should return false when limit reached', async () => {
        const currentMonth = new Date().toISOString().slice(0, 7)
        localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, '3')

        const result = await incrementVoiceUsage()

        expect(result).toBe(false)
        const stored = localStorage.getItem(`invoicecommand-voice-usage-${currentMonth}`)
        expect(stored).toBe('3') // Should not increment
      })

      it('should use month-specific storage keys', async () => {
        await incrementVoiceUsage()

        const currentMonth = new Date().toISOString().slice(0, 7)
        const key = `invoicecommand-voice-usage-${currentMonth}`
        expect(localStorage.getItem(key)).toBe('1')
      })
    })

    describe('Authenticated Users', () => {
      it('should call API to increment usage', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
        })

        const result = await incrementVoiceUsage('user-123')

        expect(global.fetch).toHaveBeenCalledWith('/api/voice-usage', {
          method: 'POST',
        })
        expect(result).toBe(true)
      })

      it('should return false when limit exceeded (429 status)', async () => {
        ;(global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
          status: 429,
        })

        const result = await incrementVoiceUsage('user-123')

        expect(result).toBe(false)
      })

      it('should return false on API error', async () => {
        ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

        const result = await incrementVoiceUsage('user-123')

        expect(result).toBe(false)
      })
    })
  })

  describe('canUseVoiceCommand', () => {
    it('should return true when under limit (anonymous)', async () => {
      const result = await canUseVoiceCommand()

      expect(result).toBe(true)
    })

    it('should return false when at limit (anonymous)', async () => {
      const currentMonth = new Date().toISOString().slice(0, 7)
      localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, '3')

      const result = await canUseVoiceCommand()

      expect(result).toBe(false)
    })

    it('should return true when under limit (authenticated)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 5, limit: 10 }),
      })

      const result = await canUseVoiceCommand('user-123')

      expect(result).toBe(true)
    })

    it('should return false when at limit (authenticated)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 10, limit: 10 }),
      })

      const result = await canUseVoiceCommand('user-123')

      expect(result).toBe(false)
    })

    it('should return false when over limit (authenticated)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 15, limit: 10 }),
      })

      const result = await canUseVoiceCommand('user-123')

      expect(result).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle month transitions correctly', async () => {
      // Set usage for previous month
      const lastMonth = new Date()
      lastMonth.setMonth(lastMonth.getMonth() - 1)
      const lastMonthKey = lastMonth.toISOString().slice(0, 7)
      localStorage.setItem(`invoicecommand-voice-usage-${lastMonthKey}`, '3')

      // Current month should start fresh
      const result = await getVoiceUsageThisMonth()
      expect(result.used).toBe(0)
    })

    it('should not share usage between anonymous and authenticated', async () => {
      // Set anonymous usage
      const currentMonth = new Date().toISOString().slice(0, 7)
      localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, '2')

      // Authenticated user should fetch from API
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 0, limit: 10 }),
      })

      const result = await getVoiceUsageThisMonth('user-123')
      expect(result.used).toBe(0)
      expect(result.limit).toBe(10)
    })
  })
})
