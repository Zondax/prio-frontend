import {
  type EventCollection,
  EventCollectionFilter,
  EventCollectionFilterType,
  type EventCollectionWithSummary,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

/**
 * Checks if an event is in a collection using the contains_event flag
 *
 * @param collectionsWithSummary Array of collections with summary
 * @param collectionId ID of the collection to check
 * @returns True if the event is in the collection, false otherwise
 */
export function isEventInCollection(collectionsWithSummary: EventCollectionWithSummary[], collectionId: string): boolean {
  const collectionWithSummary = collectionsWithSummary.find((c) => c.getCollection()?.getId() === collectionId)
  return collectionWithSummary ? collectionWithSummary.getContainsEvent() : false
}

/**
 * Checks if an event is in any collection using the contains_event flag
 *
 * @param collectionsWithSummary Array of collections with summary
 * @returns True if the event is in any collection, false otherwise
 */
export function isEventInAnyCollection(collectionsWithSummary: EventCollectionWithSummary[]): boolean {
  return collectionsWithSummary.some((collection) => collection.getContainsEvent())
}

/**
 * Filters collections based on search query
 *
 * @param collections Array of collections to filter
 * @param searchQuery Search query to filter by
 * @returns Filtered array of collections
 */
export function filterCollectionsByQuery(collections: EventCollection[], searchQuery: string): EventCollection[] {
  if (!searchQuery) return collections

  return collections.filter((collection) => collection.getName().toLowerCase().includes(searchQuery.toLowerCase()))
}

/**
 * Extracts EventCollection objects from EventCollectionWithSummary array
 *
 * @param collectionsWithSummary Array of collections with summary
 * @returns Array of EventCollection objects
 */
export function extractCollections(collectionsWithSummary: EventCollectionWithSummary[]): EventCollection[] {
  return collectionsWithSummary.map((c) => c.getCollection() ?? null).filter((c): c is EventCollection => c !== null)
}

/**
 * Builds the input for the collection search with the can_manage_events filter
 * @param eventId ID of the event to check if it is in the collections
 * @returns Object with the input configured for the store
 */
export function buildCollectionsInput(eventId: string) {
  const canManageEventsFilter = new EventCollectionFilter()
  canManageEventsFilter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_CAN_MANAGE_EVENTS)
  canManageEventsFilter.setValueBool(true)

  return {
    checkEventId: eventId,
    filters: [canManageEventsFilter],
  }
}

/**
 * Toggles an event in a collection by checking if it's already in the collection and adding/removing accordingly
 *
 * @param collectionsWithSummary Array of collections with summary
 * @param collectionId ID of the collection to toggle the event in
 * @param eventId ID of the event to toggle
 * @param addEventToCollection Function to add an event to a collection
 * @param removeEventFromCollection Function to remove an event from a collection
 * @returns Promise that resolves when the operation is complete
 */
export async function toggleEventInCollection(
  collectionsWithSummary: EventCollectionWithSummary[],
  collectionId: string,
  eventId: string,
  addEventToCollection: (collectionId: string, eventId: string) => void,
  removeEventFromCollection: (collectionId: string, eventId: string) => void
) {
  const collectionWithSummary = collectionsWithSummary.find((c) => c.getCollection()?.getId() === collectionId)

  if (collectionWithSummary?.getContainsEvent()) {
    removeEventFromCollection(collectionId, eventId)
  } else {
    addEventToCollection(collectionId, eventId)
  }
}
