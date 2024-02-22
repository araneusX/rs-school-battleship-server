import { UnknownEvent, AppEvent } from '../../types/events/index.js';
import { SendToClient } from './types.js';

export const wsReducer = (events: UnknownEvent[], sendToClient: SendToClient): (AppEvent | void)[] => {
  return events.map((event) => {});
};
