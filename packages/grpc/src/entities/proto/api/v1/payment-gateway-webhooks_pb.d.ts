import * as jspb from 'google-protobuf'

import * as google_api_annotations_pb from '../../../google/api/annotations_pb'; // proto import: "google/api/annotations.proto"
import * as google_api_httpbody_pb from '../../../google/api/httpbody_pb'; // proto import: "google/api/httpbody.proto"


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

