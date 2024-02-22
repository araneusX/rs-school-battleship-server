import { BaseMessage } from '../messages/general.js';
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
} from '../messages/messages.js';
import { BaseEvent } from './general.js';

type MessageEvent<TMessage extends BaseMessage<string, unknown>> = BaseEvent<
  `message_${TMessage['type']}`,
  TMessage['data']
>;

export type RegMessageEvent = MessageEvent<RegMessage>;

export type UpdateWinnersMessageEvent = MessageEvent<UpdateWinnersMessage>;

export type CreateGameMessageEvent = MessageEvent<CreateGameMessage>;

export type UpdateRoomMessageEvent = MessageEvent<UpdateRoomMessage>;

export type StartGameMessageEvent = MessageEvent<StartGameMessage>;

export type AttackMessageEvent = MessageEvent<AttackMessage>;

export type TurnMessageEvent = MessageEvent<TurnMessage>;

export type FinishMessageEvent = MessageEvent<FinishMessage>;

export type AddUserToRoomMessageEvent = MessageEvent<AddUserToRoomMessage>;

export type WsEvent =
  | RegMessageEvent
  | UpdateWinnersMessageEvent
  | CreateGameMessageEvent
  | UpdateRoomMessageEvent
  | StartGameMessageEvent
  | AttackMessageEvent
  | TurnMessageEvent
  | FinishMessageEvent
  | AddUserToRoomMessageEvent;
