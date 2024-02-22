import { BaseEvent } from './general.js';

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

export type GameEvent = AddShipEvent | AttackEvent | RandomAttackEvent;
