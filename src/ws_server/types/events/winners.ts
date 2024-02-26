import { BaseEvent } from './general.js';

export type NewWinEvent = BaseEvent<'new_win'>;

export type CastWinnersEvent = BaseEvent<'cast_winners_info'>;

export type WinnersEvent = NewWinEvent | CastWinnersEvent;
