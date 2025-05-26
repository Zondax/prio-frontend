import { type Common, Event, EventService, type GrpcConfig, type Metadata } from '@prio-grpc'
import type { Filter, SortingOption } from '@prio-grpc/entities/proto/api/v1/common_pb'
import type { FilterTag, GetEventMapMarkersResponse } from '@prio-grpc/entities/proto/api/v1/event_pb'
import { type Option, type PaginationInput, createPageRequest } from '@prio-grpc/utils'
import type { TPageableResponse } from '@zondax/stores'

export type EventInput = PaginationInput & {
  filters?: Filter[]
  nlSessionId?: string
}

export type EventSortItem = Partial<SortingOption.AsObject>

export type EventListMetadata = {
  sortOptions: Option<EventSortItem>[]
  filterOptions: unknown
  filterState?: Event.NLFilterState
  filterTags?: FilterTag[]
}

export type GetEventListResponse = TPageableResponse<Event.Event, EventListMetadata>

//FIXME: title, start_date => backend is atm accepting this, and ideally would be good to have the
//BE sending the sorting options through and endpoint
export enum SortKindOptions {
  TITLE = 'title',
  START_DATE = 'start_date',
}

const mockSortOptions: Option<Partial<SortingOption.AsObject>>[] = [
  {
    id: 'date-oldest',
    label: 'Date (Soon)',
    value: { kind: SortKindOptions.START_DATE, orderAscending: true },
  },
  {
    id: 'date-newest',
    label: 'Date (Future)',
    value: { kind: SortKindOptions.START_DATE, orderAscending: false },
  },
  {
    id: 'title-a-z',
    label: 'Title (A-Z)',
    value: { kind: SortKindOptions.TITLE, orderAscending: true },
  },
  {
    id: 'title-z-a',
    label: 'Title (Z-A)',
    value: { kind: SortKindOptions.TITLE, orderAscending: false },
  },
]

const mockFilterOptions: unknown[] = []

export const createEventClient = (cp: GrpcConfig): EventService.EventServiceClient => {
  return new EventService.EventServiceClient(cp.baseUrl, cp.metadata as Metadata)
}

export const getEventList = async (
  client: EventService.EventServiceClient,
  clientParams: GrpcConfig,
  input: EventInput,
  cursor?: string
): Promise<GetEventListResponse> => {
  const request = new Event.GetEventsRequest()

  // Set pagination if needed
  const inputWithCursor: PaginationInput = cursor ? { ...input, cursor } : input
  const pagination = createPageRequest(inputWithCursor)
  if (pagination) {
    request.setPagination(pagination)
  }

  if (input.filters) {
    // FIXME: check if we need to adjust
    const filterList = input.filters.map((f) => f)
    request.setFiltersList(filterList)
  }

  // Set the nlSessionId if provided
  if (input.nlSessionId) {
    request.setNlSessionId(input.nlSessionId)
  }

  try {
    const response = await client.getEvents(request, clientParams.metadata as Metadata)
    return {
      data: response.getEventsList(),
      cursor: response.getPagination()?.getNextCursor() || '',
      metadata: {
        sortOptions: mockSortOptions,
        filterOptions: mockFilterOptions,
        filterState: response.getNlFilterState(),
      },
    }
  } catch (error) {
    console.error('[API] Error getting events:', error)
    throw error
  }
}

export const getEventMapMarkers = async (
  client: EventService.EventServiceClient,
  clientParams: GrpcConfig,
  input: EventInput
): Promise<GetEventMapMarkersResponse> => {
  const request = new Event.GetEventMapMarkersRequest()

  // Add filters if they exist
  if (input.filters && input.filters.length > 0) {
    for (const filter of input.filters) {
      request.addFilters(filter)
    }
  }

  // Set the nlSessionId if provided
  if (input.nlSessionId) {
    request.setNlSessionId(input.nlSessionId)
  }

  try {
    const response = await client.getEventMapMarkers(request, clientParams.metadata as Metadata)
    return response
  } catch (error) {
    console.error('[API] Error getting event map markers:', error)
    throw error
  }
}

export const getEventById = async (
  client: EventService.EventServiceClient,
  clientParams: GrpcConfig,
  eventId: number
): Promise<Event.GetEventByIdResponse> => {
  const request = new Event.GetEventByIdRequest()
  request.setId(eventId)

  try {
    const response = await client.getEventById(request, clientParams.metadata as Metadata)
    return response
  } catch (error) {
    console.error('[API] Error getting event by ID:', error)
    throw error
  }
}

export const getEventByIdSingle = async (
  client: EventService.EventServiceClient,
  clientParams: GrpcConfig,
  eventId: number
): Promise<Event.Event | undefined> => {
  try {
    const response = await getEventById(client, clientParams, eventId)
    return response.getEvent() || undefined
  } catch (error) {
    console.error('[API] Error fetching event by ID:', error)
    throw error
  }
}

export const upsertEventState = async (
  client: EventService.EventServiceClient,
  clientParams: GrpcConfig,
  eventId: number,
  status: Common.EventStatus
): Promise<Event.UpsertEventStateResponse> => {
  const request = new Event.UpsertEventStateRequest()
  request.setId(eventId)
  request.setStatus(status)

  try {
    return await client.upsertEventState(request, clientParams.metadata as Metadata)
  } catch (error) {
    console.error('[API] Error upserting event state:', error)
    throw error
  }
}
