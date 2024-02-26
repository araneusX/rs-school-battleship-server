import { BaseMessage } from './general.js';

export type RegMessage = BaseMessage<
  'reg',
  {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  }
>;

export type UpdateWinnersMessage = BaseMessage<
  'update_winners',
  {
    name: string;
    wins: number;
  }[]
>;

export type AddUserToRoomMessage = BaseMessage<
  'add_user_to_room',
  {
    indexRoom: number;
  }
>;

export type CreateGameMessage = BaseMessage<'create_game', { idGame: number; idPlayer: number }>;

export type UpdateRoomMessage = BaseMessage<
  'update_room',
  {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[]
>;

export type StartGameMessage = BaseMessage<
  'start_game',
  {
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    }[];

    currentPlayerIndex: number;
  }
>;

export type AttackMessage = BaseMessage<
  'attack',
  {
    position: {
      x: number;
      y: number;
    };
    currentPlayer: number;
    status: 'miss' | 'killed' | 'shot';
  }
>;

export type TurnMessage = BaseMessage<
  'turn',
  {
    currentPlayer: number;
  }
>;

export type FinishMessage = BaseMessage<
  'finish',
  {
    winPlayer: number;
  }
>;
