import { describe, expect, it } from 'vitest'

import { isTabActive } from './active-tab'

/**
 * Tests for the isTabActive function
 *
 * These tests verify that the function correctly determines if a tab is active
 * based on the current route segments.
 */
describe('isTabActive', () => {
  /**
   * Helper function to convert a path string to segments array
   * Similar to how useSegments() would return values
   */
  const pathToSegments = (path: string): string[] => {
    // Remove leading slash if present
    const normalizedPath = path.startsWith('/') ? path.substring(1) : path
    // Split by / to create segments
    return normalizedPath ? normalizedPath.split('/') : ['']
  }

  // Test cases based on the console logs
  it('should return true when tab path exactly matches joined segments', () => {
    const tabPath = '/(protected)/(tabs)/profile'
    const segments = pathToSegments('(protected)/(tabs)/profile')

    expect(isTabActive(tabPath, segments)).toBe(true)
  })

  it('should return false when tab path does not match joined segments', () => {
    const tabPath = '/(protected)/(tabs)/profile'
    const segments = pathToSegments('(protected)/(tabs)')

    expect(isTabActive(tabPath, segments)).toBe(false)
  })

  it('should return false when tab path is a subset of segments', () => {
    const tabPath = '/(protected)/(tabs)'
    const segments = pathToSegments('(protected)/(tabs)/profile')

    expect(isTabActive(tabPath, segments)).toBe(false)
  })

  it('should return true for index tab when segments match', () => {
    const tabPath = '/(protected)/(tabs)'
    const segments = pathToSegments('(protected)/(tabs)')

    expect(isTabActive(tabPath, segments)).toBe(true)
  })

  it('should handle leading slashes in tabPath correctly', () => {
    const tabPath = '/(protected)/(tabs)'
    const segments = pathToSegments('(protected)/(tabs)')

    expect(isTabActive(tabPath, segments)).toBe(true)
  })

  it('should return false for now tab when on profile page', () => {
    const tabPath = '/(protected)/(tabs)/now'
    const segments = pathToSegments('(protected)/(tabs)/profile')

    expect(isTabActive(tabPath, segments)).toBe(false)
  })

  it('should return false for agenda tab when on profile page', () => {
    const tabPath = '/(protected)/(tabs)/agenda'
    const segments = pathToSegments('(protected)/(tabs)/profile')

    expect(isTabActive(tabPath, segments)).toBe(false)
  })

  // Edge cases
  it('should handle empty segments array', () => {
    const tabPath = '/(protected)/(tabs)'

    expect(isTabActive(tabPath, [])).toBe(false)
  })

  it('should handle root path correctly', () => {
    const tabPath = '/'
    const segments = ['']

    expect(isTabActive(tabPath, segments)).toBe(true)
  })

  it('should handle empty string tabPath', () => {
    const tabPath = '/'
    const segments = ['']

    expect(isTabActive(tabPath, segments)).toBe(true)
  })

  // Comprehensive test matrix based on console logs
  it.each([
    // [tabPath, segments, expected]
    ['/(protected)/(tabs)/profile', pathToSegments('(protected)/(tabs)/profile'), true],
    ['/(protected)/(tabs)/profile', pathToSegments('(protected)/(tabs)'), false],
    ['/(protected)/(tabs)/now', pathToSegments('(protected)/(tabs)/profile'), false],
    ['/(protected)/(tabs)/now', pathToSegments('(protected)/(tabs)'), false],
    ['/(protected)/(tabs)/agenda', pathToSegments('(protected)/(tabs)/profile'), false],
    ['/(protected)/(tabs)/agenda', pathToSegments('(protected)/(tabs)'), false],
    ['/(protected)/(tabs)', pathToSegments('(protected)/(tabs)/profile'), false],
    ['/(protected)/(tabs)', pathToSegments('(protected)/(tabs)'), true],
  ])('should return correct result for tab %s with segments %s', (tabPath, segments, expected) => {
    expect(isTabActive(tabPath, segments)).toBe(expected)
  })
})
