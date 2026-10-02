/**
 * Tests for date validation utilities
 * Tests expiration date validation for estimates
 */

import { isValidExpirationDate, validateExpirationDate, getDefaultExpirationDate } from '@/lib/utils'

describe('Date Validation Utilities', () => {
  describe('isValidExpirationDate', () => {
    it('should return true for today', () => {
      const today = new Date().toISOString().split('T')[0]
      expect(isValidExpirationDate(today)).toBe(true)
    })

    it('should return true for future dates', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowString = tomorrow.toISOString().split('T')[0]

      expect(isValidExpirationDate(tomorrowString)).toBe(true)
    })

    it('should return false for past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split('T')[0]

      expect(isValidExpirationDate(yesterdayString)).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidExpirationDate('')).toBe(false)
    })

    it('should return false for invalid date strings', () => {
      expect(isValidExpirationDate('not-a-date')).toBe(false)
    })
  })

  describe('validateExpirationDate', () => {
    it('should return valid for today', () => {
      const today = new Date().toISOString().split('T')[0]
      const result = validateExpirationDate(today)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return valid for future dates within one year', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 30)
      const futureDateString = futureDate.toISOString().split('T')[0]

      const result = validateExpirationDate(futureDateString)

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should return error for past dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toISOString().split('T')[0]

      const result = validateExpirationDate(yesterdayString)

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Expiration date must be today or in the future')
    })

    it('should return error for empty string', () => {
      const result = validateExpirationDate('')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Expiration date is required for estimates')
    })

    it('should return error for invalid date format', () => {
      const result = validateExpirationDate('invalid-date')

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid date format')
    })

    it('should return error for dates more than one year in the future', () => {
      const farFuture = new Date()
      farFuture.setFullYear(farFuture.getFullYear() + 2)
      const farFutureString = farFuture.toISOString().split('T')[0]

      const result = validateExpirationDate(farFutureString)

      expect(result.valid).toBe(false)
      expect(result.error).toBe('Expiration date should be within one year')
    })

    it('should accept dates exactly one year from now', () => {
      const oneYearFromNow = new Date()
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      const oneYearFromNowString = oneYearFromNow.toISOString().split('T')[0]

      const result = validateExpirationDate(oneYearFromNowString)

      expect(result.valid).toBe(true)
    })
  })

  describe('getDefaultExpirationDate', () => {
    it('should return date 30 days from now by default', () => {
      const result = getDefaultExpirationDate()
      const expected = new Date()
      expected.setDate(expected.getDate() + 30)
      const expectedString = expected.toISOString().split('T')[0]

      expect(result).toBe(expectedString)
    })

    it('should return date with custom days offset', () => {
      const result = getDefaultExpirationDate(60)
      const expected = new Date()
      expected.setDate(expected.getDate() + 60)
      const expectedString = expected.toISOString().split('T')[0]

      expect(result).toBe(expectedString)
    })

    it('should return date 7 days from now', () => {
      const result = getDefaultExpirationDate(7)
      const expected = new Date()
      expected.setDate(expected.getDate() + 7)
      const expectedString = expected.toISOString().split('T')[0]

      expect(result).toBe(expectedString)
    })

    it('should return date in YYYY-MM-DD format', () => {
      const result = getDefaultExpirationDate()
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})
