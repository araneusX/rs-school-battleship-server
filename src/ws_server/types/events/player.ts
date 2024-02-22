import { BaseEvent } from './general.js';

export type RegEvent = BaseEvent<
  'reg',
  {
    name: string;
    password: string;
  }
>;

export type playerEvent = RegEvent;
