import { AppEvent } from './AppEvent.js';

export type CreateRoomEvent = AppEvent<'create_room'>;

export type AddUserToRoomEvent = AppEvent<
  'add_user_to_room',
  {
    indexRoom: number;
  }
>;
