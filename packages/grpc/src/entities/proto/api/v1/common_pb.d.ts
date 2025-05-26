import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class PageRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): PageRequest;

  getCursor(): string;
  setCursor(value: string): PageRequest;

  getSortingList(): Array<SortingOption>;
  setSortingList(value: Array<SortingOption>): PageRequest;
  clearSortingList(): PageRequest;
  addSorting(value?: SortingOption, index?: number): SortingOption;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PageRequest): PageRequest.AsObject;
  static serializeBinaryToWriter(message: PageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PageRequest;
  static deserializeBinaryFromReader(message: PageRequest, reader: jspb.BinaryReader): PageRequest;
}

export namespace PageRequest {
  export type AsObject = {
    pageSize: number,
    cursor: string,
    sortingList: Array<SortingOption.AsObject>,
  }
}

export class PageResponse extends jspb.Message {
  getNextCursor(): string;
  setNextCursor(value: string): PageResponse;

  getTotalItems(): number;
  setTotalItems(value: number): PageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: PageResponse): PageResponse.AsObject;
  static serializeBinaryToWriter(message: PageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PageResponse;
  static deserializeBinaryFromReader(message: PageResponse, reader: jspb.BinaryReader): PageResponse;
}

export namespace PageResponse {
  export type AsObject = {
    nextCursor: string,
    totalItems: number,
  }
}

export class SortingOption extends jspb.Message {
  getKind(): string;
  setKind(value: string): SortingOption;

  getName(): string;
  setName(value: string): SortingOption;

  getOrderAscending(): boolean;
  setOrderAscending(value: boolean): SortingOption;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SortingOption.AsObject;
  static toObject(includeInstance: boolean, msg: SortingOption): SortingOption.AsObject;
  static serializeBinaryToWriter(message: SortingOption, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SortingOption;
  static deserializeBinaryFromReader(message: SortingOption, reader: jspb.BinaryReader): SortingOption;
}

export namespace SortingOption {
  export type AsObject = {
    kind: string,
    name: string,
    orderAscending: boolean,
  }
}

export class Coordinates extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): Coordinates;

  getLongitude(): number;
  setLongitude(value: number): Coordinates;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Coordinates.AsObject;
  static toObject(includeInstance: boolean, msg: Coordinates): Coordinates.AsObject;
  static serializeBinaryToWriter(message: Coordinates, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Coordinates;
  static deserializeBinaryFromReader(message: Coordinates, reader: jspb.BinaryReader): Coordinates;
}

export namespace Coordinates {
  export type AsObject = {
    latitude: number,
    longitude: number,
  }
}

export class Location extends jspb.Message {
  getType(): string;
  setType(value: string): Location;

  getCoordinates(): Coordinates | undefined;
  setCoordinates(value?: Coordinates): Location;
  hasCoordinates(): boolean;
  clearCoordinates(): Location;

  getName(): string;
  setName(value: string): Location;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Location.AsObject;
  static toObject(includeInstance: boolean, msg: Location): Location.AsObject;
  static serializeBinaryToWriter(message: Location, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Location;
  static deserializeBinaryFromReader(message: Location, reader: jspb.BinaryReader): Location;
}

export namespace Location {
  export type AsObject = {
    type: string,
    coordinates?: Coordinates.AsObject,
    name: string,
  }
}

export class Point extends jspb.Message {
  getLatitude(): number;
  setLatitude(value: number): Point;

  getLongitude(): number;
  setLongitude(value: number): Point;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Point.AsObject;
  static toObject(includeInstance: boolean, msg: Point): Point.AsObject;
  static serializeBinaryToWriter(message: Point, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Point;
  static deserializeBinaryFromReader(message: Point, reader: jspb.BinaryReader): Point;
}

export namespace Point {
  export type AsObject = {
    latitude: number,
    longitude: number,
  }
}

export class GeoBoundingBox extends jspb.Message {
  getTopLeft(): Point | undefined;
  setTopLeft(value?: Point): GeoBoundingBox;
  hasTopLeft(): boolean;
  clearTopLeft(): GeoBoundingBox;

  getBottomRight(): Point | undefined;
  setBottomRight(value?: Point): GeoBoundingBox;
  hasBottomRight(): boolean;
  clearBottomRight(): GeoBoundingBox;

  getName(): string;
  setName(value: string): GeoBoundingBox;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GeoBoundingBox.AsObject;
  static toObject(includeInstance: boolean, msg: GeoBoundingBox): GeoBoundingBox.AsObject;
  static serializeBinaryToWriter(message: GeoBoundingBox, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GeoBoundingBox;
  static deserializeBinaryFromReader(message: GeoBoundingBox, reader: jspb.BinaryReader): GeoBoundingBox;
}

export namespace GeoBoundingBox {
  export type AsObject = {
    topLeft?: Point.AsObject,
    bottomRight?: Point.AsObject,
    name: string,
  }
}

export class Filter extends jspb.Message {
  getKind(): FilterKind;
  setKind(value: FilterKind): Filter;

  getName(): string;
  setName(value: string): Filter;

  getDescription(): string;
  setDescription(value: string): Filter;

  getTextValue(): string;
  setTextValue(value: string): Filter;
  hasTextValue(): boolean;
  clearTextValue(): Filter;

  getDateRange(): DateRange | undefined;
  setDateRange(value?: DateRange): Filter;
  hasDateRange(): boolean;
  clearDateRange(): Filter;

  getToggleValue(): boolean;
  setToggleValue(value: boolean): Filter;
  hasToggleValue(): boolean;
  clearToggleValue(): Filter;

  getGeoBox(): GeoBoundingBox | undefined;
  setGeoBox(value?: GeoBoundingBox): Filter;
  hasGeoBox(): boolean;
  clearGeoBox(): Filter;

  getGeoPosition(): Location | undefined;
  setGeoPosition(value?: Location): Filter;
  hasGeoPosition(): boolean;
  clearGeoPosition(): Filter;

  getLocationName(): string;
  setLocationName(value: string): Filter;
  hasLocationName(): boolean;
  clearLocationName(): Filter;

  getSelectOptions(): SelectOptions | undefined;
  setSelectOptions(value?: SelectOptions): Filter;
  hasSelectOptions(): boolean;
  clearSelectOptions(): Filter;

  getEventStatus(): EventStatus;
  setEventStatus(value: EventStatus): Filter;
  hasEventStatus(): boolean;
  clearEventStatus(): Filter;

  getNlQuery(): string;
  setNlQuery(value: string): Filter;
  hasNlQuery(): boolean;
  clearNlQuery(): Filter;

  getCollectionId(): string;
  setCollectionId(value: string): Filter;
  hasCollectionId(): boolean;
  clearCollectionId(): Filter;

  getValueCase(): Filter.ValueCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Filter.AsObject;
  static toObject(includeInstance: boolean, msg: Filter): Filter.AsObject;
  static serializeBinaryToWriter(message: Filter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Filter;
  static deserializeBinaryFromReader(message: Filter, reader: jspb.BinaryReader): Filter;
}

export namespace Filter {
  export type AsObject = {
    kind: FilterKind,
    name: string,
    description: string,
    textValue?: string,
    dateRange?: DateRange.AsObject,
    toggleValue?: boolean,
    geoBox?: GeoBoundingBox.AsObject,
    geoPosition?: Location.AsObject,
    locationName?: string,
    selectOptions?: SelectOptions.AsObject,
    eventStatus?: EventStatus,
    nlQuery?: string,
    collectionId?: string,
  }

  export enum ValueCase { 
    VALUE_NOT_SET = 0,
    TEXT_VALUE = 4,
    DATE_RANGE = 5,
    TOGGLE_VALUE = 6,
    GEO_BOX = 7,
    GEO_POSITION = 8,
    LOCATION_NAME = 9,
    SELECT_OPTIONS = 10,
    EVENT_STATUS = 11,
    NL_QUERY = 12,
    COLLECTION_ID = 13,
  }
}

export class DateRange extends jspb.Message {
  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): DateRange;
  hasStartDate(): boolean;
  clearStartDate(): DateRange;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): DateRange;
  hasEndDate(): boolean;
  clearEndDate(): DateRange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DateRange.AsObject;
  static toObject(includeInstance: boolean, msg: DateRange): DateRange.AsObject;
  static serializeBinaryToWriter(message: DateRange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DateRange;
  static deserializeBinaryFromReader(message: DateRange, reader: jspb.BinaryReader): DateRange;
}

export namespace DateRange {
  export type AsObject = {
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class SelectOptions extends jspb.Message {
  getOptionsList(): Array<string>;
  setOptionsList(value: Array<string>): SelectOptions;
  clearOptionsList(): SelectOptions;
  addOptions(value: string, index?: number): SelectOptions;

  getSelectedList(): Array<string>;
  setSelectedList(value: Array<string>): SelectOptions;
  clearSelectedList(): SelectOptions;
  addSelected(value: string, index?: number): SelectOptions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SelectOptions.AsObject;
  static toObject(includeInstance: boolean, msg: SelectOptions): SelectOptions.AsObject;
  static serializeBinaryToWriter(message: SelectOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SelectOptions;
  static deserializeBinaryFromReader(message: SelectOptions, reader: jspb.BinaryReader): SelectOptions;
}

export namespace SelectOptions {
  export type AsObject = {
    optionsList: Array<string>,
    selectedList: Array<string>,
  }
}

export enum Platform { 
  PLATFORM_UNSPECIFIED = 0,
  PLATFORM_IOS = 1,
  PLATFORM_ANDROID = 2,
}
export enum EventStatus { 
  EVENT_STATUS_UNSPECIFIED = 0,
  EVENT_STATUS_NONE = 1,
  EVENT_STATUS_PINNED = 2,
  EVENT_STATUS_REGISTERED = 3,
  EVENT_STATUS_APPROVED = 4,
  EVENT_STATUS_REJECTED = 5,
  EVENT_STATUS_VISITED = 6,
}
export enum FilterKind { 
  FILTER_KIND_UNSPECIFIED = 0,
  FILTER_KIND_FREE_TEXT = 1,
  FILTER_KIND_DATE_RANGE = 2,
  FILTER_KIND_TOGGLE = 3,
  FILTER_KIND_SELECT_SINGLE_OPTION = 4,
  FILTER_KIND_SELECT_MULTIPLE_OPTIONS = 5,
  FILTER_KIND_GEO_POSITION = 6,
  FILTER_KIND_GEO_BOUNDING_BOX = 7,
  FILTER_KIND_GEO_LOCATION_NAME = 8,
  FILTER_KIND_STATUS = 9,
  FILTER_KIND_NL_QUERY = 10,
  FILTER_KIND_COLLECTION_ID = 11,
}
