/**
 * Tests for voice usage utilities. Voice commands need an account, so usage
 * always comes from the server.
 */

import { getVoiceUsageThisMonth, canUseVoiceCommand } from '@/lib/utils'

global.fetch = jest.fn()

describe('Voice Usage Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockReset()
  })

  describe('getVoiceUsageThisMonth', () => {
    it('should fetch usage from the API', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 5, limit: 10 }),
      })

      const result = await getVoiceUsageThisMonth()

      expect(global.fetch).toHaveBeenCalledWith('/api/voice-usage')
      expect(result.used).toBe(5)
      expect(result.limit).toBe(10)
    })

    it('should return fallback values on API error', async () => {
      ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      const result = await getVoiceUsageThisMonth()

      expect(result.used).toBe(0)
      expect(result.limit).toBe(10)
    })

    it('should return fallback values on non-OK response', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      })

      const result = await getVoiceUsageThisMonth()

      expect(result.used).toBe(0)
      expect(result.limit).toBe(10)
    })

    it('ignores any old anonymous counter in localStorage', async () => {
      const currentMonth = new Date().toISOString().slice(0, 7)
      localStorage.setItem(`invoicecommand-voice-usage-${currentMonth}`, '2')
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 0, limit: 10 }),
      })

      const result = await getVoiceUsageThisMonth()

      expect(result.used).toBe(0)
      localStorage.clear()
    })
  })

  describe('canUseVoiceCommand', () => {
    it('should return true when under limit', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 5, limit: 10 }),
      })

      expect(await canUseVoiceCommand()).toBe(true)
    })

    it('should return false when at limit', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 10, limit: 10 }),
      })

      expect(await canUseVoiceCommand()).toBe(false)
    })

    it('should return false when over limit', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ used: 15, limit: 10 }),
      })

      expect(await canUseVoiceCommand()).toBe(false)
    })
  })
})
