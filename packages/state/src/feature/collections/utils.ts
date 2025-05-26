import type { EventCollectionWithSummary } from '../../stores'

/**
 * Safely extracts the collection object from EventCollectionWithSummary.
 * Returns undefined if the data is not present or not in the expected format.
 *
 * @param collectionData - The collection data to extract the collection from.
 * @returns The collection object, or undefined if not found.
 */
export function extractCollection(collectionData: EventCollectionWithSummary[] | undefined): {
  collectionWithSummary: EventCollectionWithSummary | undefined
  totalEvents: number | undefined
} {
  const collectionWithSummary = collectionData?.[0]
  const totalEvents = collectionWithSummary?.getTotalEvents()
  return { collectionWithSummary, totalEvents }
}
