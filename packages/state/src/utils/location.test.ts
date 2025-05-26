import { describe, expect, it } from 'vitest'

import { getGoogleMapsLink } from './location'

describe('Location Utilities', () => {
  describe('getGoogleMapsLink', () => {
    it('should create a valid Google Maps URL with simple location', () => {
      const location = 'New York'
      const link = getGoogleMapsLink(location)

      expect(link).toBe('https://www.google.com/maps?q=New York')
    })

    it('should work with addresses containing special characters', () => {
      const location = '123 Main St, Suite #456, New York, NY 10001'
      const link = getGoogleMapsLink(location)

      expect(link).toBe('https://www.google.com/maps?q=123 Main St, Suite #456, New York, NY 10001')
    })

    it('should handle empty location strings', () => {
      const location = ''
      const link = getGoogleMapsLink(location)

      expect(link).toBe('https://www.google.com/maps?q=')
    })

    it('should work with coordinate strings', () => {
      const location = '40.7128,-74.0060'
      const link = getGoogleMapsLink(location)

      expect(link).toBe('https://www.google.com/maps?q=40.7128,-74.0060')
    })
  })
})
