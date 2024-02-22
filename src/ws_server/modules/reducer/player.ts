import { AppEvent, UnknownEvent } from '../../types/events/index.js';

export const playerReducer = (events: UnknownEvent[]): (AppEvent | void)[] => {
  return events.map((event) => {});
};
