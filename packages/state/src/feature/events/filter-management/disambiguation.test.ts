import { Filter, FilterKind } from '@prio-grpc/entities/proto/api/v1/common_pb'
import { AmbiguousFilterGroup } from '@prio-grpc/entities/proto/api/v1/event_pb'
import { describe, expect, it } from 'vitest'

import {
  AmbiguousEntity,
  convertToAmbiguousEntity,
  findNextUnprocessedFilterGroup,
  getAmbiguousFilterKey,
  mapFilterKindToEntityType,
} from './disambiguation'

describe('mapFilterKindToEntityType', () => {
  it('should map FilterKind.FILTER_KIND_FREE_TEXT to category', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_FREE_TEXT)).toBe('category')
  })

  it('should map FilterKind.FILTER_KIND_DATE_RANGE to date', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_DATE_RANGE)).toBe('date')
  })

  it('should map FilterKind.FILTER_KIND_GEO_LOCATION_NAME to location', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)).toBe('location')
  })

  it('should map FilterKind.FILTER_KIND_SELECT_SINGLE_OPTION to category', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_SELECT_SINGLE_OPTION)).toBe('category')
  })

  it('should map FilterKind.FILTER_KIND_SELECT_MULTIPLE_OPTIONS to category', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_SELECT_MULTIPLE_OPTIONS)).toBe('category')
  })

  it('should map FilterKind.FILTER_KIND_GEO_POSITION to location', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_GEO_POSITION)).toBe('location')
  })

  it('should map FilterKind.FILTER_KIND_GEO_BOUNDING_BOX to location', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_GEO_BOUNDING_BOX)).toBe('location')
  })

  it('should map FilterKind.FILTER_KIND_STATUS to category', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_STATUS)).toBe('category')
  })

  it('should map FilterKind.FILTER_KIND_NL_QUERY to other', () => {
    expect(mapFilterKindToEntityType(FilterKind.FILTER_KIND_NL_QUERY)).toBe('other')
  })

  it('should map unknown FilterKind to other', () => {
    // Use a value that doesn't correspond to any valid FilterKind
    expect(mapFilterKindToEntityType(999)).toBe('other')
  })

  it('should handle number input for FilterKind', () => {
    // Test with number equivalents of FilterKind enum values
    expect(mapFilterKindToEntityType(Number(FilterKind.FILTER_KIND_GEO_LOCATION_NAME))).toBe('location')
  })
})

describe('getAmbiguousFilterKey', () => {
  it('should create a key combining kind and name', () => {
    const group = new AmbiguousFilterGroup()
    group.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    group.setName('san francisco')

    expect(getAmbiguousFilterKey(group)).toBe(`${FilterKind.FILTER_KIND_GEO_LOCATION_NAME}_san francisco`)
  })

  it('should handle different kinds of filters', () => {
    // Test with date filter
    const dateGroup = new AmbiguousFilterGroup()
    dateGroup.setKind(FilterKind.FILTER_KIND_DATE_RANGE)
    dateGroup.setName('next weekend')

    expect(getAmbiguousFilterKey(dateGroup)).toBe(`${FilterKind.FILTER_KIND_DATE_RANGE}_next weekend`)

    // Test with category filter
    const categoryGroup = new AmbiguousFilterGroup()
    categoryGroup.setKind(FilterKind.FILTER_KIND_FREE_TEXT)
    categoryGroup.setName('music')

    expect(getAmbiguousFilterKey(categoryGroup)).toBe(`${FilterKind.FILTER_KIND_FREE_TEXT}_music`)
  })
})

describe('convertToAmbiguousEntity', () => {
  it('should convert AmbiguousFilterGroup to AmbiguousEntity', () => {
    // Create a test group
    const group = new AmbiguousFilterGroup()
    group.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    group.setName('cities')

    // Create options
    const option1 = new Filter()
    option1.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    option1.setName('San Francisco')
    option1.setDescription('City in California')
    option1.setTextValue('SF')

    const option2 = new Filter()
    option2.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    option2.setName('New York')
    option2.setDescription('City in New York State')

    group.addOptions(option1)
    group.addOptions(option2)

    // Convert to entity
    const entity = convertToAmbiguousEntity(group)

    // Verify the result
    expect(entity.type).toBe('location')
    expect(entity.value).toBe('cities')
    expect(entity.options.length).toBe(2)

    // Check first option
    expect(entity.options[0].label).toBe('San Francisco')
    expect(entity.options[0].description).toBe('City in California')
    expect(entity.options[0].meta).toBe('SF')
    expect(entity.options[0].originalFilter).toBe(option1)

    // Check second option
    expect(entity.options[1].label).toBe('New York')
    expect(entity.options[1].description).toBe('City in New York State')
    expect(entity.options[1].meta).toBeUndefined()
    expect(entity.options[1].originalFilter).toBe(option2)
  })

  it('should generate unique IDs for options', () => {
    // Create a test group with options that have the same name
    const group = new AmbiguousFilterGroup()
    group.setKind(FilterKind.FILTER_KIND_SELECT_SINGLE_OPTION)
    group.setName('choices')

    // Create options with same name
    const option1 = new Filter()
    option1.setKind(FilterKind.FILTER_KIND_SELECT_SINGLE_OPTION)
    option1.setName('Option A')

    const option2 = new Filter()
    option2.setKind(FilterKind.FILTER_KIND_SELECT_SINGLE_OPTION)
    option2.setName('Option A')

    group.addOptions(option1)
    group.addOptions(option2)

    // Convert to entity
    const entity = convertToAmbiguousEntity(group)

    // Verify the IDs are different
    expect(entity.options[0].id).not.toEqual(entity.options[1].id)
    // Verify the IDs include the index
    expect(entity.options[0].id).toContain('0:')
    expect(entity.options[1].id).toContain('1:')
  })

  it('should correctly map filter kind to entity type', () => {
    // Test with different filter kinds to ensure proper mapping

    // Test with date filter
    const dateGroup = new AmbiguousFilterGroup()
    dateGroup.setKind(FilterKind.FILTER_KIND_DATE_RANGE)
    dateGroup.setName('date')

    const dateEntity = convertToAmbiguousEntity(dateGroup)
    expect(dateEntity.type).toBe('date')

    // Test with category filter
    const categoryGroup = new AmbiguousFilterGroup()
    categoryGroup.setKind(FilterKind.FILTER_KIND_FREE_TEXT)
    categoryGroup.setName('category')

    const categoryEntity = convertToAmbiguousEntity(categoryGroup)
    expect(categoryEntity.type).toBe('category')
  })
})

describe('findNextUnprocessedFilterGroup', () => {
  it('should find the first unprocessed filter group', () => {
    // Create test groups
    const group1 = new AmbiguousFilterGroup()
    group1.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    group1.setName('location1')

    const group2 = new AmbiguousFilterGroup()
    group2.setKind(FilterKind.FILTER_KIND_DATE_RANGE)
    group2.setName('date1')

    const group3 = new AmbiguousFilterGroup()
    group3.setKind(FilterKind.FILTER_KIND_FREE_TEXT)
    group3.setName('category1')

    // Create processed keys set with the first group already processed
    const processedKeys = new Set([getAmbiguousFilterKey(group1)])

    // Find next unprocessed group
    const result = findNextUnprocessedFilterGroup([group1, group2, group3], processedKeys)

    // Should return the second group
    expect(result).toBe(group2)
  })

  it('should return undefined when all groups are processed', () => {
    // Create test groups
    const group1 = new AmbiguousFilterGroup()
    group1.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    group1.setName('location1')

    const group2 = new AmbiguousFilterGroup()
    group2.setKind(FilterKind.FILTER_KIND_DATE_RANGE)
    group2.setName('date1')

    // Create processed keys set with all groups already processed
    const processedKeys = new Set([getAmbiguousFilterKey(group1), getAmbiguousFilterKey(group2)])

    // Find next unprocessed group
    const result = findNextUnprocessedFilterGroup([group1, group2], processedKeys)

    // Should return undefined
    expect(result).toBeUndefined()
  })

  it('should return the first group when no groups are processed', () => {
    // Create test groups
    const group1 = new AmbiguousFilterGroup()
    group1.setKind(FilterKind.FILTER_KIND_GEO_LOCATION_NAME)
    group1.setName('location1')

    const group2 = new AmbiguousFilterGroup()
    group2.setKind(FilterKind.FILTER_KIND_DATE_RANGE)
    group2.setName('date1')

    // Create empty processed keys set
    const processedKeys = new Set<string>()

    // Find next unprocessed group
    const result = findNextUnprocessedFilterGroup([group1, group2], processedKeys)

    // Should return the first group
    expect(result).toBe(group1)
  })

  it('should handle empty groups array', () => {
    // Create empty processed keys set
    const processedKeys = new Set<string>()

    // Find next unprocessed group with empty array
    const result = findNextUnprocessedFilterGroup([], processedKeys)

    // Should return undefined
    expect(result).toBeUndefined()
  })
})
