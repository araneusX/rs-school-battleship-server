import { Event } from './event.js';

export type AddShipEvent = Event<
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

export type AttackEvent = Event<
  'attack',
  {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  }
>;

export type RandomAttackEvent = Event<
  'randomAttack',
  {
    gameId: number;
    indexPlayer: number;
  }
>;
