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
} from '../../types/messages/messages.js';

type Message =
  | AddUserToRoomMessage
  | AttackMessage
  | CreateGameMessage
  | FinishMessage
  | RegMessage
  | StartGameMessage
  | TurnMessage
  | UpdateRoomMessage
  | UpdateWinnersMessage;

export type SendToClient = (clientId: number, message: Message) => void;
