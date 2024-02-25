import { BaseEvent } from './general.js';

export type CreateGameEvent = BaseEvent<
  'create_game',
  {
    playerIds: [number, number];
  }
>;

export type AddShipEvent = BaseEvent<
  'add_ships',
  {
    gameId: number;
    ships: {
      position: {
        x: number;
        y: number;
      };
      direction: boolean;
      length: number;
      type: 'small' | 'medium' | 'large' | 'huge';
    }[];
    indexPlayer: number;
  }
>;

export type AttackEvent = BaseEvent<
  'attack',
  {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  }
>;

export type RandomAttackEvent = BaseEvent<
  'randomAttack',
  {
    gameId: number;
    indexPlayer: number;
  }
>;

export type GameEvent = CreateGameEvent | AddShipEvent | AttackEvent | RandomAttackEvent;
