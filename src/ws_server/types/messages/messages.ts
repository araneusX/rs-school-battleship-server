import { Message } from './message.js';

export type RegMessage = Message<
  'reg',
  {
    name: string;
    index: number;
    error: boolean;
    errorText: string;
  }
>;

export type UpdateWinnersMessage = Message<
  'update_winners',
  {
    name: string;
    wins: number;
  }[]
>;

export type AddUserToRoomMessage = Message<
  'add_user_to_room',
  {
    indexRoom: number;
  }
>;

export type CreateGameMessage = Message<'create_game', { idGame: number; idPlayer: number }>;

export type UpdateRoomMessage = Message<
  'update_room',
  {
    roomId: number;
    roomUsers: {
      name: string;
      index: number;
    }[];
  }[]
>;

export type StartGameMessage = Message<
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

export type AttackMessage = Message<
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

export type TurnMessage = Message<
  'turn',
  {
    currentPlayer: number;
  }
>;

export type FinishMessage = Message<
  'finish',
  {
    winPlayer: number;
  }
>;
