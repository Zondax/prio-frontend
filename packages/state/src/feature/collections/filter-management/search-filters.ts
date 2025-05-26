import {
  EventCollectionFilter,
  EventCollectionFilterType,
  type EventCollectionVisibilityType,
} from '@prio-grpc/entities/proto/api/v1/eventscollections_pb'

export type CollectionsViewFilter = 'all' | 'shared' | 'mine'

/**
 * Creates a filter for collections owned by a specific user.
 * @param ownerUserName The username of the owner
 */
export function createOwnerFilter(ownerUserName: string): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_OWNER)
  filter.setOwnerUserName(ownerUserName)
  return filter
}

/**
 * Creates a filter for collections with a specific name.
 * @param name The name of the collection
 */
export function createNameFilter(name: string): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_NAME)
  filter.setName(name)
  return filter
}

/**
 * Creates a filter for collections with a specific visibility.
 * @param visibility The visibility type (public/private)
 */
export function createVisibilityFilter(visibility: EventCollectionVisibilityType): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_VISIBILITY)
  filter.setVisibility(visibility)
  return filter
}

/**
 * Creates a filter for a specific collection ID.
 * @param id The collection ID
 */
export function createIdFilter(id: string): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_ID)
  filter.setId(id)
  return filter
}

/**
 * Creates a filter for "My Collections" (collections owned by the current user).
 */
export function createMyCollectionsFilter(): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_MY_COLLECTIONS)
  filter.setValueBool(true)
  return filter
}

/**
 * Creates a filter for collections shared with the current user.
 */
export function createSharedWithMeFilter(): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_SHARE_WITH_ME)
  filter.setValueBool(true)
  return filter
}

/**
 * Creates a filter for collections where the user can manage events.
 */
export function createCanManageEventsFilter(): EventCollectionFilter {
  const filter = new EventCollectionFilter()
  filter.setType(EventCollectionFilterType.EVENT_COLLECTION_FILTER_CAN_MANAGE_EVENTS)
  filter.setValueBool(true)
  return filter
}
