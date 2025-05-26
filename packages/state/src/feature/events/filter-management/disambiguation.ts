import { type Filter, FilterKind } from '@prio-grpc/entities/proto/api/v1/common_pb'
import type { AmbiguousFilterGroup } from '@prio-grpc/entities/proto/api/v1/event_pb'

/**
 * Entity types for the disambiguation dialog
 */
export type EntityType =
  | 'location'
  | 'time'
  | 'date'
  | 'category'
  | 'event'
  | 'artist'
  | 'venue'
  | 'price'
  | 'transport'
  | 'accessibility'
  | 'ticket'
  | 'other'

/**
 * Represents an ambiguous entity that needs disambiguation
 */
export interface AmbiguousEntity {
  type: EntityType
  value: string
  options: AmbiguousOption[]
}

/**
 * Represents an option for the ambiguous entity
 */
export interface AmbiguousOption {
  id: string
  label: string
  description?: string
  meta?: string
  originalFilter?: Filter
}

/**
 * Maps FilterKind enum values to entity types for the disambiguation dialog
 *
 * @param filterKind The FilterKind enum value
 * @returns The entity type for the disambiguation dialog
 */
export function mapFilterKindToEntityType(filterKind: FilterKind | number): EntityType {
  // Convert to number if it's an enum
  const kind = typeof filterKind === 'number' ? filterKind : Number(filterKind)

  switch (kind) {
    case FilterKind.FILTER_KIND_FREE_TEXT:
      return 'category'
    case FilterKind.FILTER_KIND_DATE_RANGE:
      return 'date'
    case FilterKind.FILTER_KIND_GEO_LOCATION_NAME:
      return 'location'
    case FilterKind.FILTER_KIND_SELECT_SINGLE_OPTION:
    case FilterKind.FILTER_KIND_SELECT_MULTIPLE_OPTIONS:
      return 'category'
    case FilterKind.FILTER_KIND_GEO_POSITION:
      return 'location'
    case FilterKind.FILTER_KIND_GEO_BOUNDING_BOX:
      return 'location'
    case FilterKind.FILTER_KIND_STATUS:
      return 'category'
    case FilterKind.FILTER_KIND_NL_QUERY:
      return 'other'
    default:
      return 'other'
  }
}

/**
 * Creates a unique key for an ambiguous filter group to track disambiguation state
 *
 * @param group The AmbiguousFilterGroup
 * @returns A unique key combining kind and name
 */
export function getAmbiguousFilterKey(group: AmbiguousFilterGroup): string {
  return `${group.getKind()}_${group.getName()}`
}

/**
 * Converts an AmbiguousFilterGroup to an AmbiguousEntity for use in the disambiguation dialog
 *
 * @param group The AmbiguousFilterGroup from the API response
 * @returns An AmbiguousEntity for the disambiguation dialog
 */
export function convertToAmbiguousEntity(group: AmbiguousFilterGroup): AmbiguousEntity {
  return {
    type: mapFilterKindToEntityType(group.getKind()),
    value: group.getName(),
    options: group.getOptionsList().map((option, index) => {
      // Use a combination of index and option name for a unique ID
      // This ensures each option has a truly unique ID, even if they're the same type
      const uniqueId = `${index}:${option.getName()}:${option.getKind().toString()}`

      return {
        id: uniqueId,
        label: option.getName(),
        description: option.getDescription(),
        meta: option.hasTextValue() ? option.getTextValue() : undefined,
        originalFilter: option,
      }
    }),
  }
}

/**
 * Finds the next unprocessed ambiguous filter group
 *
 * @param groups The list of ambiguous filter groups from the API
 * @param processedFilterKeys The set of already processed filter keys
 * @returns The next unprocessed group or undefined if all are processed
 */
export function findNextUnprocessedFilterGroup(
  groups: AmbiguousFilterGroup[],
  processedFilterKeys: Set<string>
): AmbiguousFilterGroup | undefined {
  return groups.find((group) => !processedFilterKeys.has(getAmbiguousFilterKey(group)))
}
