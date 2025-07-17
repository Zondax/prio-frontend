import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class ConversationBookmark extends jspb.Message {
  getId(): string;
  setId(value: string): ConversationBookmark;

  getUserId(): string;
  setUserId(value: string): ConversationBookmark;

  getConversationId(): string;
  setConversationId(value: string): ConversationBookmark;

  getMessageId(): string;
  setMessageId(value: string): ConversationBookmark;

  getName(): string;
  setName(value: string): ConversationBookmark;

  getDescription(): string;
  setDescription(value: string): ConversationBookmark;
  hasDescription(): boolean;
  clearDescription(): ConversationBookmark;

  getColor(): string;
  setColor(value: string): ConversationBookmark;
  hasColor(): boolean;
  clearColor(): ConversationBookmark;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): ConversationBookmark;
  clearTagsList(): ConversationBookmark;
  addTags(value: string, index?: number): ConversationBookmark;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): ConversationBookmark;
  hasMetadata(): boolean;
  clearMetadata(): ConversationBookmark;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ConversationBookmark;
  hasCreatedAt(): boolean;
  clearCreatedAt(): ConversationBookmark;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): ConversationBookmark;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): ConversationBookmark;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ConversationBookmark.AsObject;
  static toObject(includeInstance: boolean, msg: ConversationBookmark): ConversationBookmark.AsObject;
  static serializeBinaryToWriter(message: ConversationBookmark, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ConversationBookmark;
  static deserializeBinaryFromReader(message: ConversationBookmark, reader: jspb.BinaryReader): ConversationBookmark;
}

export namespace ConversationBookmark {
  export type AsObject = {
    id: string,
    userId: string,
    conversationId: string,
    messageId: string,
    name: string,
    description?: string,
    color?: string,
    tagsList: Array<string>,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 6,
  }

  export enum ColorCase { 
    _COLOR_NOT_SET = 0,
    COLOR = 7,
  }

  export enum MetadataCase { 
    _METADATA_NOT_SET = 0,
    METADATA = 9,
  }
}

export class CreateBookmarkRequest extends jspb.Message {
  getConversationId(): string;
  setConversationId(value: string): CreateBookmarkRequest;

  getMessageId(): string;
  setMessageId(value: string): CreateBookmarkRequest;

  getName(): string;
  setName(value: string): CreateBookmarkRequest;

  getDescription(): string;
  setDescription(value: string): CreateBookmarkRequest;
  hasDescription(): boolean;
  clearDescription(): CreateBookmarkRequest;

  getColor(): string;
  setColor(value: string): CreateBookmarkRequest;
  hasColor(): boolean;
  clearColor(): CreateBookmarkRequest;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): CreateBookmarkRequest;
  clearTagsList(): CreateBookmarkRequest;
  addTags(value: string, index?: number): CreateBookmarkRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateBookmarkRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateBookmarkRequest): CreateBookmarkRequest.AsObject;
  static serializeBinaryToWriter(message: CreateBookmarkRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateBookmarkRequest;
  static deserializeBinaryFromReader(message: CreateBookmarkRequest, reader: jspb.BinaryReader): CreateBookmarkRequest;
}

export namespace CreateBookmarkRequest {
  export type AsObject = {
    conversationId: string,
    messageId: string,
    name: string,
    description?: string,
    color?: string,
    tagsList: Array<string>,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 4,
  }

  export enum ColorCase { 
    _COLOR_NOT_SET = 0,
    COLOR = 5,
  }
}

export class GetBookmarkRequest extends jspb.Message {
  getBookmarkId(): string;
  setBookmarkId(value: string): GetBookmarkRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBookmarkRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBookmarkRequest): GetBookmarkRequest.AsObject;
  static serializeBinaryToWriter(message: GetBookmarkRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBookmarkRequest;
  static deserializeBinaryFromReader(message: GetBookmarkRequest, reader: jspb.BinaryReader): GetBookmarkRequest;
}

export namespace GetBookmarkRequest {
  export type AsObject = {
    bookmarkId: string,
  }
}

export class SearchBookmarksRequest extends jspb.Message {
  getConversationId(): string;
  setConversationId(value: string): SearchBookmarksRequest;
  hasConversationId(): boolean;
  clearConversationId(): SearchBookmarksRequest;

  getQuery(): string;
  setQuery(value: string): SearchBookmarksRequest;
  hasQuery(): boolean;
  clearQuery(): SearchBookmarksRequest;

  getPagination(): proto_api_v1_common_pb.PageRequest | undefined;
  setPagination(value?: proto_api_v1_common_pb.PageRequest): SearchBookmarksRequest;
  hasPagination(): boolean;
  clearPagination(): SearchBookmarksRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchBookmarksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchBookmarksRequest): SearchBookmarksRequest.AsObject;
  static serializeBinaryToWriter(message: SearchBookmarksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchBookmarksRequest;
  static deserializeBinaryFromReader(message: SearchBookmarksRequest, reader: jspb.BinaryReader): SearchBookmarksRequest;
}

export namespace SearchBookmarksRequest {
  export type AsObject = {
    conversationId?: string,
    query?: string,
    pagination?: proto_api_v1_common_pb.PageRequest.AsObject,
  }

  export enum ConversationIdCase { 
    _CONVERSATION_ID_NOT_SET = 0,
    CONVERSATION_ID = 1,
  }

  export enum QueryCase { 
    _QUERY_NOT_SET = 0,
    QUERY = 2,
  }
}

export class UpdateBookmarkRequest extends jspb.Message {
  getBookmarkId(): string;
  setBookmarkId(value: string): UpdateBookmarkRequest;

  getName(): string;
  setName(value: string): UpdateBookmarkRequest;
  hasName(): boolean;
  clearName(): UpdateBookmarkRequest;

  getDescription(): string;
  setDescription(value: string): UpdateBookmarkRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateBookmarkRequest;

  getColor(): string;
  setColor(value: string): UpdateBookmarkRequest;
  hasColor(): boolean;
  clearColor(): UpdateBookmarkRequest;

  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): UpdateBookmarkRequest;
  clearTagsList(): UpdateBookmarkRequest;
  addTags(value: string, index?: number): UpdateBookmarkRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateBookmarkRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateBookmarkRequest): UpdateBookmarkRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateBookmarkRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateBookmarkRequest;
  static deserializeBinaryFromReader(message: UpdateBookmarkRequest, reader: jspb.BinaryReader): UpdateBookmarkRequest;
}

export namespace UpdateBookmarkRequest {
  export type AsObject = {
    bookmarkId: string,
    name?: string,
    description?: string,
    color?: string,
    tagsList: Array<string>,
  }

  export enum NameCase { 
    _NAME_NOT_SET = 0,
    NAME = 2,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 3,
  }

  export enum ColorCase { 
    _COLOR_NOT_SET = 0,
    COLOR = 4,
  }
}

export class DeleteBookmarkRequest extends jspb.Message {
  getBookmarkId(): string;
  setBookmarkId(value: string): DeleteBookmarkRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteBookmarkRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteBookmarkRequest): DeleteBookmarkRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteBookmarkRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteBookmarkRequest;
  static deserializeBinaryFromReader(message: DeleteBookmarkRequest, reader: jspb.BinaryReader): DeleteBookmarkRequest;
}

export namespace DeleteBookmarkRequest {
  export type AsObject = {
    bookmarkId: string,
  }
}

export class SearchBookmarksResponse extends jspb.Message {
  getBookmarksList(): Array<ConversationBookmark>;
  setBookmarksList(value: Array<ConversationBookmark>): SearchBookmarksResponse;
  clearBookmarksList(): SearchBookmarksResponse;
  addBookmarks(value?: ConversationBookmark, index?: number): ConversationBookmark;

  getPagination(): proto_api_v1_common_pb.PageResponse | undefined;
  setPagination(value?: proto_api_v1_common_pb.PageResponse): SearchBookmarksResponse;
  hasPagination(): boolean;
  clearPagination(): SearchBookmarksResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchBookmarksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchBookmarksResponse): SearchBookmarksResponse.AsObject;
  static serializeBinaryToWriter(message: SearchBookmarksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchBookmarksResponse;
  static deserializeBinaryFromReader(message: SearchBookmarksResponse, reader: jspb.BinaryReader): SearchBookmarksResponse;
}

export namespace SearchBookmarksResponse {
  export type AsObject = {
    bookmarksList: Array<ConversationBookmark.AsObject>,
    pagination?: proto_api_v1_common_pb.PageResponse.AsObject,
  }
}

