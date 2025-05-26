import { describe, expect, it } from 'vitest'

import { TransportMode } from './constants'

describe('Constants', () => {
  describe('TransportMode', () => {
    it('should define the correct transport modes', () => {
      expect(TransportMode.FOOT).toBe('foot')
      expect(TransportMode.BIKE).toBe('bike')
      expect(TransportMode.CAR).toBe('car')
    })

    it('should have exactly three transport modes', () => {
      const values = Object.values(TransportMode).filter((value) => typeof value === 'string')
      expect(values.length).toBe(3)
    })

    it('should have unique values', () => {
      const values = Object.values(TransportMode).filter((v) => typeof v === 'string')
      const uniqueValues = [...new Set(values)]
      expect(values.length).toBe(uniqueValues.length)
    })
  })
})
