import { AppEvent, UnknownEvent } from '../../types/events/index.js';

export const roomReducer = (events: UnknownEvent[]): (AppEvent | void)[] => {
  return events.map((event) => {});
};
