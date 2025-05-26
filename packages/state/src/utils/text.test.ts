import { describe, expect, it } from 'vitest'

import { formatText } from './text'

describe('Text Utilities', () => {
  describe('formatText', () => {
    it('should split a string into paragraphs', () => {
      const input = 'First paragraph\nSecond paragraph\nThird paragraph'
      const result = formatText(input)

      expect(result).toEqual(['First paragraph', 'Second paragraph', 'Third paragraph'])
    })

    it('should filter out empty lines', () => {
      const input = 'First paragraph\n\nSecond paragraph\n\n\nThird paragraph'
      const result = formatText(input)

      expect(result).toEqual(['First paragraph', 'Second paragraph', 'Third paragraph'])
    })

    it('should return an empty array for an empty string', () => {
      const input = ''
      const result = formatText(input)

      expect(result).toEqual([])
    })

    it('should return an empty array for a string with only newlines', () => {
      const input = '\n\n\n'
      const result = formatText(input)

      expect(result).toEqual([])
    })

    it('should handle strings with no newlines', () => {
      const input = 'Single paragraph with no newlines'
      const result = formatText(input)

      expect(result).toEqual(['Single paragraph with no newlines'])
    })

    it('should handle strings with leading and trailing newlines', () => {
      const input = '\nFirst paragraph\nSecond paragraph\n'
      const result = formatText(input)

      expect(result).toEqual(['First paragraph', 'Second paragraph'])
    })
  })
})
