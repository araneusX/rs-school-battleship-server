import { BaseEvent } from './general.js';

export type UserJoinedEvent = BaseEvent<'user_joined'>;

export type UserLeftEvent = BaseEvent<'user_left'>;

export type UserEvent = UserJoinedEvent | UserLeftEvent;
