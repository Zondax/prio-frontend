/**
 * @vitest-environment jsdom
 */

import { describe, expect, it } from 'vitest'

import { getGridColumnClasses, getSpacingValues } from './grid-utils'

describe('getSpacingValues', () => {
  it('should handle number input', () => {
    const result = getSpacingValues(16)
    expect(result).toEqual({ horizontalSpacing: 16, verticalSpacing: 16 })
  })

  it('should handle string input (Tailwind classes)', () => {
    const result = getSpacingValues('6')
    expect(result).toEqual({ horizontalSpacing: 24, verticalSpacing: 24 }) // 6 * 4 = 24px
  })

  it('should handle object input with x and y values', () => {
    const result = getSpacingValues({ x: 8, y: 16 })
    expect(result).toEqual({ horizontalSpacing: 8, verticalSpacing: 16 })
  })

  it('should handle object input with string values', () => {
    const result = getSpacingValues({ x: '4', y: '8' })
    expect(result).toEqual({ horizontalSpacing: 16, verticalSpacing: 32 }) // 4 * 4 = 16px, 8 * 4 = 32px
  })

  it('should handle partial object input', () => {
    const result1 = getSpacingValues({ x: 10 })
    expect(result1).toEqual({ horizontalSpacing: 10, verticalSpacing: 24 }) // Default for y

    const result2 = getSpacingValues({ y: 20 })
    expect(result2).toEqual({ horizontalSpacing: 24, verticalSpacing: 20 }) // Default for x
  })

  it('should use defaults for invalid inputs', () => {
    const result = getSpacingValues(undefined)
    expect(result).toEqual({ horizontalSpacing: 24, verticalSpacing: 24 }) // Default values
  })
})

describe('getGridColumnClasses', () => {
  it('should return correct class for a given number of columns', () => {
    expect(getGridColumnClasses(1)).toBe('grid-cols-1')
    expect(getGridColumnClasses(2)).toBe('grid-cols-2')
    expect(getGridColumnClasses(3)).toBe('grid-cols-3')
    expect(getGridColumnClasses(12)).toBe('grid-cols-12')
  })

  it('should handle zero or negative columns by defaulting to 1', () => {
    expect(getGridColumnClasses(0)).toBe('grid-cols-1')
    expect(getGridColumnClasses(-5)).toBe('grid-cols-1')
  })

  it('should handle floating point numbers by flooring and defaulting to 1 if result is < 1', () => {
    expect(getGridColumnClasses(3.7)).toBe('grid-cols-3')
    expect(getGridColumnClasses(0.8)).toBe('grid-cols-1')
  })
})
