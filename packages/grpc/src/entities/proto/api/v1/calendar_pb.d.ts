import * as jspb from 'google-protobuf'

import * as google_protobuf_struct_pb from 'google-protobuf/google/protobuf/struct_pb'; // proto import: "google/protobuf/struct.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"


export class Calendar extends jspb.Message {
  getExternalId(): string;
  setExternalId(value: string): Calendar;

  getTitle(): string;
  setTitle(value: string): Calendar;

  getColor(): string;
  setColor(value: string): Calendar;

  getAllowsModifications(): boolean;
  setAllowsModifications(value: boolean): Calendar;

  getAllowedAvailabilitiesList(): Array<string>;
  setAllowedAvailabilitiesList(value: Array<string>): Calendar;
  clearAllowedAvailabilitiesList(): Calendar;
  addAllowedAvailabilities(value: string, index?: number): Calendar;

  getSource(): CalendarSource | undefined;
  setSource(value?: CalendarSource): Calendar;
  hasSource(): boolean;
  clearSource(): Calendar;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): Calendar;
  hasMetadata(): boolean;
  clearMetadata(): Calendar;

  getDeviceId(): string;
  setDeviceId(value: string): Calendar;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Calendar.AsObject;
  static toObject(includeInstance: boolean, msg: Calendar): Calendar.AsObject;
  static serializeBinaryToWriter(message: Calendar, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Calendar;
  static deserializeBinaryFromReader(message: Calendar, reader: jspb.BinaryReader): Calendar;
}

export namespace Calendar {
  export type AsObject = {
    externalId: string,
    title: string,
    color: string,
    allowsModifications: boolean,
    allowedAvailabilitiesList: Array<string>,
    source?: CalendarSource.AsObject,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
    deviceId: string,
  }
}

export class CalendarSource extends jspb.Message {
  getId(): string;
  setId(value: string): CalendarSource;

  getName(): string;
  setName(value: string): CalendarSource;

  getType(): string;
  setType(value: string): CalendarSource;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalendarSource.AsObject;
  static toObject(includeInstance: boolean, msg: CalendarSource): CalendarSource.AsObject;
  static serializeBinaryToWriter(message: CalendarSource, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalendarSource;
  static deserializeBinaryFromReader(message: CalendarSource, reader: jspb.BinaryReader): CalendarSource;
}

export namespace CalendarSource {
  export type AsObject = {
    id: string,
    name: string,
    type: string,
  }
}

export class CalendarEvent extends jspb.Message {
  getExternalId(): string;
  setExternalId(value: string): CalendarEvent;

  getCalendarExternalId(): string;
  setCalendarExternalId(value: string): CalendarEvent;

  getTitle(): string;
  setTitle(value: string): CalendarEvent;

  getLocation(): string;
  setLocation(value: string): CalendarEvent;

  getTimeZone(): string;
  setTimeZone(value: string): CalendarEvent;

  getNotes(): string;
  setNotes(value: string): CalendarEvent;

  getStartDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartDate(value?: google_protobuf_timestamp_pb.Timestamp): CalendarEvent;
  hasStartDate(): boolean;
  clearStartDate(): CalendarEvent;

  getEndDate(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndDate(value?: google_protobuf_timestamp_pb.Timestamp): CalendarEvent;
  hasEndDate(): boolean;
  clearEndDate(): CalendarEvent;

  getAllDay(): boolean;
  setAllDay(value: boolean): CalendarEvent;

  getStatus(): string;
  setStatus(value: string): CalendarEvent;

  getMetadata(): google_protobuf_struct_pb.Struct | undefined;
  setMetadata(value?: google_protobuf_struct_pb.Struct): CalendarEvent;
  hasMetadata(): boolean;
  clearMetadata(): CalendarEvent;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalendarEvent.AsObject;
  static toObject(includeInstance: boolean, msg: CalendarEvent): CalendarEvent.AsObject;
  static serializeBinaryToWriter(message: CalendarEvent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalendarEvent;
  static deserializeBinaryFromReader(message: CalendarEvent, reader: jspb.BinaryReader): CalendarEvent;
}

export namespace CalendarEvent {
  export type AsObject = {
    externalId: string,
    calendarExternalId: string,
    title: string,
    location: string,
    timeZone: string,
    notes: string,
    startDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endDate?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    allDay: boolean,
    status: string,
    metadata?: google_protobuf_struct_pb.Struct.AsObject,
  }
}

export class SyncCalendarEventsRequest extends jspb.Message {
  getEventsList(): Array<CalendarEvent>;
  setEventsList(value: Array<CalendarEvent>): SyncCalendarEventsRequest;
  clearEventsList(): SyncCalendarEventsRequest;
  addEvents(value?: CalendarEvent, index?: number): CalendarEvent;

  getCalendarsList(): Array<Calendar>;
  setCalendarsList(value: Array<Calendar>): SyncCalendarEventsRequest;
  clearCalendarsList(): SyncCalendarEventsRequest;
  addCalendars(value?: Calendar, index?: number): Calendar;

  getPlatform(): proto_api_v1_common_pb.Platform;
  setPlatform(value: proto_api_v1_common_pb.Platform): SyncCalendarEventsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncCalendarEventsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SyncCalendarEventsRequest): SyncCalendarEventsRequest.AsObject;
  static serializeBinaryToWriter(message: SyncCalendarEventsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncCalendarEventsRequest;
  static deserializeBinaryFromReader(message: SyncCalendarEventsRequest, reader: jspb.BinaryReader): SyncCalendarEventsRequest;
}

export namespace SyncCalendarEventsRequest {
  export type AsObject = {
    eventsList: Array<CalendarEvent.AsObject>,
    calendarsList: Array<Calendar.AsObject>,
    platform: proto_api_v1_common_pb.Platform,
  }
}

export class CalendarIdentifiers extends jspb.Message {
  getExternalId(): string;
  setExternalId(value: string): CalendarIdentifiers;

  getSyncId(): string;
  setSyncId(value: string): CalendarIdentifiers;

  getSource(): CalendarSource | undefined;
  setSource(value?: CalendarSource): CalendarIdentifiers;
  hasSource(): boolean;
  clearSource(): CalendarIdentifiers;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalendarIdentifiers.AsObject;
  static toObject(includeInstance: boolean, msg: CalendarIdentifiers): CalendarIdentifiers.AsObject;
  static serializeBinaryToWriter(message: CalendarIdentifiers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalendarIdentifiers;
  static deserializeBinaryFromReader(message: CalendarIdentifiers, reader: jspb.BinaryReader): CalendarIdentifiers;
}

export namespace CalendarIdentifiers {
  export type AsObject = {
    externalId: string,
    syncId: string,
    source?: CalendarSource.AsObject,
  }
}

export class SyncCalendarEventsResponse extends jspb.Message {
  getCalendarsList(): Array<CalendarIdentifiers>;
  setCalendarsList(value: Array<CalendarIdentifiers>): SyncCalendarEventsResponse;
  clearCalendarsList(): SyncCalendarEventsResponse;
  addCalendars(value?: CalendarIdentifiers, index?: number): CalendarIdentifiers;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncCalendarEventsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SyncCalendarEventsResponse): SyncCalendarEventsResponse.AsObject;
  static serializeBinaryToWriter(message: SyncCalendarEventsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncCalendarEventsResponse;
  static deserializeBinaryFromReader(message: SyncCalendarEventsResponse, reader: jspb.BinaryReader): SyncCalendarEventsResponse;
}

export namespace SyncCalendarEventsResponse {
  export type AsObject = {
    calendarsList: Array<CalendarIdentifiers.AsObject>,
  }
}

export class SyncError extends jspb.Message {
  getId(): string;
  setId(value: string): SyncError;

  getErrorMessage(): string;
  setErrorMessage(value: string): SyncError;

  getErrorCode(): string;
  setErrorCode(value: string): SyncError;

  getType(): string;
  setType(value: string): SyncError;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SyncError.AsObject;
  static toObject(includeInstance: boolean, msg: SyncError): SyncError.AsObject;
  static serializeBinaryToWriter(message: SyncError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SyncError;
  static deserializeBinaryFromReader(message: SyncError, reader: jspb.BinaryReader): SyncError;
}

export namespace SyncError {
  export type AsObject = {
    id: string,
    errorMessage: string,
    errorCode: string,
    type: string,
  }
}

