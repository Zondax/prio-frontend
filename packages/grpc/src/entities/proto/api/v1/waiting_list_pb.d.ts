import * as jspb from 'google-protobuf'

import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class JoinWaitingListRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): JoinWaitingListRequest;

  getTurnstile(): string;
  setTurnstile(value: string): JoinWaitingListRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): JoinWaitingListRequest;
  hasMetadata(): boolean;
  clearMetadata(): JoinWaitingListRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinWaitingListRequest.AsObject;
  static toObject(includeInstance: boolean, msg: JoinWaitingListRequest): JoinWaitingListRequest.AsObject;
  static serializeBinaryToWriter(message: JoinWaitingListRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinWaitingListRequest;
  static deserializeBinaryFromReader(message: JoinWaitingListRequest, reader: jspb.BinaryReader): JoinWaitingListRequest;
}

export namespace JoinWaitingListRequest {
  export type AsObject = {
    email: string,
    turnstile: string,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class JoinWaitingListResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): JoinWaitingListResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): JoinWaitingListResponse.AsObject;
  static toObject(includeInstance: boolean, msg: JoinWaitingListResponse): JoinWaitingListResponse.AsObject;
  static serializeBinaryToWriter(message: JoinWaitingListResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): JoinWaitingListResponse;
  static deserializeBinaryFromReader(message: JoinWaitingListResponse, reader: jspb.BinaryReader): JoinWaitingListResponse;
}

export namespace JoinWaitingListResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class ListUsersRequest extends jspb.Message {
  getEmailFilter(): string;
  setEmailFilter(value: string): ListUsersRequest;

  getPageSize(): number;
  setPageSize(value: number): ListUsersRequest;

  getPage(): number;
  setPage(value: number): ListUsersRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): ListUsersRequest;
  hasMetadata(): boolean;
  clearMetadata(): ListUsersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUsersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListUsersRequest): ListUsersRequest.AsObject;
  static serializeBinaryToWriter(message: ListUsersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUsersRequest;
  static deserializeBinaryFromReader(message: ListUsersRequest, reader: jspb.BinaryReader): ListUsersRequest;
}

export namespace ListUsersRequest {
  export type AsObject = {
    emailFilter: string,
    pageSize: number,
    page: number,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class WaitingListUser extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): WaitingListUser;

  getJoinedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setJoinedAt(value?: google_protobuf_timestamp_pb.Timestamp): WaitingListUser;
  hasJoinedAt(): boolean;
  clearJoinedAt(): WaitingListUser;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): WaitingListUser;
  hasMetadata(): boolean;
  clearMetadata(): WaitingListUser;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WaitingListUser.AsObject;
  static toObject(includeInstance: boolean, msg: WaitingListUser): WaitingListUser.AsObject;
  static serializeBinaryToWriter(message: WaitingListUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WaitingListUser;
  static deserializeBinaryFromReader(message: WaitingListUser, reader: jspb.BinaryReader): WaitingListUser;
}

export namespace WaitingListUser {
  export type AsObject = {
    email: string,
    joinedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class ListUsersResponse extends jspb.Message {
  getUsersList(): Array<WaitingListUser>;
  setUsersList(value: Array<WaitingListUser>): ListUsersResponse;
  clearUsersList(): ListUsersResponse;
  addUsers(value?: WaitingListUser, index?: number): WaitingListUser;

  getTotalCount(): number;
  setTotalCount(value: number): ListUsersResponse;

  getTotalPages(): number;
  setTotalPages(value: number): ListUsersResponse;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): ListUsersResponse;
  hasMetadata(): boolean;
  clearMetadata(): ListUsersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListUsersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListUsersResponse): ListUsersResponse.AsObject;
  static serializeBinaryToWriter(message: ListUsersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListUsersResponse;
  static deserializeBinaryFromReader(message: ListUsersResponse, reader: jspb.BinaryReader): ListUsersResponse;
}

export namespace ListUsersResponse {
  export type AsObject = {
    usersList: Array<WaitingListUser.AsObject>,
    totalCount: number,
    totalPages: number,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

