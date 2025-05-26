import type { EventCollection } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

/**
 * Interface for the collection pinning state
 */
export interface CollectionPinningState {
  /**
   * List of collections
   */
  collections: EventCollection[]
  /**
   * List of collections filtered by search query
   */
  filteredCollections: EventCollection[]
  /**
   * Current search query
   */
  searchQuery: string
  /**
   * Function to set the search query
   */
  setSearchQuery: (query: string) => void
  /**
   * Function to check if an event is in a collection
   */
  isInCollection: (collectionId: string) => boolean
  /**
   * Function to check if an event is in any collection
   */
  isInAnyCollection: () => boolean

  /**
   * Function to toggle an event in a collection
   */
  toggleEventInCollection: (collectionId: string) => Promise<void>

  /**
   * Whether the create collection dialog is open
   */
  isCreateCollectionDialogOpen: boolean
  /**
   * Function to set whether the create collection dialog is open
   */
  setIsCreateCollectionDialogOpen: (isOpen: boolean) => void
}
