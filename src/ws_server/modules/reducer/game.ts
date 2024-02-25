import { GameEvent, ReducerEvents } from '../../types/index.js';
import { ScopeReducer } from './types.js';

export const gameReducer: ScopeReducer = (events) => {
  const reducerEvents = events as ReducerEvents<GameEvent>;

  return reducerEvents.map((event) => {
    switch (event.type) {
      case 'create_game':
        break;
      case 'add_ships':
        break;
      case 'attack':
        break;
      case 'randomAttack':
        break;

      default:
        break;
    }
  });
};
