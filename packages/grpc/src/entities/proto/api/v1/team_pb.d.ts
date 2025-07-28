import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class Team extends jspb.Message {
  getId(): string;
  setId(value: string): Team;

  getName(): string;
  setName(value: string): Team;

  getImage(): string;
  setImage(value: string): Team;

  getCreatorUserId(): string;
  setCreatorUserId(value: string): Team;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): Team;
  hasMetadata(): boolean;
  clearMetadata(): Team;

  getType(): string;
  setType(value: string): Team;

  getDescription(): string;
  setDescription(value: string): Team;

  getPlan(): string;
  setPlan(value: string): Team;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Team;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Team;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Team;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Team;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Team.AsObject;
  static toObject(includeInstance: boolean, msg: Team): Team.AsObject;
  static serializeBinaryToWriter(message: Team, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Team;
  static deserializeBinaryFromReader(message: Team, reader: jspb.BinaryReader): Team;
}

export namespace Team {
  export type AsObject = {
    id: string,
    name: string,
    image: string,
    creatorUserId: string,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
    type: string,
    description: string,
    plan: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class TeamMember extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): TeamMember;

  getTeamId(): string;
  setTeamId(value: string): TeamMember;

  getRole(): TeamRole;
  setRole(value: TeamRole): TeamMember;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): TeamMember;
  hasCreatedAt(): boolean;
  clearCreatedAt(): TeamMember;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TeamMember.AsObject;
  static toObject(includeInstance: boolean, msg: TeamMember): TeamMember.AsObject;
  static serializeBinaryToWriter(message: TeamMember, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TeamMember;
  static deserializeBinaryFromReader(message: TeamMember, reader: jspb.BinaryReader): TeamMember;
}

export namespace TeamMember {
  export type AsObject = {
    userId: string,
    teamId: string,
    role: TeamRole,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreateTeamRequest extends jspb.Message {
  getName(): string;
  setName(value: string): CreateTeamRequest;

  getImage(): string;
  setImage(value: string): CreateTeamRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): CreateTeamRequest;
  hasMetadata(): boolean;
  clearMetadata(): CreateTeamRequest;

  getDescription(): string;
  setDescription(value: string): CreateTeamRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTeamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTeamRequest): CreateTeamRequest.AsObject;
  static serializeBinaryToWriter(message: CreateTeamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTeamRequest;
  static deserializeBinaryFromReader(message: CreateTeamRequest, reader: jspb.BinaryReader): CreateTeamRequest;
}

export namespace CreateTeamRequest {
  export type AsObject = {
    name: string,
    image: string,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
    description: string,
  }
}

export class GetTeamRequest extends jspb.Message {
  getId(): string;
  setId(value: string): GetTeamRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTeamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTeamRequest): GetTeamRequest.AsObject;
  static serializeBinaryToWriter(message: GetTeamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTeamRequest;
  static deserializeBinaryFromReader(message: GetTeamRequest, reader: jspb.BinaryReader): GetTeamRequest;
}

export namespace GetTeamRequest {
  export type AsObject = {
    id: string,
  }
}

export class SearchTeamsRequest extends jspb.Message {
  getPageRequest(): proto_api_v1_common_pb.PageRequest | undefined;
  setPageRequest(value?: proto_api_v1_common_pb.PageRequest): SearchTeamsRequest;
  hasPageRequest(): boolean;
  clearPageRequest(): SearchTeamsRequest;

  getQuery(): string;
  setQuery(value: string): SearchTeamsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchTeamsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchTeamsRequest): SearchTeamsRequest.AsObject;
  static serializeBinaryToWriter(message: SearchTeamsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchTeamsRequest;
  static deserializeBinaryFromReader(message: SearchTeamsRequest, reader: jspb.BinaryReader): SearchTeamsRequest;
}

export namespace SearchTeamsRequest {
  export type AsObject = {
    pageRequest?: proto_api_v1_common_pb.PageRequest.AsObject,
    query: string,
  }
}

export class UpdateTeamRequest extends jspb.Message {
  getId(): string;
  setId(value: string): UpdateTeamRequest;

  getName(): string;
  setName(value: string): UpdateTeamRequest;

  getImage(): string;
  setImage(value: string): UpdateTeamRequest;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): UpdateTeamRequest;
  hasMetadata(): boolean;
  clearMetadata(): UpdateTeamRequest;

  getDescription(): string;
  setDescription(value: string): UpdateTeamRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTeamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTeamRequest): UpdateTeamRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateTeamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTeamRequest;
  static deserializeBinaryFromReader(message: UpdateTeamRequest, reader: jspb.BinaryReader): UpdateTeamRequest;
}

export namespace UpdateTeamRequest {
  export type AsObject = {
    id: string,
    name: string,
    image: string,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
    description: string,
  }
}

export class DeleteTeamRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteTeamRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTeamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTeamRequest): DeleteTeamRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteTeamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTeamRequest;
  static deserializeBinaryFromReader(message: DeleteTeamRequest, reader: jspb.BinaryReader): DeleteTeamRequest;
}

export namespace DeleteTeamRequest {
  export type AsObject = {
    id: string,
  }
}

export class CreateTeamResponse extends jspb.Message {
  getTeam(): Team | undefined;
  setTeam(value?: Team): CreateTeamResponse;
  hasTeam(): boolean;
  clearTeam(): CreateTeamResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateTeamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateTeamResponse): CreateTeamResponse.AsObject;
  static serializeBinaryToWriter(message: CreateTeamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateTeamResponse;
  static deserializeBinaryFromReader(message: CreateTeamResponse, reader: jspb.BinaryReader): CreateTeamResponse;
}

export namespace CreateTeamResponse {
  export type AsObject = {
    team?: Team.AsObject,
  }
}

export class GetTeamResponse extends jspb.Message {
  getTeam(): Team | undefined;
  setTeam(value?: Team): GetTeamResponse;
  hasTeam(): boolean;
  clearTeam(): GetTeamResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTeamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTeamResponse): GetTeamResponse.AsObject;
  static serializeBinaryToWriter(message: GetTeamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTeamResponse;
  static deserializeBinaryFromReader(message: GetTeamResponse, reader: jspb.BinaryReader): GetTeamResponse;
}

export namespace GetTeamResponse {
  export type AsObject = {
    team?: Team.AsObject,
  }
}

export class SearchTeamsResponse extends jspb.Message {
  getTeamsList(): Array<Team>;
  setTeamsList(value: Array<Team>): SearchTeamsResponse;
  clearTeamsList(): SearchTeamsResponse;
  addTeams(value?: Team, index?: number): Team;

  getPageResponse(): proto_api_v1_common_pb.PageResponse | undefined;
  setPageResponse(value?: proto_api_v1_common_pb.PageResponse): SearchTeamsResponse;
  hasPageResponse(): boolean;
  clearPageResponse(): SearchTeamsResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchTeamsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchTeamsResponse): SearchTeamsResponse.AsObject;
  static serializeBinaryToWriter(message: SearchTeamsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchTeamsResponse;
  static deserializeBinaryFromReader(message: SearchTeamsResponse, reader: jspb.BinaryReader): SearchTeamsResponse;
}

export namespace SearchTeamsResponse {
  export type AsObject = {
    teamsList: Array<Team.AsObject>,
    pageResponse?: proto_api_v1_common_pb.PageResponse.AsObject,
  }
}

export class UpdateTeamResponse extends jspb.Message {
  getTeam(): Team | undefined;
  setTeam(value?: Team): UpdateTeamResponse;
  hasTeam(): boolean;
  clearTeam(): UpdateTeamResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateTeamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateTeamResponse): UpdateTeamResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateTeamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateTeamResponse;
  static deserializeBinaryFromReader(message: UpdateTeamResponse, reader: jspb.BinaryReader): UpdateTeamResponse;
}

export namespace UpdateTeamResponse {
  export type AsObject = {
    team?: Team.AsObject,
  }
}

export class DeleteTeamResponse extends jspb.Message {
  getEmpty(): google_protobuf_empty_pb.Empty | undefined;
  setEmpty(value?: google_protobuf_empty_pb.Empty): DeleteTeamResponse;
  hasEmpty(): boolean;
  clearEmpty(): DeleteTeamResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteTeamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteTeamResponse): DeleteTeamResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteTeamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteTeamResponse;
  static deserializeBinaryFromReader(message: DeleteTeamResponse, reader: jspb.BinaryReader): DeleteTeamResponse;
}

export namespace DeleteTeamResponse {
  export type AsObject = {
    empty?: google_protobuf_empty_pb.Empty.AsObject,
  }
}

export class SearchMembersRequest extends jspb.Message {
  getTeamId(): string;
  setTeamId(value: string): SearchMembersRequest;

  getPageRequest(): proto_api_v1_common_pb.PageRequest | undefined;
  setPageRequest(value?: proto_api_v1_common_pb.PageRequest): SearchMembersRequest;
  hasPageRequest(): boolean;
  clearPageRequest(): SearchMembersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMembersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMembersRequest): SearchMembersRequest.AsObject;
  static serializeBinaryToWriter(message: SearchMembersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMembersRequest;
  static deserializeBinaryFromReader(message: SearchMembersRequest, reader: jspb.BinaryReader): SearchMembersRequest;
}

export namespace SearchMembersRequest {
  export type AsObject = {
    teamId: string,
    pageRequest?: proto_api_v1_common_pb.PageRequest.AsObject,
  }
}

export class AddMemberRequest extends jspb.Message {
  getTeamId(): string;
  setTeamId(value: string): AddMemberRequest;

  getEmail(): string;
  setEmail(value: string): AddMemberRequest;

  getRole(): TeamRole;
  setRole(value: TeamRole): AddMemberRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMemberRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AddMemberRequest): AddMemberRequest.AsObject;
  static serializeBinaryToWriter(message: AddMemberRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMemberRequest;
  static deserializeBinaryFromReader(message: AddMemberRequest, reader: jspb.BinaryReader): AddMemberRequest;
}

export namespace AddMemberRequest {
  export type AsObject = {
    teamId: string,
    email: string,
    role: TeamRole,
  }
}

export class UpdateMemberRoleRequest extends jspb.Message {
  getTeamId(): string;
  setTeamId(value: string): UpdateMemberRoleRequest;

  getEmail(): string;
  setEmail(value: string): UpdateMemberRoleRequest;

  getRole(): TeamRole;
  setRole(value: TeamRole): UpdateMemberRoleRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMemberRoleRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMemberRoleRequest): UpdateMemberRoleRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateMemberRoleRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMemberRoleRequest;
  static deserializeBinaryFromReader(message: UpdateMemberRoleRequest, reader: jspb.BinaryReader): UpdateMemberRoleRequest;
}

export namespace UpdateMemberRoleRequest {
  export type AsObject = {
    teamId: string,
    email: string,
    role: TeamRole,
  }
}

export class RemoveMemberRequest extends jspb.Message {
  getTeamId(): string;
  setTeamId(value: string): RemoveMemberRequest;

  getEmail(): string;
  setEmail(value: string): RemoveMemberRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveMemberRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveMemberRequest): RemoveMemberRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveMemberRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveMemberRequest;
  static deserializeBinaryFromReader(message: RemoveMemberRequest, reader: jspb.BinaryReader): RemoveMemberRequest;
}

export namespace RemoveMemberRequest {
  export type AsObject = {
    teamId: string,
    email: string,
  }
}

export class SearchMembersResponse extends jspb.Message {
  getMembersList(): Array<TeamMember>;
  setMembersList(value: Array<TeamMember>): SearchMembersResponse;
  clearMembersList(): SearchMembersResponse;
  addMembers(value?: TeamMember, index?: number): TeamMember;

  getPageResponse(): proto_api_v1_common_pb.PageResponse | undefined;
  setPageResponse(value?: proto_api_v1_common_pb.PageResponse): SearchMembersResponse;
  hasPageResponse(): boolean;
  clearPageResponse(): SearchMembersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchMembersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchMembersResponse): SearchMembersResponse.AsObject;
  static serializeBinaryToWriter(message: SearchMembersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchMembersResponse;
  static deserializeBinaryFromReader(message: SearchMembersResponse, reader: jspb.BinaryReader): SearchMembersResponse;
}

export namespace SearchMembersResponse {
  export type AsObject = {
    membersList: Array<TeamMember.AsObject>,
    pageResponse?: proto_api_v1_common_pb.PageResponse.AsObject,
  }
}

export class AddMemberResponse extends jspb.Message {
  getMember(): TeamMember | undefined;
  setMember(value?: TeamMember): AddMemberResponse;
  hasMember(): boolean;
  clearMember(): AddMemberResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AddMemberResponse.AsObject;
  static toObject(includeInstance: boolean, msg: AddMemberResponse): AddMemberResponse.AsObject;
  static serializeBinaryToWriter(message: AddMemberResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AddMemberResponse;
  static deserializeBinaryFromReader(message: AddMemberResponse, reader: jspb.BinaryReader): AddMemberResponse;
}

export namespace AddMemberResponse {
  export type AsObject = {
    member?: TeamMember.AsObject,
  }
}

export class UpdateMemberRoleResponse extends jspb.Message {
  getMember(): TeamMember | undefined;
  setMember(value?: TeamMember): UpdateMemberRoleResponse;
  hasMember(): boolean;
  clearMember(): UpdateMemberRoleResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateMemberRoleResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateMemberRoleResponse): UpdateMemberRoleResponse.AsObject;
  static serializeBinaryToWriter(message: UpdateMemberRoleResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateMemberRoleResponse;
  static deserializeBinaryFromReader(message: UpdateMemberRoleResponse, reader: jspb.BinaryReader): UpdateMemberRoleResponse;
}

export namespace UpdateMemberRoleResponse {
  export type AsObject = {
    member?: TeamMember.AsObject,
  }
}

export class RemoveMemberResponse extends jspb.Message {
  getEmpty(): google_protobuf_empty_pb.Empty | undefined;
  setEmpty(value?: google_protobuf_empty_pb.Empty): RemoveMemberResponse;
  hasEmpty(): boolean;
  clearEmpty(): RemoveMemberResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveMemberResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveMemberResponse): RemoveMemberResponse.AsObject;
  static serializeBinaryToWriter(message: RemoveMemberResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveMemberResponse;
  static deserializeBinaryFromReader(message: RemoveMemberResponse, reader: jspb.BinaryReader): RemoveMemberResponse;
}

export namespace RemoveMemberResponse {
  export type AsObject = {
    empty?: google_protobuf_empty_pb.Empty.AsObject,
  }
}

export class CanAccessTeamRequest extends jspb.Message {
  getTeamId(): string;
  setTeamId(value: string): CanAccessTeamRequest;

  getAction(): string;
  setAction(value: string): CanAccessTeamRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CanAccessTeamRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CanAccessTeamRequest): CanAccessTeamRequest.AsObject;
  static serializeBinaryToWriter(message: CanAccessTeamRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CanAccessTeamRequest;
  static deserializeBinaryFromReader(message: CanAccessTeamRequest, reader: jspb.BinaryReader): CanAccessTeamRequest;
}

export namespace CanAccessTeamRequest {
  export type AsObject = {
    teamId: string,
    action: string,
  }
}

export class CanAccessTeamResponse extends jspb.Message {
  getAllowed(): boolean;
  setAllowed(value: boolean): CanAccessTeamResponse;

  getReason(): string;
  setReason(value: string): CanAccessTeamResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CanAccessTeamResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CanAccessTeamResponse): CanAccessTeamResponse.AsObject;
  static serializeBinaryToWriter(message: CanAccessTeamResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CanAccessTeamResponse;
  static deserializeBinaryFromReader(message: CanAccessTeamResponse, reader: jspb.BinaryReader): CanAccessTeamResponse;
}

export namespace CanAccessTeamResponse {
  export type AsObject = {
    allowed: boolean,
    reason: string,
  }
}

export enum TeamRole { 
  TEAM_ROLE_UNSPECIFIED = 0,
  TEAM_ROLE_MEMBER = 1,
  TEAM_ROLE_ADMIN = 2,
  TEAM_ROLE_OWNER = 3,
}
