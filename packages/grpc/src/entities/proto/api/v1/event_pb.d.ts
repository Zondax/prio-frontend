import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class Date extends jspb.Message {
  getStart(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStart(value?: google_protobuf_timestamp_pb.Timestamp): Date;
  hasStart(): boolean;
  clearStart(): Date;

  getEnd(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEnd(value?: google_protobuf_timestamp_pb.Timestamp): Date;
  hasEnd(): boolean;
  clearEnd(): Date;

  getLocalTimezone(): string;
  setLocalTimezone(value: string): Date;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Date.AsObject;
  static toObject(includeInstance: boolean, msg: Date): Date.AsObject;
  static serializeBinaryToWriter(message: Date, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Date;
  static deserializeBinaryFromReader(message: Date, reader: jspb.BinaryReader): Date;
}

export namespace Date {
  export type AsObject = {
    start?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    end?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    localTimezone: string,
  }
}

export class EventSource extends jspb.Message {
  getName(): string;
  setName(value: string): EventSource;

  getBaseurl(): string;
  setBaseurl(value: string): EventSource;

  getType(): EventSourceType;
  setType(value: EventSourceType): EventSource;

  getUrl(): string;
  setUrl(value: string): EventSource;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventSource.AsObject;
  static toObject(includeInstance: boolean, msg: EventSource): EventSource.AsObject;
  static serializeBinaryToWriter(message: EventSource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventSource;
  static deserializeBinaryFromReader(message: EventSource, reader: jspb.BinaryReader): EventSource;
}

export namespace EventSource {
  export type AsObject = {
    name: string,
    baseurl: string,
    type: EventSourceType,
    url: string,
  }
}

export class Event extends jspb.Message {
  getId(): number;
  setId(value: number): Event;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Event;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Event;

  getKind(): EventKind;
  setKind(value: EventKind): Event;

  getSource(): EventSource | undefined;
  setSource(value?: EventSource): Event;
  hasSource(): boolean;
  clearSource(): Event;

  getTitle(): string;
  setTitle(value: string): Event;

  getDescription(): string;
  setDescription(value: string): Event;

  getImage(): string;
  setImage(value: string): Event;

  getDate(): Date | undefined;
  setDate(value?: Date): Event;
  hasDate(): boolean;
  clearDate(): Event;

  getLocationType(): string;
  setLocationType(value: string): Event;

  getLocation(): proto_api_v1_common_pb.Location | undefined;
  setLocation(value?: proto_api_v1_common_pb.Location): Event;
  hasLocation(): boolean;
  clearLocation(): Event;

  getStatus(): proto_api_v1_common_pb.EventStatus;
  setStatus(value: proto_api_v1_common_pb.EventStatus): Event;

  getExternalId(): string;
  setExternalId(value: string): Event;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Event.AsObject;
  static toObject(includeInstance: boolean, msg: Event): Event.AsObject;
  static serializeBinaryToWriter(message: Event, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Event;
  static deserializeBinaryFromReader(message: Event, reader: jspb.BinaryReader): Event;
}

export namespace Event {
  export type AsObject = {
    id: number,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    kind: EventKind,
    source?: EventSource.AsObject,
    title: string,
    description: string,
    image: string,
    date?: Date.AsObject,
    locationType: string,
    location?: proto_api_v1_common_pb.Location.AsObject,
    status: proto_api_v1_common_pb.EventStatus,
    externalId: string,
  }
}

export class MarkerEvent extends jspb.Message {
  getId(): number;
  setId(value: number): MarkerEvent;

  getTitle(): string;
  setTitle(value: string): MarkerEvent;

  getImage(): string;
  setImage(value: string): MarkerEvent;

  getStartDate(): string;
  setStartDate(value: string): MarkerEvent;

  getLocalTimezone(): string;
  setLocalTimezone(value: string): MarkerEvent;

  getLocationType(): string;
  setLocationType(value: string): MarkerEvent;

  getLocation(): proto_api_v1_common_pb.Location | undefined;
  setLocation(value?: proto_api_v1_common_pb.Location): MarkerEvent;
  hasLocation(): boolean;
  clearLocation(): MarkerEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkerEvent.AsObject;
  static toObject(includeInstance: boolean, msg: MarkerEvent): MarkerEvent.AsObject;
  static serializeBinaryToWriter(message: MarkerEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkerEvent;
  static deserializeBinaryFromReader(message: MarkerEvent, reader: jspb.BinaryReader): MarkerEvent;
}

export namespace MarkerEvent {
  export type AsObject = {
    id: number,
    title: string,
    image: string,
    startDate: string,
    localTimezone: string,
    locationType: string,
    location?: proto_api_v1_common_pb.Location.AsObject,
  }
}

export class MapMarker extends jspb.Message {
  getKind(): MapMarkerKind;
  setKind(value: MapMarkerKind): MapMarker;

  getCoordinates(): proto_api_v1_common_pb.Coordinates | undefined;
  setCoordinates(value?: proto_api_v1_common_pb.Coordinates): MapMarker;
  hasCoordinates(): boolean;
  clearCoordinates(): MapMarker;

  getEvent(): MarkerEvent | undefined;
  setEvent(value?: MarkerEvent): MapMarker;
  hasEvent(): boolean;
  clearEvent(): MapMarker;

  getEventGroup(): EventGroup | undefined;
  setEventGroup(value?: EventGroup): MapMarker;
  hasEventGroup(): boolean;
  clearEventGroup(): MapMarker;

  getMarkerDataCase(): MapMarker.MarkerDataCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MapMarker.AsObject;
  static toObject(includeInstance: boolean, msg: MapMarker): MapMarker.AsObject;
  static serializeBinaryToWriter(message: MapMarker, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MapMarker;
  static deserializeBinaryFromReader(message: MapMarker, reader: jspb.BinaryReader): MapMarker;
}

export namespace MapMarker {
  export type AsObject = {
    kind: MapMarkerKind,
    coordinates?: proto_api_v1_common_pb.Coordinates.AsObject,
    event?: MarkerEvent.AsObject,
    eventGroup?: EventGroup.AsObject,
  }

  export enum MarkerDataCase { 
    MARKER_DATA_NOT_SET = 0,
    EVENT = 3,
    EVENT_GROUP = 4,
  }
}

export class EventGroup extends jspb.Message {
  getEventCount(): number;
  setEventCount(value: number): EventGroup;

  getEventsIncludedList(): Array<MarkerEvent>;
  setEventsIncludedList(value: Array<MarkerEvent>): EventGroup;
  clearEventsIncludedList(): EventGroup;
  addEventsIncluded(value?: MarkerEvent, index?: number): MarkerEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventGroup.AsObject;
  static toObject(includeInstance: boolean, msg: EventGroup): EventGroup.AsObject;
  static serializeBinaryToWriter(message: EventGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventGroup;
  static deserializeBinaryFromReader(message: EventGroup, reader: jspb.BinaryReader): EventGroup;
}

export namespace EventGroup {
  export type AsObject = {
    eventCount: number,
    eventsIncludedList: Array<MarkerEvent.AsObject>,
  }
}

export class FilterTag extends jspb.Message {
  getType(): FilterTagType;
  setType(value: FilterTagType): FilterTag;

  getValue(): string;
  setValue(value: string): FilterTag;

  getDisplayText(): string;
  setDisplayText(value: string): FilterTag;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FilterTag.AsObject;
  static toObject(includeInstance: boolean, msg: FilterTag): FilterTag.AsObject;
  static serializeBinaryToWriter(message: FilterTag, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FilterTag;
  static deserializeBinaryFromReader(message: FilterTag, reader: jspb.BinaryReader): FilterTag;
}

export namespace FilterTag {
  export type AsObject = {
    type: FilterTagType,
    value: string,
    displayText: string,
  }
}

export class AmbiguousFilterGroup extends jspb.Message {
  getKind(): proto_api_v1_common_pb.FilterKind;
  setKind(value: proto_api_v1_common_pb.FilterKind): AmbiguousFilterGroup;

  getName(): string;
  setName(value: string): AmbiguousFilterGroup;

  getOptionsList(): Array<proto_api_v1_common_pb.Filter>;
  setOptionsList(value: Array<proto_api_v1_common_pb.Filter>): AmbiguousFilterGroup;
  clearOptionsList(): AmbiguousFilterGroup;
  addOptions(value?: proto_api_v1_common_pb.Filter, index?: number): proto_api_v1_common_pb.Filter;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AmbiguousFilterGroup.AsObject;
  static toObject(includeInstance: boolean, msg: AmbiguousFilterGroup): AmbiguousFilterGroup.AsObject;
  static serializeBinaryToWriter(message: AmbiguousFilterGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AmbiguousFilterGroup;
  static deserializeBinaryFromReader(message: AmbiguousFilterGroup, reader: jspb.BinaryReader): AmbiguousFilterGroup;
}

export namespace AmbiguousFilterGroup {
  export type AsObject = {
    kind: proto_api_v1_common_pb.FilterKind,
    name: string,
    optionsList: Array<proto_api_v1_common_pb.Filter.AsObject>,
  }
}

export class NLFilterState extends jspb.Message {
  getResolvedFiltersList(): Array<proto_api_v1_common_pb.Filter>;
  setResolvedFiltersList(value: Array<proto_api_v1_common_pb.Filter>): NLFilterState;
  clearResolvedFiltersList(): NLFilterState;
  addResolvedFilters(value?: proto_api_v1_common_pb.Filter, index?: number): proto_api_v1_common_pb.Filter;

  getAmbiguousFiltersList(): Array<AmbiguousFilterGroup>;
  setAmbiguousFiltersList(value: Array<AmbiguousFilterGroup>): NLFilterState;
  clearAmbiguousFiltersList(): NLFilterState;
  addAmbiguousFilters(value?: AmbiguousFilterGroup, index?: number): AmbiguousFilterGroup;

  getExtractedTagsList(): Array<FilterTag>;
  setExtractedTagsList(value: Array<FilterTag>): NLFilterState;
  clearExtractedTagsList(): NLFilterState;
  addExtractedTags(value?: FilterTag, index?: number): FilterTag;

  getSessionId(): string;
  setSessionId(value: string): NLFilterState;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NLFilterState.AsObject;
  static toObject(includeInstance: boolean, msg: NLFilterState): NLFilterState.AsObject;
  static serializeBinaryToWriter(message: NLFilterState, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NLFilterState;
  static deserializeBinaryFromReader(message: NLFilterState, reader: jspb.BinaryReader): NLFilterState;
}

export namespace NLFilterState {
  export type AsObject = {
    resolvedFiltersList: Array<proto_api_v1_common_pb.Filter.AsObject>,
    ambiguousFiltersList: Array<AmbiguousFilterGroup.AsObject>,
    extractedTagsList: Array<FilterTag.AsObject>,
    sessionId: string,
  }
}

export class GetEventsRequest extends jspb.Message {
  getFiltersList(): Array<proto_api_v1_common_pb.Filter>;
  setFiltersList(value: Array<proto_api_v1_common_pb.Filter>): GetEventsRequest;
  clearFiltersList(): GetEventsRequest;
  addFilters(value?: proto_api_v1_common_pb.Filter, index?: number): proto_api_v1_common_pb.Filter;

  getPagination(): proto_api_v1_common_pb.PageRequest | undefined;
  setPagination(value?: proto_api_v1_common_pb.PageRequest): GetEventsRequest;
  hasPagination(): boolean;
  clearPagination(): GetEventsRequest;

  getNlSessionId(): string;
  setNlSessionId(value: string): GetEventsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventsRequest): GetEventsRequest.AsObject;
  static serializeBinaryToWriter(message: GetEventsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventsRequest;
  static deserializeBinaryFromReader(message: GetEventsRequest, reader: jspb.BinaryReader): GetEventsRequest;
}

export namespace GetEventsRequest {
  export type AsObject = {
    filtersList: Array<proto_api_v1_common_pb.Filter.AsObject>,
    pagination?: proto_api_v1_common_pb.PageRequest.AsObject,
    nlSessionId: string,
  }
}

export class GetEventsResponse extends jspb.Message {
  getEventsList(): Array<Event>;
  setEventsList(value: Array<Event>): GetEventsResponse;
  clearEventsList(): GetEventsResponse;
  addEvents(value?: Event, index?: number): Event;

  getPagination(): proto_api_v1_common_pb.PageResponse | undefined;
  setPagination(value?: proto_api_v1_common_pb.PageResponse): GetEventsResponse;
  hasPagination(): boolean;
  clearPagination(): GetEventsResponse;

  getNlFilterState(): NLFilterState | undefined;
  setNlFilterState(value?: NLFilterState): GetEventsResponse;
  hasNlFilterState(): boolean;
  clearNlFilterState(): GetEventsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventsResponse): GetEventsResponse.AsObject;
  static serializeBinaryToWriter(message: GetEventsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventsResponse;
  static deserializeBinaryFromReader(message: GetEventsResponse, reader: jspb.BinaryReader): GetEventsResponse;
}

export namespace GetEventsResponse {
  export type AsObject = {
    eventsList: Array<Event.AsObject>,
    pagination?: proto_api_v1_common_pb.PageResponse.AsObject,
    nlFilterState?: NLFilterState.AsObject,
  }
}

export class GetEventByIdRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetEventByIdRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventByIdRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventByIdRequest): GetEventByIdRequest.AsObject;
  static serializeBinaryToWriter(message: GetEventByIdRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventByIdRequest;
  static deserializeBinaryFromReader(message: GetEventByIdRequest, reader: jspb.BinaryReader): GetEventByIdRequest;
}

export namespace GetEventByIdRequest {
  export type AsObject = {
    id: number,
  }
}

export class GetEventByIdResponse extends jspb.Message {
  getEvent(): Event | undefined;
  setEvent(value?: Event): GetEventByIdResponse;
  hasEvent(): boolean;
  clearEvent(): GetEventByIdResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventByIdResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventByIdResponse): GetEventByIdResponse.AsObject;
  static serializeBinaryToWriter(message: GetEventByIdResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventByIdResponse;
  static deserializeBinaryFromReader(message: GetEventByIdResponse, reader: jspb.BinaryReader): GetEventByIdResponse;
}

export namespace GetEventByIdResponse {
  export type AsObject = {
    event?: Event.AsObject,
  }
}

export class GetEventMapMarkersRequest extends jspb.Message {
  getFiltersList(): Array<proto_api_v1_common_pb.Filter>;
  setFiltersList(value: Array<proto_api_v1_common_pb.Filter>): GetEventMapMarkersRequest;
  clearFiltersList(): GetEventMapMarkersRequest;
  addFilters(value?: proto_api_v1_common_pb.Filter, index?: number): proto_api_v1_common_pb.Filter;

  getNlSessionId(): string;
  setNlSessionId(value: string): GetEventMapMarkersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventMapMarkersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventMapMarkersRequest): GetEventMapMarkersRequest.AsObject;
  static serializeBinaryToWriter(message: GetEventMapMarkersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventMapMarkersRequest;
  static deserializeBinaryFromReader(message: GetEventMapMarkersRequest, reader: jspb.BinaryReader): GetEventMapMarkersRequest;
}

export namespace GetEventMapMarkersRequest {
  export type AsObject = {
    filtersList: Array<proto_api_v1_common_pb.Filter.AsObject>,
    nlSessionId: string,
  }
}

export class GetEventMapMarkersResponse extends jspb.Message {
  getMarkersList(): Array<MapMarker>;
  setMarkersList(value: Array<MapMarker>): GetEventMapMarkersResponse;
  clearMarkersList(): GetEventMapMarkersResponse;
  addMarkers(value?: MapMarker, index?: number): MapMarker;

  getNlFilterState(): NLFilterState | undefined;
  setNlFilterState(value?: NLFilterState): GetEventMapMarkersResponse;
  hasNlFilterState(): boolean;
  clearNlFilterState(): GetEventMapMarkersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventMapMarkersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventMapMarkersResponse): GetEventMapMarkersResponse.AsObject;
  static serializeBinaryToWriter(message: GetEventMapMarkersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventMapMarkersResponse;
  static deserializeBinaryFromReader(message: GetEventMapMarkersResponse, reader: jspb.BinaryReader): GetEventMapMarkersResponse;
}

export namespace GetEventMapMarkersResponse {
  export type AsObject = {
    markersList: Array<MapMarker.AsObject>,
    nlFilterState?: NLFilterState.AsObject,
  }
}

export class UpsertEventStateRequest extends jspb.Message {
  getId(): number;
  setId(value: number): UpsertEventStateRequest;

  getStatus(): proto_api_v1_common_pb.EventStatus;
  setStatus(value: proto_api_v1_common_pb.EventStatus): UpsertEventStateRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertEventStateRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpsertEventStateRequest): UpsertEventStateRequest.AsObject;
  static serializeBinaryToWriter(message: UpsertEventStateRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpsertEventStateRequest;
  static deserializeBinaryFromReader(message: UpsertEventStateRequest, reader: jspb.BinaryReader): UpsertEventStateRequest;
}

export namespace UpsertEventStateRequest {
  export type AsObject = {
    id: number,
    status: proto_api_v1_common_pb.EventStatus,
  }
}

export class UpsertEventStateResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): UpsertEventStateResponse;

  getMessage(): string;
  setMessage(value: string): UpsertEventStateResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertEventStateResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpsertEventStateResponse): UpsertEventStateResponse.AsObject;
  static serializeBinaryToWriter(message: UpsertEventStateResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpsertEventStateResponse;
  static deserializeBinaryFromReader(message: UpsertEventStateResponse, reader: jspb.BinaryReader): UpsertEventStateResponse;
}

export namespace UpsertEventStateResponse {
  export type AsObject = {
    success: boolean,
    message: string,
  }
}

export enum EventSourceType { 
  EVENT_SOURCE_TYPE_UNSPECIFIED = 0,
  EVENT_SOURCE_TYPE_LUMA = 1,
  EVENT_SOURCE_TYPE_EVENTBRITE = 2,
  EVENT_SOURCE_TYPE_CALENDAR = 3,
}
export enum EventKind { 
  EVENT_KIND_UNSPECIFIED = 0,
  EVENT_KIND_PRIVATE = 1,
  EVENT_KIND_PUBLIC = 2,
}
export enum MapMarkerKind { 
  MAP_MARKER_KIND_UNSPECIFIED = 0,
  MAP_MARKER_KIND_EVENT_ITEM = 1,
  MAP_MARKER_KIND_EVENT_GROUPED = 2,
}
export enum FilterTagType { 
  FILTER_TAG_TYPE_UNSPECIFIED = 0,
  FILTER_TAG_TYPE_DATE = 1,
  FILTER_TAG_TYPE_TIME = 2,
  FILTER_TAG_TYPE_LOCATION = 3,
  FILTER_TAG_TYPE_CATEGORY = 4,
  FILTER_TAG_TYPE_KEYWORD = 5,
}
