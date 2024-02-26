import {
  AddUserToRoomMessage,
  AttackMessage,
  CreateGameMessage,
  FinishMessage,
  RegMessage,
  StartGameMessage,
  TurnMessage,
  UpdateRoomMessage,
  UpdateWinnersMessage,
} from './messages.js';

import {
  AddShipEvent,
  AddUserToRoomEvent,
  AttackEvent,
  CreateRoomEvent,
  RandomAttackEvent,
  RegEvent,
} from '../events/index.js';

export type BaseMessage<TType extends string, TData = undefined> = {
  type: TType;
  data: TData;
};

export type OutcomeMessage =
  | AddUserToRoomMessage
  | AttackMessage
  | CreateGameMessage
  | FinishMessage
  | RegMessage
  | StartGameMessage
  | TurnMessage
  | UpdateRoomMessage
  | UpdateWinnersMessage;

export type IncomeMessage =
  | AddShipEvent
  | AddUserToRoomEvent
  | AttackEvent
  | CreateRoomEvent
  | RandomAttackEvent
  | RegEvent;
