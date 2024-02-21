import { AppEvent } from './AppEvent.js';

export type AddShipEvent = AppEvent<
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

export type AttackEvent = AppEvent<
  'attack',
  {
    gameId: number;
    x: number;
    y: number;
    indexPlayer: number;
  }
>;

export type RandomAttackEvent = AppEvent<
  'randomAttack',
  {
    gameId: number;
    indexPlayer: number;
  }
>;
