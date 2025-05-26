import type { EventsCollections, GrpcConfig } from '@prio-grpc'
import { EventCollectionPermission } from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

export type CollectionPermissionResponse =
  | EventsCollections.SetEventCollectionPermissionResponse
  | EventsCollections.RemoveEventCollectionPermissionResponse
  | EventsCollections.GetEventCollectionPermissionsResponse

/**
 * Represents the type of operation performed on collection permissions
 */
export type PermissionOperationType = 'get' | 'set' | 'remove'

/**
 * Represents a collection permission operation with all necessary data
 */
export interface PermissionOperation {
  operation: PermissionOperationType
  collectionId: string
  userName?: string
  permission?: number
}

/**
 * Data structure for tracking collection permission operations
 */
export interface PermissionOperationData {
  /**
   * Map of optimistic operations by username
   * Key: username, Value: operation details
   */
  operations?: Map<string, PermissionOperation>

  /**
   * Current optimistic operation being performed
   */
  currentOperation?: PermissionOperation
}

/**
 * Interface for the collection permissions store
 */
export interface CollectionPermissionStore {
  /** Sets API connection parameters */
  setParams: (params: GrpcConfig) => void

  /** Gets permissions for a collection */
  getCollectionPermissions: (collectionId: string) => Promise<EventsCollections.GetEventCollectionPermissionsResponse>

  /** Sets permissions for a user on a collection */
  setCollectionPermission: (
    collectionId: string,
    userId: string,
    permission: number
  ) => Promise<EventsCollections.SetEventCollectionPermissionResponse>

  /** Removes permissions for a user on a collection */
  removeCollectionPermission: (collectionId: string, userId: string) => Promise<EventsCollections.RemoveEventCollectionPermissionResponse>

  /** Indicates if an operation is in progress */
  isProcessing: boolean

  /** Contains error information if an operation failed */
  error: string | null
}
