import { EventsCollections, EventsCollectionsService, type GrpcConfig, type Metadata } from '@prio-grpc'
import type {
  EventCollection,
  EventCollectionFilter,
  EventCollectionWithSummary,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'
import { type Option, type PaginationInput, createPageRequest } from '@prio-grpc/utils'
import type { TPageableResponse } from '@zondax/stores'

export type CollectionInput = PaginationInput & {
  filters?: EventCollectionFilter[]
  checkEventId?: string
}

export type CollectionSortItem = Partial<import('@prio-grpc/entities/proto/api/v1/common_pb').SortingOption.AsObject>

export interface CollectionListMetadata {
  sortOptions: Option<CollectionSortItem>[]
  filterOptions: unknown
}

export const createCollectionClient = (cp: GrpcConfig): EventsCollectionsService.EventCollectionServiceClient => {
  return new EventsCollectionsService.EventCollectionServiceClient(cp.baseUrl, cp.metadata as Metadata)
}

export const getEventsCollections = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  input: CollectionInput,
  cursor?: string,
  checkEventId?: string
): Promise<TPageableResponse<EventCollectionWithSummary, CollectionListMetadata>> => {
  const request = new EventsCollections.GetEventCollectionsRequest()

  const inputWithCursor: PaginationInput = cursor ? { ...input, cursor } : input
  const pagination = createPageRequest(inputWithCursor)
  if (pagination) {
    request.setPagination(pagination)
  }

  // Set filters if present
  if (input.filters && input.filters.length > 0) {
    const filterList = input.filters.map((f) => f)
    request.setFiltersList(filterList)
  }

  if (checkEventId) {
    request.setCheckEventId(checkEventId)
  }

  const response = await client.getEventCollections(request, clientParams.metadata as Metadata)
  const collectionsList = response.getCollectionsList()
  return {
    data: collectionsList,
    cursor: response.getPageInfo()?.getNextCursor() || '',
    metadata: {
      sortOptions: [], // Add proper sort options when available
      filterOptions: {},
    },
  }
}

export const createCollection = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collection: EventCollection
): Promise<EventsCollections.CreateEventCollectionResponse> => {
  const request = new EventsCollections.CreateEventCollectionRequest()
  const collectionData = collection
  if (!collectionData) {
    throw new Error('No collection data found in EventCollection')
  }
  request.setName(collectionData.getName())
  request.setDescription(collectionData.getDescription())
  request.setVisibility(collectionData.getVisibility())

  return await client.createEventCollection(request, clientParams.metadata as Metadata)
}

/**
 * Updates an existing collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection to update
 * @param collection The collection data to update
 * @returns Promise resolving to the update operation response
 */
export const updateCollection = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string,
  collection: EventCollection
): Promise<EventsCollections.UpdateEventCollectionResponse> => {
  const request = new EventsCollections.UpdateEventCollectionRequest()
  request.setCollectionId(collectionId)
  if (collection.getName()) {
    request.setName(collection.getName())
  }

  if (collection.getDescription()) {
    request.setDescription(collection.getDescription())
  }

  if (collection.getVisibility()) {
    request.setVisibility(collection.getVisibility())
  }

  return await client.updateEventCollection(request, clientParams.metadata as Metadata)
}

/**
 * Deletes a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection to delete
 * @returns Promise resolving to the delete operation response
 */
export const deleteCollection = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string
): Promise<EventsCollections.DeleteEventCollectionResponse> => {
  const request = new EventsCollections.DeleteEventCollectionRequest()
  request.setCollectionId(collectionId)

  return await client.deleteEventCollection(request, clientParams.metadata as Metadata)
}

/**
 * Adds an event to a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection
 * @param eventId The ID of the event to add
 * @returns Promise resolving to the add operation response
 */
export const addEventToCollection = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string,
  eventId: string
): Promise<EventsCollections.AddEventsToCollectionResponse> => {
  const request = new EventsCollections.AddEventsToCollectionRequest()
  request.setCollectionId(collectionId)
  request.setEventIdsList([eventId])

  return await client.addEventsToCollection(request, clientParams.metadata as Metadata)
}

/**
 * Adds multiple events to a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection
 * @param eventIds Array of event IDs to add
 * @returns Promise resolving to the add operation response
 */
export const addEventsToCollection = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string,
  eventIds: string[]
): Promise<EventsCollections.AddEventsToCollectionResponse> => {
  const request = new EventsCollections.AddEventsToCollectionRequest()
  request.setCollectionId(collectionId)
  request.setEventIdsList(eventIds)

  return await client.addEventsToCollection(request, clientParams.metadata as Metadata)
}

/**
 * Removes events from a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection
 * @param eventIds Array of event IDs to remove
 * @returns Promise resolving to the remove operation response
 */
export const removeEventsFromCollection = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string,
  eventIds: string[]
): Promise<EventsCollections.RemoveEventsFromCollectionResponse> => {
  const request = new EventsCollections.RemoveEventsFromCollectionRequest()
  request.setCollectionId(collectionId)
  request.setEventIdsList(eventIds)

  return await client.removeEventsFromCollection(request, clientParams.metadata as Metadata)
}

/**
 * Gets permissions for a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection
 * @returns Promise resolving to the get operation response
 */
export const getCollectionPermissions = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  input: EventsCollections.GetEventCollectionPermissionsRequest
): Promise<EventsCollections.GetEventCollectionPermissionsResponse> => {
  const request = new EventsCollections.GetEventCollectionPermissionsRequest()
  if (input.getCollectionId()) {
    request.setCollectionId(input.getCollectionId())
  }

  const response = await client.getEventCollectionPermissions(request, clientParams.metadata as Metadata)
  return response
}

/**
 * Sets a permission for a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection
 * @param userName The name of the user to set the permission for
 * @param permission The permission to set
 * @returns Promise resolving to the set operation response
 */
export const setCollectionPermission = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string,
  userName: string,
  permission: number
): Promise<EventsCollections.SetEventCollectionPermissionResponse> => {
  const request = new EventsCollections.SetEventCollectionPermissionRequest()
  request.setCollectionId(collectionId)
  request.setUserName(userName)
  request.setPermission(permission)

  return await client.setEventCollectionPermission(request, clientParams.metadata as Metadata)
}

/**
 * Removes a permission for a collection
 * @param client The gRPC client
 * @param clientParams The client parameters
 * @param collectionId The ID of the collection
 * @param userName The name of the user to remove the permission for
 * @returns Promise resolving to the remove operation response
 */
export const removeCollectionPermission = async (
  client: EventsCollectionsService.EventCollectionServiceClient,
  clientParams: GrpcConfig,
  collectionId: string,
  userName: string
): Promise<EventsCollections.RemoveEventCollectionPermissionResponse> => {
  const request = new EventsCollections.RemoveEventCollectionPermissionRequest()
  request.setCollectionId(collectionId)
  request.setUserName(userName)

  return await client.removeEventCollectionPermission(request, clientParams.metadata as Metadata)
}
