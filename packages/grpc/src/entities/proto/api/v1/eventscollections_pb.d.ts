import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class PaginationOptions extends jspb.Message {
  getPage(): number;
  setPage(value: number): PaginationOptions;

  getPageSize(): number;
  setPageSize(value: number): PaginationOptions;

  getSortBy(): string;
  setSortBy(value: string): PaginationOptions;

  getSortDesc(): boolean;
  setSortDesc(value: boolean): PaginationOptions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PaginationOptions.AsObject;
  static toObject(includeInstance: boolean, msg: PaginationOptions): PaginationOptions.AsObject;
  static serializeBinaryToWriter(message: PaginationOptions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PaginationOptions;
  static deserializeBinaryFromReader(message: PaginationOptions, reader: jspb.BinaryReader): PaginationOptions;
}

export namespace PaginationOptions {
  export type AsObject = {
    page: number,
    pageSize: number,
    sortBy: string,
    sortDesc: boolean,
  }
}

export class User extends jspb.Message {
  getDisplayName(): string;
  setDisplayName(value: string): User;

  getUsername(): string;
  setUsername(value: string): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    displayName: string,
    username: string,
  }
}

export class EventCollection extends jspb.Message {
  getId(): string;
  setId(value: string): EventCollection;

  getName(): string;
  setName(value: string): EventCollection;

  getDescription(): string;
  setDescription(value: string): EventCollection;

  getOwnerUserName(): string;
  setOwnerUserName(value: string): EventCollection;

  getVisibility(): EventCollectionVisibilityType;
  setVisibility(value: EventCollectionVisibilityType): EventCollection;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): EventCollection;
  hasCreatedAt(): boolean;
  clearCreatedAt(): EventCollection;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): EventCollection;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): EventCollection;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventCollection.AsObject;
  static toObject(includeInstance: boolean, msg: EventCollection): EventCollection.AsObject;
  static serializeBinaryToWriter(message: EventCollection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventCollection;
  static deserializeBinaryFromReader(message: EventCollection, reader: jspb.BinaryReader): EventCollection;
}

export namespace EventCollection {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    ownerUserName: string,
    visibility: EventCollectionVisibilityType,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class EventCollectionItem extends jspb.Message {
  getId(): string;
  setId(value: string): EventCollectionItem;

  getEventCollectionId(): string;
  setEventCollectionId(value: string): EventCollectionItem;

  getEventId(): string;
  setEventId(value: string): EventCollectionItem;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): EventCollectionItem;
  hasCreatedAt(): boolean;
  clearCreatedAt(): EventCollectionItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventCollectionItem.AsObject;
  static toObject(includeInstance: boolean, msg: EventCollectionItem): EventCollectionItem.AsObject;
  static serializeBinaryToWriter(message: EventCollectionItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventCollectionItem;
  static deserializeBinaryFromReader(message: EventCollectionItem, reader: jspb.BinaryReader): EventCollectionItem;
}

export namespace EventCollectionItem {
  export type AsObject = {
    id: string,
    eventCollectionId: string,
    eventId: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class EventCollectionPermission extends jspb.Message {
  getEventCollectionId(): string;
  setEventCollectionId(value: string): EventCollectionPermission;

  getPermission(): EventCollectionPermissionType;
  setPermission(value: EventCollectionPermissionType): EventCollectionPermission;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): EventCollectionPermission;
  hasCreatedAt(): boolean;
  clearCreatedAt(): EventCollectionPermission;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): EventCollectionPermission;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): EventCollectionPermission;

  getUser(): User | undefined;
  setUser(value?: User): EventCollectionPermission;
  hasUser(): boolean;
  clearUser(): EventCollectionPermission;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventCollectionPermission.AsObject;
  static toObject(includeInstance: boolean, msg: EventCollectionPermission): EventCollectionPermission.AsObject;
  static serializeBinaryToWriter(message: EventCollectionPermission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventCollectionPermission;
  static deserializeBinaryFromReader(message: EventCollectionPermission, reader: jspb.BinaryReader): EventCollectionPermission;
}

export namespace EventCollectionPermission {
  export type AsObject = {
    eventCollectionId: string,
    permission: EventCollectionPermissionType,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    user?: User.AsObject,
  }
}

export class EventPreview extends jspb.Message {
  getImageUrl(): string;
  setImageUrl(value: string): EventPreview;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventPreview.AsObject;
  static toObject(includeInstance: boolean, msg: EventPreview): EventPreview.AsObject;
  static serializeBinaryToWriter(message: EventPreview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventPreview;
  static deserializeBinaryFromReader(message: EventPreview, reader: jspb.BinaryReader): EventPreview;
}

export namespace EventPreview {
  export type AsObject = {
    imageUrl: string,
  }
}

export class UserPermissions extends jspb.Message {
  getCanEdit(): boolean;
  setCanEdit(value: boolean): UserPermissions;

  getCanDelete(): boolean;
  setCanDelete(value: boolean): UserPermissions;

  getCanAddEvents(): boolean;
  setCanAddEvents(value: boolean): UserPermissions;

  getCanRemoveEvents(): boolean;
  setCanRemoveEvents(value: boolean): UserPermissions;

  getCanManagePermissions(): boolean;
  setCanManagePermissions(value: boolean): UserPermissions;

  getIsOwner(): boolean;
  setIsOwner(value: boolean): UserPermissions;

  getPermissionLevel(): EventCollectionPermissionType;
  setPermissionLevel(value: EventCollectionPermissionType): UserPermissions;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserPermissions.AsObject;
  static toObject(includeInstance: boolean, msg: UserPermissions): UserPermissions.AsObject;
  static serializeBinaryToWriter(message: UserPermissions, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserPermissions;
  static deserializeBinaryFromReader(message: UserPermissions, reader: jspb.BinaryReader): UserPermissions;
}

export namespace UserPermissions {
  export type AsObject = {
    canEdit: boolean,
    canDelete: boolean,
    canAddEvents: boolean,
    canRemoveEvents: boolean,
    canManagePermissions: boolean,
    isOwner: boolean,
    permissionLevel: EventCollectionPermissionType,
  }
}

export class EventCollectionWithSummary extends jspb.Message {
  getCollection(): EventCollection | undefined;
  setCollection(value?: EventCollection): EventCollectionWithSummary;
  hasCollection(): boolean;
  clearCollection(): EventCollectionWithSummary;

  getTotalEvents(): number;
  setTotalEvents(value: number): EventCollectionWithSummary;

  getPreviewEventsList(): Array<EventPreview>;
  setPreviewEventsList(value: Array<EventPreview>): EventCollectionWithSummary;
  clearPreviewEventsList(): EventCollectionWithSummary;
  addPreviewEvents(value?: EventPreview, index?: number): EventPreview;

  getUserPermissions(): UserPermissions | undefined;
  setUserPermissions(value?: UserPermissions): EventCollectionWithSummary;
  hasUserPermissions(): boolean;
  clearUserPermissions(): EventCollectionWithSummary;

  getContainsEvent(): boolean;
  setContainsEvent(value: boolean): EventCollectionWithSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventCollectionWithSummary.AsObject;
  static toObject(includeInstance: boolean, msg: EventCollectionWithSummary): EventCollectionWithSummary.AsObject;
  static serializeBinaryToWriter(message: EventCollectionWithSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventCollectionWithSummary;
  static deserializeBinaryFromReader(message: EventCollectionWithSummary, reader: jspb.BinaryReader): EventCollectionWithSummary;
}

export namespace EventCollectionWithSummary {
  export type AsObject = {
    collection?: EventCollection.AsObject,
    totalEvents: number,
    previewEventsList: Array<EventPreview.AsObject>,
    userPermissions?: UserPermissions.AsObject,
    containsEvent: boolean,
  }
}

export class CreateEventCollectionRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateEventCollectionRequest;

  getDescription(): string;
  setDescription(value: string): CreateEventCollectionRequest;

  getVisibility(): EventCollectionVisibilityType;
  setVisibility(value: EventCollectionVisibilityType): CreateEventCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEventCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEventCollectionRequest): CreateEventCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: CreateEventCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEventCollectionRequest;
  static deserializeBinaryFromReader(message: CreateEventCollectionRequest, reader: jspb.BinaryReader): CreateEventCollectionRequest;
}

export namespace CreateEventCollectionRequest {
  export type AsObject = {
    name: string,
    description: string,
    visibility: EventCollectionVisibilityType,
  }
}

export class CreateEventCollectionResponse extends jspb.Message {
  getCollection(): EventCollectionWithSummary | undefined;
  setCollection(value?: EventCollectionWithSummary): CreateEventCollectionResponse;
  hasCollection(): boolean;
  clearCollection(): CreateEventCollectionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateEventCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateEventCollectionResponse): CreateEventCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: CreateEventCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateEventCollectionResponse;
  static deserializeBinaryFromReader(message: CreateEventCollectionResponse, reader: jspb.BinaryReader): CreateEventCollectionResponse;
}

export namespace CreateEventCollectionResponse {
  export type AsObject = {
    collection?: EventCollectionWithSummary.AsObject,
  }
}

export class GetEventCollectionsRequest extends jspb.Message {
  getFiltersList(): Array<EventCollectionFilter>;
  setFiltersList(value: Array<EventCollectionFilter>): GetEventCollectionsRequest;
  clearFiltersList(): GetEventCollectionsRequest;
  addFilters(value?: EventCollectionFilter, index?: number): EventCollectionFilter;

  getPagination(): proto_api_v1_common_pb.PageRequest | undefined;
  setPagination(value?: proto_api_v1_common_pb.PageRequest): GetEventCollectionsRequest;
  hasPagination(): boolean;
  clearPagination(): GetEventCollectionsRequest;

  getCheckEventId(): string;
  setCheckEventId(value: string): GetEventCollectionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventCollectionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventCollectionsRequest): GetEventCollectionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetEventCollectionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventCollectionsRequest;
  static deserializeBinaryFromReader(message: GetEventCollectionsRequest, reader: jspb.BinaryReader): GetEventCollectionsRequest;
}

export namespace GetEventCollectionsRequest {
  export type AsObject = {
    filtersList: Array<EventCollectionFilter.AsObject>,
    pagination?: proto_api_v1_common_pb.PageRequest.AsObject,
    checkEventId: string,
  }
}

export class EventCollectionFilter extends jspb.Message {
  getType(): EventCollectionFilterType;
  setType(value: EventCollectionFilterType): EventCollectionFilter;

  getOwnerUserName(): string;
  setOwnerUserName(value: string): EventCollectionFilter;
  hasOwnerUserName(): boolean;
  clearOwnerUserName(): EventCollectionFilter;

  getVisibility(): EventCollectionVisibilityType;
  setVisibility(value: EventCollectionVisibilityType): EventCollectionFilter;
  hasVisibility(): boolean;
  clearVisibility(): EventCollectionFilter;

  getName(): string;
  setName(value: string): EventCollectionFilter;
  hasName(): boolean;
  clearName(): EventCollectionFilter;

  getId(): string;
  setId(value: string): EventCollectionFilter;
  hasId(): boolean;
  clearId(): EventCollectionFilter;

  getMyCollections(): boolean;
  setMyCollections(value: boolean): EventCollectionFilter;
  hasMyCollections(): boolean;
  clearMyCollections(): EventCollectionFilter;

  getValueBool(): boolean;
  setValueBool(value: boolean): EventCollectionFilter;
  hasValueBool(): boolean;
  clearValueBool(): EventCollectionFilter;

  getValueCase(): EventCollectionFilter.ValueCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EventCollectionFilter.AsObject;
  static toObject(includeInstance: boolean, msg: EventCollectionFilter): EventCollectionFilter.AsObject;
  static serializeBinaryToWriter(message: EventCollectionFilter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EventCollectionFilter;
  static deserializeBinaryFromReader(message: EventCollectionFilter, reader: jspb.BinaryReader): EventCollectionFilter;
}

export namespace EventCollectionFilter {
  export type AsObject = {
    type: EventCollectionFilterType,
    ownerUserName?: string,
    visibility?: EventCollectionVisibilityType,
    name?: string,
    id?: string,
    myCollections?: boolean,
    valueBool?: boolean,
  }

  export enum ValueCase { 
    VALUE_NOT_SET = 0,
    OWNER_USER_NAME = 2,
    VISIBILITY = 3,
    NAME = 5,
    ID = 6,
    MY_COLLECTIONS = 7,
    VALUE_BOOL = 8,
  }
}

export class GetEventCollectionsResponse extends jspb.Message {
  getCollectionsList(): Array<EventCollectionWithSummary>;
  setCollectionsList(value: Array<EventCollectionWithSummary>): GetEventCollectionsResponse;
  clearCollectionsList(): GetEventCollectionsResponse;
  addCollections(value?: EventCollectionWithSummary, index?: number): EventCollectionWithSummary;

  getPageInfo(): proto_api_v1_common_pb.PageResponse | undefined;
  setPageInfo(value?: proto_api_v1_common_pb.PageResponse): GetEventCollectionsResponse;
  hasPageInfo(): boolean;
  clearPageInfo(): GetEventCollectionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventCollectionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventCollectionsResponse): GetEventCollectionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetEventCollectionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventCollectionsResponse;
  static deserializeBinaryFromReader(message: GetEventCollectionsResponse, reader: jspb.BinaryReader): GetEventCollectionsResponse;
}

export namespace GetEventCollectionsResponse {
  export type AsObject = {
    collectionsList: Array<EventCollectionWithSummary.AsObject>,
    pageInfo?: proto_api_v1_common_pb.PageResponse.AsObject,
  }
}

export class UpdateEventCollectionRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): UpdateEventCollectionRequest;

  getName(): string;
  setName(value: string): UpdateEventCollectionRequest;

  getDescription(): string;
  setDescription(value: string): UpdateEventCollectionRequest;

  getVisibility(): EventCollectionVisibilityType;
  setVisibility(value: EventCollectionVisibilityType): UpdateEventCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateEventCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateEventCollectionRequest): UpdateEventCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateEventCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateEventCollectionRequest;
  static deserializeBinaryFromReader(message: UpdateEventCollectionRequest, reader: jspb.BinaryReader): UpdateEventCollectionRequest;
}

export namespace UpdateEventCollectionRequest {
  export type AsObject = {
    collectionId: string,
    name: string,
    description: string,
    visibility: EventCollectionVisibilityType,
  }
}

export class UpdateEventCollectionResponse extends jspb.Message {
  getCollection(): EventCollection | undefined;
  setCollection(value?: EventCollection): UpdateEventCollectionResponse;
  hasCollection(): boolean;
  clearCollection(): UpdateEventCollectionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateEventCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateEventCollectionResponse): UpdateEventCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateEventCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateEventCollectionResponse;
  static deserializeBinaryFromReader(message: UpdateEventCollectionResponse, reader: jspb.BinaryReader): UpdateEventCollectionResponse;
}

export namespace UpdateEventCollectionResponse {
  export type AsObject = {
    collection?: EventCollection.AsObject,
  }
}

export class DeleteEventCollectionRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): DeleteEventCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteEventCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteEventCollectionRequest): DeleteEventCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteEventCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteEventCollectionRequest;
  static deserializeBinaryFromReader(message: DeleteEventCollectionRequest, reader: jspb.BinaryReader): DeleteEventCollectionRequest;
}

export namespace DeleteEventCollectionRequest {
  export type AsObject = {
    collectionId: string,
  }
}

export class DeleteEventCollectionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteEventCollectionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteEventCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteEventCollectionResponse): DeleteEventCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteEventCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteEventCollectionResponse;
  static deserializeBinaryFromReader(message: DeleteEventCollectionResponse, reader: jspb.BinaryReader): DeleteEventCollectionResponse;
}

export namespace DeleteEventCollectionResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class AddEventsToCollectionRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): AddEventsToCollectionRequest;

  getEventIdsList(): Array<string>;
  setEventIdsList(value: Array<string>): AddEventsToCollectionRequest;
  clearEventIdsList(): AddEventsToCollectionRequest;
  addEventIds(value: string, index?: number): AddEventsToCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddEventsToCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddEventsToCollectionRequest): AddEventsToCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: AddEventsToCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddEventsToCollectionRequest;
  static deserializeBinaryFromReader(message: AddEventsToCollectionRequest, reader: jspb.BinaryReader): AddEventsToCollectionRequest;
}

export namespace AddEventsToCollectionRequest {
  export type AsObject = {
    collectionId: string,
    eventIdsList: Array<string>,
  }
}

export class AddEventsToCollectionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): AddEventsToCollectionResponse;

  getEventsAdded(): number;
  setEventsAdded(value: number): AddEventsToCollectionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddEventsToCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddEventsToCollectionResponse): AddEventsToCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: AddEventsToCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddEventsToCollectionResponse;
  static deserializeBinaryFromReader(message: AddEventsToCollectionResponse, reader: jspb.BinaryReader): AddEventsToCollectionResponse;
}

export namespace AddEventsToCollectionResponse {
  export type AsObject = {
    success: boolean,
    eventsAdded: number,
  }
}

export class RemoveEventsFromCollectionRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): RemoveEventsFromCollectionRequest;

  getEventIdsList(): Array<string>;
  setEventIdsList(value: Array<string>): RemoveEventsFromCollectionRequest;
  clearEventIdsList(): RemoveEventsFromCollectionRequest;
  addEventIds(value: string, index?: number): RemoveEventsFromCollectionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveEventsFromCollectionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveEventsFromCollectionRequest): RemoveEventsFromCollectionRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveEventsFromCollectionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveEventsFromCollectionRequest;
  static deserializeBinaryFromReader(message: RemoveEventsFromCollectionRequest, reader: jspb.BinaryReader): RemoveEventsFromCollectionRequest;
}

export namespace RemoveEventsFromCollectionRequest {
  export type AsObject = {
    collectionId: string,
    eventIdsList: Array<string>,
  }
}

export class RemoveEventsFromCollectionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RemoveEventsFromCollectionResponse;

  getEventsRemoved(): number;
  setEventsRemoved(value: number): RemoveEventsFromCollectionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveEventsFromCollectionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveEventsFromCollectionResponse): RemoveEventsFromCollectionResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveEventsFromCollectionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveEventsFromCollectionResponse;
  static deserializeBinaryFromReader(message: RemoveEventsFromCollectionResponse, reader: jspb.BinaryReader): RemoveEventsFromCollectionResponse;
}

export namespace RemoveEventsFromCollectionResponse {
  export type AsObject = {
    success: boolean,
    eventsRemoved: number,
  }
}

export class SetEventCollectionPermissionRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): SetEventCollectionPermissionRequest;

  getUserName(): string;
  setUserName(value: string): SetEventCollectionPermissionRequest;

  getPermission(): EventCollectionPermissionType;
  setPermission(value: EventCollectionPermissionType): SetEventCollectionPermissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetEventCollectionPermissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SetEventCollectionPermissionRequest): SetEventCollectionPermissionRequest.AsObject;
  static serializeBinaryToWriter(message: SetEventCollectionPermissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetEventCollectionPermissionRequest;
  static deserializeBinaryFromReader(message: SetEventCollectionPermissionRequest, reader: jspb.BinaryReader): SetEventCollectionPermissionRequest;
}

export namespace SetEventCollectionPermissionRequest {
  export type AsObject = {
    collectionId: string,
    userName: string,
    permission: EventCollectionPermissionType,
  }
}

export class SetEventCollectionPermissionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): SetEventCollectionPermissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SetEventCollectionPermissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SetEventCollectionPermissionResponse): SetEventCollectionPermissionResponse.AsObject;
  static serializeBinaryToWriter(message: SetEventCollectionPermissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SetEventCollectionPermissionResponse;
  static deserializeBinaryFromReader(message: SetEventCollectionPermissionResponse, reader: jspb.BinaryReader): SetEventCollectionPermissionResponse;
}

export namespace SetEventCollectionPermissionResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class RemoveEventCollectionPermissionRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): RemoveEventCollectionPermissionRequest;

  getUserName(): string;
  setUserName(value: string): RemoveEventCollectionPermissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveEventCollectionPermissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveEventCollectionPermissionRequest): RemoveEventCollectionPermissionRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveEventCollectionPermissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveEventCollectionPermissionRequest;
  static deserializeBinaryFromReader(message: RemoveEventCollectionPermissionRequest, reader: jspb.BinaryReader): RemoveEventCollectionPermissionRequest;
}

export namespace RemoveEventCollectionPermissionRequest {
  export type AsObject = {
    collectionId: string,
    userName: string,
  }
}

export class RemoveEventCollectionPermissionResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): RemoveEventCollectionPermissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveEventCollectionPermissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveEventCollectionPermissionResponse): RemoveEventCollectionPermissionResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveEventCollectionPermissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveEventCollectionPermissionResponse;
  static deserializeBinaryFromReader(message: RemoveEventCollectionPermissionResponse, reader: jspb.BinaryReader): RemoveEventCollectionPermissionResponse;
}

export namespace RemoveEventCollectionPermissionResponse {
  export type AsObject = {
    success: boolean,
  }
}

export class GetEventCollectionPermissionsRequest extends jspb.Message {
  getCollectionId(): string;
  setCollectionId(value: string): GetEventCollectionPermissionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventCollectionPermissionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventCollectionPermissionsRequest): GetEventCollectionPermissionsRequest.AsObject;
  static serializeBinaryToWriter(message: GetEventCollectionPermissionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventCollectionPermissionsRequest;
  static deserializeBinaryFromReader(message: GetEventCollectionPermissionsRequest, reader: jspb.BinaryReader): GetEventCollectionPermissionsRequest;
}

export namespace GetEventCollectionPermissionsRequest {
  export type AsObject = {
    collectionId: string,
  }
}

export class GetEventCollectionPermissionsResponse extends jspb.Message {
  getOwner(): User | undefined;
  setOwner(value?: User): GetEventCollectionPermissionsResponse;
  hasOwner(): boolean;
  clearOwner(): GetEventCollectionPermissionsResponse;

  getPermissionsList(): Array<EventCollectionPermission>;
  setPermissionsList(value: Array<EventCollectionPermission>): GetEventCollectionPermissionsResponse;
  clearPermissionsList(): GetEventCollectionPermissionsResponse;
  addPermissions(value?: EventCollectionPermission, index?: number): EventCollectionPermission;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetEventCollectionPermissionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetEventCollectionPermissionsResponse): GetEventCollectionPermissionsResponse.AsObject;
  static serializeBinaryToWriter(message: GetEventCollectionPermissionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetEventCollectionPermissionsResponse;
  static deserializeBinaryFromReader(message: GetEventCollectionPermissionsResponse, reader: jspb.BinaryReader): GetEventCollectionPermissionsResponse;
}

export namespace GetEventCollectionPermissionsResponse {
  export type AsObject = {
    owner?: User.AsObject,
    permissionsList: Array<EventCollectionPermission.AsObject>,
  }
}

export enum EventCollectionVisibilityType { 
  EVENT_COLLECTION_VISIBILITY_UNSPECIFIED = 0,
  EVENT_COLLECTION_VISIBILITY_PRIVATE = 1,
  EVENT_COLLECTION_VISIBILITY_PUBLIC = 2,
}
export enum EventCollectionPermissionType { 
  EVENT_COLLECTION_PERMISSION_UNSPECIFIED = 0,
  EVENT_COLLECTION_PERMISSION_NONE = 1,
  EVENT_COLLECTION_PERMISSION_VIEW = 2,
  EVENT_COLLECTION_PERMISSION_EDIT = 3,
  EVENT_COLLECTION_PERMISSION_ADMIN = 4,
  EVENT_COLLECTION_PERMISSION_OWNER = 5,
}
export enum EventCollectionFilterType { 
  EVENT_COLLECTION_FILTER_UNSPECIFIED = 0,
  EVENT_COLLECTION_FILTER_OWNER = 1,
  EVENT_COLLECTION_FILTER_VISIBILITY = 2,
  EVENT_COLLECTION_FILTER_NAME = 3,
  EVENT_COLLECTION_FILTER_ID = 4,
  EVENT_COLLECTION_FILTER_MY_COLLECTIONS = 5,
  EVENT_COLLECTION_FILTER_SHARE_WITH_ME = 6,
  EVENT_COLLECTION_FILTER_CAN_MANAGE_EVENTS = 7,
}
