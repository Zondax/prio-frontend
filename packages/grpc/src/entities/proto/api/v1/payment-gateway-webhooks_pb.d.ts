import * as jspb from 'google-protobuf'

import * as google_api_annotations_pb from '../../../google/api/annotations_pb'; // proto import: "google/api/annotations.proto"


export class StripeWebhookRequest extends jspb.Message {
  getPayload(): Uint8Array | string;
  getPayload_asU8(): Uint8Array;
  getPayload_asB64(): string;
  setPayload(value: Uint8Array | string): StripeWebhookRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StripeWebhookRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StripeWebhookRequest): StripeWebhookRequest.AsObject;
  static serializeBinaryToWriter(message: StripeWebhookRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StripeWebhookRequest;
  static deserializeBinaryFromReader(message: StripeWebhookRequest, reader: jspb.BinaryReader): StripeWebhookRequest;
}

export namespace StripeWebhookRequest {
  export type AsObject = {
    payload: Uint8Array | string,
  }
}

export class StripeWebhookResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): StripeWebhookResponse;

  getMessage(): string;
  setMessage(value: string): StripeWebhookResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StripeWebhookResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StripeWebhookResponse): StripeWebhookResponse.AsObject;
  static serializeBinaryToWriter(message: StripeWebhookResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StripeWebhookResponse;
  static deserializeBinaryFromReader(message: StripeWebhookResponse, reader: jspb.BinaryReader): StripeWebhookResponse;
}

export namespace StripeWebhookResponse {
  export type AsObject = {
    success: boolean,
    message: string,
  }
}

