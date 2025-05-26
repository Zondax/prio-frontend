import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class DeleteUserResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteUserResponse;

  getMessage(): string;
  setMessage(value: string): DeleteUserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUserResponse): DeleteUserResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUserResponse;
  static deserializeBinaryFromReader(message: DeleteUserResponse, reader: jspb.BinaryReader): DeleteUserResponse;
}

export namespace DeleteUserResponse {
  export type AsObject = {
    success: boolean,
    message: string,
  }
}

export class DeleteUserRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUserRequest): DeleteUserRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUserRequest;
  static deserializeBinaryFromReader(message: DeleteUserRequest, reader: jspb.BinaryReader): DeleteUserRequest;
}

export namespace DeleteUserRequest {
  export type AsObject = {
  }
}

export class UserPreferences extends jspb.Message {
  getUserId(): string;
  setUserId(value: string): UserPreferences;

  getDisplayName(): string;
  setDisplayName(value: string): UserPreferences;
  hasDisplayName(): boolean;
  clearDisplayName(): UserPreferences;

  getThemeMode(): ThemeMode;
  setThemeMode(value: ThemeMode): UserPreferences;
  hasThemeMode(): boolean;
  clearThemeMode(): UserPreferences;

  getLanguage(): string;
  setLanguage(value: string): UserPreferences;
  hasLanguage(): boolean;
  clearLanguage(): UserPreferences;

  getTimezone(): string;
  setTimezone(value: string): UserPreferences;
  hasTimezone(): boolean;
  clearTimezone(): UserPreferences;

  getAccessibilitySettingsMap(): jspb.Map<string, string>;
  clearAccessibilitySettingsMap(): UserPreferences;

  getProfilePicture(): string;
  setProfilePicture(value: string): UserPreferences;
  hasProfilePicture(): boolean;
  clearProfilePicture(): UserPreferences;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): UserPreferences;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): UserPreferences;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UserPreferences.AsObject;
  static toObject(includeInstance: boolean, msg: UserPreferences): UserPreferences.AsObject;
  static serializeBinaryToWriter(message: UserPreferences, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UserPreferences;
  static deserializeBinaryFromReader(message: UserPreferences, reader: jspb.BinaryReader): UserPreferences;
}

export namespace UserPreferences {
  export type AsObject = {
    userId: string,
    displayName?: string,
    themeMode?: ThemeMode,
    language?: string,
    timezone?: string,
    accessibilitySettingsMap: Array<[string, string]>,
    profilePicture?: string,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }

  export enum DisplayNameCase { 
    _DISPLAY_NAME_NOT_SET = 0,
    DISPLAY_NAME = 2,
  }

  export enum ThemeModeCase { 
    _THEME_MODE_NOT_SET = 0,
    THEME_MODE = 3,
  }

  export enum LanguageCase { 
    _LANGUAGE_NOT_SET = 0,
    LANGUAGE = 4,
  }

  export enum TimezoneCase { 
    _TIMEZONE_NOT_SET = 0,
    TIMEZONE = 5,
  }

  export enum ProfilePictureCase { 
    _PROFILE_PICTURE_NOT_SET = 0,
    PROFILE_PICTURE = 7,
  }
}

export class GetUserPreferencesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserPreferencesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserPreferencesRequest): GetUserPreferencesRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserPreferencesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserPreferencesRequest;
  static deserializeBinaryFromReader(message: GetUserPreferencesRequest, reader: jspb.BinaryReader): GetUserPreferencesRequest;
}

export namespace GetUserPreferencesRequest {
  export type AsObject = {
  }
}

export class GetUserPreferencesResponse extends jspb.Message {
  getPreferences(): UserPreferences | undefined;
  setPreferences(value?: UserPreferences): GetUserPreferencesResponse;
  hasPreferences(): boolean;
  clearPreferences(): GetUserPreferencesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserPreferencesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserPreferencesResponse): GetUserPreferencesResponse.AsObject;
  static serializeBinaryToWriter(message: GetUserPreferencesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserPreferencesResponse;
  static deserializeBinaryFromReader(message: GetUserPreferencesResponse, reader: jspb.BinaryReader): GetUserPreferencesResponse;
}

export namespace GetUserPreferencesResponse {
  export type AsObject = {
    preferences?: UserPreferences.AsObject,
  }
}

export class UpsertUserPreferencesRequest extends jspb.Message {
  getPreferences(): UserPreferences | undefined;
  setPreferences(value?: UserPreferences): UpsertUserPreferencesRequest;
  hasPreferences(): boolean;
  clearPreferences(): UpsertUserPreferencesRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertUserPreferencesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpsertUserPreferencesRequest): UpsertUserPreferencesRequest.AsObject;
  static serializeBinaryToWriter(message: UpsertUserPreferencesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpsertUserPreferencesRequest;
  static deserializeBinaryFromReader(message: UpsertUserPreferencesRequest, reader: jspb.BinaryReader): UpsertUserPreferencesRequest;
}

export namespace UpsertUserPreferencesRequest {
  export type AsObject = {
    preferences?: UserPreferences.AsObject,
  }
}

export class UpsertUserPreferencesResponse extends jspb.Message {
  getId(): number;
  setId(value: number): UpsertUserPreferencesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpsertUserPreferencesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UpsertUserPreferencesResponse): UpsertUserPreferencesResponse.AsObject;
  static serializeBinaryToWriter(message: UpsertUserPreferencesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpsertUserPreferencesResponse;
  static deserializeBinaryFromReader(message: UpsertUserPreferencesResponse, reader: jspb.BinaryReader): UpsertUserPreferencesResponse;
}

export namespace UpsertUserPreferencesResponse {
  export type AsObject = {
    id: number,
  }
}

export class WatchUserPreferencesRequest extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WatchUserPreferencesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: WatchUserPreferencesRequest): WatchUserPreferencesRequest.AsObject;
  static serializeBinaryToWriter(message: WatchUserPreferencesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WatchUserPreferencesRequest;
  static deserializeBinaryFromReader(message: WatchUserPreferencesRequest, reader: jspb.BinaryReader): WatchUserPreferencesRequest;
}

export namespace WatchUserPreferencesRequest {
  export type AsObject = {
  }
}

export enum ThemeMode { 
  THEME_MODE_UNSPECIFIED = 0,
  THEME_MODE_LIGHT = 1,
  THEME_MODE_DARK = 2,
  THEME_MODE_SYSTEM = 3,
}
