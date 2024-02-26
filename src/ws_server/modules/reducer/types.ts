import { AppEvent, SendToClient, UnknownEvent } from '../../types/index.js';

export type ScopeReducer = (
  events: UnknownEvent[],
  utils: { sendToClient: SendToClient },
) => (AppEvent | AppEvent[] | void)[];
