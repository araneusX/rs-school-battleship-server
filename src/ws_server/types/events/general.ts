import { GameEvent } from './game.js';
import { RegEvent } from './player.js';
import { RoomEvent } from './room.js';
import { WsEvent } from './ws.js';

export type BaseEvent<TType extends string, TData = undefined> = {
  type: TType;
  data: TData;
  userId: number;
};

export type UnknownEvent = BaseEvent<string, unknown>;

export type AppEvent = GameEvent | RegEvent | RoomEvent | WsEvent;
