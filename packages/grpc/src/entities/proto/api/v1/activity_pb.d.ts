import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as proto_api_v1_common_pb from '../../../proto/api/v1/common_pb'; // proto import: "proto/api/v1/common.proto"
import * as proto_api_v1_event_pb from '../../../proto/api/v1/event_pb'; // proto import: "proto/api/v1/event.proto"


export class Activity extends jspb.Message {
  getId(): string;
  setId(value: string): Activity;

  getUserId(): string;
  setUserId(value: string): Activity;

  getEvent(): proto_api_v1_event_pb.Event | undefined;
  setEvent(value?: proto_api_v1_event_pb.Event): Activity;
  hasEvent(): boolean;
  clearEvent(): Activity;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Activity;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Activity;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Activity;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Activity;

  getActivitySlotsList(): Array<ActivitySlot>;
  setActivitySlotsList(value: Array<ActivitySlot>): Activity;
  clearActivitySlotsList(): Activity;
  addActivitySlots(value?: ActivitySlot, index?: number): ActivitySlot;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Activity.AsObject;
  static toObject(includeInstance: boolean, msg: Activity): Activity.AsObject;
  static serializeBinaryToWriter(message: Activity, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Activity;
  static deserializeBinaryFromReader(message: Activity, reader: jspb.BinaryReader): Activity;
}

export namespace Activity {
  export type AsObject = {
    id: string,
    userId: string,
    event?: proto_api_v1_event_pb.Event.AsObject,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    activitySlotsList: Array<ActivitySlot.AsObject>,
  }
}

export class ActivitySlot extends jspb.Message {
  getId(): string;
  setId(value: string): ActivitySlot;

  getActivityId(): string;
  setActivityId(value: string): ActivitySlot;

  getStartTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartTime(value?: google_protobuf_timestamp_pb.Timestamp): ActivitySlot;
  hasStartTime(): boolean;
  clearStartTime(): ActivitySlot;

  getEndTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndTime(value?: google_protobuf_timestamp_pb.Timestamp): ActivitySlot;
  hasEndTime(): boolean;
  clearEndTime(): ActivitySlot;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivitySlot.AsObject;
  static toObject(includeInstance: boolean, msg: ActivitySlot): ActivitySlot.AsObject;
  static serializeBinaryToWriter(message: ActivitySlot, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivitySlot;
  static deserializeBinaryFromReader(message: ActivitySlot, reader: jspb.BinaryReader): ActivitySlot;
}

export namespace ActivitySlot {
  export type AsObject = {
    id: string,
    activityId: string,
    startTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class ActivitySlotData extends jspb.Message {
  getActivityId(): string;
  setActivityId(value: string): ActivitySlotData;

  getStartTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setStartTime(value?: google_protobuf_timestamp_pb.Timestamp): ActivitySlotData;
  hasStartTime(): boolean;
  clearStartTime(): ActivitySlotData;

  getEndTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEndTime(value?: google_protobuf_timestamp_pb.Timestamp): ActivitySlotData;
  hasEndTime(): boolean;
  clearEndTime(): ActivitySlotData;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivitySlotData.AsObject;
  static toObject(includeInstance: boolean, msg: ActivitySlotData): ActivitySlotData.AsObject;
  static serializeBinaryToWriter(message: ActivitySlotData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivitySlotData;
  static deserializeBinaryFromReader(message: ActivitySlotData, reader: jspb.BinaryReader): ActivitySlotData;
}

export namespace ActivitySlotData {
  export type AsObject = {
    activityId: string,
    startTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    endTime?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class TransportModes extends jspb.Message {
  getModesList(): Array<TransportMode>;
  setModesList(value: Array<TransportMode>): TransportModes;
  clearModesList(): TransportModes;
  addModes(value?: TransportMode, index?: number): TransportMode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransportModes.AsObject;
  static toObject(includeInstance: boolean, msg: TransportModes): TransportModes.AsObject;
  static serializeBinaryToWriter(message: TransportModes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransportModes;
  static deserializeBinaryFromReader(message: TransportModes, reader: jspb.BinaryReader): TransportModes;
}

export namespace TransportModes {
  export type AsObject = {
    modesList: Array<TransportMode.AsObject>,
  }
}

export class TransportMode extends jspb.Message {
  getType(): string;
  setType(value: string): TransportMode;

  getDistance(): number;
  setDistance(value: number): TransportMode;

  getDuration(): number;
  setDuration(value: number): TransportMode;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransportMode.AsObject;
  static toObject(includeInstance: boolean, msg: TransportMode): TransportMode.AsObject;
  static serializeBinaryToWriter(message: TransportMode, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransportMode;
  static deserializeBinaryFromReader(message: TransportMode, reader: jspb.BinaryReader): TransportMode;
}

export namespace TransportMode {
  export type AsObject = {
    type: string,
    distance: number,
    duration: number,
  }
}

export class RouteMatrix extends jspb.Message {
  getRoutesList(): Array<ActivityPairRoutes>;
  setRoutesList(value: Array<ActivityPairRoutes>): RouteMatrix;
  clearRoutesList(): RouteMatrix;
  addRoutes(value?: ActivityPairRoutes, index?: number): ActivityPairRoutes;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RouteMatrix.AsObject;
  static toObject(includeInstance: boolean, msg: RouteMatrix): RouteMatrix.AsObject;
  static serializeBinaryToWriter(message: RouteMatrix, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RouteMatrix;
  static deserializeBinaryFromReader(message: RouteMatrix, reader: jspb.BinaryReader): RouteMatrix;
}

export namespace RouteMatrix {
  export type AsObject = {
    routesList: Array<ActivityPairRoutes.AsObject>,
  }
}

export class ActivityPairRoutes extends jspb.Message {
  getFromActivityId(): string;
  setFromActivityId(value: string): ActivityPairRoutes;

  getToActivityId(): string;
  setToActivityId(value: string): ActivityPairRoutes;

  getTransportModesList(): Array<TransportModeRoute>;
  setTransportModesList(value: Array<TransportModeRoute>): ActivityPairRoutes;
  clearTransportModesList(): ActivityPairRoutes;
  addTransportModes(value?: TransportModeRoute, index?: number): TransportModeRoute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ActivityPairRoutes.AsObject;
  static toObject(includeInstance: boolean, msg: ActivityPairRoutes): ActivityPairRoutes.AsObject;
  static serializeBinaryToWriter(message: ActivityPairRoutes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ActivityPairRoutes;
  static deserializeBinaryFromReader(message: ActivityPairRoutes, reader: jspb.BinaryReader): ActivityPairRoutes;
}

export namespace ActivityPairRoutes {
  export type AsObject = {
    fromActivityId: string,
    toActivityId: string,
    transportModesList: Array<TransportModeRoute.AsObject>,
  }
}

export class TransportModeRoute extends jspb.Message {
  getTransportMode(): string;
  setTransportMode(value: string): TransportModeRoute;

  getDistanceInMeters(): number;
  setDistanceInMeters(value: number): TransportModeRoute;

  getDurationInMinutes(): number;
  setDurationInMinutes(value: number): TransportModeRoute;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransportModeRoute.AsObject;
  static toObject(includeInstance: boolean, msg: TransportModeRoute): TransportModeRoute.AsObject;
  static serializeBinaryToWriter(message: TransportModeRoute, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransportModeRoute;
  static deserializeBinaryFromReader(message: TransportModeRoute, reader: jspb.BinaryReader): TransportModeRoute;
}

export namespace TransportModeRoute {
  export type AsObject = {
    transportMode: string,
    distanceInMeters: number,
    durationInMinutes: number,
  }
}

export class GetActivitiesRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): GetActivitiesRequest;

  getCursor(): string;
  setCursor(value: string): GetActivitiesRequest;

  getDateFilter(): proto_api_v1_common_pb.DateRange | undefined;
  setDateFilter(value?: proto_api_v1_common_pb.DateRange): GetActivitiesRequest;
  hasDateFilter(): boolean;
  clearDateFilter(): GetActivitiesRequest;

  getSortingList(): Array<proto_api_v1_common_pb.SortingOption>;
  setSortingList(value: Array<proto_api_v1_common_pb.SortingOption>): GetActivitiesRequest;
  clearSortingList(): GetActivitiesRequest;
  addSorting(value?: proto_api_v1_common_pb.SortingOption, index?: number): proto_api_v1_common_pb.SortingOption;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetActivitiesRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetActivitiesRequest): GetActivitiesRequest.AsObject;
  static serializeBinaryToWriter(message: GetActivitiesRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetActivitiesRequest;
  static deserializeBinaryFromReader(message: GetActivitiesRequest, reader: jspb.BinaryReader): GetActivitiesRequest;
}

export namespace GetActivitiesRequest {
  export type AsObject = {
    pageSize: number,
    cursor: string,
    dateFilter?: proto_api_v1_common_pb.DateRange.AsObject,
    sortingList: Array<proto_api_v1_common_pb.SortingOption.AsObject>,
  }
}

export class GetActivitiesResponse extends jspb.Message {
  getActivities(): GetActivitiesResponse.ActivityData | undefined;
  setActivities(value?: GetActivitiesResponse.ActivityData): GetActivitiesResponse;
  hasActivities(): boolean;
  clearActivities(): GetActivitiesResponse;

  getRouteMatrix(): RouteMatrix | undefined;
  setRouteMatrix(value?: RouteMatrix): GetActivitiesResponse;
  hasRouteMatrix(): boolean;
  clearRouteMatrix(): GetActivitiesResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetActivitiesResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetActivitiesResponse): GetActivitiesResponse.AsObject;
  static serializeBinaryToWriter(message: GetActivitiesResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetActivitiesResponse;
  static deserializeBinaryFromReader(message: GetActivitiesResponse, reader: jspb.BinaryReader): GetActivitiesResponse;
}

export namespace GetActivitiesResponse {
  export type AsObject = {
    activities?: GetActivitiesResponse.ActivityData.AsObject,
    routeMatrix?: RouteMatrix.AsObject,
  }

  export class ActivityData extends jspb.Message {
    getItemsList(): Array<Activity>;
    setItemsList(value: Array<Activity>): ActivityData;
    clearItemsList(): ActivityData;
    addItems(value?: Activity, index?: number): Activity;

    getPagination(): proto_api_v1_common_pb.PageResponse | undefined;
    setPagination(value?: proto_api_v1_common_pb.PageResponse): ActivityData;
    hasPagination(): boolean;
    clearPagination(): ActivityData;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): ActivityData.AsObject;
    static toObject(includeInstance: boolean, msg: ActivityData): ActivityData.AsObject;
    static serializeBinaryToWriter(message: ActivityData, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): ActivityData;
    static deserializeBinaryFromReader(message: ActivityData, reader: jspb.BinaryReader): ActivityData;
  }

  export namespace ActivityData {
    export type AsObject = {
      itemsList: Array<Activity.AsObject>,
      pagination?: proto_api_v1_common_pb.PageResponse.AsObject,
    }
  }

}

export class CreateActivitySlotRequest extends jspb.Message {
  getActivitySlot(): ActivitySlotData | undefined;
  setActivitySlot(value?: ActivitySlotData): CreateActivitySlotRequest;
  hasActivitySlot(): boolean;
  clearActivitySlot(): CreateActivitySlotRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateActivitySlotRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateActivitySlotRequest): CreateActivitySlotRequest.AsObject;
  static serializeBinaryToWriter(message: CreateActivitySlotRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateActivitySlotRequest;
  static deserializeBinaryFromReader(message: CreateActivitySlotRequest, reader: jspb.BinaryReader): CreateActivitySlotRequest;
}

export namespace CreateActivitySlotRequest {
  export type AsObject = {
    activitySlot?: ActivitySlotData.AsObject,
  }
}

export class CreateActivitySlotResponse extends jspb.Message {
  getId(): string;
  setId(value: string): CreateActivitySlotResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateActivitySlotResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateActivitySlotResponse): CreateActivitySlotResponse.AsObject;
  static serializeBinaryToWriter(message: CreateActivitySlotResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateActivitySlotResponse;
  static deserializeBinaryFromReader(message: CreateActivitySlotResponse, reader: jspb.BinaryReader): CreateActivitySlotResponse;
}

export namespace CreateActivitySlotResponse {
  export type AsObject = {
    id: string,
  }
}

export class DeleteActivitySlotRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteActivitySlotRequest;
  hasId(): boolean;
  clearId(): DeleteActivitySlotRequest;

  getActivitySlot(): ActivitySlotData | undefined;
  setActivitySlot(value?: ActivitySlotData): DeleteActivitySlotRequest;
  hasActivitySlot(): boolean;
  clearActivitySlot(): DeleteActivitySlotRequest;

  getIdentifierCase(): DeleteActivitySlotRequest.IdentifierCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteActivitySlotRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteActivitySlotRequest): DeleteActivitySlotRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteActivitySlotRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteActivitySlotRequest;
  static deserializeBinaryFromReader(message: DeleteActivitySlotRequest, reader: jspb.BinaryReader): DeleteActivitySlotRequest;
}

export namespace DeleteActivitySlotRequest {
  export type AsObject = {
    id?: string,
    activitySlot?: ActivitySlotData.AsObject,
  }

  export enum IdentifierCase { 
    IDENTIFIER_NOT_SET = 0,
    ID = 1,
    ACTIVITY_SLOT = 2,
  }
}

export class DeleteActivitySlotResponse extends jspb.Message {
  getSuccess(): boolean;
  setSuccess(value: boolean): DeleteActivitySlotResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteActivitySlotResponse.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteActivitySlotResponse): DeleteActivitySlotResponse.AsObject;
  static serializeBinaryToWriter(message: DeleteActivitySlotResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteActivitySlotResponse;
  static deserializeBinaryFromReader(message: DeleteActivitySlotResponse, reader: jspb.BinaryReader): DeleteActivitySlotResponse;
}

export namespace DeleteActivitySlotResponse {
  export type AsObject = {
    success: boolean,
  }
}

