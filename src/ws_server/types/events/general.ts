import { GameEvent } from './game.js';
import { RoomEvent } from './room.js';
import { UserEvent } from './user.js';

export type BaseEvent<TType extends string, TData = undefined> = {
  type: TType;
  data: TData;
  id: number;
};

export type RegEvent = BaseEvent<
  'reg',
  {
    name: string;
    password: string;
  }
>;

export type UnknownEvent = BaseEvent<string, unknown | undefined>;

export type AppEvent = GameEvent | RegEvent | RoomEvent | UserEvent;
