import type { EventsCollections, GrpcConfig } from '@prio-grpc'
import type { EventCollection, EventCollectionWithSummary } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

import type { CollectionInput, CollectionListMetadata } from '../../api/collection'

export {
  EventCollection,
  EventCollectionVisibilityType,
  EventCollectionPermission,
  EventCollectionWithSummary,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

/**
 * Represents the type of operation performed on a collection
 * - 'create': Creating a new collection
 * - 'update': Modifying an existing collection's properties
 * - 'delete': Removing a collection
 * - 'add_event': Adding an event to a collection
 * - 'remove_event': Removing an event from a collection
 */
export type CollectionOperationType = 'create' | 'update' | 'delete' | 'add_event' | 'remove_event'

/**
 * Represents a collection operation with all necessary data
 * @property operation - The type of operation being performed
 * @property collection - The collection entity involved in the operation
 * @property eventId - Optional event ID for event-related operations
 */
export type CollectionOperation = {
  operation: CollectionOperationType
  collection: EventCollectionWithSummary
  eventId?: string
}

/**
 * Data structure for tracking collection operations
 * Contains both the map of operations by collection ID and the current operation being executed
 * Enables optimistic UI updates while waiting for backend confirmation
 */
export interface CollectionOperationData {
  /** Map of operations keyed by collection ID (or temporary ID for new collections) */
  operations?: Map<string, CollectionOperation>
  /** The current operation being processed */
  currentOperation?: CollectionOperation
}

/**
 * Union type for all possible collection-related API responses
 * Used by the optimistic store implementation
 */
export type CollectionResponse =
  | EventsCollections.CreateEventCollectionResponse
  | EventsCollections.UpdateEventCollectionResponse
  | EventsCollections.DeleteEventCollectionResponse

/**
 * Store metrics for monitoring performance and debugging
 * Provides detailed information about store operations
 */
export type StoreMetrics = {
  /** Total number of API calls made */
  totalCallCount: number
  /** Number of fetch operations performed */
  fetchCount: number
  /** Number of store resets performed */
  resetCount: number
  /** Type of the most recent operation */
  lastCallType: 'fetch' | 'reset' | 'none'
  /** Timestamp of the most recent operation */
  lastCallTimestamp: number
  /** Average duration of API calls in milliseconds */
  averageCallDuration: number
  /** Duration of the most recent API call in milliseconds */
  lastCallDuration: number
}

/**
 * Interface for the collections store
 * Provides a unified API for both read and write operations on collections
 */
export interface CollectionStore {
  /** Retrieves collections with optimistic updates applied */
  getData: () => EventCollectionWithSummary[] | undefined
  /** Metadata from the last fetch operation, including pagination info */
  metadata: CollectionListMetadata | undefined
  /** Performance metrics for the store */
  metrics: StoreMetrics | undefined
  /** Indicates if all available data has been loaded */
  hasReachedEnd: boolean
  /** Loads the next page of collection data */
  loadNextPage: () => void
  /** Indicates if a fetch operation is in progress */
  isLoading: boolean
  /** Contains error information if a fetch operation failed */
  error: string | null
  /** Sets input parameters for filtering and sorting collections */
  setInput: (input: CollectionInput) => void
  /** Sets API connection parameters */
  setParams: (params: GrpcConfig) => void

  /** Creates a new collection with the specified name and options */
  createNewCollection: (name: string, options?: Partial<EventCollection.AsObject>) => Promise<CollectionResponse>
  /** Removes a collection by ID */
  removeCollection: (collectionId: string) => Promise<CollectionResponse>
  /** Updates an existing collection's properties */
  updateExistingCollection: (collectionId: string, data: Partial<EventCollection.AsObject>) => Promise<CollectionResponse>
  /** Adds an event to a collection */
  addEventToCollection: (collectionId: string, eventId: string) => Promise<CollectionResponse>
  /** Removes an event from a collection */
  removeEventFromCollection: (collectionId: string, eventId: string) => Promise<CollectionResponse>
  /** Indicates if a write operation is in progress */
  isWriting: boolean
}
