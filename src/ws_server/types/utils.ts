import { BaseEvent, UnknownEvent } from './events/general.js';

export type ReducerEvents<TEvent extends UnknownEvent> = TEvent[];
