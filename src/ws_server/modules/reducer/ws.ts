import { AppEvent } from '../../types/events/AppEvent.js';
import { SendToClient } from './types.js';

export const wsReducer = (
  events: AppEvent<string, unknown>[],
  sendToClient: SendToClient,
): (AppEvent<string, unknown> | void)[] => {
  return events.map((event) => {});
};
