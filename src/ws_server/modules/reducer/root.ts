import { AppEvent, UnknownEvent } from '../../types/events/general.js';
import { gameReducer } from './game.js';
import { playerReducer } from './player.js';
import { roomReducer } from './room.js';
import { SendToClient } from '../../types/index.js';
import { wsReducer } from './ws.js';

export const createReducer = (sendToClient: SendToClient) => {
  const tools = {};

  const reducer = (events: UnknownEvent[]) => {
    if (!events.length) {
      return;
    }

    const nextTickEvents = [
      ...gameReducer(events),
      ...playerReducer(events),
      ...roomReducer(events),
      ...wsReducer(events, sendToClient),
    ].filter((event): event is AppEvent => !!event);

    reducer(nextTickEvents);
  };

  return reducer;
};
