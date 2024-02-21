import { Event } from './event.js';

export type RegEvent = Event<
  'reg',
  {
    name: string;
    password: string;
  }
>;
