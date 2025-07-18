import { describe, expect, it } from 'vitest'
import { buildUrl, formatDate, formatRelativeDate, getSafeClientParams, getUtmParams, hashString, sanitizeParams } from './utils'

describe('web utils', () => {
  describe('getUtmParams', () => {
    it('should extract UTM parameters from search params', () => {
      const searchParams = {
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'summer-sale',
        utm_term: 'shoes',
        utm_content: 'banner-ad',
        other_param: 'ignored',
      }

      const result = getUtmParams(searchParams)

      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: 'summer-sale',
        utm_term: 'shoes',
        utm_content: 'banner-ad',
      })
    })

    it('should handle undefined search params', () => {
      const result = getUtmParams(undefined)
      expect(result).toEqual({})
    })

    it('should handle null search params', () => {
      const result = getUtmParams(null)
      expect(result).toEqual({})
    })

    it('should filter out array values and only include strings', () => {
      const searchParams = {
        utm_source: 'google',
        utm_medium: ['cpc', 'display'], // array value should be ignored
        utm_campaign: 'summer-sale',
        utm_term: undefined,
        utm_content: '',
      }

      const result = getUtmParams(searchParams)

      expect(result).toEqual({
        utm_source: 'google',
        utm_medium: undefined,
        utm_campaign: 'summer-sale',
        utm_term: undefined,
        utm_content: '',
      })
    })

    it('should handle partial UTM parameters', () => {
      const searchParams = {
        utm_source: 'facebook',
        utm_campaign: 'awareness',
        other_param: 'value',
      }

      const result = getUtmParams(searchParams)

      expect(result).toEqual({
        utm_source: 'facebook',
        utm_medium: undefined,
        utm_campaign: 'awareness',
        utm_term: undefined,
        utm_content: undefined,
      })
    })

    it('should handle empty search params object', () => {
      const result = getUtmParams({})
      expect(result).toEqual({
        utm_source: undefined,
        utm_medium: undefined,
        utm_campaign: undefined,
        utm_term: undefined,
        utm_content: undefined,
      })
    })
  })

  describe('buildUrl', () => {
    it('should build URL with query parameters', () => {
      const result = buildUrl('/dashboard', {
        tab: 'analytics',
        period: '30d',
      })

      expect(result).toBe('/dashboard?tab=analytics&period=30d')
    })

    it('should handle undefined parameters', () => {
      const result = buildUrl('/dashboard', {
        tab: 'analytics',
        period: undefined,
        source: 'organic',
      })

      expect(result).toBe('/dashboard?tab=analytics&source=organic')
    })

    it('should handle empty parameters object', () => {
      const result = buildUrl('/dashboard', {})
      expect(result).toBe('/dashboard')
    })

    it('should handle all undefined parameters', () => {
      const result = buildUrl('/dashboard', {
        tab: undefined,
        period: undefined,
      })

      expect(result).toBe('/dashboard')
    })

    it('should handle URL with existing path', () => {
      const result = buildUrl('/dashboard/users', {
        filter: 'active',
        sort: 'name',
      })

      expect(result).toBe('/dashboard/users?filter=active&sort=name')
    })
  })

  describe('formatDate', () => {
    it('should format date string consistently', () => {
      const dateString = '2024-01-15T14:30:00Z'
      const result = formatDate(dateString)

      // Should match format 'MMM d, HH:mm'
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{2}:\d{2}$/)
    })

    it('should handle different date formats', () => {
      const isoDate = '2024-12-25T09:15:30.000Z'
      const result = formatDate(isoDate)

      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}, \d{2}:\d{2}$/)
    })
  })

  describe('formatRelativeDate', () => {
    it('should format today dates as relative time', () => {
      const now = new Date()
      const result = formatRelativeDate(now.toISOString())

      expect(result).toMatch(/^(Just now|\d+ (seconds?|minutes?) ago)$/)
    })

    it('should format yesterday as "Yesterday"', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)

      const result = formatRelativeDate(yesterday.toISOString())
      expect(result).toBe('Yesterday')
    })

    it('should format older dates with month and day', () => {
      const oldDate = new Date()
      oldDate.setDate(oldDate.getDate() - 30)

      const result = formatRelativeDate(oldDate.toISOString())
      expect(result).toMatch(/^[A-Za-z]{3} \d{1,2}$/)
    })
  })

  describe('hashString', () => {
    it('should generate consistent hash for same input', () => {
      const input = 'test-string'
      const hash1 = hashString(input)
      const hash2 = hashString(input)

      expect(hash1).toBe(hash2)
      expect(hash1).toMatch(/^[a-f0-9]{64}$/) // SHA256 produces 64 char hex
    })

    it('should generate different hashes for different inputs', () => {
      const hash1 = hashString('string1')
      const hash2 = hashString('string2')

      expect(hash1).not.toBe(hash2)
    })

    it('should handle empty string', () => {
      const result = hashString('')
      expect(result).toBe('empty_string_key_val')
    })

    it('should handle unicode characters', () => {
      const unicodeString = '测试字符串 🚀'
      const result = hashString(unicodeString)

      expect(result).toMatch(/^[a-f0-9]{64}$/)
    })

    it('should handle long strings', () => {
      const longString = 'a'.repeat(10000)
      const result = hashString(longString)

      expect(result).toMatch(/^[a-f0-9]{64}$/)
    })
  })

  describe('sanitizeParams', () => {
    it('should remove default sensitive keys', () => {
      const params = {
        username: 'john_doe',
        password: 'secret123',
        token: 'abc123',
        secret: 'hidden',
        key: 'api_key',
        auth: 'bearer_token',
        safe_param: 'visible',
      }

      const result = sanitizeParams(params)

      expect(result).toEqual({
        username: 'john_doe',
        safe_param: 'visible',
      })
    })

    it('should remove custom sensitive keys', () => {
      const params = {
        name: 'John',
        email: 'john@example.com',
        ssn: '123-45-6789',
        creditCard: '4111-1111-1111-1111',
        phone: '555-0123',
      }

      const result = sanitizeParams(params, ['ssn', 'creditCard'])

      expect(result).toEqual({
        name: 'John',
        email: 'john@example.com',
        phone: '555-0123',
      })
    })

    it('should handle empty params object', () => {
      const result = sanitizeParams({})
      expect(result).toEqual({})
    })

    it('should handle params with no sensitive keys', () => {
      const params = {
        name: 'John',
        age: 30,
        city: 'New York',
      }

      const result = sanitizeParams(params)
      expect(result).toEqual(params)
    })

    it('should handle nested objects', () => {
      const params = {
        user: {
          name: 'John',
          password: 'secret',
        },
        config: {
          theme: 'dark',
          key: 'api_key',
        },
        metadata: 'safe',
      }

      const result = sanitizeParams(params)

      expect(result).toEqual({
        user: {
          name: 'John',
          password: 'secret', // nested password not removed by default
        },
        config: {
          theme: 'dark',
          key: 'api_key', // nested key not removed by default
        },
        metadata: 'safe',
      })
    })
  })

  describe('getSafeClientParams', () => {
    it('should extract only allowed keys', () => {
      const params = {
        theme: 'dark',
        language: 'en',
        token: 'secret123',
        userId: '456',
        internal_flag: true,
      }

      const allowedKeys = ['theme', 'language', 'userId']
      const result = getSafeClientParams(params, allowedKeys)

      expect(result).toEqual({
        theme: 'dark',
        language: 'en',
        userId: '456',
      })
    })

    it('should handle non-existent keys gracefully', () => {
      const params = {
        theme: 'dark',
        language: 'en',
      }

      const allowedKeys = ['theme', 'language', 'nonExistent']
      const result = getSafeClientParams(params, allowedKeys)

      expect(result).toEqual({
        theme: 'dark',
        language: 'en',
      })
    })

    it('should handle empty allowed keys array', () => {
      const params = {
        theme: 'dark',
        language: 'en',
        token: 'secret123',
      }

      const result = getSafeClientParams(params, [])
      expect(result).toEqual({})
    })

    it('should handle empty params object', () => {
      const allowedKeys = ['theme', 'language']
      const result = getSafeClientParams({}, allowedKeys)
      expect(result).toEqual({})
    })

    it('should preserve original data types', () => {
      const params = {
        theme: 'dark',
        count: 42,
        enabled: true,
        config: { nested: 'value' },
        tags: ['tag1', 'tag2'],
        sensitive: 'should_not_appear',
      }

      const allowedKeys = ['theme', 'count', 'enabled', 'config', 'tags']
      const result = getSafeClientParams(params, allowedKeys)

      expect(result).toEqual({
        theme: 'dark',
        count: 42,
        enabled: true,
        config: { nested: 'value' },
        tags: ['tag1', 'tag2'],
      })
    })
  })
})
