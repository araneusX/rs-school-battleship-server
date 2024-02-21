import { AppEvent } from '../../types/events/AppEvent';

export const roomReducer = (events: AppEvent<string, unknown>[]): (AppEvent<string, unknown> | void)[] => {
  return events.map((event) => {});
};
