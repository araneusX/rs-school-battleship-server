import { BaseEvent } from './general.js';

export type CreateRoomEvent = BaseEvent<'create_room'>;

export type AddUserToRoomEvent = BaseEvent<
  'add_user_to_room',
  {
    indexRoom: number;
  }
>;

export type RemoveUserFromRoomEvent = BaseEvent<'remove_user_from_room'>;

export type DeleteRoomEvent = BaseEvent<
  'delete_room',
  {
    roomId: number;
  }
>;

export type CastRoomInfoEvent = BaseEvent<
  'cast_room_info',
  | {
      roomId?: number;
      userIds?: number[];
    }
  | undefined
>;

export type RoomEvent =
  | CreateRoomEvent
  | AddUserToRoomEvent
  | RemoveUserFromRoomEvent
  | DeleteRoomEvent
  | CastRoomInfoEvent;
