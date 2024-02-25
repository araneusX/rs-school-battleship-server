import { ReducerEvents, UserEvent } from '../../types/index.js';
import { ScopeReducer } from './types.js';

export const userReducer: ScopeReducer = (events) => {
  const reducerEvents = events as ReducerEvents<UserEvent>;

  return reducerEvents.map((event) => {
    switch (event.type) {
      case 'user_joined':
        return [
          {
            type: 'cast_room_info',
            data: {
              userIds: [event.id],
            },
            id: event.id,
          },
          {
            type: 'cast_winners_info',
            id: event.id,
          },
        ];
      case 'user_left':
        return {
          type: 'remove_user_from_room',
          data: undefined,
          id: event.id,
        };
      default:
        break;
    }
  });
};
