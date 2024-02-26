import { ReducerEvents, WinnersEvent } from '../../types/index.js';
import { authStorage, winnersStorage } from '../index.js';
import { ScopeReducer } from './types.js';

export const winnersReducer: ScopeReducer = (events, { sendToClient }) => {
  const reducerEvents = events as ReducerEvents<WinnersEvent>;

  return reducerEvents.map((event) => {
    switch (event.type) {
      case 'new_win':
        const record = winnersStorage.getItemMatch({ userId: event.id });

        if (record) {
          winnersStorage.updateItem(record.id, {
            ...record,
            wins: record.wins + 1,
          });
        } else {
          winnersStorage.addItem({
            userId: event.id,
            wins: 1,
          });
        }

        return {
          type: 'cast_winners_info',
          data: undefined,
          id: event.id,
        };

      case 'cast_winners_info':
        sendToClient({
          type: 'update_winners',
          data: [
            ...winnersStorage.getAllItems().map(({ userId, wins }) => ({
              name: authStorage.getItemById(userId)?.name ?? '',
              wins,
            })),
          ],
        });
      default:
        break;
    }
  });
};
