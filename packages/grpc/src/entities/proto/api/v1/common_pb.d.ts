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

export enum Platform { 
  PLATFORM_UNSPECIFIED = 0,
  PLATFORM_IOS = 1,
  PLATFORM_ANDROID = 2,
}
