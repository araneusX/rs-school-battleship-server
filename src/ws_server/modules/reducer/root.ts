import { AppEvent, UnknownEvent } from '../../types/events/general.js';
import { gameReducer } from './game.js';
import { roomReducer } from './room.js';
import { SendToClient } from '../../types/index.js';
import { userReducer } from './user.js';
import { winnersReducer } from './winners.js';

export const createReducer = (sendToClient: SendToClient) => {
  const utils = { sendToClient };

  const reducer = (events: UnknownEvent[]) => {
    if (!events.length) {
      return;
    }

    const nextTickEvents = [
      ...gameReducer(events, utils),
      ...roomReducer(events, utils),
      ...userReducer(events, utils),
      ...winnersReducer(events, utils),
    ]
      .flat()
      .filter((event): event is AppEvent => !!event);

    reducer(nextTickEvents);
  };

  return reducer;
};
