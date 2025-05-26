import * as jspb from 'google-protobuf'

import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class MobileConfig extends jspb.Message {
  getAuth(): MobileConfig.Auth | undefined;
  setAuth(value?: MobileConfig.Auth): MobileConfig;
  hasAuth(): boolean;
  clearAuth(): MobileConfig;

  getSentry(): MobileConfig.Sentry | undefined;
  setSentry(value?: MobileConfig.Sentry): MobileConfig;
  hasSentry(): boolean;
  clearSentry(): MobileConfig;

  getLocationIq(): MobileConfig.LocationIq | undefined;
  setLocationIq(value?: MobileConfig.LocationIq): MobileConfig;
  hasLocationIq(): boolean;
  clearLocationIq(): MobileConfig;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MobileConfig.AsObject;
  static toObject(includeInstance: boolean, msg: MobileConfig): MobileConfig.AsObject;
  static serializeBinaryToWriter(message: MobileConfig, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MobileConfig;
  static deserializeBinaryFromReader(message: MobileConfig, reader: jspb.BinaryReader): MobileConfig;
}

export namespace MobileConfig {
  export type AsObject = {
    auth?: MobileConfig.Auth.AsObject,
    sentry?: MobileConfig.Sentry.AsObject,
    locationIq?: MobileConfig.LocationIq.AsObject,
  }

  export class Auth extends jspb.Message {
    getIssuer(): string;
    setIssuer(value: string): Auth;

    getClientId(): string;
    setClientId(value: string): Auth;

    getScopesList(): Array<string>;
    setScopesList(value: Array<string>): Auth;
    clearScopesList(): Auth;
    addScopes(value: string, index?: number): Auth;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Auth.AsObject;
    static toObject(includeInstance: boolean, msg: Auth): Auth.AsObject;
    static serializeBinaryToWriter(message: Auth, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Auth;
    static deserializeBinaryFromReader(message: Auth, reader: jspb.BinaryReader): Auth;
  }

  export namespace Auth {
    export type AsObject = {
      issuer: string,
      clientId: string,
      scopesList: Array<string>,
    }
  }


  export class Sentry extends jspb.Message {
    getDsn(): string;
    setDsn(value: string): Sentry;

    getEnabled(): boolean;
    setEnabled(value: boolean): Sentry;

    getTracesSampleRate(): number;
    setTracesSampleRate(value: number): Sentry;

    getProfilesSampleRate(): number;
    setProfilesSampleRate(value: number): Sentry;

    getSessionTrackingIntervalMillis(): number;
    setSessionTrackingIntervalMillis(value: number): Sentry;

    getReplaysSessionSampleRate(): number;
    setReplaysSessionSampleRate(value: number): Sentry;

    getReplaysOnErrorSampleRate(): number;
    setReplaysOnErrorSampleRate(value: number): Sentry;

    getEnableUserInteractionTracing(): boolean;
    setEnableUserInteractionTracing(value: boolean): Sentry;

    getAutoSessionTracking(): boolean;
    setAutoSessionTracking(value: boolean): Sentry;

    getEnableNativeFramesTracking(): boolean;
    setEnableNativeFramesTracking(value: boolean): Sentry;

    getEnableTimeToInitialDisplay(): boolean;
    setEnableTimeToInitialDisplay(value: boolean): Sentry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Sentry.AsObject;
    static toObject(includeInstance: boolean, msg: Sentry): Sentry.AsObject;
    static serializeBinaryToWriter(message: Sentry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Sentry;
    static deserializeBinaryFromReader(message: Sentry, reader: jspb.BinaryReader): Sentry;
  }

  export namespace Sentry {
    export type AsObject = {
      dsn: string,
      enabled: boolean,
      tracesSampleRate: number,
      profilesSampleRate: number,
      sessionTrackingIntervalMillis: number,
      replaysSessionSampleRate: number,
      replaysOnErrorSampleRate: number,
      enableUserInteractionTracing: boolean,
      autoSessionTracking: boolean,
      enableNativeFramesTracking: boolean,
      enableTimeToInitialDisplay: boolean,
    }
  }


  export class LocationIq extends jspb.Message {
    getApiKey(): string;
    setApiKey(value: string): LocationIq;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): LocationIq.AsObject;
    static toObject(includeInstance: boolean, msg: LocationIq): LocationIq.AsObject;
    static serializeBinaryToWriter(message: LocationIq, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): LocationIq;
    static deserializeBinaryFromReader(message: LocationIq, reader: jspb.BinaryReader): LocationIq;
  }

  export namespace LocationIq {
    export type AsObject = {
      apiKey: string,
    }
  }

}

export class Challenge extends jspb.Message {
  getValue(): string;
  setValue(value: string): Challenge;

  getAppId(): string;
  setAppId(value: string): Challenge;

  getPlatform(): proto_api_v1_common_pb.Platform;
  setPlatform(value: proto_api_v1_common_pb.Platform): Challenge;

  getUuid(): string;
  setUuid(value: string): Challenge;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Challenge.AsObject;
  static toObject(includeInstance: boolean, msg: Challenge): Challenge.AsObject;
  static serializeBinaryToWriter(message: Challenge, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Challenge;
  static deserializeBinaryFromReader(message: Challenge, reader: jspb.BinaryReader): Challenge;
}

export namespace Challenge {
  export type AsObject = {
    value: string,
    appId: string,
    platform: proto_api_v1_common_pb.Platform,
    uuid: string,
  }
}

export class GetChallengeRequest extends jspb.Message {
  getPlatform(): proto_api_v1_common_pb.Platform;
  setPlatform(value: proto_api_v1_common_pb.Platform): GetChallengeRequest;

  getAppId(): string;
  setAppId(value: string): GetChallengeRequest;

  getUuid(): string;
  setUuid(value: string): GetChallengeRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetChallengeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetChallengeRequest): GetChallengeRequest.AsObject;
  static serializeBinaryToWriter(message: GetChallengeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetChallengeRequest;
  static deserializeBinaryFromReader(message: GetChallengeRequest, reader: jspb.BinaryReader): GetChallengeRequest;
}

export namespace GetChallengeRequest {
  export type AsObject = {
    platform: proto_api_v1_common_pb.Platform,
    appId: string,
    uuid: string,
  }
}

export class GetChallengeResponse extends jspb.Message {
  getChallenge(): string;
  setChallenge(value: string): GetChallengeResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetChallengeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetChallengeResponse): GetChallengeResponse.AsObject;
  static serializeBinaryToWriter(message: GetChallengeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetChallengeResponse;
  static deserializeBinaryFromReader(message: GetChallengeResponse, reader: jspb.BinaryReader): GetChallengeResponse;
}

export namespace GetChallengeResponse {
  export type AsObject = {
    challenge: string,
  }
}

export class GetMobileConfigRequest extends jspb.Message {
  getAttestationResult(): string;
  setAttestationResult(value: string): GetMobileConfigRequest;

  getChallenge(): string;
  setChallenge(value: string): GetMobileConfigRequest;

  getPlatform(): proto_api_v1_common_pb.Platform;
  setPlatform(value: proto_api_v1_common_pb.Platform): GetMobileConfigRequest;

  getAppId(): string;
  setAppId(value: string): GetMobileConfigRequest;

  getUuid(): string;
  setUuid(value: string): GetMobileConfigRequest;

  getKeyId(): string;
  setKeyId(value: string): GetMobileConfigRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMobileConfigRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMobileConfigRequest): GetMobileConfigRequest.AsObject;
  static serializeBinaryToWriter(message: GetMobileConfigRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMobileConfigRequest;
  static deserializeBinaryFromReader(message: GetMobileConfigRequest, reader: jspb.BinaryReader): GetMobileConfigRequest;
}

export namespace GetMobileConfigRequest {
  export type AsObject = {
    attestationResult: string,
    challenge: string,
    platform: proto_api_v1_common_pb.Platform,
    appId: string,
    uuid: string,
    keyId: string,
  }
}

export class GetMobileConfigResponse extends jspb.Message {
  getConfig(): MobileConfig | undefined;
  setConfig(value?: MobileConfig): GetMobileConfigResponse;
  hasConfig(): boolean;
  clearConfig(): GetMobileConfigResponse;

  getError(): string;
  setError(value: string): GetMobileConfigResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMobileConfigResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMobileConfigResponse): GetMobileConfigResponse.AsObject;
  static serializeBinaryToWriter(message: GetMobileConfigResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMobileConfigResponse;
  static deserializeBinaryFromReader(message: GetMobileConfigResponse, reader: jspb.BinaryReader): GetMobileConfigResponse;
}

export namespace GetMobileConfigResponse {
  export type AsObject = {
    config?: MobileConfig.AsObject,
    error: string,
  }
}

