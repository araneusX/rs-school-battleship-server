import { BaseEvent } from './general.js';

export type CreateRoomEvent = BaseEvent<'create_room'>;

export type AddUserToRoomEvent = BaseEvent<
  'add_user_to_room',
  {
    indexRoom: number;
  }
>;

export type RoomEvent = CreateRoomEvent | AddUserToRoomEvent;
