import { Event } from './event.js';

export type CreateRoomEvent = Event<'create_room'>;

export type AddUserToRoomEvent = Event<
  'add_user_to_room',
  {
    indexRoom: number;
  }
>;
