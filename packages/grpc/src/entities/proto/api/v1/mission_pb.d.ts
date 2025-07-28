import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class Mission extends jspb.Message {
  getId(): string;
  setId(value: string): Mission;

  getName(): string;
  setName(value: string): Mission;

  getDescription(): string;
  setDescription(value: string): Mission;

  getTeamId(): string;
  setTeamId(value: string): Mission;

  getCreatorUserId(): string;
  setCreatorUserId(value: string): Mission;

  getStatus(): MissionStatus;
  setStatus(value: MissionStatus): Mission;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): Mission;
  hasStartDate(): boolean;
  clearStartDate(): Mission;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): Mission;
  hasEndDate(): boolean;
  clearEndDate(): Mission;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): Mission;
  hasMetadata(): boolean;
  clearMetadata(): Mission;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Mission;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Mission;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Mission;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Mission;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Mission.AsObject;
  static toObject(includeInstance: boolean, msg: Mission): Mission.AsObject;
  static serializeBinaryToWriter(message: Mission, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Mission;
  static deserializeBinaryFromReader(message: Mission, reader: jspb.BinaryReader): Mission;
}

export namespace Mission {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    teamId: string,
    creatorUserId: string,
    status: MissionStatus,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class MissionMember extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): MissionMember;

  getMissionId(): string;
  setMissionId(value: string): MissionMember;

  getRole(): MissionMemberRole;
  setRole(value: MissionMemberRole): MissionMember;

  getJoinedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setJoinedAt(value?: google_protobuf_timestamp_pb.Timestamp): MissionMember;
  hasJoinedAt(): boolean;
  clearJoinedAt(): MissionMember;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MissionMember.AsObject;
  static toObject(includeInstance: boolean, msg: MissionMember): MissionMember.AsObject;
  static serializeBinaryToWriter(message: MissionMember, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MissionMember;
  static deserializeBinaryFromReader(message: MissionMember, reader: jspb.BinaryReader): MissionMember;
}

export namespace MissionMember {
  export type AsObject = {
    userId: string,
    missionId: string,
    role: MissionMemberRole,
    joinedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreateMissionRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateMissionRequest;

  getDescription(): string;
  setDescription(value: string): CreateMissionRequest;

  getTeamId(): string;
  setTeamId(value: string): CreateMissionRequest;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): CreateMissionRequest;
  hasStartDate(): boolean;
  clearStartDate(): CreateMissionRequest;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): CreateMissionRequest;
  hasEndDate(): boolean;
  clearEndDate(): CreateMissionRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): CreateMissionRequest;
  hasMetadata(): boolean;
  clearMetadata(): CreateMissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateMissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateMissionRequest): CreateMissionRequest.AsObject;
  static serializeBinaryToWriter(message: CreateMissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateMissionRequest;
  static deserializeBinaryFromReader(message: CreateMissionRequest, reader: jspb.BinaryReader): CreateMissionRequest;
}

export namespace CreateMissionRequest {
  export type AsObject = {
    name: string,
    description: string,
    teamId: string,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class CreateMissionResponse extends jspb.Message {
  getMission(): Mission | undefined;
  setMission(value?: Mission): CreateMissionResponse;
  hasMission(): boolean;
  clearMission(): CreateMissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateMissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateMissionResponse): CreateMissionResponse.AsObject;
  static serializeBinaryToWriter(message: CreateMissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateMissionResponse;
  static deserializeBinaryFromReader(message: CreateMissionResponse, reader: jspb.BinaryReader): CreateMissionResponse;
}

export namespace CreateMissionResponse {
  export type AsObject = {
    mission?: Mission.AsObject,
  }
}

export class GetMissionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetMissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMissionRequest): GetMissionRequest.AsObject;
  static serializeBinaryToWriter(message: GetMissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMissionRequest;
  static deserializeBinaryFromReader(message: GetMissionRequest, reader: jspb.BinaryReader): GetMissionRequest;
}

export namespace GetMissionRequest {
  export type AsObject = {
    id: string,
  }
}

export class GetMissionResponse extends jspb.Message {
  getMission(): Mission | undefined;
  setMission(value?: Mission): GetMissionResponse;
  hasMission(): boolean;
  clearMission(): GetMissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMissionResponse): GetMissionResponse.AsObject;
  static serializeBinaryToWriter(message: GetMissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMissionResponse;
  static deserializeBinaryFromReader(message: GetMissionResponse, reader: jspb.BinaryReader): GetMissionResponse;
}

export namespace GetMissionResponse {
  export type AsObject = {
    mission?: Mission.AsObject,
  }
}

export class UpdateMissionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateMissionRequest;

  getName(): google_protobuf_wrappers_pb.StringValue | undefined;
  setName(value?: google_protobuf_wrappers_pb.StringValue): UpdateMissionRequest;
  hasName(): boolean;
  clearName(): UpdateMissionRequest;

  getDescription(): google_protobuf_wrappers_pb.StringValue | undefined;
  setDescription(value?: google_protobuf_wrappers_pb.StringValue): UpdateMissionRequest;
  hasDescription(): boolean;
  clearDescription(): UpdateMissionRequest;

  getStatus(): MissionStatus;
  setStatus(value: MissionStatus): UpdateMissionRequest;
  hasStatus(): boolean;
  clearStatus(): UpdateMissionRequest;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): UpdateMissionRequest;
  hasStartDate(): boolean;
  clearStartDate(): UpdateMissionRequest;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): UpdateMissionRequest;
  hasEndDate(): boolean;
  clearEndDate(): UpdateMissionRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): UpdateMissionRequest;
  hasMetadata(): boolean;
  clearMetadata(): UpdateMissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMissionRequest): UpdateMissionRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMissionRequest;
  static deserializeBinaryFromReader(message: UpdateMissionRequest, reader: jspb.BinaryReader): UpdateMissionRequest;
}

export namespace UpdateMissionRequest {
  export type AsObject = {
    id: string,
    name?: google_protobuf_wrappers_pb.StringValue.AsObject,
    description?: google_protobuf_wrappers_pb.StringValue.AsObject,
    status?: MissionStatus,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }

  export enum NameCase { 
    _NAME_NOT_SET = 0,
    NAME = 2,
  }

  export enum DescriptionCase { 
    _DESCRIPTION_NOT_SET = 0,
    DESCRIPTION = 3,
  }

  export enum StatusCase { 
    _STATUS_NOT_SET = 0,
    STATUS = 4,
  }

  export enum StartDateCase { 
    _START_DATE_NOT_SET = 0,
    START_DATE = 5,
  }

  export enum EndDateCase { 
    _END_DATE_NOT_SET = 0,
    END_DATE = 6,
  }

  export enum MetadataCase { 
    _METADATA_NOT_SET = 0,
    METADATA = 7,
  }
}

export class UpdateMissionResponse extends jspb.Message {
  getMission(): Mission | undefined;
  setMission(value?: Mission): UpdateMissionResponse;
  hasMission(): boolean;
  clearMission(): UpdateMissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMissionResponse): UpdateMissionResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateMissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMissionResponse;
  static deserializeBinaryFromReader(message: UpdateMissionResponse, reader: jspb.BinaryReader): UpdateMissionResponse;
}

export namespace UpdateMissionResponse {
  export type AsObject = {
    mission?: Mission.AsObject,
  }
}

export class DeleteMissionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteMissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteMissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteMissionRequest): DeleteMissionRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteMissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteMissionRequest;
  static deserializeBinaryFromReader(message: DeleteMissionRequest, reader: jspb.BinaryReader): DeleteMissionRequest;
}

export namespace DeleteMissionRequest {
  export type AsObject = {
    id: string,
  }
}

export class SearchMissionsRequest extends jspb.Message {
  getPageRequest(): proto_api_v1_common_pb.PageRequest | undefined;
  setPageRequest(value?: proto_api_v1_common_pb.PageRequest): SearchMissionsRequest;
  hasPageRequest(): boolean;
  clearPageRequest(): SearchMissionsRequest;

  getQuery(): string;
  setQuery(value: string): SearchMissionsRequest;

  getTeamId(): string;
  setTeamId(value: string): SearchMissionsRequest;

  getStatus(): MissionStatus;
  setStatus(value: MissionStatus): SearchMissionsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMissionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMissionsRequest): SearchMissionsRequest.AsObject;
  static serializeBinaryToWriter(message: SearchMissionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMissionsRequest;
  static deserializeBinaryFromReader(message: SearchMissionsRequest, reader: jspb.BinaryReader): SearchMissionsRequest;
}

export namespace SearchMissionsRequest {
  export type AsObject = {
    pageRequest?: proto_api_v1_common_pb.PageRequest.AsObject,
    query: string,
    teamId: string,
    status: MissionStatus,
  }
}

export class SearchMissionsResponse extends jspb.Message {
  getMissionsList(): Array<Mission>;
  setMissionsList(value: Array<Mission>): SearchMissionsResponse;
  clearMissionsList(): SearchMissionsResponse;
  addMissions(value?: Mission, index?: number): Mission;

  getPageResponse(): proto_api_v1_common_pb.PageResponse | undefined;
  setPageResponse(value?: proto_api_v1_common_pb.PageResponse): SearchMissionsResponse;
  hasPageResponse(): boolean;
  clearPageResponse(): SearchMissionsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMissionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMissionsResponse): SearchMissionsResponse.AsObject;
  static serializeBinaryToWriter(message: SearchMissionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMissionsResponse;
  static deserializeBinaryFromReader(message: SearchMissionsResponse, reader: jspb.BinaryReader): SearchMissionsResponse;
}

export namespace SearchMissionsResponse {
  export type AsObject = {
    missionsList: Array<Mission.AsObject>,
    pageResponse?: proto_api_v1_common_pb.PageResponse.AsObject,
  }
}

export class SearchMissionMembersRequest extends jspb.Message {
  getId(): string;
  setId(value: string): SearchMissionMembersRequest;

  getPageRequest(): proto_api_v1_common_pb.PageRequest | undefined;
  setPageRequest(value?: proto_api_v1_common_pb.PageRequest): SearchMissionMembersRequest;
  hasPageRequest(): boolean;
  clearPageRequest(): SearchMissionMembersRequest;

  getRole(): MissionMemberRole;
  setRole(value: MissionMemberRole): SearchMissionMembersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMissionMembersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMissionMembersRequest): SearchMissionMembersRequest.AsObject;
  static serializeBinaryToWriter(message: SearchMissionMembersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMissionMembersRequest;
  static deserializeBinaryFromReader(message: SearchMissionMembersRequest, reader: jspb.BinaryReader): SearchMissionMembersRequest;
}

export namespace SearchMissionMembersRequest {
  export type AsObject = {
    id: string,
    pageRequest?: proto_api_v1_common_pb.PageRequest.AsObject,
    role: MissionMemberRole,
  }
}

export class SearchMissionMembersResponse extends jspb.Message {
  getMembersList(): Array<MissionMember>;
  setMembersList(value: Array<MissionMember>): SearchMissionMembersResponse;
  clearMembersList(): SearchMissionMembersResponse;
  addMembers(value?: MissionMember, index?: number): MissionMember;

  getPageResponse(): proto_api_v1_common_pb.PageResponse | undefined;
  setPageResponse(value?: proto_api_v1_common_pb.PageResponse): SearchMissionMembersResponse;
  hasPageResponse(): boolean;
  clearPageResponse(): SearchMissionMembersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMissionMembersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMissionMembersResponse): SearchMissionMembersResponse.AsObject;
  static serializeBinaryToWriter(message: SearchMissionMembersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMissionMembersResponse;
  static deserializeBinaryFromReader(message: SearchMissionMembersResponse, reader: jspb.BinaryReader): SearchMissionMembersResponse;
}

export namespace SearchMissionMembersResponse {
  export type AsObject = {
    membersList: Array<MissionMember.AsObject>,
    pageResponse?: proto_api_v1_common_pb.PageResponse.AsObject,
  }
}

export class AddMissionMemberRequest extends jspb.Message {
  getId(): string;
  setId(value: string): AddMissionMemberRequest;

  getUserEmail(): string;
  setUserEmail(value: string): AddMissionMemberRequest;

  getRole(): MissionMemberRole;
  setRole(value: MissionMemberRole): AddMissionMemberRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMissionMemberRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddMissionMemberRequest): AddMissionMemberRequest.AsObject;
  static serializeBinaryToWriter(message: AddMissionMemberRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMissionMemberRequest;
  static deserializeBinaryFromReader(message: AddMissionMemberRequest, reader: jspb.BinaryReader): AddMissionMemberRequest;
}

export namespace AddMissionMemberRequest {
  export type AsObject = {
    id: string,
    userEmail: string,
    role: MissionMemberRole,
  }
}

export class AddMissionMemberResponse extends jspb.Message {
  getMember(): MissionMember | undefined;
  setMember(value?: MissionMember): AddMissionMemberResponse;
  hasMember(): boolean;
  clearMember(): AddMissionMemberResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMissionMemberResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddMissionMemberResponse): AddMissionMemberResponse.AsObject;
  static serializeBinaryToWriter(message: AddMissionMemberResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMissionMemberResponse;
  static deserializeBinaryFromReader(message: AddMissionMemberResponse, reader: jspb.BinaryReader): AddMissionMemberResponse;
}

export namespace AddMissionMemberResponse {
  export type AsObject = {
    member?: MissionMember.AsObject,
  }
}

export class UpdateMissionMemberRoleRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateMissionMemberRoleRequest;

  getUserEmail(): string;
  setUserEmail(value: string): UpdateMissionMemberRoleRequest;

  getRole(): MissionMemberRole;
  setRole(value: MissionMemberRole): UpdateMissionMemberRoleRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMissionMemberRoleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMissionMemberRoleRequest): UpdateMissionMemberRoleRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMissionMemberRoleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMissionMemberRoleRequest;
  static deserializeBinaryFromReader(message: UpdateMissionMemberRoleRequest, reader: jspb.BinaryReader): UpdateMissionMemberRoleRequest;
}

export namespace UpdateMissionMemberRoleRequest {
  export type AsObject = {
    id: string,
    userEmail: string,
    role: MissionMemberRole,
  }
}

export class UpdateMissionMemberRoleResponse extends jspb.Message {
  getMember(): MissionMember | undefined;
  setMember(value?: MissionMember): UpdateMissionMemberRoleResponse;
  hasMember(): boolean;
  clearMember(): UpdateMissionMemberRoleResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMissionMemberRoleResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMissionMemberRoleResponse): UpdateMissionMemberRoleResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateMissionMemberRoleResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMissionMemberRoleResponse;
  static deserializeBinaryFromReader(message: UpdateMissionMemberRoleResponse, reader: jspb.BinaryReader): UpdateMissionMemberRoleResponse;
}

export namespace UpdateMissionMemberRoleResponse {
  export type AsObject = {
    member?: MissionMember.AsObject,
  }
}

export class RemoveMissionMemberRequest extends jspb.Message {
  getId(): string;
  setId(value: string): RemoveMissionMemberRequest;

  getUserEmail(): string;
  setUserEmail(value: string): RemoveMissionMemberRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveMissionMemberRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveMissionMemberRequest): RemoveMissionMemberRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveMissionMemberRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveMissionMemberRequest;
  static deserializeBinaryFromReader(message: RemoveMissionMemberRequest, reader: jspb.BinaryReader): RemoveMissionMemberRequest;
}

export namespace RemoveMissionMemberRequest {
  export type AsObject = {
    id: string,
    userEmail: string,
  }
}

export class CanAccessMissionRequest extends jspb.Message {
  getId(): string;
  setId(value: string): CanAccessMissionRequest;

  getAction(): string;
  setAction(value: string): CanAccessMissionRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CanAccessMissionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CanAccessMissionRequest): CanAccessMissionRequest.AsObject;
  static serializeBinaryToWriter(message: CanAccessMissionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CanAccessMissionRequest;
  static deserializeBinaryFromReader(message: CanAccessMissionRequest, reader: jspb.BinaryReader): CanAccessMissionRequest;
}

export namespace CanAccessMissionRequest {
  export type AsObject = {
    id: string,
    action: string,
  }
}

export class CanAccessMissionResponse extends jspb.Message {
  getCanAccess(): boolean;
  setCanAccess(value: boolean): CanAccessMissionResponse;

  getReason(): string;
  setReason(value: string): CanAccessMissionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CanAccessMissionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CanAccessMissionResponse): CanAccessMissionResponse.AsObject;
  static serializeBinaryToWriter(message: CanAccessMissionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CanAccessMissionResponse;
  static deserializeBinaryFromReader(message: CanAccessMissionResponse, reader: jspb.BinaryReader): CanAccessMissionResponse;
}

export namespace CanAccessMissionResponse {
  export type AsObject = {
    canAccess: boolean,
    reason: string,
  }
}

export enum MissionStatus { 
  MISSION_STATUS_UNSPECIFIED = 0,
  MISSION_STATUS_DRAFT = 1,
  MISSION_STATUS_ACTIVE = 2,
  MISSION_STATUS_COMPLETED = 3,
  MISSION_STATUS_ARCHIVED = 4,
}
export enum MissionMemberRole { 
  MISSION_MEMBER_ROLE_UNSPECIFIED = 0,
  MISSION_MEMBER_ROLE_MEMBER = 1,
  MISSION_MEMBER_ROLE_ADMIN = 2,
  MISSION_MEMBER_ROLE_OWNER = 3,
}
