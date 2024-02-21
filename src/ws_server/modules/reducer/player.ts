import { AppEvent } from '../../types/events/AppEvent';

export const playerReducer = (events: AppEvent<string, unknown>[]): (AppEvent<string, unknown> | void)[] => {
  return events.map((event) => {});
};
