import { EventsCollectionsService, type GrpcConfig, type Metadata } from '@prio-grpc'

/**
 * Creates a client for the EventsCollections service
 * @param cp GrpcConfig configuration
 * @returns EventCollectionServiceClient instance
 */
export const createEventsCollectionsClient = (cp: GrpcConfig): EventsCollectionsService.EventCollectionServiceClient => {
  return new EventsCollectionsService.EventCollectionServiceClient(cp.baseUrl, cp.metadata as Metadata)
}
