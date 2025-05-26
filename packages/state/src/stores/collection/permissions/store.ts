import { EventsCollections, type EventsCollectionsService, type GrpcConfig } from '@prio-grpc'
import { createGrpcOptimisticStore, createGrpcSingleMethodStore } from '@zondax/stores'
import { useCallback, useEffect, useRef } from 'react'

import {
  removeCollectionPermission as apiRemoveCollectionPermission,
  setCollectionPermission as apiSetCollectionPermission,
  getCollectionPermissions,
} from '../../../api/collection'
import { createEventsCollectionsClient } from '../client'
import type { CollectionPermissionResponse, PermissionOperation, PermissionOperationData } from './types'
import { getMergedPermissions, mergePermissionOperations } from './utils'

// TODO: Move this to state/feature
/**
 * Creates a GetEventCollectionPermissionsRequest with the specified collection ID
 * @param collectionId The ID of the collection to get permissions for
 * @returns The created request object
 */
export const createGetCollectionPermissionsRequest = (collectionId: string): EventsCollections.GetEventCollectionPermissionsRequest => {
  const request = new EventsCollections.GetEventCollectionPermissionsRequest()
  request.setCollectionId(collectionId)
  return request
}

/**
 * Creates a store for reading collection permissions
 * @returns A store with read capabilities for permissions
 */
function createPermissionReadStore() {
  return createGrpcSingleMethodStore<
    GrpcConfig,
    EventsCollectionsService.EventCollectionServiceClient,
    EventsCollections.GetEventCollectionPermissionsRequest,
    EventsCollections.GetEventCollectionPermissionsResponse
  >({
    createClient: createEventsCollectionsClient,
    method: getCollectionPermissions,
  })
}

/**
 * Creates a store for writing collection permissions
 * @returns A store with write capabilities for permissions
 */
function createPermissionWriteStore() {
  return createGrpcOptimisticStore<
    GrpcConfig,
    ReturnType<typeof createEventsCollectionsClient>,
    PermissionOperationData,
    CollectionPermissionResponse
  >({
    createClient: createEventsCollectionsClient,
    read: async () => ({
      operations: new Map<string, PermissionOperation>(),
      currentOperation: {
        operation: 'set',
        collectionId: '',
      },
    }),
    write: async (client, params, data) => {
      if (!data || !data.currentOperation) {
        throw new Error('No operation data provided')
      }

      const { operation, collectionId, userName, permission } = data.currentOperation

      switch (operation) {
        case 'set':
          if (!collectionId) {
            throw new Error('Collection ID is required for setting permissions')
          }
          if (!userName) {
            throw new Error('User name is required for setting permissions')
          }
          if (permission === undefined) {
            throw new Error('Permission level is required for setting permissions')
          }
          return apiSetCollectionPermission(client, params, collectionId, userName, permission)
        case 'remove':
          if (!collectionId) {
            throw new Error('Collection ID is required for removing permissions')
          }
          if (!userName) {
            throw new Error('User name is required for removing permissions')
          }
          return apiRemoveCollectionPermission(client, params, collectionId, userName)
        default:
          throw new Error(`Unsupported operation: ${operation}`)
      }
    },
    handlers: {
      mergeUpdate: mergePermissionOperations,
    },
  })
}

/**
 * React hook for managing collection permissions
 * @returns Object with methods and state for permission management
 */
export const useCollectionPermissionsStore = () => {
  const readStoreRef = useRef<ReturnType<typeof createPermissionReadStore> | null>(null)
  const writeStoreRef = useRef<ReturnType<typeof createPermissionWriteStore> | null>(null)

  // Ensure stores are created only once
  if (!readStoreRef.current) readStoreRef.current = createPermissionReadStore()
  if (!writeStoreRef.current) writeStoreRef.current = createPermissionWriteStore()

  const readStore = readStoreRef.current()
  const writeStore = writeStoreRef.current()

  /**
   * Sets parameters for all stores
   */
  const setParams = useCallback((params: GrpcConfig) => {
    readStore.setParams(params)
    writeStore.setParams(params)
  }, [])

  /**
   * Sets permissions for a user on a collection
   * @param collectionId The ID of the collection
   * @param userName The name of the user to set permissions for
   * @param permission The permission level to set
   * @returns Promise resolving to the permission setting response
   */
  const setCollectionPermission = useCallback((collectionId: string, userName: string, permission: number) => {
    if (!collectionId) {
      throw new Error('Collection ID is required for setting permissions')
    }
    if (!userName) {
      throw new Error('User name is required for setting permissions')
    }

    return writeStore.update?.({
      currentOperation: {
        operation: 'set',
        collectionId,
        userName,
        permission,
      },
    }) as Promise<EventsCollections.SetEventCollectionPermissionResponse>
  }, [])

  /**
   * Removes permissions for a user on a collection
   * @param collectionId The ID of the collection
   * @param userName The name of the user to remove permissions for
   * @returns Promise resolving to the permission removal response
   */
  const removeCollectionPermission = useCallback((collectionId: string, userName: string) => {
    if (!collectionId) {
      throw new Error('Collection ID is required for removing permissions')
    }
    if (!userName) {
      throw new Error('User name is required for removing permissions')
    }

    return writeStore.update?.({
      currentOperation: {
        operation: 'remove',
        collectionId,
        userName,
      },
    }) as Promise<EventsCollections.RemoveEventCollectionPermissionResponse>
  }, [])

  /**
   * Returns permissions by combining backend data and optimistic updates
   */
  const getData = () => {
    const readData = readStore.data
    if (!readData) return readData

    const writeData = writeStore.getData()
    return getMergedPermissions(readData, writeData)
  }

  return {
    setParams,
    setInput: readStore.setInput,
    setCollectionPermission,
    removeCollectionPermission,
    isLoading: readStore.isLoading,
    error: readStore.error || writeStore.error,
    data: getData(),
  }
}
