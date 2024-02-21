import { AppEvent } from './AppEvent.js';

export type RegEvent = AppEvent<
  'reg',
  {
    name: string;
    password: string;
  }
>;
