import { AppEvent, GameEvent, ReducerEvents, UnknownEvent } from '../../types/index.js';

export const gameReducer = (events: UnknownEvent[]): (AppEvent | void)[] => {
  const reducerEvents = events as ReducerEvents<GameEvent>;
  return reducerEvents.map((event) => {
    switch (event.type) {
      case 'add_ships':
        const data = event.data;
        break;

      default:
        break;
    }
  });
};
