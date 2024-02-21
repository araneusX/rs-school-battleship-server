import { AppEvent } from '../../types/events/AppEvent.js';
import { gameReducer } from './game.js';
import { playerReducer } from './player.js';
import { roomReducer } from './room.js';
import { SendToClient } from './types.js';
import { wsReducer } from './ws.js';

export const createReducer = (sendToClient: SendToClient) => {
  const tools = {};

  const reducer = (events: AppEvent<string, unknown>[]) => {
    if (!events.length) {
      return;
    }

    const nextTickEvents = [
      ...gameReducer(events),
      ...playerReducer(events),
      ...roomReducer(events),
      ...wsReducer(events, sendToClient),
    ].filter((event): event is AppEvent<string, unknown> => !!event);

    reducer(nextTickEvents);
  };

  return reducer;
};
